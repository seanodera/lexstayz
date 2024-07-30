'use client';

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { addDays, differenceInDays } from "date-fns";
import { getStaysFirebase } from "@/data/hotelsData";
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

interface StaysState {
    stays: Stay[];
    currentStay: Stay;
    currentId: number | string;
    dates: Dates;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
}

const initialState: StaysState = {
    stays: [],
    currentStay: {} as Stay,
    currentId: -1,
    dates: {
        startDate: new Date().toDateString(),
        endDate: addDays(new Date(), 1).toDateString(),
        length: 1,
    },
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false,
};

export const fetchStaysAsync = createAsyncThunk(
    'stays/fetchStays',
    async () => {
        const stays = await getStaysFirebase();
        return stays;
    }
);

const staysSlice = createSlice({
    name: "stays",
    initialState: initialState,
    reducers: {
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
        updateDates: (state, action: PayloadAction<Dates>) => {
            state.dates.startDate = action.payload.startDate;
            state.dates.endDate = action.payload.endDate;
            state.dates.length = differenceInDays(new Date(state.dates.endDate), new Date(state.dates.startDate));
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchStaysAsync.pending, (state) => {
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
            });
    }
});

export const selectCurrentStay = (state: RootState) => state.stays.currentStay;
export const selectAllStays = (state: RootState) => state.stays.stays;
export const selectCurrentId = (state: RootState) => state.stays.currentId;
export const selectDates = (state: RootState) => state.stays.dates;
export const selectIsLoading = (state: RootState) => state.stays.isLoading;
export const selectHasError = (state: RootState) => state.stays.hasError;
export const selectErrorMessage = (state: RootState) => state.stays.errorMessage;
export const selectHasRun = (state: RootState) => state.stays.hasRun;
export const selectStayById = (state: RootState, id: string | number) => state.stays.stays.find((stay) => stay.id === id);

export const {
    setAllStays,
    setCurrentStay,
    setCurrentStayFromId,
    updateDates
} = staysSlice.actions;

export default staysSlice.reducer;
