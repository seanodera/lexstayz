import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCart, updateCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {Select} from "@headlessui/react";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";

export default function CartSummary({stay}: any) {
    const cart = useAppSelector(selectCart);
    const dispatch = useAppDispatch();
    const [subTotal, setSubTotal] = useState(0);
    const  booking = useAppSelector(selectConfirmBooking)
    useEffect(() => {
        let _subTotal = 0;

        cart.forEach((value: any) => {
            _subTotal += value.numRooms * stay.rooms.find((stay: any) => stay.id === value.roomId).price * booking.length ;
        });
        setSubTotal(_subTotal);
    }, [cart, booking.length]);

    return (
        <div>
            <div className={'flex justify-between items-center'}>
                <h3 className="text-2xl font-semibold mb-2">Cart</h3>
                <h4 className={'text-gray-500 mb-0'}>Subtotal: {stay.currency? stay.currency : 'USD'} {subTotal.toFixed(2)}</h4>
            </div>
            {cart.map((cartItem: any, index: number) => {
                let numRooms = cartItem.numRooms

                function handleCart(newRooms: number) {
                    // Clone the global cart array to avoid mutating the original array
                    let newCart = [cart];

                    // Check if the number of rooms is greater than zero
                    if (newRooms > 0) {

                        newCart[ index ] = {
                            ...cartItem,
                            numRooms: newRooms,

                        };

                    } else if (newRooms === 0) {
                        // Remove the room from the cart if the number of rooms is zero
                        newCart.splice(index, 1);
                    }

                    // Dispatch the updated cart
                    dispatch(updateCart(newCart));
                }

                return <div key={index} className={'flex justify-between border-solid px-4 py-2 border-gray-200 shadow-md rounded-lg'}>
                    <div>
                        <div className={'text-lg font-bold capitalize'}>{cartItem.name}</div>
                        <div className={'text-primary font-semibold'}>$ {cartItem.price.toFixed(2)} /night</div>
                    </div>
                    <div>
                        <Select value={numRooms}
                                onChange={(e) => handleCart(parseInt(e.target.value))}
                                className={'appearance-none rounded-xl border border-primary text-sm py-2 px-4 text-start bg-transparent'}>
                            {Array.from({length: 11}, (_, i) => <option value={i}
                                                                        key={i}>{i} {(i === 1) ? 'Room' : 'Rooms'}</option>)}
                        </Select>
                    </div>
                </div>
            })}
            <div className="rounded-2xl p-4 mt-4">
                <Link href="/booking-confirmation"
                      className="block rounded-xl text-center py-3 bg-primary text-white font-medium w-full">
                    Confirm Reservation
                </Link>
            </div>
        </div>
    );
}
