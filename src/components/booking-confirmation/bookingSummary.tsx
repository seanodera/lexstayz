// components/BookingSummary.tsx
import {getCountry, getExchangeRate, toMoneyFormat} from "@/lib/utils";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";
import {useEffect, useState} from "react";
import {message} from "antd";
import {setBookingStay, updateCostData} from "@/slices/confirmBookingSlice";
import {selectDates} from "@/slices/staysSlice";

const BookingSummary = ({ stay }: any) => {
    const cart = useAppSelector(selectCart);
    const dates = useAppSelector(selectDates);
    const [subTotal, setSubTotal] = useState(0);
    const [exchangeRate, setExchangeRate] = useState(0)
    const [currency,setCurrency] = useState('USD')
    const [messageApi, contextHolder] = message.useMessage();
    const dispatch =useAppDispatch()
    useEffect(() => {
        let _subTotal = 0;
        cart.forEach((value: any) => {
            _subTotal += value.numRooms * stay.rooms.find((stay: any) => stay.id === value.roomId).price * dates.length ;
        });
        setSubTotal(_subTotal);
    }, [cart]);

    useEffect(() => {
       const fetchExchangeRate = async () => {
           const country = await getCountry();

            const fromCurrency = 'USD'; // Change as needed
            const toCurrency = 'GHS'; // Change as needed
            if (toCurrency){
                const rate = await getExchangeRate(fromCurrency, toCurrency);
                if (rate) {
                    setCurrency(toCurrency)
                    setExchangeRate(rate * 1.02);
                } else {
                    //messageApi.error(`Failed to get exchange Rate`, )
                }
            }
        };
       fetchExchangeRate()
    });
    useEffect(()=>{
        dispatch(setBookingStay(stay))
        dispatch(updateCostData(
            {price: subTotal, currency: currency, usedRate: exchangeRate}
        ))
    },[currency, exchangeRate, subTotal])
    return (
        <div className="border border-gray-200 rounded-xl p-4 shadow-md shadow-primary">
            <h3 className="text-xl font-semibold">Price Summary</h3>
            {cart.map((cartItem: any, index: number) => <div key={index} className={'grid grid-cols-2'}>
                <div
                    className="capitalize text-gray-500">{stay.rooms.find((value: any) => value.id === cartItem.roomId).name}</div>
                <div
                    className="capitalize text-end">${toMoneyFormat(cartItem.numRooms * stay.rooms.find((value: any) => value.id === cartItem.roomId).price)}</div>
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
            <div className={'text-primary text-center font-medium h4 my-2'}> 1 USD = {toMoneyFormat(exchangeRate)} {currency}</div>
            <div className={'text-lg font-medium'}>You will Pay</div>
            <div className={'text-xl font-bold'}>{currency} {toMoneyFormat(subTotal * 1.035 * exchangeRate)}</div>
        </div>
    );
};

export default BookingSummary;
