import {createAsyncThunk} from "@reduxjs/toolkit";

import {writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {collection, doc, getDoc} from "firebase/firestore";

import dayjs from "dayjs";
import {addDays} from "date-fns";
import {RootState} from "@/data/types";
import {cancelBooking, getCurrentUser, refundBooking} from "@/data/bookingData";


export const updateBookingStatusAsync = createAsyncThunk(
    'booking/updateStatus',
    async ({status, booking}: { status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected', booking: any }, {
        getState,
        rejectWithValue
    }) => {
        const state = getState() as RootState
        const stayState = state.stays
        try {
            const user = getCurrentUser()
            const batch = writeBatch(firestore);
            const bookingsDoc = doc(firestore,  'bookings', booking.id)
            const hostTransaction = doc(firestore, 'hosts', booking.hostId, 'pendingTransactions', booking.id);
            const transactionDoc = await getDoc(hostTransaction)
            const availableRef = collection(firestore, 'hosts', booking.hostId, 'availableTransactions');
            const stayRef = doc(firestore, 'stays', booking.accommodationId);
            let paymentData = booking.paymentData;
            if (status === 'Rejected' || status === 'Canceled') {
                const newBooking = await cancelBooking(booking)
                paymentData = newBooking.paymentData;
            }

            if (transactionDoc.exists()) {

            } else {
                if (status === 'Confirmed') {
                    batch.set(hostTransaction, {
                        id: booking.id,
                        amount: booking.totalPrice,
                        fees: booking.fees,
                        currency: 'USD',
                        paymentData: paymentData,
                        date: booking.createdAt,
                        availableDate: addDays(booking.checkOutDate, 3).toISOString(),
                    }, {merge: true})
                }
            }
            batch.update(bookingsDoc, {status: status, acceptedAt: new Date().toString(), paymentData: paymentData,})


            await batch.commit();
            let newBooking = {...booking};
            newBooking.status = status
            return {booking: newBooking, status}
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error');
            }
        }

    }
);



function reverseProcessHotelBooking(stayData: any, booking: any, checkIn: Date, checkOut: Date): {
    updatedRooms: any[],
    fullyBookedDates: string[]
} {
    const rooms = stayData.rooms;
    const bookedRooms = booking.rooms;
    const bookingIds = bookedRooms.map((room: any) => room.roomId);

    let updatedRooms: any[] = [];
    let fullyBookedDates: string[] = [...stayData.fullyBookedDates];

    rooms.forEach((room: any) => {
        if (bookingIds.includes(room.id)) {
            const bookedRoomData = bookedRooms.find((r: any) => r.roomId === room.id);
            let {bookedDates, fullDates} = room;

            // Initialize if undefined
            bookedDates = bookedDates ? {...bookedDates} : {};
            fullDates = fullDates ? [...fullDates] : [];

            iterateDaysBetween(checkIn, checkOut, (date) => {
                const currentDateStr = date.toISOString().split('T')[0];

                if (bookedDates[currentDateStr]) {
                    // Decrease the booked count due to cancellation
                    bookedDates[currentDateStr] -= bookedRoomData.numRooms;

                    if (bookedDates[currentDateStr] <= 0) {
                        delete bookedDates[currentDateStr];
                    }

                    // If room is now available on this date, remove from fullDates
                    if (fullDates.includes(currentDateStr) && bookedDates[currentDateStr] < room.available) {
                        fullDates = fullDates.filter((value: string) => value !== currentDateStr);
                        fullyBookedDates = fullyBookedDates.filter((value: string) => value !== currentDateStr);
                    }
                }
            });

            updatedRooms.push({...room, bookedDates, fullDates});
        } else {
            updatedRooms.push(room);
        }
    });

    return {updatedRooms, fullyBookedDates};
}

function reverseProcessHomeBooking(stayData: any, checkIn: Date, checkOut: Date): string[] {
    const unavailableDates = new Set<string>(stayData.bookedDates || []);

    iterateDaysBetween(checkIn, checkOut, (date) => {
        unavailableDates.delete(date.toISOString().split('T')[0]);
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
