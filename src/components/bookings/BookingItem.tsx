'use client'

import {useAppSelector} from "@/hooks/hooks";
import {Card, Divider, Image} from "antd";
import {getTag} from "@/components/common";
import dayjs from "dayjs";
import {differenceInDays} from "date-fns";
import {dateReader} from "@/lib/utils";
import {selectStayById} from "@/slices/staysSlice";

export default function BookingItem({booking}: {booking: any}){
    const stay = useAppSelector((state: any) => selectStayById(state, booking.accommodationId))
    return <div className={'block md:space-y-4 gap-2 bg-white rounded-xl p-4'}>
        <Image src={stay?.poster} alt={''} className={'rounded-xl h-full object-cover aspect-video '}/>
        <div className={'mt-2'}>
            <div className={'flex justify-between items-center gap-2'}>
                <h3 className={'mb-0'}>{stay?.name}</h3>
                <div>{getTag(booking.status)}</div>
            </div>
            <h4 className={'font-light text-gray-400 line-clamp-1'}>{stay?.location.city}, {stay?.location.country}</h4>
            <div className={'flex gap-2 items-center mt-4'}>
                <h4 className={'mb-0'}>{booking.numGuests} Guests</h4>
                <Divider className={'bg-dark'} type={'vertical'}/>
                <h4 className={'mb-0'}>{differenceInDays(booking.checkOutDate, booking.checkInDate)} Day</h4>
            </div>
            <div className={'grid grid-cols-2 gap-2 mt-4'}>
                <div>
                    <h4 className={'font-semibold '}>Check In</h4>
                    <h4>{dateReader({date: booking.checkInDate})}</h4>
                </div>
                <div>
                    <h4 className={'font-semibold'}>Check Out</h4>
                    <h4>{dateReader({date: booking.checkOutDate})}</h4>
                </div>
            </div>
        </div>
    </div>
}