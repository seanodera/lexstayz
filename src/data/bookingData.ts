import {auth, firestore} from "@/lib/firebase";
import {query, where, writeBatch} from "@firebase/firestore";
import {collection, doc, getDoc, getDocs, runTransaction} from "firebase/firestore";
import {addDays} from "date-fns";
import axios from "axios";
import {handler_url} from "@/lib/utils";
import {Balance} from "@/lib/types";


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


interface BookingParams {
    userId: string,
    id: string,
    paymentData: any,
    isConfirmed?: boolean,
    status?: string
}


export async function completeBooking({
                                          userId,
                                          id,
                                          paymentData,
                                          isConfirmed = true,
                                          status = 'Confirmed',
                                      }: BookingParams) {
    try {
        const batch = writeBatch(firestore);
        const bookingsDoc = doc(firestore, 'bookings', id);
        const bookingSnap = await getDoc(bookingsDoc);

        if (!bookingSnap.exists()) throw new Error("Booking does not exist!");
        const booking = bookingSnap.data();

        if (booking.status === status && booking.isConfirmed === isConfirmed) {
            throw new Error("Booking status or confirmation status is already set!");
        }

        const hostRef = doc(firestore, 'hosts', booking.hostId);
        const hostTransactionsRef = doc(firestore, 'hosts', booking.hostId, 'pendingTransactions', id);
        const stayRef = doc(firestore, 'stays', booking.accommodationId);

        batch.update(bookingsDoc, {status, isConfirmed, paymentData});

        const transactionDoc = await getDoc(hostTransactionsRef);

        await runTransaction(firestore, async (transaction) => {
            const staySnap = await transaction.get(stayRef);
            if (!staySnap.exists()) throw new Error("Accommodation document does not exist!");
            const stayData = staySnap.data();

            const checkIn = new Date(booking.checkInDate);
            const checkOut = new Date(booking.checkOutDate);

            // Update host transactions
            handleTransactionUpdates({
                transactionDoc,
                status,
                booking,
                stayData,
                hostTransactionsRef,
                batch,
                paymentData,
            });

            // Update host balance
            await updateHostBalance(transaction, hostRef, booking, status);

            // Update stay availability
            if (stayData.type === 'Hotel') {
                const {updatedRooms, fullyBookedDates} = processHotelBooking(stayData, booking, checkIn, checkOut);
                transaction.update(stayRef, {rooms: updatedRooms,bookedDates: fullyBookedDates});
            } else if (stayData.type === 'Home') {
                const unavailableDates = processHomeBooking(stayData, checkIn, checkOut);
                transaction.update(stayRef, {bookedDates: unavailableDates});
            }
        });

        await batch.commit();
        console.log('Booking completed successfully', booking);
    } catch (err) {
        console.error("Error completing booking:", err);
    }
}

/**
 * Handles updates to the host transactions document.
 */
function handleTransactionUpdates({
                                      transactionDoc,
                                      status,
                                      booking,
                                      stayData,
                                      hostTransactionsRef,
                                      batch,
                                      paymentData,
                                  }: {
    transactionDoc: any;
    status: string;
    booking: any;
    stayData: any;
    hostTransactionsRef: any;
    batch: any;
    paymentData: any;
}) {
    if (transactionDoc.exists()) {
        if (status === 'Canceled' || status === 'Rejected') {
            batch.delete(hostTransactionsRef);
        }
    } else if (status === 'Confirmed') {
        batch.set(hostTransactionsRef, {
            id: booking.id,
            amount: booking.totalPrice,
            currency: stayData.currency,
            paymentData,
            date: booking.createdAt,
            hostId: booking.hostId,
            userId: booking.userId,
            status,
            availableDate: addDays(booking.checkOutDate, 3).toISOString(),
        });
    }
}

/**
 * Updates the host's balance in the database.
 */
async function updateHostBalance(transaction: any, hostRef: any, booking: any, status: string) {
    const hostSnap = await transaction.get(hostRef);
    const hostData = hostSnap.data();

    if (!hostData) throw new Error("Host data not found!");

    const currentBalance: Balance = hostData.balance || {
        available: 0,
        prevAvailable: 0,
        pending: 0,
        prevPending: 0,
    };

    const updatedBalance = {...currentBalance};

    if (status === 'Confirmed') {
        updatedBalance.pending += booking.totalPrice;
    } else if (status === 'Canceled' || status === 'Rejected') {
        updatedBalance.pending -= booking.totalPrice;
    }

    updatedBalance.prevPending = currentBalance.pending;
    updatedBalance.prevAvailable = currentBalance.available;

    transaction.update(hostRef, {balance: updatedBalance});
}

function processHotelBooking(stayData: any, booking: any, checkIn: Date, checkOut: Date): {
    updatedRooms: any[],
    fullyBookedDates: string[]
} {
    const rooms = stayData.rooms;
    const bookedRooms = booking.rooms;
    const bookingIds = bookedRooms.map((room: any) => room.roomId);

    let updatedRooms: any[] = [];
    let fullyBookedDates: string[] = stayData.bookedDates?? [];


    rooms.forEach((room: any) => {

        if (bookingIds.includes(room.id)) {

            const bookedRoomData = bookedRooms.find((r: any) => r.roomId === room.id);
            let {bookedDates, fullDates} = room;
            console.log(bookedDates, fullDates, room)

            bookedDates = bookedDates ? {...bookedDates} : {};
            fullDates = fullDates ? [...fullDates] : [];
            console.log(bookingIds);
            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[ 0 ];
                console.log(currentDateStr)
                if (!bookedDates[ currentDateStr ]) {
                    bookedDates[ currentDateStr ] = bookedRoomData.numRooms;
                } else {
                    bookedDates[ currentDateStr ] += bookedRoomData.numRooms;
                }

                if (bookedDates[ currentDateStr ] >= room.available && !fullDates.includes(currentDateStr)) {
                    fullDates.push(currentDateStr);
                    fullyBookedDates.push(currentDateStr);
                }
            });

            updatedRooms.push({...room, bookedDates, fullDates});
        } else {
            updatedRooms.push(room);
        }
    });
    console.log(updatedRooms, fullyBookedDates);
    return {updatedRooms, fullyBookedDates};
}

function processHomeBooking(stayData: any, checkIn: Date, checkOut: Date): string[] {
    const unavailableDates = new Set<string>(stayData.bookedDates || []);

    iterateDaysBetween(checkIn, checkOut, (date) => {
        unavailableDates.add(date.toISOString().split('T')[ 0 ]);
    });

    return Array.from(unavailableDates);
}

function iterateDaysBetween(startDate: Date, endDate: Date, task: (date: Date) => void): void {
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        task(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
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
