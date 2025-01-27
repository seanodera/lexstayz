import {writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {doc, getDoc, runTransaction} from "firebase/firestore";
import {Booking, Home, Hotel, Room, Stay} from "@/lib/types";
import {verifyPayment} from "@/data/payment";
import {addDays, subMonths} from "date-fns";
import {iterateDaysBetween, refundBooking, updateHostBalance} from "@/data/bookingData";


export async function completeBooking(id: string, reference: string, method: string) {
    const batch = writeBatch(firestore);

    const response = await verifyPayment(reference, method);
    let status = response.status === 'success' ? 'Pending' : 'Failed';
    const isConfirmed = response.status === 'success';
    const paymentData = response.data;

    const bookingRef = doc(firestore, 'bookings', id);
    const bookingSnap = await getDoc(bookingRef)
    if (!bookingSnap.exists()) {
        throw new Error("Booking not found.");
    }
    const booking = bookingSnap.data() as Booking;


    const hostRef = doc(firestore, 'hosts', booking.hostId);
    const hostTransactionsRef = doc(hostRef, 'pendingTransactions', id);
    const stayRef = doc(firestore, 'stays', booking.accommodationId);

    if (isConfirmed) {
    await runTransaction(firestore, async (transaction) => {
        const bookingSnap = await transaction.get(bookingRef)
        if (!bookingSnap.exists()) {
            throw new Error("Booking not found.");
        }
        const booking = bookingSnap.data() as Booking;
        if (booking.status === status || ((booking.status === 'Confirmed' || booking.status === 'Completed') && status === 'Pending')) {
            return;
        }

        const staySnap = await transaction.get(stayRef);
        if (!staySnap.exists()) throw new Error("Accommodation document does not exist!");
        const stayData = staySnap.data() as Hotel | Home;
        const checkIn = new Date(booking.checkInDate);
        const checkOut = new Date(booking.checkOutDate);
        const isBooked = isDateRangeBooked(new Set<string>(stayData.bookedDates ?? []),checkIn,checkOut);
        if (isBooked) {
            await refundBooking(booking);
            status = 'Failed';
            throw new Error('Stay is Already booked! Your funds are on the way');
        } else {
            batch.set(hostTransactionsRef, {
                id: booking.id,
                amount: booking.totalPrice,
                currency: 'USD',
                paymentData,
                fees: booking.fees,
                date: booking.createdAt,
                hostId: booking.hostId,
                userId: booking.accountId,
                status,
                availableDate: addDays(booking.checkOutDate, 60).toISOString(),
            }, {merge: true});
            await updateHostBalance(transaction, hostRef, booking, status)
        }
        transaction.update(bookingRef, {status, isConfirmed, paymentData})
        if (stayData.type === 'Hotel') {
            const {updatedRooms, fullyBookedDates} = processHotelBooking(stayData, booking, checkIn, checkOut);
            transaction.update(stayRef, {rooms: updatedRooms,bookedDates: fullyBookedDates});
        } else if (stayData.type === 'Home') {
            const unavailableDates = processHomeBooking(stayData, checkIn, checkOut);
            transaction.update(stayRef, {bookedDates: unavailableDates});
        }
    });
    }
   await batch.commit()
}

function isDateRangeBooked(
    bookedDates: Map<string, number> | Set<string> | Record<string, number>,
    checkIn: Date,
    checkOut: Date
): boolean {
    const bookedDatesSet =
        bookedDates instanceof Map
            ? new Set(bookedDates.keys()) // Convert Map to Set of keys
            : bookedDates instanceof Set
                ? bookedDates // Use Set directly
                : new Set(Object.keys(bookedDates)); // Convert object keys to Set

    let isBooked = false;

    iterateDaysBetween(checkIn, checkOut, (date) => {
        const currentDateStr = date.toISOString().split('T')[0];
        if (bookedDatesSet.has(currentDateStr)) {
            isBooked = true;
        }
    });

    return isBooked;
}

function processHotelBooking(
    stayData: Hotel,
    booking: Booking,
    checkIn: Date,
    checkOut: Date
): {
    updatedRooms: Room[];
    fullyBookedDates: string[];
} {
    const rooms = stayData.rooms;
    const bookedRooms = booking.rooms ? booking.rooms : [];
    const bookingIds = bookedRooms.map((room) => room.roomId);

    // Initialize variables
    const updatedRooms: any[] = [];
    const fullyBookedDatesSet = new Set<string>(stayData.bookedDates ?? []);
    const oneMonthAgo = subMonths(new Date(), 1);


    // Clean old fully booked dates from stayData.bookedDates
    fullyBookedDatesSet.forEach((date) => {
        if (new Date(date) < oneMonthAgo) {
            fullyBookedDatesSet.delete(date);
        }
    });

    rooms.forEach((room: Room) => {
        if (bookingIds.includes(room.id)) {
            const bookedRoomData = bookedRooms.find((r) => r.roomId === room.id);

            // Clean old dates from room-level bookedDates
            let bookedDatesMap = new Map<string, number>(
                Object.entries(room.bookedDates ?? {}).filter(([date]) => new Date(date) >= oneMonthAgo)
            );
            let fullDates = room.fullDates?.filter((date: string) => new Date(date) >= oneMonthAgo) ?? [];

            // Iterate over the booking range
            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[ 0 ];

                // Update room-level bookedDates map
                const currentCount = bookedDatesMap.get(currentDateStr) || 0;
                const updatedCount = currentCount + bookedRoomData!.numRooms;
                bookedDatesMap.set(currentDateStr, updatedCount);

                // Update full dates and stayData fully booked dates if applicable
                if (updatedCount >= room.available && !fullDates.includes(currentDateStr)) {
                    fullDates.push(currentDateStr);
                    fullyBookedDatesSet.add(currentDateStr);
                }
            });

            // Convert bookedDatesMap back to an object for storage
            updatedRooms.push({
                ...room,
                bookedDates: Object.fromEntries(bookedDatesMap),
                fullDates,
            });
        } else {
            // Keep room as is for non-booked rooms
            updatedRooms.push(room);
        }
    });

    return {updatedRooms, fullyBookedDates: Array.from(fullyBookedDatesSet)};
}

function processHomeBooking(stayData: Home, checkIn: Date, checkOut: Date): string[] {
    const unavailableDatesSet = new Set<string>(stayData.bookedDates || []);
    const oneMonthAgo = subMonths(new Date(), 1);


    // Clean old dates
    unavailableDatesSet.forEach((date) => {
        if (new Date(date) < oneMonthAgo) {
            unavailableDatesSet.delete(date);
        }
    });

    // Add new unavailable dates
    iterateDaysBetween(checkIn, checkOut, (date) => {
        unavailableDatesSet.add(date.toISOString().split('T')[ 0 ]);
    });

    return Array.from(unavailableDatesSet);
}

