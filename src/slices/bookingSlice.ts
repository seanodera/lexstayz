'use client';

import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {completeBooking, generateID, getBookings, getCurrentUser} from "@/data/bookingData";
import {RootState} from "@/data/types";
import {verifyPayment} from "@/data/payment";
import {arrayUnion, collection, doc, getDoc, setDoc} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {writeBatch} from "@firebase/firestore";
import {state} from "sucrase/dist/types/parser/traverser/base";
import {updateBookingStatusAsync} from "@/slices/bookingThunks/updateBookingStatusAsync";


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
                paymentData: res.data.data,
                isConfirmed: true,
                status: 'Confirmed'
            })
            return {
                booking: {
                    ..._booking,
                    paymentData: res.data.data,
                    isConfirmed: true,
                    status: 'Confirmed',
                }, updated: true
            }
        } else if (res.status === 'success' && _booking.isConfirmed) {
            return {booking: _booking, updated: false};
        } else if (_booking.isConfirmed) {
            await completeBooking({
                userId: user.uid,
                id: _booking.id,
                paymentData: res.data.data,
                isConfirmed: false,
                status: 'Rejected',
            })
            return {
                booking: {
                    ..._booking,
                    paymentData: res.data.data,
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

export const fetchBookingAsync = createAsyncThunk('bookings/fetchBooking', async (id: string, {
        getState,
        rejectWithValue
    }) => {
        try {
            const {bookings} = getState() as RootState
            const _booking = bookings.bookings.find((value) => value.id === id)
            if (_booking) {
                return _booking;
            } else {
                const user = getCurrentUser()
                const bookingRef = doc(firestore, 'bookings', id)
                const bookingSnapshot = await getDoc(bookingRef);
                if (bookingSnapshot.exists()) {
                    return bookingSnapshot.data();
                } else {
                    throw new Error('Booking not found');
                }
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
)

interface Review {
    id: string;
    bookingId: string;
    userId: string;
    stayId: string;
    name: string;
    rating: number;
    createdAt: string;
    valueForMoney: number;
    facilities: number;
    location: number;
    staff: number;
    cleanliness: number;
    comfort: number;
}

export const writeReview = createAsyncThunk('bookings/writeReview', async (review: Review, {
    rejectWithValue,
    getState
}) => {
    try {

        const { bookings } = getState() as RootState;


        const user = getCurrentUser();
        if (!user) {
            throw new Error('User not authenticated');
        }


        const bookingRef = doc(firestore, 'bookings', review.bookingId);
        const stayRef = doc(firestore, 'stays', review.stayId);


        const snapshot = await getDoc(stayRef);
        const data = snapshot.data();
        if (!data) {
            throw new Error('Stay not found');
        }


        if (data.reviews && data.reviews.some((r: any) => r.bookingId === review.bookingId)) {
            throw new Error('A review already exists for this booking');
        }


        const newNumReviews = (data.numReviews || 0) + 1;
        const newRating = ((data.rating || 0) * (data.numReviews || 0) + review.rating) / newNumReviews;


        const batch = writeBatch(firestore);


        batch.update(bookingRef, { review: true, reviewData: review });


        batch.update(stayRef, {
            reviews: arrayUnion(review),
            numReviews: newNumReviews,
            rating: newRating
        });


        await batch.commit();


        const booking = bookings.bookings.find((value) => value.id === review.bookingId);
        return { ...booking, review: true, reviewData: review };
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            return rejectWithValue(error.message);
        }
        return rejectWithValue('An unknown error occurred');
    }
});

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
                state.bookings[ pos ] = action.payload.booking;
                if (state.currentBooking.id === action.payload.booking.id) {
                    state.currentBooking = action.payload.booking;
                }
            }
            state.isLoading = false;
        }).addCase(checkUnpaidBookingAsync.rejected, (state, action) => {
            state.isLoading = false;
            state.hasError = true;
            state.errorMessage = action.error.message || 'Failed to fetch bookings';
        }).addCase(fetchBookingAsync.pending, (state, action) => {
            state.isLoading = true
        })
            .addCase(fetchBookingAsync.fulfilled, (state, action) => {
                const localBooking = state.bookings.find((value) => value.id === action.payload.id)
                if (!localBooking) {
                    state.bookings.push(action.payload);
                }
                state.currentBooking = action.payload;
                state.isLoading = false
            })
            .addCase(fetchBookingAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to fetch booking';
            })
            .addCase(writeReview.pending, (state, action) => {
                state.isLoading = true;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(writeReview.fulfilled, (state, action) => {
                state.isLoading = false;
                const bookingIndex = state.bookings.findIndex((value) => value.id === action.payload.id)
                state.bookings[ bookingIndex ] = action.payload
            })
            .addCase(writeReview.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = 'Failed to write review';
            }) .addCase(updateBookingStatusAsync.pending, (state) => {
            state.isLoading = true;
            state.hasError = false;
            state.errorMessage = '';
        })
            .addCase(updateBookingStatusAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.bookings.findIndex((value) => value.id === action.payload.booking.id);
                if (index !== -1) {
                    state.bookings[ index ] = {
                        ...action.payload.booking,
                        status: action.payload.status,
                    };
                    if (state.currentBooking && state.currentBooking.id === action.payload.booking.id){
                        state.currentBooking = action.payload.booking
                    }
                }
            })
            .addCase(updateBookingStatusAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.error.message || 'Failed to update booking';
            });
    }
});

export const selectCart = (state: RootState) => state.bookings.cart;
export const selectBookings = (state: RootState) => state.bookings.bookings;
export const selectIsLoading = (state: RootState) => state.bookings.isLoading;
export const selectCurrentBooking = (state: RootState) => state.bookings.currentBooking;
export const selectHasError = (state: RootState) => state.bookings.hasError;
export const selectErrorMessage = (state: RootState) => state.bookings.errorMessage;
export const selectHasBookingRun = (state: RootState) => state.bookings.hasBookingRun;
export {updateBookingStatusAsync}
export const {
    resetBooking,
    updateCart
} = bookingsSlice.actions;

export default bookingsSlice.reducer;
