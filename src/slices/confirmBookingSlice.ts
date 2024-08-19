import { Stay } from "@/lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";;
import { addDays, differenceInDays } from "date-fns";
import { RootState } from "@/data/types";
import {getCountry, getFeePercentage} from "@/lib/utils";
import createBooking from "@/slices/confirmBookingThunks/createBooking";
import handlePaymentAsync from '@/slices/confirmBookingThunks/handlePaymentAsync'
import {state} from "sucrase/dist/types/parser/traverser/base";
import {WritableDraft} from "immer";

export interface ConfirmBookingState {
    stay: Stay;
    checkInDate: string;
    checkOutDate: string;
    rooms: object[];
    paymentData: any;
    contact: any;
    numGuests: number;
    specialRequest: string;
    totalPrice: number;
    currency: string;
    usedRate: number;
    fees: number;
    grandTotal: number;  // Added grandTotal to the state
    length: number;
    exchanged: boolean;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    bookingStatus: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected';
    paymentMethod: any;
    exchangeRates: any;
}

const initialState: ConfirmBookingState = {
    stay: {} as Stay,
    checkInDate: new Date().toString(),
    checkOutDate: addDays(new Date().toString(), 1).toString(),
    rooms: [],
    paymentData: {
        method: 'Pryzapay',
        account: '80085'
    },
    contact: {},
    numGuests: 2,
    specialRequest: '',
    totalPrice: 0,
    currency: 'KES',
    fees: 0,
    usedRate: 1,
    grandTotal: 0,  // Initialize grandTotal
    exchanged: false,
    length: 0,
    status: 'idle',
    error: null,
    paymentMethod: 'new',
    bookingStatus: 'Pending', // Default status
    exchangeRates: {}
};

const recalculateCosts = (state: any) => {
    if (!state.stay.id){
        return ;
    }
    console.log(state, state.stay.id)
    //calculate totals
    let subTotal = 0;

    if (state.stay.type === 'Hotel'){
        state.rooms.forEach((value: any) => {
            subTotal += value.numRooms * state.stay.rooms.find((stay: any) => stay.id === value.roomId).price * state.length ;
        });
    } else {
        subTotal = state.stay.price * state.length
    }

    // Convert the total price to USD for fee calculation
    let totalPriceInUSD = subTotal;

    if (state.stay.currency !== 'USD') {

        totalPriceInUSD = (subTotal * 1.02 / state.exchangeRates[state.stay.currency]) * state.exchangeRates['USD']
    }

    // Calculate fees using the fee percentage function based on the USD equivalent of totalPrice
    const feePercentage = getFeePercentage(totalPriceInUSD) / 100;
    const fees = subTotal * feePercentage;

    // Convert the total price to the stay's currency if necessary
    if (state.stay.currency && state.stay.currency !== state.currency) {

        const exchangeRate = 1.02 / state.exchangeRates[state.stay.currency];
        state.usedRate = exchangeRate ;
        state.fees = fees * exchangeRate;
        state.totalPrice = subTotal * exchangeRate;

        state.grandTotal = state.fees + state.totalPrice;
    } else {
        state.totalPrice = subTotal;
        state.fees = fees;
        state.usedRate = 1;
        state.grandTotal = state.totalPrice + state.fees;
    }
};






export const fetchExchangeRates = createAsyncThunk(
    'confirmBooking/fetchExchangeRates',
    async (_, { getState }) => {
        const { confirmBooking } = getState() as { confirmBooking: ConfirmBookingState };
        try {
            const country = await getCountry()
            let fromCurrency = country?.currency || confirmBooking.currency;

            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);
            console.log(response)
            const data = await response.json();
            return {rates: data.rates, currency: data.base_code};
        } catch (error) {
            console.error('Error fetching exchange rates:', error);
        }
    }
);

