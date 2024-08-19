'use client'
import {Button, Card, Skeleton} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectFocusChat} from "@/slices/messagingSlice";
import {selectBookings} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {selectAllStays} from "@/slices/staysSlice";
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";



export default function BookingBox() {
    const chat = useAppSelector(selectFocusChat)
    const bookings = useAppSelector(selectBookings)
    const stays = useAppSelector(selectAllStays)
    const [booking, setBooking] = useState<any>(undefined)
    const [stay, setStay] = useState<any>(undefined)
    const [currentChatUser, setCurrentChatUser] = useState<string>('')
    useEffect(() => {
        if (chat){
            if (chat.hostId !== currentChatUser){
                setCurrentChatUser(chat.userId)
            }
        }
    }, [chat]);
    useEffect(() => {

            const _booking = bookings.find((booking: any) => booking.hostId == currentChatUser)
            console.log(bookings)
            if (_booking) {
                const stay = stays.find((stay: any) => stay.id === _booking.accommodationId);
                setBooking(_booking)
                setStay(stay)
            }

    }, [currentChatUser]);

    if (!booking || !stay) {
        return <Skeleton active/>
    } else {
        return <div className={'px-4 space-y-4'}>
            <div>

            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Guest Name</h3>
                <h3 className={'font-semibold'}>{booking.user.firstName} {booking.user.lastName}</h3>
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Email</h3>
                <h3 className={'font-semibold'}>{booking.user.email}</h3>
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Phone Number</h3>
                <h3 className={'font-semibold'}>{booking.user.phone}</h3>
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Reference</h3>
                <h3 className={'font-semibold'}>{booking.id.slice(0, 8).toUpperCase()}</h3>
            </div>
            <div className={'grid grid-cols-2'}>
                <div>
                    <h3 className={'text-gray-500 font-medium'}>Check In</h3>
                    <h3 className={'font-semibold'}>{dateReader({date: booking.checkInDate})}</h3>
                </div>
                <div>
                    <h3 className={'text-gray-500 font-medium'}>Check Out</h3>
                    <h3 className={'font-semibold'}>{dateReader({date: booking.checkOutDate})}</h3>
                </div>
            </div>

            <div>
                <h3 className={'text-gray-500 font-medium'}>Accommodation</h3>
                <h3 className={'font-semibold'}>{stay.name}</h3>
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Rooms</h3>
                {/*    todo: rooms*/}
            </div>
            <div>
                <h3 className={'text-gray-500 font-medium'}>Total Cost</h3>
                <h3 className={'font-bold mb-0'}>{booking.currency} {toMoneyFormat(booking.totalPrice * 1.035 * booking.usedRate)}</h3>
                <h4 className={'text-gray-400'}>{booking.currency} {toMoneyFormat(booking.totalPrice * 0.035 * booking.usedRate)} Fees</h4>
            </div>
            <div className={'text-center'}>
                <Button type={'primary'} ghost>View Booking</Button>
            </div>
        </div>
    }
}