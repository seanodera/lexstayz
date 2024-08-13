'use client';

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getBookings } from "@/data/bookingData";
import {RootState} from "@/data/types";

interface BookingState {
    cart: any[];
    bookings: any[];
    currentBooking: any;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasBookingRun:boolean
}

const initialState: BookingState = {
    cart: [],
    bookings: [],
    currentBooking: {},
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasBookingRun: false,
};

export const fetchBookingsAsync = createAsyncThunk(
    'bookings/fetchBookings',
    async () => {
        const bookings = await getBookings();

        return bookings;
    }
);

const bookingsSlice = createSlice({
    name: "bookings",
    initialState: initialState,
    reducers: {
        resetBooking: (state) => {
            state.cart = [];
        },
        updateCart: (state, action: PayloadAction<any[]>) => {
            state.cart = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchBookingsAsync.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(fetchBookingsAsync.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.isLoading = false;
                state.hasBookingRun = true;
            })
            .addCase(fetchBookingsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to fetch bookings';
            });
    }
});

export const selectCart = (state: RootState) => state.bookings.cart;
export const selectBookings = (state: RootState) => state.bookings.bookings;
export const selectIsLoading = (state: RootState) => state.bookings.isLoading;
export const selectHasError = (state: RootState) => state.bookings.hasError;
export const selectErrorMessage = (state: RootState) => state.bookings.errorMessage;
export const selectHasBookingRun =  (state: RootState) => state.bookings.hasBookingRun;

export const {
    resetBooking,
    updateCart
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