const ConfirmBookingSlice = createSlice({
    name: 'confirmBooking',
    initialState,
    reducers: {
        updateContact: (state, action: PayloadAction<any>) => {
            state.contact = action.payload;
        },
        updateSpecialRequest: (state, action: PayloadAction<string>) => {
            state.specialRequest = action.payload;
        },
        updateCostData: (state, action: PayloadAction<{ price: number; currency: string; usedRate: number }>) => {
            state.totalPrice = action.payload.price;
            state.currency = action.payload.currency;
            state.usedRate = action.payload.usedRate;
            state.exchanged = state.stay.currency !== action.payload.currency;

            recalculateCosts(state); // Recalculate costs when the price or currency changes
        },
        updateBookingData: (state, action: PayloadAction<{
            numGuests: number;
            checkInDate: string;
            checkOutDate: string
        }>) => {
            state.length = differenceInDays(action.payload.checkOutDate, action.payload.checkInDate);
            state.numGuests = action.payload.numGuests;
            state.checkInDate = action.payload.checkInDate;
            state.checkOutDate = action.payload.checkOutDate;

            if (state.stay.type && state.stay.type !== 'Hotel') {
                state.totalPrice = state.length * state.stay.price;
            }

            recalculateCosts(state); // Recalculate costs when booking dates or number of guests change
        },
        setBookingStay: (state, action: PayloadAction<Stay>) => {
            state.stay = action.payload;
            recalculateCosts(state); // Recalculate costs when the stay changes
        },
        convertCart: (state, action: PayloadAction<object[]>) => {
            state.rooms = action.payload;
            recalculateCosts(state)
        },
        setPaymentMethod: (state,action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookingStatus = 'Pending'; // Default status when booking is created
            })
            .addCase(createBooking.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(handlePaymentAsync.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(handlePaymentAsync.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.bookingStatus = 'Pending';
            })
            .addCase(handlePaymentAsync.rejected, (state, action: PayloadAction<any>) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(fetchExchangeRates.fulfilled, (state, action) => {
                state.exchangeRates = action.payload?.rates;
                state.currency = action.payload?.currency || 'KES';
                state.usedRate = action.payload?.rates[state.currency] * 1.02;

                recalculateCosts(state); // Recalculate costs after exchange rates are fetched
            })
            .addCase(fetchExchangeRates.pending, (state, action) => {
                state.status = 'loading'
                console.log('Fetching Rates',action.payload)
            });
    }

});

export const {
    updateContact,
    updateSpecialRequest,
    updateCostData,
    updateBookingData,
    setBookingStay,
    convertCart,
    setPaymentMethod
} = ConfirmBookingSlice.actions;

export {createBooking, handlePaymentAsync}

export const selectStay = (state: RootState) => state.confirmBooking.stay;
export const selectCheckInDate = (state: RootState) => state.confirmBooking.checkInDate;
export const selectCheckOutDate = (state: RootState) => state.confirmBooking.checkOutDate;
export const selectRooms = (state: RootState) => state.confirmBooking.rooms;
export const selectPaymentData = (state: RootState) => state.confirmBooking.paymentData;
export const selectContact = (state: RootState) => state.confirmBooking.contact;
export const selectNumGuests = (state: RootState) => state.confirmBooking.numGuests;
export const selectSpecialRequest = (state: RootState) => state.confirmBooking.specialRequest;
export const selectTotalPrice = (state: RootState) => state.confirmBooking.totalPrice;
export const selectCurrency = (state: RootState) => state.confirmBooking.currency;
export const selectUsedRate = (state: RootState) => state.confirmBooking.usedRate;
export const selectFees = (state: RootState) => state.confirmBooking.fees;
export const selectExchanged = (state: RootState) => state.confirmBooking.exchanged;
export const selectStatus = (state: RootState) => state.confirmBooking.status;
export const selectError = (state: RootState) => state.confirmBooking.error;
export const selectBookingStatus = (state: RootState) => state.confirmBooking.bookingStatus;
export const selectConfirmBooking = (state: RootState) => state.confirmBooking;
export const selectPaymentMethod = (state: RootState) => state.confirmBooking.paymentMethod;

export default ConfirmBookingSlice.reducer;
