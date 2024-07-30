import { configureStore } from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice';
import AuthenticationReducer from '@/slices/authenticationSlice';
import ConfirmBookingReducer from "@/slices/confirmBookingSlice";
import staysReducer from "@/slices/staysSlice";

const store = configureStore({
    reducer: {
        bookings: BookingReducer,
        authentication: AuthenticationReducer,
        confirmBooking: ConfirmBookingReducer,
        stays: staysReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

