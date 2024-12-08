import {createAsyncThunk} from "@reduxjs/toolkit";
import {getCurrentUser} from "@/data/bookingData";
import {doc, writeBatch} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {ConfirmBookingState} from "@/slices/confirmBookingSlice";


const createBooking = createAsyncThunk(
    'confirmBooking/createBooking',
    async ({ paymentData, id, method }: { paymentData: any, id: string,method: string }, { getState, rejectWithValue }) => {
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
            subtotal,
            currency,
            usedRate,
            fees,
            grandTotal,
            exchangeRates,
            paymentRate,
            paymentCurrency,
        } = state.confirmBooking;

        try {
            const user = getCurrentUser();
            const batch = writeBatch(firestore);
            const bookingsDoc = doc(firestore, 'bookings', id);
            const checkIn = new Date(checkInDate);

            const [hours, minutes] = stay.checkInTime.split(':').map(Number);
            checkIn.setHours(hours);
            checkIn.setMinutes(minutes);
            const [hoursOut, minutesOut] = stay.checkOutTime.split(':').map(Number);
            const checkOut = new Date(checkOutDate);
            checkOut.setHours(hoursOut)
            checkOut.setMinutes(minutesOut)
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
                checkInDate: checkIn.toISOString(),
                checkOutDate: checkOut.toISOString(),
                createdAt: new Date().toISOString(),
                numGuests: numGuests,
                isConfirmed: false,
                totalPrice: totalPrice,
                subtotal: subtotal,
                fees: fees,
                currency: currency,
                usedRate: usedRate,
                paymentData: paymentData,
                paymentMethod: method,
                specialRequest: specialRequest,
                status: 'Unpaid',
                grandTotal,
                paymentCurrency,
                paymentRate: paymentRate,
            };

            const unique = (stay.type === 'Hotel') ? { rooms: rooms } : {};

            const booking = {
                ...commonProperties,
                ...unique
            };

            batch.set(bookingsDoc, booking);
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
