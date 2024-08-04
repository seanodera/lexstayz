'use client';

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/data/types";
import {collection, getDocs} from "firebase/firestore";
import {firestore} from "@/lib/firebase";


export interface Stay {
    id: string;
    rooms: any[];

    [ key: string ]: any;
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
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
}

const initialState: StaysState = {
    stays: [],
    currentStay: {} as Stay,
    currentId: -1,
    isLoading: true,
    hasError: false,
    errorMessage: '',
    hasRun: false,
};

export const fetchStaysAsync = createAsyncThunk(
    'stays/fetchStays',
    async (_, {rejectWithValue}) => {
        try {
            const staysRef = collection(firestore, 'stays');
            const stays: Array<any> = [];
            const snapshot = await getDocs(staysRef);
            for (const doc1 of snapshot.docs) {
                stays.push(doc1.data());
            }
            return stays
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }

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
            if (currentStay) {
                if (state.currentStay.id !== currentStay?.id) {

                }
            }
            state.currentStay = currentStay ? currentStay : ({} as Stay);
        },
        resetError: (state) => {
            state.hasError = false
            state.errorMessage = ''
        }
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
                state.stays = action.payload as Stay[];
                state.hasRun = true;
            })
            .addCase(fetchStaysAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to fetch stays';
            });
    }
});

export const selectCurrentStay = (state: RootState) => state.stays.currentStay;
export const selectAllStays = (state: RootState) => state.stays.stays;
export const selectCurrentId = (state: RootState) => state.stays.currentId;
export const selectIsLoading = (state: RootState) => state.stays.isLoading;
export const selectHasError = (state: RootState) => state.stays.hasError;
export const selectErrorMessage = (state: RootState) => state.stays.errorMessage;
export const selectHasRun = (state: RootState) => state.stays.hasRun;
export const selectStayById = (state: RootState, id: string | number) => state.stays.stays.find((stay: Stay) => stay.id === id);

export const {
    setAllStays,
    setCurrentStay,
    setCurrentStayFromId,
    resetError,
} = staysSlice.actions;

export default staysSlice.reducer;
