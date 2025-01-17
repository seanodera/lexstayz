'use client'
import {completeBooking} from "@/data/bookingData";
import {useSearchParams} from "next/navigation";
import {verifyPayment} from "@/data/payment";
import {useEffect, useState} from "react";
import {Button, message, Result, Skeleton} from "antd";
import {savePaymentMethod} from "@/data/usersData";
import LoadingScreen from "@/components/LoadingScreen";


export default function ConfirmBooking() {


    const params = useSearchParams()
    const userID = params.get('userID')
    const bookingID = params.get('booking')
    const preserve = params.get('preserve')
    const depositId = params.get('depositId')
    const reference = params.get('reference')
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [hasRun,setHasRun] = useState(false)


    async function runBooking(){
        if (userID && bookingID && reference){
            const response = await  verifyPayment( reference, depositId ? 'Pawapay' : 'Paystack');
            if (response.status === 'success') {
                completeBooking({
                    userId: userID,
                    id: bookingID,
                    paymentData: response.data,
                    isConfirmed: true,
                    status: 'Pending',
                }).then((value) => {
                    messageApi.info('booking successfully made')
                    setIsLoading(false)
                })
                if (preserve){
                    await savePaymentMethod(response, userID)
                }
            } else {
                completeBooking({
                    userId: userID,
                    id: bookingID,
                    paymentData: response.data,
                    isConfirmed: false,
                    status: 'Failed',
                }).then((value) => {
                    setIsLoading(false)
                })
                messageApi.error('An error occurred with your payment')
                setErrorMessage('An error occurred with your payment')
                setError(true)
            }

        }

    }

const [savedData, setSavedData] = useState<any>()
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
