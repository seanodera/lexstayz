import {createAsyncThunk} from "@reduxjs/toolkit";
import {RootState} from "@/data/types";
import {generateID, getCurrentUser} from "@/data/bookingData";
import axios from "axios";
import {handler_url} from "@/lib/utils";
import createBooking from "@/slices/confirmBookingThunks/createBooking";
import {doc, updateDoc} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

async function updateBooking (id:string, paymentData : any, method: string, newRef: string, paymentRate: number, paymentCurrency: string) {
    const bookingsDoc = doc(firestore, 'bookings', id);
    await updateDoc(bookingsDoc, {paymentData: paymentData,
        paymentMethod: method,paymentDate: (new Date).toISOString(),paymentReference: newRef });
}

export const payExistingBooking = createAsyncThunk('confirmBooking/payExistingBooking',async (existingBooking: any, {dispatch, getState, rejectWithValue}) => {
    const state = getState() as RootState;
    const booking = state.confirmBooking;
    const paymentCurrency = booking.paymentCurrency
    try {
       const id = existingBooking.id +'LXT'+ generateID();
        // const country = state.authentication.country;
        const country =
            paymentCurrency === "KES" ? "Kenya" :
                paymentCurrency === "GHS" ? "Ghana" :
                    booking.configs.find((value) =>
                        value.correspondents.some(correspondent => correspondent.currency === paymentCurrency)
                    )?.country;
        const user = getCurrentUser();
        let amount = parseInt((booking.grandTotal).toFixed(2));
        if (booking.currency !== paymentCurrency) {
            amount = parseInt((booking.paymentRate * booking.grandTotal).toFixed(2));
        }

        if (state.confirmBooking.paymentMethod === 'mobile-money') {
            const res = await axios.post(`${handler_url}/api/payments/createTransaction`, {
                email: booking.contact.email,
                amount: amount,
                currency: paymentCurrency,
                callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${existingBooking.id}`,
                country: booking.country,
                booking: booking,
                reference: id,
            });

            const { access_code: accessCode, reference, authorization_url, method } = res.data.data;

            const paymentData = { accessCode, reference, authorization_url, method };

            await updateBooking(existingBooking.id,paymentData, method,id,booking.paymentRate, paymentCurrency);
            return authorization_url;
        } else {
            const res = await axios.post(`${handler_url}/api/payments/createTransaction`, {
                email: booking.contact.email,
                amount: amount,
                currency: booking.paymentCurrency,
                callback_url: `${process.env.NEXT_PUBLIC_HOST}/confirm-booking?userID=${user.uid}&booking=${existingBooking.id}`,
                country: country,
                booking: booking,
                reference: id
            });

            const { access_code: accessCode, reference, authorization_url, method } = res.data.data;

            const paymentData = { accessCode, reference, authorization_url, method };

            await updateBooking(existingBooking.id,paymentData, method,id,booking.paymentRate, paymentCurrency);
            return authorization_url;
        }
    } catch (error) {
        return rejectWithValue(`An error occurred. Please try again. ${error}`);
    }
})
