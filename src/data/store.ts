import { configureStore } from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice';
import AuthenticationReducer from '@/slices/authenticationSlice';
import ConfirmBookingReducer from "@/slices/confirmBookingSlice";
import staysReducer from "@/slices/staysSlice";
import {bookingResetMiddleware} from "@/data/middleware.ts";


const store = configureStore({
    reducer: {
        bookings: BookingReducer,
        authentication: AuthenticationReducer,
        confirmBooking: ConfirmBookingReducer,
        stays: staysReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(bookingResetMiddleware),
});

export default store;


