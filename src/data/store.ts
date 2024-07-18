import {configureStore} from "@reduxjs/toolkit";
import BookingReducer from '@/slices/bookingSlice'

const store = configureStore({
    reducer: {
        booking: BookingReducer
    }
});

export default store;