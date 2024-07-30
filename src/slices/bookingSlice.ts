'use client'

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDays, differenceInDays } from "date-fns";
import { getStaysFirebase } from "@/data/hotelsData";
import { getBookings } from "@/data/bookingData";
import { RootState } from "@/data/store"; // Ensure you have a RootState type defined in your store

export interface Stay {
    id: string;
    rooms: any[];

    [key: string]: any;
}

interface Dates {
    startDate: string;
    endDate: string;
    length: number;
}

interface BookingState {
    cart: any[];
    currentStay: Stay;
    currentId: number | string;
    stays: Stay[];
    cartTotal: number;
    bookings: any[];
    currentBooking: any;
    dates: Dates;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
}

const initialState: BookingState = {
    cart: [],
    currentStay: {} as Stay,
    currentId: -1,
    stays: [],
    cartTotal: 0,
    bookings: [],
    currentBooking: {},
    dates: {
        startDate: new Date().toDateString(),
        endDate: addDays(new Date(), 1).toDateString(),
        length: 1,
    },
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false
};

export const fetchStaysAsync = createAsyncThunk(
    'booking/fetchStays',
    async () => {
        const stays = await getStaysFirebase();
        return stays;
    }
);

export const fetchBookingsAsync = createAsyncThunk('booking/fetchBookings', async () => {
    const bookings = await getBookings();
    return bookings;
})

const bookingSlice = createSlice({
    name: "booking",
    initialState: initialState,
    reducers: {
        resetBooking: (state) => {
            state.cart = [];
            state.currentId = -1;
            state.currentStay = {} as Stay;
        },
        setAllStays: (state, action: PayloadAction<Stay[]>) => {
            state.stays = action.payload;
        },
        setCurrentStay: (state, action: PayloadAction<Stay>) => {
            state.currentStay = action.payload;
            state.currentId = -1;
        },
        setCurrentStayFromId: (state, action: PayloadAction<string | number>) => {
            state.currentId = action.payload;
            const currentStay = state.stays.find((value) => value.id === action.payload);
            console.log(currentStay);
            state.currentStay = currentStay ? currentStay : ({} as Stay);
        },
        updateCart: (state, action: PayloadAction<any[]>) => {
            state.cart = action.payload;
        },
        updateDates: (state, action: PayloadAction<Dates>) => {
            state.dates.startDate = action.payload.startDate;
            state.dates.endDate = action.payload.endDate;
            state.dates.length = differenceInDays(new Date(state.dates.endDate), new Date(state.dates.startDate));
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStaysAsync.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
            state.errorMessage = '';
        })
            .addCase(fetchStaysAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stays = action.payload;
                state.hasRun = true;
            })
            .addCase(fetchStaysAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to fetch stays';
            })
            .addCase(fetchBookingsAsync.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(fetchBookingsAsync.fulfilled, (state, action) => {
                state.bookings = action.payload;
                state.isLoading = false;
            })
            .addCase(fetchBookingsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to fetch stays';
            });
    }
})

export const selectCurrentStay = (state: RootState) => state.booking.currentStay;
export const selectCart = (state: RootState) => state.booking.cart;
export const selectCurrentId = (state: RootState) => state.booking.currentId;
export const selectAllStays = (state: RootState) => state.booking.stays;
export const selectDates = (state: RootState) => state.booking.dates;
export const selectIsLoading = (state: RootState) => state.booking.isLoading;
export const selectHasError = (state: RootState) => state.booking.hasError;
export const selectErrorMessage = (state: RootState) => state.booking.errorMessage;
export const selectHasRun = (state: RootState) => state.booking.hasRun;
export const selectBookings = (state: RootState) => state.booking.bookings;
export const selectStayById = (state: RootState, id: string | number) => state.booking.stays.find((stay) => stay.id === id);

export const {
    resetBooking,
    setCurrentStay,
    updateCart,
    setAllStays,
    setCurrentStayFromId,
    updateDates
} = bookingSlice.actions
export default bookingSlice.reducer;
