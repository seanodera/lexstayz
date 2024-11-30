'use client';

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "@/data/types";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {query, where} from "@firebase/firestore";
import {setBookingStay} from "@/slices/confirmBookingSlice";


export interface Stay {
    id: string;
    rooms: any[];

    [ key: string ]: any;
}


interface StaysState {
    stays: Stay[];
    currentStay: Stay;
    currentId: number | string;
    isLoading: boolean;
    hasError: boolean;
    errorMessage: string;
    hasRun: boolean;
    exchangeRates: any,
    globalCurrency: string
}

const initialState: StaysState = {
    stays: [],
    currentStay: {} as Stay,
    currentId: -1,
    isLoading: true,
    hasError: false,
    errorMessage: '',
    hasRun: false,
    exchangeRates: {},
    globalCurrency: 'GHS'
};

export const fetchStaysAsync = createAsyncThunk(
    'stays/fetchStays',
    async (_, {rejectWithValue}) => {
        try {

            const staysRef = query(collection(firestore, 'stays'), where('published', '==', true));
            const stays: Array<any> = [];
            const snapshot = await getDocs(staysRef);
            for (const doc1 of snapshot.docs) {
                stays.push(doc1.data());
            }
            return stays
        } catch (error) {

            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }

    }
);

export const setCurrentStayFromId = createAsyncThunk('stays/setCurrentStayFromId',
    async (id: string, {getState, dispatch, rejectWithValue}) => {
        try {
            const {stays} = getState() as { stays: StaysState }

            const currentStay = stays.stays.find((value) => value.id === id);
            if (currentStay) {

                dispatch(setBookingStay(currentStay))
                return currentStay;
            } else {
                const staysRef = collection(firestore, 'stays');
                const snapshot = await getDoc(doc(staysRef, id));
                const data = snapshot.data() as Stay
                console.log('Gotten from firebase: ', data)
                dispatch(setAllStays([...stays.stays, data]))
                dispatch(setBookingStay(data))
                return data;
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    })



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
        resetError: (state) => {
            state.hasError = false
            state.errorMessage = ''
        },
        setExchangeRates: (state, action) => {
            state.exchangeRates = action.payload?.rates || {};
            state.globalCurrency = action.payload?.currency || 'USD';
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
            })
            .addCase(setCurrentStayFromId.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(setCurrentStayFromId.fulfilled, (state, action) => {
                state.isLoading = false;
                state.currentStay = action.payload as Stay
            })
            .addCase(setCurrentStayFromId.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to set current stay';
            });
    }});

export const selectCurrentStay = (state: RootState) => state.stays.currentStay;
export const selectAllStays = (state: RootState) => state.stays.stays;
export const selectCurrentId = (state: RootState) => state.stays.currentId;
export const selectIsStayLoading = (state: RootState) => state.stays.isLoading;
export const selectHasError = (state: RootState) => state.stays.hasError;
export const selectErrorMessage = (state: RootState) => state.stays.errorMessage;
export const selectHasRun = (state: RootState) => state.stays.hasRun;
export const selectStayById = (state: RootState, id: string | number) => state.stays.stays.find((stay: Stay) => stay.id === id);
export const selectExchangeRate = (state: RootState) => state.stays.exchangeRates;
export const selectGlobalCurrency = (state: RootState) => state.stays.globalCurrency;

export const {
    setAllStays,
    setCurrentStay,
    resetError,
    setExchangeRates,
} = staysSlice.actions;

export default staysSlice.reducer;
