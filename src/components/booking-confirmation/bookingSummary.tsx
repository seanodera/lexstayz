// components/BookingSummary.tsx
import {getCountry, getExchangeRate, toMoneyFormat} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {message} from "antd";
import {selectConfirmBooking, setBookingStay, updateCostData} from "@/slices/confirmBookingSlice";


const BookingSummary = ({stay}: any) => {
    const cart = useAppSelector(selectCart);
    const [subTotal, setSubTotal] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0)
    const [currency, setCurrency] = useState('USD')
    const booking = useAppSelector(selectConfirmBooking)
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch = useAppDispatch()
    useEffect(() => {
        let _subTotal = 0;

        cart.forEach((value: any) => {
            _subTotal += value.numRooms * stay.rooms.find((stay: any) => stay.id === value.roomId).price * booking.length;
        });
        setSubTotal(_subTotal);
    }, [cart]);

    useEffect(() => {
        const fetchExchangeRate = async () => {

            // Change as needed
            const toCurrency = 'KES'; // Change as needed

            const rate = booking.exchangeRates[ currency ];
            ;
            if (rate) {
                setCurrency(toCurrency)
                setExchangeRate(rate * 1.02);
            } else {
                //messageApi.error(`Failed to get exchange Rate`, )
            }

        };
        fetchExchangeRate()
    }, [stay.currency]);

    function calculatePrice(amount: number) {
        let price = 0
        if (booking.exchangeRates[ stay.currency ] && stay.currency !== booking.currency) {
            price = amount * 1.02 / booking.exchangeRates[ stay.currency ]
        } else {
            price = amount
        }
        return toMoneyFormat(price);
    }

    useEffect(() => {
        dispatch(setBookingStay(stay))

    }, [currency, exchangeRate, subTotal])
    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md shadow-primary">
            <h3 className="text-xl font-semibold">Price Summary</h3>
            {cart.map((cartItem: any, index: number) => <div key={index} className={'grid grid-cols-2'}>
                <div
                    className="capitalize text-gray-500">{stay.rooms.find((value: any) => value.id === cartItem.roomId).name}</div>
                <div
                    className="capitalize text-end">{booking.currency} {calculatePrice(cartItem.numRooms * stay.rooms.find((value: any) => value.id === cartItem.roomId).price)}</div>
            </div>)}
            <hr className="col-span-2 my-4"/>
            <div className="grid grid-cols-2">
                <div className="font-medium text-gray-500">Subtotal</div>
                <div className="font-medium text-end">{booking.currency} {toMoneyFormat(booking.totalPrice)}</div>
                <div className="font-medium text-gray-500">Booking fees</div>
                <div className="font-medium text-end">{booking.currency} {toMoneyFormat(booking.fees)}</div>
                <hr className="col-span-2 my-4"/>
                <div className="font-medium text-xl">Total</div>
                <div className="font-medium text-xl text-end">
                    {booking.currency} {toMoneyFormat(booking.grandTotal)}
                </div>
            </div>
            <small className={'italic text-gray-400 text-center'}>We currently only accept payments
                in {currency}</small>
            <div
                className={'text-primary text-center font-medium h4 my-2'}> 1 {booking.currency} = {toMoneyFormat(exchangeRate)} {currency}</div>
            <div className={'text-lg font-medium'}>You will Pay</div>
            <div className={'text-xl font-bold'}>{currency} {toMoneyFormat(booking.grandTotal * exchangeRate)}</div>
        </div>
    );
};

export default BookingSummary;
