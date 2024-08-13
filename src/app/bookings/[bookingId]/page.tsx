'use client'
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectBookings} from "@/slices/bookingSlice";
import {selectAllStays, setCurrentStayFromId} from "@/slices/staysSlice";
import StayWidget from "@/components/bookings/StayWidget";
import {Button, Col, Row, Skeleton} from "antd";
import ReservationDetails from "@/components/bookings/ReservationDetails";
import BookingUserDetails from "@/components/bookings/BookingUserDetails";
import RoomsWidget from "@/components/bookings/RoomsWidget";
import {startChatAsync} from "@/slices/messagingSlice";
import ReviewDialog from "@/components/bookings/reviewDialog";



export default function Page(){
    const {bookingId} = useParams();
    const [booking, setBooking] = useState<any>();
    const [stay, setStay] = useState<any>()
    const bookings = useAppSelector(selectBookings);
    const stays = useAppSelector(selectAllStays)
    const router =useRouter()
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {
        const _booking = bookings.find((value) => value.id === bookingId.toString())
        setBooking(_booking)
        if (_booking){
            const _stay = stays.find((value) => value.id === _booking.accommodationId)
            if (_stay){
                setStay(_stay)
            } else {
                dispatch(setCurrentStayFromId(_booking.accommodationId)).then((value) => {
                    console.log(value)
                })
            }

        }
    },[bookingId, stays, bookings]);
    function handleContactHost() {

        // @ts-ignore
        dispatch(startChatAsync({
            hostId: booking.hostId,
            })).then((value: any) => {
            router.push('/messages')
        })
    }
    return<div className={'grid grid-cols-1 md:grid-cols-3 gap-4 py-4 lg:px-24 px-7'}>
        <div className={'md:col-span-3 flex justify-between'}>
            <div className={'text-2xl font-bold'}>Booking</div>

            {booking && booking.status !== 'Rejected'?<div className={'flex gap-2'}>
                <Button className={'animate-bounce'} type={'primary'} onClick={() => setOpenDialog(true)}>Review</Button>
                 <Button type={'primary'} onClick={() => handleContactHost()}>Message Host</Button>
                    {booking.status === 'Confirmed'? <Button type={'primary'} danger>Cancel</Button>: '' }
            </div>: <div></div>}
        </div>
        <div className={'space-y-4'}>
            {stay? <StayWidget stay={stay}/>: <Skeleton active/>}
            {stay? <RoomsWidget booking={booking} stay={stay}/>: <Skeleton active/>}
        </div>
        <div className={'md:col-span-2 space-y-4'}>
            {booking? <ReservationDetails booking={booking}/>: <Skeleton active/> }
            {booking? <BookingUserDetails booking={booking}/>: <Skeleton active/> }
        </div>
        {(stay && booking) && <ReviewDialog isOpen={openDialog} setIsOpen={setOpenDialog} booking={booking} stay={stay}/>}
    </div>
}