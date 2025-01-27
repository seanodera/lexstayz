import {auth, firestore} from "@/lib/firebase";
import {query, Transaction, where, writeBatch} from "@firebase/firestore";
import {collection, doc, getDoc, getDocs, runTransaction} from "firebase/firestore";
import {addDays, addHours, isAfter, isBefore, isEqual, subDays, subHours} from 'date-fns';
import axios from "axios";
import {getServerTime, handler_url} from "@/lib/utils";
import {Balance, Booking, Home, Host, Hotel, Room, Stay} from "@/lib/types";


export function getCurrentUser() {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('No user is signed in');
    }
    return user;
}

export function generateID() {
    const document = doc(collection(firestore, 'bookings'))
    return document.id
}


/**
 * Updates the host's balance in the database.
 */
export async function updateHostBalance(transaction: Transaction, hostRef: any, booking: Booking, status: string, withPolicy?: boolean, amount?: number) {
    const hostSnap = await transaction.get(hostRef);
    const hostData = hostSnap.data() as Host;

    if (!hostData) throw new Error("Host data not found!");

    const currentBalance: Balance = hostData.balance || {
        available: 0,
        prevAvailable: 0,
        pending: 0,
        prevPending: 0,
    };

    const updatedBalance = {...currentBalance};
    if (withPolicy) {
        if (amount) {
            updatedBalance.pending -= amount;
            updatedBalance.prevPending = updatedBalance.pending;
            transaction.update(hostRef, {balance: updatedBalance});
        }

    } else {

        if (booking.status === 'Pending' && status === 'Confirmed') {
            updatedBalance.pending += booking.totalPrice;
            updatedBalance.prevPending = currentBalance.pending;


            transaction.update(hostRef, {balance: updatedBalance});
        } else if (booking.status === 'Confirmed' && (status === 'Canceled' || status === 'Rejected')) {
            updatedBalance.pending -= booking.totalPrice;
            updatedBalance.prevPending = currentBalance.pending;

            transaction.update(hostRef, {balance: updatedBalance});
        }
    }


}


export function iterateDaysBetween(startDate: Date, endDate: Date, task: (date: Date) => void): void {
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, endDate) || isEqual(currentDate, endDate)) {
        task(currentDate);
        currentDate = addDays(currentDate, 1); // Add one day, properly handling month/year transitions
    }
}

export async function getBookings() {
    try {
        let bookings: any = []
        const user = getCurrentUser()
        const bookingsRef = collection(firestore, 'bookings')
        const bookingsQuery = query(bookingsRef, where('accountId', '==', user.uid));
        const snapshot = await getDocs(bookingsQuery)

        snapshot.docs.forEach((document) => {
            bookings.push(document.data())
        })

        return bookings;
    } catch (error) {
        console.log(error)
        return [];
    }
}

export async function refundBooking(booking: any, amount?: number) {
    let response;
    if (amount) {
        response = await axios.post(`${handler_url}/api/createRefund`, {reference: booking.id, amount: amount})
    } else {
        response = await axios.post(`${handler_url}/api/createRefund`, {reference: booking.id})
    }
    return response.data;
}

