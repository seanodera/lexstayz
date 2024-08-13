import { setCurrentStayFromId } from '@/slices/staysSlice';
import { resetBooking } from '@/slices/bookingSlice';


export const bookingResetMiddleware = (storeAPI:any) => (next:any) => (action:any) =>  {
    const result = next(action);

    // if (setCurrentStayFromId.match(action)) {
    //     const state = storeAPI.getState();
    //     const newId = action.payload;
    //     const currentStay = state.stays.currentStay;
    //
    //     if (currentStay.id !== newId) {
    //         storeAPI.dispatch(resetBooking());
    //     }
    // }

    return result;
};
