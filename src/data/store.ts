import {configureStore} from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice'
import AuthenticationReducer from '@/slices/authenticationSlice'


const store = configureStore({
    reducer: {
        booking: BookingReducer,
        authentication: AuthenticationReducer,
    }
});

export default store;