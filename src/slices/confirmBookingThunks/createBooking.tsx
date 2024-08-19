import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/bookingData";
import {doc, writeBatch} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {ConfirmBookingState} from "@/slices/confirmBookingSlice";


const createBooking = createAsyncThunk(
    'confirmBooking/createBooking',
    async ({ paymentData, id }: { paymentData: any, id: string }, { getState, rejectWithValue }) => {
        const state = getState() as { confirmBooking: ConfirmBookingState };
        const {
            stay,
            checkInDate,
            checkOutDate,
            rooms,
            contact,
            numGuests,
            specialRequest,
            totalPrice,
            currency,
            usedRate,
            fees,
            grandTotal,
        } = state.confirmBooking;

        try {
            const user = getCurrentUser();
            const batch = writeBatch(firestore);
            const userDoc = doc(firestore, 'users', user.uid, 'bookings', id);
            const hostDoc = doc(firestore, 'hosts', stay.hostId, 'bookings', id);

            const commonProperties = {
                id: id,
                accommodationId: stay.id,
                accountId: user.uid,
                hostId: stay.hostId,
                user: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    phone: contact.phone,
                    country: contact.country,
                },
                checkInDate,
                checkOutDate,
                createdAt: new Date().toISOString(),
                numGuests: numGuests,
                isConfirmed: false,
                totalPrice: totalPrice,
                fees: fees,
                currency: currency,
                usedRate: usedRate,
                paymentData: paymentData,
                specialRequest: specialRequest,
                status: 'Unpaid',
            };

            const unique = (stay.type === 'Hotel') ? { rooms: rooms } : {};

            const booking = {
                ...commonProperties,
                ...unique
            };

            batch.set(userDoc, booking);
            await batch.commit();
            return booking;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('Error');
            }
        }
    }
);

export default createBooking;