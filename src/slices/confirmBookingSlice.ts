import { Stay } from "@/lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { firestore } from "@/lib/firebase";
import { getCurrentUser } from "@/data/bookingData";
import {writeBatch, doc, collection} from "firebase/firestore";
import { RootState } from "@/data/store";
import {getAuth} from "firebase/auth";

interface ConfirmBookingState {
    stay: Stay,
    checkInDate: string,
    checkOutDate: string,
    rooms: object[],
    paymentData: any,

    contact: any,
    numGuests: number,
    specialRequest: string,
    totalPrice: number,
    currency: string,
    usedRate: number,
    fees: number,
    exchanged: boolean,
    status: 'idle' | 'loading' | 'succeeded' | 'failed',
    error: string | null,
    bookingStatus: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected',
}

const initialState: ConfirmBookingState = {
    stay: {} as Stay,
    checkInDate: new Date().toString(),
    checkOutDate: new Date().toString(),
    rooms: [],
    paymentData: {
        method: 'Pryzapay',
        account: '80085'
    },
    contact: {},
    numGuests: 0,
    specialRequest: '',
    totalPrice: 0,
    currency: 'USD',
    fees: 0,
    usedRate: 0,
    exchanged: false,

    status: 'idle',
    error: null,
    bookingStatus: 'Pending', // Default status
}

export const createBooking = createAsyncThunk(
    'confirmBooking/createBooking',
    async (_, { getState, rejectWithValue }) => {
        // @ts-ignore
        const state: RootState = getState();
        const {
            stay,
            checkInDate,
            checkOutDate,
            rooms,
            paymentData,
            contact,
            numGuests,
            specialRequest,
            totalPrice,
            currency,
            usedRate,
        } = state.confirmBooking;
        try {
            const user = getCurrentUser();
            const batch = writeBatch(firestore);
            const hostDoc = doc(collection(firestore, 'hosts', stay.hostId, 'bookings'));
            const userDoc = doc(firestore, 'user', user.uid, 'bookings', hostDoc.id);
            const booking = {
                id: hostDoc.id,
                accommodationId: stay.id,
                accountId: user.uid,
                hostId: stay.hostId,
                user: {
                    firstName: contact.firstName,
                    lastName: contact.lastName,
                    email: contact.email,
                    phone: contact.phone,
                    country: contact.country,
                },
                checkInDate,
                checkOutDate,
                createdAt: new Date().toString(),
                rooms: rooms,
                status: 'Pending',
                numGuests: numGuests,
                isConfirmed: false,
                specialRequest: specialRequest,
                totalPrice: totalPrice,
                currency: currency,
                usedRate: usedRate,
                paymentData: paymentData,
            };
            batch.set(hostDoc, booking);
            batch.set(userDoc, booking);
            await batch.commit();
            return booking;
        } catch (error) {
            console.log(error);
            // @ts-ignore
            return rejectWithValue(error.message);
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
            state.fees = action.payload.price * 0.035;
            state.currency = action.payload.currency;
            state.usedRate = action.payload.usedRate;
            state.exchanged = state.stay.currency !== action.payload.currency;
        },
        updateBookingData: (state, action: PayloadAction<{ numGuests: number; checkInDate: string; checkOutDate: string }>) => {
            state.numGuests = action.payload.numGuests;
            state.checkInDate = action.payload.checkInDate;
            state.checkOutDate = action.payload.checkOutDate;
        },
        setBookingStay: (state, action: PayloadAction<Stay>) => {
            state.stay = action.payload;
        },
        convertCart: (state, action: PayloadAction<object[]>) => {
            state.rooms = action.payload;
        },
        setBookingInformation: (state, action: PayloadAction<ConfirmBookingState>) => {
            state.stay = action.payload.stay;
            state.checkInDate = action.payload.checkInDate;
            state.checkOutDate = action.payload.checkOutDate;
            state.rooms = action.payload.rooms;

            state.contact = action.payload.contact;
            state.numGuests = action.payload.numGuests;
            state.specialRequest = action.payload.specialRequest;
            state.totalPrice = action.payload.totalPrice;
            state.currency = action.payload.currency;
            state.usedRate = action.payload.usedRate;
            state.fees = action.payload.totalPrice * 0.035;
            state.exchanged = state.stay.currency !== action.payload.currency;
        },
        updateBookingStatus: (state, action: PayloadAction<'Pending' | 'Confirmed' | 'Canceled' | 'Rejected'>) => {
            state.bookingStatus = action.payload;
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
            });
    }
});

export const {
    updateContact,
    updateSpecialRequest,
    updateCostData,
    setBookingInformation,
    updateBookingStatus,
    updateBookingData,
    setBookingStay,
    convertCart,
} = ConfirmBookingSlice.actions;

// Selectors
export const selectStay = (state: RootState) => state.confirmBooking.stay;
export const selectCheckInDate = (state: RootState) => state.confirmBooking.checkInDate;
export const selectCheckOutDate = (state: RootState) => state.confirmBooking.checkOutDate;
export const selectRooms = (state: RootState) => state.confirmBooking.rooms;
export const selectPaymentData = (state: RootState) => state.confirmBooking.paymentData;
// export const selectUserId = (state: RootState) => state.confirmBooking.userId;
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

export default ConfirmBookingSlice.reducer;
