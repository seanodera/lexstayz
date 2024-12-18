// components/BookingDetails.tsx
import {dateReader} from "@/lib/utils";
import {addDays, differenceInDays} from "date-fns";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {convertCart, selectConfirmBooking, updateBookingData} from "@/slices/confirmBookingSlice";

const BookingDetails = ({stay}: any) => {

    const cart = useAppSelector(selectCart);
    const dispatch = useAppDispatch()
    const [totalRooms, setTotalRooms] = useState(0);
    const  booking = useAppSelector(selectConfirmBooking)
    const [numGuests, setNumGuests] =useState(0)
    useEffect(() => {
        let _totalRooms = 0;
        cart.forEach((value: any) => {
            _totalRooms += value.numRooms;
        });
        setTotalRooms(_totalRooms);
        setNumGuests(booking.numGuests)
        dispatch(convertCart(cart));

    }, [cart]);

    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md shadow-primary">
            <h3 className="text-xl font-semibold">Your Booking Details</h3>
            <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
                <div className="font-medium">Check In</div>
                <div className="font-medium">Check Out</div>
                <div className="border rounded-xl p-2 font-bold text-lg">
                    {dateReader({date: booking.checkInDate})}
                    <div className="text-sm text-gray-500 font-medium">From 14:00</div>
                </div>
                <div className="border rounded-xl p-2 font-bold text-lg">
                    {dateReader({date: booking.checkOutDate})}
                    <div className="text-sm text-gray-500 font-medium">Until 12:00</div>
                </div>
            </div>
            <div className="font-medium">Length of Stay</div>
            <div className="font-bold">{differenceInDays(booking.checkOutDate,booking.checkInDate)} Nights</div>
            <hr className="my-2"/>
            <h3 className="text-xl font-semibold mb-2">Your Rooms</h3>
            <div className="text-lg font-medium">{totalRooms} rooms for {numGuests} guests</div>
            <div className="ps-4">
                {
                    cart.map((room: any, index: number) => <div key={index}><span
                        className="text-primary">{room.numRooms}</span> x {stay.rooms.find((value: any) => value.id === room.roomId).name}
                    </div>)
                }
            </div>
            <Link href={`/stay/${stay.id}`}
                  className="block text-primary text-center py-2 hover:bg-primary hover:text-white my-2 rounded-xl">
                Change Selection
            </Link>
        </div>
    );
};

export default BookingDetails;