export async function cancelBooking(booking: Booking) {
    if (booking.status === 'Rejected' || booking.status === 'Canceled') {
        return booking;
    }
    const serverDate = await getServerTime();
    const batch = writeBatch(firestore)
    const bookingRef = doc(firestore, 'bookings', booking.id);
    const hostRef = doc(firestore, 'hosts', booking.hostId);
    const hostTransactionsRef = doc(hostRef, 'pendingTransactions', booking.id);
    const stayRef = doc(firestore, 'stays', booking.accommodationId);

    let paymentData = booking.paymentData;
    let cancellationAmount: number | undefined;
    let netBooking = booking;
    await runTransaction(firestore, async (transaction) => {
        const bookingSnap = await transaction.get(bookingRef)
        if (!bookingSnap.exists()) {
            throw new Error("Booking not found.");
        }
        const booking = bookingSnap.data() as Booking;
        let netBooking = booking;
        if (booking.status === 'Rejected' || booking.status === 'Canceled') {
            return booking;
        }
        if (booking.status === 'Confirmed' || booking.status === 'Pending') {
            if (booking.status === "Pending" && booking.isConfirmed) {
                await refundBooking(booking);
            } else {
                const staySnap = await getDoc(stayRef);
                if (!staySnap.exists()) throw new Error("Accommodation document does not exist!");

                const stayData = staySnap.data() as Stay;
                const checkIn = new Date(booking.checkInDate);
                const checkOut = new Date(booking.checkOutDate);
                const cancellation = stayData.cancellation;
                if (cancellation.cancellation === 'Non-Refundable') {


                } else if (cancellation.cancellation === 'Other') {
                    let date;
                    let timeToCheck;
                    if (cancellation.preDate) {
                        date = checkIn;
                        if (cancellation.timeSpace === 'Days') {
                            timeToCheck = subDays(date, cancellation.time);
                        } else {
                            timeToCheck = subHours(date, cancellation.time);
                        }
                    } else {
                        date = new Date(booking.createdAt);
                        if (cancellation.timeSpace === 'Days') {
                            timeToCheck = addDays(date, cancellation.time);
                        } else {
                            timeToCheck = addHours(date, cancellation.time);
                        }
                    }
                    if (isAfter(serverDate, timeToCheck)) {
                        const amount = (booking.grandTotal - booking.fees) * booking.paymentRate * (100 - cancellation.rate) / 100
                        paymentData = await handleCancellationOrRejection(booking, paymentData, amount)
                        batch.set(hostTransactionsRef, {
                            amount: amount,
                            availableDate: serverDate.toISOString(),
                        }, {merge: true});
                        cancellationAmount = booking.totalPrice * cancellation.rate / 100;
                        await updateHostBalance(transaction, hostRef, booking, 'Canceled', true, amount)
                    } else {
                        const amount = (booking.grandTotal - booking.fees) * booking.paymentRate
                        paymentData = await refundBooking(booking, amount);
                        cancellationAmount = 0;
                        await updateHostBalance(transaction, hostRef, booking, 'Canceled', true, amount)
                    }

                } else {
                    const amount = (booking.grandTotal - booking.fees) * booking.paymentRate
                    paymentData = await refundBooking(booking, amount);
                    cancellationAmount = 0;
                    await updateHostBalance(transaction, hostRef, booking, 'Canceled', true, amount)
                }
                if (stayData) {
                    updateStayDataForCancellation(stayData, booking, checkIn, checkOut, stayRef, transaction);
                }
            }
        }
    });
    if (netBooking.status === 'Rejected' || netBooking.status === 'Canceled') {

    } else {
        batch.update(bookingRef, { status: 'Canceled', paymentData: paymentData });
        if (cancellationAmount && cancellationAmount > 0) {
            batch.set(hostTransactionsRef, {
                amount: cancellationAmount,
                availableDate: serverDate.toISOString(),
                paymentData: paymentData,
            }, {merge: true});
        } else {
            batch.delete(hostTransactionsRef);
        }
    }
    await batch.commit()
    return {...netBooking,status: 'Canceled', paymentData: paymentData}
}

// Other utility functions remain unchanged
async function handleCancellationOrRejection(booking: any, paymentData: any, amount?: number) {
    if (booking.status === "Pending" && booking.isConfirmed) {
        return await refundBooking(booking);
    } else if (booking.isConfirmed) {
        if (amount) {
            return await refundBooking(booking, amount);
        } else {
            return await refundBooking(booking, (booking.grandTotal - booking.fees) * booking.paymentRate);
        }
    }
    return paymentData;
}

function updateStayDataForCancellation(
    stayData: any,
    booking: any,
    checkIn: Date,
    checkOut: Date,
    stayRef: any,
    transaction: Transaction
) {
    if (stayData.type === "Hotel") {
        const {updatedRooms, fullyBookedDates} = reverseHotelBooking(stayData, booking, checkIn, checkOut);
        // @ts-ignore
        transaction.update(stayRef, {rooms: updatedRooms, bookedDates: fullyBookedDates});
    } else if (stayData.type === "Home") {
        const updatedUnavailableDates = reverseHomeBooking(stayData, checkIn, checkOut);
        transaction.update(stayRef, {bookedDates: updatedUnavailableDates});
    }
}

function reverseHotelBooking(
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
    const updatedRooms: Room[] = [];
    const fullyBookedDatesSet = new Set<string>(stayData.bookedDates ?? []);

    rooms.forEach((room: Room) => {
        if (bookingIds.includes(room.id)) {
            const bookedRoomData = bookedRooms.find((r) => r.roomId === room.id);

            // Extract room-level data
            let bookedDatesMap = new Map<string, number>(
                Object.entries(room.bookedDates ?? {})
            );
            let fullDates = room.fullDates ?? [];

            // Iterate over the booking range
            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[ 0 ];

                // Update room-level bookedDates map
                const currentCount = bookedDatesMap.get(currentDateStr) || 0;
                const updatedCount = Math.max(currentCount - bookedRoomData!.numRooms, 0);

                if (updatedCount > 0) {
                    bookedDatesMap.set(currentDateStr, updatedCount);
                } else {
                    bookedDatesMap.delete(currentDateStr);
                }

                // Update full dates and stayData fully booked dates
                if (updatedCount < room.available) {
                    fullDates = fullDates.filter((date) => date !== currentDateStr);
                    fullyBookedDatesSet.delete(currentDateStr);
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

function reverseHomeBooking(stayData: Home, checkIn: Date, checkOut: Date): string[] {
    const unavailableDatesSet = new Set<string>(stayData.bookedDates || []);

    // Remove the booked dates within the booking range
    iterateDaysBetween(checkIn, checkOut, (date) => {
        const currentDateStr = date.toISOString().split('T')[ 0 ];
        unavailableDatesSet.delete(currentDateStr);
    });

    return Array.from(unavailableDatesSet);
}
