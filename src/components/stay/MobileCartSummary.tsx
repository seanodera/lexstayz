'use client'
import Link from "next/link";
import {dateReader} from "@/lib/utils";
import {useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";

export default function MobileCartSummary({dates } : any) {

    const cart = useAppSelector(selectCart);

    const [totalRooms, setTotalRooms] = useState(0);
    useEffect(() => {
        let _totalRooms = 0;
        cart.forEach((value: any) => {
            _totalRooms += value.numRooms;
        });
        setTotalRooms(_totalRooms);
    }, [cart]);
    return (
        <div className="md:hidden fixed end-0 bottom-0 w-full bg-primary-50 z-10 flex justify-between border border-gray-200 py-3 px-7">
            <div className="flex w-full me-2 justify-between items-center">
                <div>
                    <h3 className="font-bold">{totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'} Selected</h3>
                    <h6 className="underline text-sm">
                        {dateReader({ date: dates.startDate, years: false })} - {dateReader({ date: dates.endDate, years: false })}
                    </h6>
                </div>
            </div>
            <Link href="/booking-confirmation" className="block rounded-xl text-center py-3 bg-primary text-white font-medium w-full">
                Confirm
            </Link>
        </div>
    );
}
