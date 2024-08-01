'use client'
import {useSearchParams} from "next/navigation";
import {useAppSelector} from "@/hooks/hooks";
import {selectBookings} from "@/slices/bookingSlice";
import {useEffect} from "react";
import {getCurrentUser} from "@/data/bookingData";
import {doc} from "firebase/firestore";
import {firestore} from "@/lib/firebase";
import {writeBatch} from "@firebase/firestore";
import {Button, message, Result} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";


export default function CheckOutComponent(){
    const params = useSearchParams()
    const userID  = params.get('userID')
    const bookingID = params.get('bookingID')
    const bookings = useAppSelector(selectBookings)

    useEffect(() => {
        if (userID && bookingID){
            const booking = bookings.find((value) => value.id === bookingID)
            if (booking){
                completeBooking(booking, bookingID)
            } else {
                message.error('booking Paid but not found')
            }
        } else {
            message.error('params not passed')
        }
    });

    return <div>
        <Result
            icon={<CheckCircleOutlined/>} title={'Booking Request Sent'}
            status={'success'}
            subTitle={'Your booking has been received successfully. Please wait for the host to accept your booking.'}
            extra={<Button href={'/bookings'} type={'primary'} ghost>View Bookings</Button>}/>
    </div>
}

async function completeBooking(booking:any, bookingID: string){
    try {
        const user = getCurrentUser();
        const hostDoc = doc(firestore, 'hosts', booking.accommodationId, 'bookings', bookingID)
        const userDoc = doc(firestore, 'user', user.uid, 'bookings', bookingID)
        const batch = writeBatch(firestore)
        batch.update(hostDoc,{status: 'Confirmed'})
        batch.update(userDoc,{status: 'Confirmed'})
        await batch.commit()
    } catch (error){
        console.log(error)
    }
}