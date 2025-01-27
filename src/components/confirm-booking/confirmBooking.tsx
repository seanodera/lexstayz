'use client'
import {useSearchParams} from "next/navigation";
import {verifyPayment} from "@/data/payment";
import {useEffect, useState} from "react";
import {Button, message, Result, Skeleton} from "antd";
import {savePaymentMethod} from "@/data/usersData";
import LoadingScreen from "@/components/LoadingScreen";
import {completeBooking} from "@/data/completeBooking";


export default function ConfirmBooking() {


    const params = useSearchParams()
    const userID = params.get('userID')
    const bookingID = params.get('booking')
    const depositId = params.get('depositId')
    const reference = params.get('reference')
    const method = params.get('method')
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')


    function runBooking() {
        if (userID && bookingID && reference) {
            completeBooking(bookingID, reference,method? method : depositId ? 'Pawapay' : 'Paystack_KE').then(result => {
                setIsLoading(false);
                messageApi.info('booking successfully made')
            }).catch(err => {
                console.log(err)
                setIsLoading(false)
                messageApi.error('An error occurred with your payment')
                setErrorMessage('An error occurred with your payment')
                setError(true)
            })


        }

    }

    useEffect(() => {
        runBooking()
    }, []);


    return <div className={'h-screen w-full flex flex-col justify-center'}>
        {contextHolder}
        {isLoading ? <LoadingScreen/> : <Result

            title={`Booking Request ${error ? 'Failed' : 'Sent'}`}
            status={error ? 'error' : 'success'}
            subTitle={error ? errorMessage : <div>
                <div className={'text-gray-400'}>Your booking has been received successfully. Please wait for the host
                    to accept your booking.
                </div>
                <div>Booking Reference: <strong className={'text-dark'}>{bookingID}</strong></div>
            </div>}
            extra={<Button href={'/bookings'} type={'primary'} ghost>View Bookings</Button>}/>}
    </div>
}
