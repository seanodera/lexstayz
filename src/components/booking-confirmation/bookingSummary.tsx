// components/BookingSummary.tsx
import { toMoneyFormat } from "@/lib/utils";
import {useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";

const BookingSummary = ({ stay }: any) => {
    const cart = useAppSelector(selectCart);
    const [subTotal, setSubTotal] = useState(0);
    useEffect(() => {
        let _subTotal = 0;
        cart.forEach((value: any) => {
            _subTotal += value.numRooms * stay.rooms.find((stay: any) => stay.id === value.roomId).price;
        });
        setSubTotal(_subTotal);
    }, [cart]);
    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md shadow-primary">
            <h3 className="text-xl font-semibold">Price Summary</h3>
            {cart.map((cartItem: any, index: number) => <div key={index} className={'grid grid-cols-2'}>
                <div className="capitalize text-gray-500">{stay.rooms.find((value: any) => value.id === cartItem.roomId).name}</div>
                <div className="capitalize text-end">${toMoneyFormat(cartItem.numRooms * stay.rooms.find((value: any) => value.id === cartItem.roomId).price)}</div>
            </div>)}
            <hr className="col-span-2 my-4"/>
            <div className="grid grid-cols-2">
                <div className="font-medium text-gray-500">Subtotal</div>
                <div className="font-medium text-end">${toMoneyFormat(subTotal)}</div>
                <div className="font-medium text-gray-500">Booking fees</div>
                <div className="font-medium text-end">${toMoneyFormat(subTotal * 0.035)}</div>
                <hr className="col-span-2 my-4"/>
                <div className="font-medium text-xl">Total</div>
                <div className="font-medium text-xl text-end">
                    ${toMoneyFormat(subTotal * 1.035)}
                </div>
            </div>
        </div>
    );
};

export default BookingSummary;
