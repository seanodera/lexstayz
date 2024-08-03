'use client'
import React from 'react';
import axios from 'axios';
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectConfirmBooking, createBooking } from "@/slices/confirmBookingSlice";
import { message } from "antd";
import {generateID, getCurrentUser} from "@/data/bookingData";
import {useRouter} from "next/navigation";


declare global {
    interface Window {
        PaystackPop: any;
    }
}

const PaystackPayment = () => {
    const booking = useAppSelector(selectConfirmBooking);
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter()
    async function handlePaystackPayment() {

        // Generate a unique ID for the transaction
        const id = generateID();

        try {
            const user = getCurrentUser();
            // Make a POST request to create the transaction
            const res = await axios.post('/api/createTransaction', {
                email: booking.contact.email,
                amount: (booking.totalPrice * 1.035 * booking.usedRate).toFixed(2), // Amount in KES
                currency: booking.currency,
                callback_url: `https://lexstayz.vercel.app/checkout?userID=${user.uid}&booking=${id}`,
                reference: id
            });

            // Extract access code and reference from the response
            const { access_code: accessCode, reference, authorization_url } = res.data.data.data;
            console.log('Access Code:', accessCode, 'Reference:', reference);

            // Initialize Paystack pop-up for payment
            // const popup = new window.PaystackPop();
            // popup.resumeTransaction(accessCode);

            // Dispatch booking action and handle success or failure
            dispatch(createBooking({ paymentData: res.data, id })).then((value:any) => {
                router.push(authorization_url)
                messageApi.success('Booking confirmed!');
            });

        } catch (error) {
            // Handle errors from the API request or any other unexpected issues
            console.error('Error handling payment:', error);
            messageApi.error(`An error occurred. Please try again. ${error}`,);
        }
    }
    return (
        <div className={'block'}>
            {contextHolder}
            <button className="block py-3 text-center bg-primary rounded-xl font-medium text-white" onClick={() => handlePaystackPayment()}>
                Checkout
            </button>
        </div>
    );
};

export default PaystackPayment;
