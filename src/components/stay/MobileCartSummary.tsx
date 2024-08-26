'use client'
import Link from "next/link";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import {selectCurrentStay} from "@/slices/staysSlice";

export default function MobileCartSummary() {

    const cart = useAppSelector(selectCart);
    const stay = useAppSelector(selectCurrentStay)
    const booking = useAppSelector(selectConfirmBooking)
    const [totalRooms, setTotalRooms] = useState(0);
    useEffect(() => {
        let _totalRooms = 0;
        cart.forEach((value: any) => {
            _totalRooms += value.numRooms;
        });
        setTotalRooms(_totalRooms);
    }, [cart]);
    return (
        <div
            className="md:hidden fixed end-0 bottom-0 w-full bg-primary-50 z-10 flex justify-between border border-gray-200 py-3 px-7">
            <div className="flex w-full me-2 justify-between items-center">
                <div>
                    {stay.type === 'Hotel' ?
                        <h3 className="font-bold">{totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'} Selected</h3> :
                        <h3 className={'font-semibold text-dark'}>{booking.currency} {toMoneyFormat(booking.grandTotal)}</h3>}
                    <h6 className="underline text-sm">
                        {dateReader({
                            date: booking.checkInDate,
                            years: false
                        })} - {dateReader({date: booking.checkOutDate, years: false})}
                    </h6>
                </div>
            </div>
            <div>
                <Link href={stay.type === 'Hotel' ? "/book-firm" : "/book-firm"}
                      className="block rounded-xl text-center px-4 py-3 bg-primary text-white font-medium">
                    Confirm
                </Link>
            </div>
        </div>
    );
}
