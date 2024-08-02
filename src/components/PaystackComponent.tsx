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
    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY as string;
    const booking = useAppSelector(selectConfirmBooking);
    const dispatch = useAppDispatch();
    const [messageApi, contextHolder] = message.useMessage();
    const router = useRouter()
    async function handlePaystackPayment() {
        // Log the payment details
        console.log('Function called:',
            'email:', booking.contact.email,
            'amount:', (booking.totalPrice * 1.035 * booking.usedRate).toFixed(2),
            'currency:', 'GHS'
        );

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


    const handlePaystackPaymentOld = () => {
        const id = generateID()
        const handler = window.PaystackPop.setup({
            key: paystackPublicKey,
            email: booking.contact.email,
            amount: (Number(booking.totalPrice * 1.035 * booking.usedRate * 100).toFixed(0)), // Amount in kobo
            currency: 'KES',
            ref: id, // Generate a unique reference
            callback: function(response: any) {
                // Make an API call to your server to verify the transaction
                axios.post('/api/verifyTransaction', { reference: response.reference })
                    .then(res => {
                        if (res.data.status === 'success') {
                            alert('Payment successful');

                            dispatch(createBooking({paymentData: res.data, id: id})).then((value: any) => {
                                if (value.meta.requestStatus === 'fulfilled') {
                                    messageApi.success('Booking confirmed!');
                                } else {
                                    messageApi.error('Booking failed. Please try again.');
                                }
                            });
                        } else {
                            alert('Payment verification failed');
                        }
                    });
            },
            onClose: function() {
                alert('Transaction was not completed, window closed.');
            }
        });
        handler.openIframe();

    };

    return (
        <div>
            {contextHolder}
            <button className="block max-lg:hidden py-3 text-center bg-primary rounded-xl font-medium text-white" onClick={() => handlePaystackPayment()}>
                Checkout
            </button>
        </div>
    );
};

export default PaystackPayment;
