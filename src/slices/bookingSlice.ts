'use client';

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {completeBooking, getBookings, getCurrentUser} from "@/data/bookingData";
import {RootState} from "@/data/types";
import {verifyPayment} from "@/data/payment";
import {state} from "sucrase/dist/types/parser/traverser/base";

interface BookingState {
    cart: any[];
    bookings: any[];
    currentBooking: any;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasBookingRun: boolean
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

export const checkUnpaidBookingAsync = createAsyncThunk('bookings/checkUnpaidBooking', async (id: string, {
    getState,
    rejectWithValue
}) => {
    try {
        const {bookings} = getState() as RootState
        const _booking = bookings.bookings.find((value) => value.id === id)
        const user = getCurrentUser()
        const res = await verifyPayment(id)
        if (res.status === 'success' && !_booking.isConfirmed) {
            await completeBooking({
                userId: user.uid,
                id: _booking.id,
                isConfirmed: true,
                status: 'Confirmed'
            })
            return {
                booking: {
                    ..._booking,
                    isConfirmed: true,
                    status: 'Confirmed',
                }, updated: true
            }
        } else if (res.status === 'success' && _booking.isConfirmed) {
            return {booking: _booking, updated: false};
        } else if (_booking.isConfirmed) {
            completeBooking({
                userId: user.uid,
                id: _booking.id,
                isConfirmed: false,
                status: 'Rejected',
            })
            return {
                booking: {
                    ..._booking,
                    isConfirmed: false,
                    status: 'Rejected',
                }, updated: true
            }
        } else {
            return {booking: _booking, updated: false};
        }

    } catch (error) {
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
    }
})
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
            }).addCase(checkUnpaidBookingAsync.pending, (state, action) => {
            state.isLoading = true;
        }).addCase(checkUnpaidBookingAsync.fulfilled, (state, action) => {
            if (action.payload.updated) {
                const pos = state.bookings.findIndex(value => value.id === action.payload.booking.id)
                state.bookings[ pos ] = action.payload;
            }
            state.isLoading = false;
        }).addCase(checkUnpaidBookingAsync.rejected, (state, action) => {
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
export const selectHasBookingRun = (state: RootState) => state.bookings.hasBookingRun;

export const {
    resetBooking,
    updateCart
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
