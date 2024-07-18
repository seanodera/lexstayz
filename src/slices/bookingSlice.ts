import {createSlice} from "@reduxjs/toolkit";


const bookingSlice = createSlice({
    name: "booking",
    initialState: {
        cart: [],
        currentStay: {},
        currentId: 0,
        stays: [],
    },
    reducers: {
        resetBooking: (state, action) => {
            state.cart = [];
            state.currentId = 0;
            state.currentStay = {};
        },
        setAllStays: (state, action) => {
            state.stays = action.payload;
        },
        setCurrentStay: (state, action) => {
            state.currentStay = action.payload;
            state.currentId = action.payload.id;
        },
        setCurrentStayFromId: (state, action) => {
            state.currentId = action.payload;
            state.currentStay = state.stays[action.payload];
            console.log(state)
        },
        updateCart: (state, action) => {
            state.cart = action.payload;
        }
    }
})

export const selectCurrentStay = (state: any) => state.booking.currentStay;
export const selectCart = (state: any) => state.booking.cart;
export const selectCurrentId = (state: any) => state.booking.currentId;
export const selectAllStays = (state: any) => state.booking.stays;
export const {resetBooking,setCurrentStay,updateCart, setAllStays,setCurrentStayFromId} = bookingSlice.actions
export default bookingSlice.reducer;