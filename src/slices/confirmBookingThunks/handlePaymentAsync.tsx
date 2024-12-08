import {createAsyncThunk} from "@reduxjs/toolkit";
import {generateID, getCurrentUser} from "@/data/bookingData";
import axios from "axios";
import createBooking from "@/slices/confirmBookingThunks/createBooking";
import {handler_url} from "@/lib/utils";
import {RootState} from "@/data/types";

const handlePaymentAsync = createAsyncThunk(
    'confirmBooking/handlePaymentAsync',
    async ({ preserve = false }: { preserve?: boolean }, { dispatch, getState, rejectWithValue }) => {
        const state = getState() as RootState;
        const booking = state.confirmBooking;

        const id = generateID();
        const paymentCurrency = booking.paymentCurrency


        try {
            const country = state.authentication.country;
            const user = getCurrentUser();
            let amount = parseInt((booking.grandTotal).toFixed(2));
            if (booking.currency !== paymentCurrency) {
                amount = parseInt((booking.paymentRate * booking.grandTotal).toFixed(2));
            }

            if (state.confirmBooking.paymentMethod === 'mobile-money') {
                const res = await axios.post(`${handler_url}/api/payments/createTransaction`, {
                    email: booking.contact.email,
                    amount: booking.grandTotal.toFixed(2),
                    currency: booking.currency,
                    callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${id}`,
                    country: booking.country,
                    booking: booking,
                    reference: id
                });

                const { access_code: accessCode, reference, authorization_url, method } = res.data.data;

                const paymentData = { accessCode, reference, authorization_url, method };
                await dispatch(createBooking({ paymentData, id, method }));
                return authorization_url;
            } else {
                const res = await axios.post(`${handler_url}/api/payments/createTransaction`, {
                    email: booking.contact.email,
                    amount: amount,
                    currency: booking.paymentCurrency,
                    callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${id}`,
                    country: country?.name,
                    booking: booking,
                    reference: id
                });

                const { access_code: accessCode, reference, authorization_url, method } = res.data.data;

                const paymentData = { accessCode, reference, authorization_url, method };
                await dispatch(createBooking({ paymentData, id, method }));
                return authorization_url;
            }
        } catch (error) {
            return rejectWithValue(`An error occurred. Please try again. ${error}`);
        }
    }
);

export default handlePaymentAsync;
