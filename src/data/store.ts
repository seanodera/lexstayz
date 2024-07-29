import { configureStore } from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice';
import AuthenticationReducer from '@/slices/authenticationSlice';
import ConfirmBookingReducer from "@/slices/confirmBookingSlice";

const store = configureStore({
    reducer: {
        booking: BookingReducer,
        authentication: AuthenticationReducer,
        confirmBooking: ConfirmBookingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
