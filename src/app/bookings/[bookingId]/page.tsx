'use client'
import {useParams, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {
    checkUnpaidBookingAsync,
    fetchBookingAsync,
    selectBookings,
    selectCurrentBooking,
    updateBookingStatusAsync
} from "@/slices/bookingSlice";
import {selectAllStays, selectCurrentStay, setCurrentStayFromId} from "@/slices/staysSlice";
import StayWidget from "@/components/bookings/StayWidget";
import {Button, Col, Row, Skeleton} from "antd";
import ReservationDetails from "@/components/bookings/ReservationDetails";
import BookingUserDetails from "@/components/bookings/BookingUserDetails";
import RoomsWidget from "@/components/bookings/RoomsWidget";
import {startChatAsync} from "@/slices/messagingSlice";
import ReviewDialog from "@/components/bookings/reviewDialog";
import {verifyPayment} from "@/data/payment";
import {completeBooking} from "@/data/bookingData";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function Page() {
    const {bookingId} = useParams();
    const booking = useAppSelector(selectCurrentBooking)
    const stay = useAppSelector(selectCurrentStay)
    const bookings = useAppSelector(selectBookings);
    const router = useRouter()
    const dispatch = useAppDispatch();
    const [openDialog, setOpenDialog] = useState(false);
    useEffect(() => {

        if (!booking || booking.id !== bookingId){
            dispatch(fetchBookingAsync(bookingId.toString())).then((value) => {
                console.log(value)
                if (value.meta.requestStatus === 'fulfilled') {
                    if (value.payload.status !== 'Canceled'){
                        dispatch(checkUnpaidBookingAsync(booking.id))
                    }
                    dispatch(setCurrentStayFromId(value.payload.accommodationId))
                }
            },)
        }
    }, [bookingId, dispatch]);


    function handleContactHost() {
        dispatch(startChatAsync({
            hostId: booking.hostId,
        })).then((value: any) => {
            router.push('/messages')
        })
    }

    function handleCancel(){
        dispatch(updateBookingStatusAsync({status:'Canceled', booking}))
    }

    console.log(booking, stay, bookings)
    return <div className={'grid grid-cols-1 md:grid-cols-3 gap-4 py-4 lg:px-24 px-7'}>
        <div className={'md:col-span-3 flex max-md:flex-col justify-between'}>
            <div className={'text-2xl font-bold'}>Booking</div>
            {booking.id && booking.status !== 'Rejected' ? <div className={'flex gap-2'}>
                {!booking.review && <Button className={'animate-bounce'} type={'primary'}
                         onClick={() => setOpenDialog(true)}>Review</Button>}
                <Button type={'primary'} onClick={() => handleContactHost()}>Message Host</Button>
                {booking.status === 'Confirmed' ? <Button type={'primary'}  danger>Cancel</Button> : ''}
            </div> : <div></div>}
        </div>
        <div className={'space-y-4'}>
            {stay.id ? <StayWidget stay={stay}/> : <Skeleton active/>}
            {stay.id ? <RoomsWidget booking={booking} stay={stay}/> : <Skeleton active/>}
        </div>
        <div className={'md:col-span-2 space-y-4'}>
            {booking.id ? <ReservationDetails booking={booking}/> : <Skeleton active/>}
            {booking.id ? <BookingUserDetails booking={booking}/> : <Skeleton active/>}
        </div>
        {(stay.id && booking.id) &&
            <ReviewDialog isOpen={openDialog} setIsOpen={setOpenDialog} booking={booking} stay={stay}/>}
    </div>
}