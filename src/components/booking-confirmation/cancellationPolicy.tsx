
import dayjs from "dayjs";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import { dateReader, toMoneyFormat } from "@/lib/utils";


export default function CancellationPolicy ({stay}: {stay: any}) {
    const [message, setMessage] = useState('')
    const [subText, setSubText] = useState('')
    const booking = useAppSelector(selectConfirmBooking)
    useEffect(() => {
        switch (stay.cancellation.cancellation) {
            case 'Free':
                setMessage('Free cancellation');
                setSubText('! Booking fee is non-refundable after 24 hours');
                break;
            case 'Non-Refundable':
                setMessage('The booking is Non-Refundable');
                setSubText('')
                break;
            case 'Other':
                const cancellation = stay.cancellation
                let date = dayjs()
                console.log(cancellation)
                if (cancellation.preDate) {
                    if (cancellation.timeSpace === 'Days') {
                        date = dayjs(booking.checkInDate).subtract(cancellation.time, 'days')
                    } else if (cancellation.timeSpace === 'Hours') {
                        date = dayjs(booking.checkInDate).subtract(cancellation.time, 'hours')
                    }
                } else {
                    if (cancellation.timeSpace === 'Days') {
                        date = dayjs(booking.checkInDate).add(cancellation.time, 'days')
                    } else if (cancellation.timeSpace === 'Hours') {
                        date = dayjs(booking.checkInDate).add(cancellation.time, 'hours')
                    }
                }
                setMessage(`Free Cancellation until ${dateReader({date: date.toDate(), years: false, weekDay: true})}`)
                setSubText(`After that, only ${booking.currency} ${toMoneyFormat(((100 - cancellation.rate) / 100) * booking.grandTotal)} is refundable`)
                break;
        }
    }, [booking.checkInDate, booking.currency, booking.grandTotal, stay.cancellation]);



    return <div className={'border-solid border-gray-200 p-4 rounded-xl my-8'}>
        <h3 className={'font-semibold'}>Cancellation Policy</h3>
        <p className={''}>{message}</p>
        <p className={'text-gray-500'}>{subText}</p>

        <hr className={'my-8'}/>

        <h3 className={'font-semibold'}>Ground Rules</h3>
        <p>We request guests to remember a few simple things about what makes a good guests</p>
        <ul>
            <li>Follow the house rules</li>
            <li>Treat the home as your own</li>
        </ul>

    </div>
}