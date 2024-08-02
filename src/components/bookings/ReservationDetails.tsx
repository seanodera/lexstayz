import {Card} from "antd";
import {dateReader, timeFromDate, toMoneyFormat} from "@/lib/utils";
import {getTag} from "@/components/common";


export default function ReservationDetails({booking}: {booking: any}){

    return <Card className={'rounded-xl'}>
        <div className={'flex justify-between'}>
            <div className={'text-xl font-semibold mb-4'}>Reservation Details</div>
            <div>{booking.isConfirmed? getTag('Paid'):''} {getTag(booking.status)}</div>
        </div>
        <div className={'grid grid-cols-2'}>
            <div className={''}>
                <h3 className={'mb-0'}>Booking Confirmation</h3>
                <h3 className={'font-bold'}>{booking.id.slice(0, 8).toUpperCase()}</h3>
            </div>
            <div className={''}>
                <h3 className={'mb-0'}>Booked On</h3>
                <h3 className={'font-bold'}>{dateReader({date: booking.createdAt})}</h3>
            </div>
            <div className={''}>
                <h3 className={'mb-0'}>Check In Date</h3>
                <h3 className={'font-bold mb-0'}>{dateReader({date: booking.checkInDate})}</h3>
                <h4 className={'text-gray-400'}>{timeFromDate({date: String(booking.checkInDate), am_pm: true})}</h4>
            </div>
            <div className={''}>
                <h3 className={'mb-0'}>Check Out Date</h3>
                <h3 className={'font-bold mb-0'}>{dateReader({date: booking.checkOutDate})}</h3>
                <h4 className={'text-gray-400'}>{timeFromDate({date: String(booking.checkOutDate), am_pm: true})}</h4>
            </div>

        </div>
    </Card>
}