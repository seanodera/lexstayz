import {PawaPayCountryData, Stay} from "@/lib/types";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {addDays, differenceInDays} from "date-fns";
import {RootState} from "@/data/types";
import {getCountry, getFeePercentage, handler_url} from "@/lib/utils";
import createBooking from "@/slices/confirmBookingThunks/createBooking";
import handlePaymentAsync from '@/slices/confirmBookingThunks/handlePaymentAsync';
import {setExchangeRates} from "@/slices/staysSlice";
import Error from "next/error";
import axios from "axios";

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
    subtotal: number;
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
    paymentCurrency: string;
    paymentRate: number;
    country: string;
    configs: PawaPayCountryData[];
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
    subtotal: 0,
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
    paymentCurrency: 'GHS',
    paymentRate: 1,
    exchangeRates: {},
    country: 'Kenya',
    configs: []
};

const recalculateCosts = (state: any) => {
    if (!state.stay.id){
        return ;
    }
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
    state.totalPrice = subTotal;
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
        state.subtotal = subTotal * exchangeRate;

        state.grandTotal = state.fees + state.subtotal;
    } else {
        state.subtotal = subTotal;
        state.fees = fees;
        state.usedRate = 1;
        state.grandTotal = state.subtotal + state.fees;
    }
};






export const fetchExchangeRates = createAsyncThunk(
    'confirmBooking/fetchExchangeRates',
    async (_, { getState,dispatch,rejectWithValue }) => {
        const { confirmBooking} = getState() as RootState;
        try {
            const country = await getCountry()
            let fromCurrency = country?.currency || confirmBooking.currency;

            const response = await fetch(`https://open.er-api.com/v6/latest/${fromCurrency}`);

            const data = await response.json();
            dispatch(setExchangeRates({rates: data.rates, currency: data.base_code}))
            return {rates: data.rates, currency: data.base_code, country: country?.name};
        } catch (error) {
            rejectWithValue('Error fetching the currency exchange')
            console.error('Error fetching exchange rates:', error);
        }
    }
);

export const fetchPawaPayConfigs = createAsyncThunk(
    'confirmBooking/fetchPawaPayConfigs', async (_, {rejectWithValue}) => {
        try {
            const res = await axios.get(`${handler_url}/api/payments/configs`)
            return res.data.data;
        } catch (e) {
            return rejectWithValue('Error fetching payment configs')
        }
    }
)

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
            state.subtotal = action.payload.price;
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


            recalculateCosts(state); // Recalculate costs when booking dates or number of guests change
        },
        setBookingStay: (state, action: PayloadAction<Stay>) => {
            state.stay = action.payload;
            if (action.payload && action.payload.location && action.payload.location.country === 'Kenya'){
                state.paymentCurrency = 'KES';
                if (state.exchangeRates){
                    state.paymentRate = state.exchangeRates['KES'];
                }

            }
            recalculateCosts(state); // Recalculate costs when the stay changes
        },
        convertCart: (state, action: PayloadAction<object[]>) => {
            state.rooms = action.payload;
            recalculateCosts(state)
        },
        setPaymentMethod: (state,action: PayloadAction<string>) => {
            state.paymentMethod = action.payload;
        },
        resetConfirmBookingError: (state) => {
            state.status = 'idle';
            state.error = '';
        },
        setPaymentCurrency: (state, action: PayloadAction<string>) => {
            state.paymentCurrency = action.payload;
            if (state.exchangeRates){
                state.paymentRate = state.exchangeRates[action.payload];
            }
        }
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
                console.log('Fetching Rates',action.payload)
                state.exchangeRates = action.payload?.rates;
                state.currency = action.payload?.currency || 'GHS';
                state.country = action.payload?.country || 'Kenya';
                if (action.payload && (action.payload.currency === 'KES' || action.payload.currency === 'GHS') ) {
                    state.paymentCurrency = action.payload.currency;
                    state.paymentRate = action.payload?.rates[action.payload.currency];
                } else {
                    state.paymentRate = action.payload?.rates[state.paymentCurrency] * 1.035
                }
                state.usedRate = action.payload?.rates[state.currency] * 1.02;

                recalculateCosts(state);
                state.status = 'idle';
            })
            .addCase(fetchExchangeRates.pending, (state) => {
                state.status = 'loading'
            }).addCase(fetchExchangeRates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'An error occurred';
        })

            .addCase(fetchPawaPayConfigs.pending, (state) => {
                // state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchPawaPayConfigs.fulfilled, (state, action) => {
                state.status = 'idle';
                state.configs = action.payload;
            })
            .addCase(fetchPawaPayConfigs.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string || 'Error fetching PawaPay payment configs';
            })
        ;
    }

});

export const {
    updateContact,
    updateSpecialRequest,
    updateCostData,
    updateBookingData,
    setBookingStay,
    convertCart,
    setPaymentMethod,
    resetConfirmBookingError,
    setPaymentCurrency
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
export const selectSubtotal = (state: RootState) => state.confirmBooking.subtotal;
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
