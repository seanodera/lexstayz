import { Stay } from "@/lib/types";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

import {  firestore } from "@/lib/firebase";
import {getCurrentUser} from "@/data/bookingData";
import {writeBatch} from "@firebase/firestore";
import {doc} from "firebase/firestore"; // Assuming you have a firebase module

interface ConfirmBookingState {
    stay: Stay,
    checkInDate: string,
    checkOutDate: string,
    rooms: object[],
    paymentData: any,
    userId: string,
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
    userId: '',
    status: 'idle',
    error: null,
    bookingStatus: 'Pending', // Default status
}

export const createBooking = createAsyncThunk(
    'confirmBooking/createBooking',
    async ({
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
           }: {
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
    }, { rejectWithValue }) => {
        try {
            const user = getCurrentUser();
            const batch = writeBatch(firestore);
            const hostDoc = doc(firestore, 'hosts', stay.hostId, 'bookings');
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
        setBookingInformation: (state, action: PayloadAction<ConfirmBookingState>) => {
            state.stay = action.payload.stay;
            state.checkInDate = action.payload.checkInDate;
            state.checkOutDate = action.payload.checkOutDate;
            state.rooms = action.payload.rooms;
            state.paymentData = action.payload.paymentData;
            state.userId = action.payload.userId;
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
            .addCase(createBooking.rejected, (state, action) => {
                state.status = 'failed';

            });
    }
});

export const { updateContact, updateSpecialRequest, updateCostData, setBookingInformation, updateBookingStatus } = ConfirmBookingSlice.actions;

export default ConfirmBookingSlice.reducer;
