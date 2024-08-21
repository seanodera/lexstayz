import {createAsyncThunk} from "@reduxjs/toolkit";
import {generateID, getCurrentUser} from "@/data/bookingData";
import axios from "axios";
import {ConfirmBookingState} from "@/slices/confirmBookingSlice";
import createBooking from "@/slices/confirmBookingThunks/createBooking";

const handlePaymentAsync = createAsyncThunk(
    'confirmBooking/handlePaymentAsync',
    async ({ preserve = false }: { preserve?: boolean }, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as { confirmBooking: ConfirmBookingState };
        const booking = state.confirmBooking;

        const id = generateID();
        const paymentCurrency = 'KES'


        try {
            const user = getCurrentUser();
            let amount = parseInt((booking.grandTotal).toFixed(2));
            if (booking.currency !== paymentCurrency) {
                amount = parseInt((booking.exchangeRates[paymentCurrency] * 1.02 * booking.grandTotal).toFixed(2));
            }

            if (state.confirmBooking.paymentMethod === 'new') {
                const res = await axios.post('/api/createTransaction', {
                    email: booking.contact.email,
                    amount: amount,
                    currency: paymentCurrency,
                    callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${id}${preserve ? `&preserve=${preserve}` : ''}`,
                    reference: id
                });

                const { access_code: accessCode, reference, authorization_url } = res.data.data.data;

                const paymentData = { accessCode, reference, authorization_url };
                await dispatch(createBooking({ paymentData, id }));
                return authorization_url;
            } else {
                const res = await axios.post('/api/createCharge', {
                    email: booking.contact.email,
                    amount: amount,
                    currency: paymentCurrency,
                    authorization_code: state.confirmBooking.paymentMethod,
                    callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${id}${preserve ? `&preserve=${preserve}` : ''}`,
                    reference: id
                });

                await dispatch(createBooking({ paymentData: res.data.data, id }));
                return `/confirm-booking?userID=${user.uid}&booking=${id}`;
            }
        } catch (error) {
            return rejectWithValue(`An error occurred. Please try again. ${error}`);
        }
    }
);

export default handlePaymentAsync;