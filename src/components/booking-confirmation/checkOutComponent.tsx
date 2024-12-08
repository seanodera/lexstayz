'use client'
import {useSearchParams} from "next/navigation";
import {useAppSelector} from "@/hooks/hooks";
import {selectBookings} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {completeBooking, getCurrentUser} from "@/data/bookingData";
import {doc} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {writeBatch} from "@firebase/firestore";
import {Button, message, Result, Skeleton} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import {verifyPayment} from "@/data/payment";


export default function CheckOutComponent() {
    const params = useSearchParams()
    const userID = params.get('userID')
    const bookingID = params.get('booking')
    const depositId = params.get('depositId')
    const [messageApi, contextHolder] = message.useMessage();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [hasRun,setHasRun] = useState(false)
    useEffect(() => {
        console.log(userID,bookingID,depositId);
       if (!hasRun){
           if (userID && bookingID) {
               verifyPayment( depositId? depositId : bookingID, depositId ? 'Pawapay' : 'Paystack').then((res) => {
                   console.log(res)
                   if (res.status === 'success') {
                       completeBooking({
                           userId: userID,
                           id: bookingID,
                           paymentData: res.data.data,
                           isConfirmed: true,
                           status: 'Confirmed'
                       }).then((value) => {
                           messageApi.info('booking successfully made')
                           setIsLoading(false)
                       })
                   } else {
                       completeBooking({
                           userId: userID,
                           id: bookingID,
                           paymentData: res.data.data,
                           isConfirmed: false,
                           status: 'Rejected',
                       }).then((value) => {
                           setIsLoading(false)
                       })
                       messageApi.error('An error occurred with your payment')
                       setErrorMessage('An error occurred with your payment')
                       setError(true)
                   }

               })

           } else {
               setErrorMessage('An error has occurred')
               setError(true)
               messageApi.error('An error has occurred')
           }
           setHasRun(true)
       }
    }, [userID, bookingID]);


    return <div className={'h-full w-full flex flex-col justify-center'}>
        {contextHolder}
        {isLoading ? <Skeleton active/> : <Result
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

