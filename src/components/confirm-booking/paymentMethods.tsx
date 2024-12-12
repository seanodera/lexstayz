'use client'

import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Radio, RadioGroup} from "@headlessui/react";
import {CiCreditCard2} from "react-icons/ci";
import {
    selectConfirmBooking,
    selectPaymentMethod,
    setPaymentCurrency,
    setPaymentMethod
} from "@/slices/confirmBookingSlice";
import {toMoneyFormat} from "@/lib/utils";
import {AiOutlineMobile} from "react-icons/ai";
import {Dropdown, Select} from "antd";
import {useEffect, useState} from "react";

// Define the types for the user's payment methods

export default function PaymentMethods() {
    const booking = useAppSelector(selectConfirmBooking)
    const [supportedCurrencies,setSupportedCurrencies] = useState(['GHS', 'KES'])
    const cardCurrencies = ['GHS', 'KES']
    const paymentMethod = useAppSelector(selectPaymentMethod);
    const dispatch = useAppDispatch();

    useEffect(() => {
        let data:string[] = ['GHS', 'KES'];
        booking.configs.forEach((config) => {
            config.correspondents.forEach((value) => {
               if (!data.includes(value.currency)){
                   data.push(value.currency);
               }
            })
        })
        setSupportedCurrencies(data)
    }, [booking.configs]);
    return (
        <div>
            <div className={'flex justify-between'}>
                <h3 className="font-semibold">Payment Methods</h3>
                <Select value={booking.paymentCurrency} onChange={(value) => dispatch(setPaymentCurrency(value))} options={supportedCurrencies.map((currency) => ({value: currency, label: currency}))}/>
            </div>
            {booking.paymentCurrency !== booking.currency && <div>
                <div className={'flex gap-2'}>
                    <h3 className={'text-xl'}>Total Price: </h3>
                    <h2 className={'text-xl font-bold'}>{booking.currency} {toMoneyFormat(booking.grandTotal)}</h2>
                </div>
                <div
                    className={'text-primary font-medium h4 mb-4 '}> 1 {booking.currency} = {toMoneyFormat(booking.paymentRate)} {booking.paymentCurrency}
                </div>
            </div>
            }
            <div>
                <RadioGroup
                    value={paymentMethod}
                    onChange={(value) => dispatch(setPaymentMethod(value))}
                    className="grid grid-cols-2 gap-4"
                >
                    {cardCurrencies.includes(booking.paymentCurrency) && <Radio value={'card-payment'} className="">
                        {({checked}) => (
                            <div
                                className={`w-full ${checked ? 'border-primary ' : 'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                <div className={'text-3xl'}>
                                    <CiCreditCard2/>
                                </div>
                                <div className={'w-full'}>
                                    <div className="font-semibold">
                                        Card Payment
                                    </div>
                                    <div
                                        className={'font-bold text-lg'}>{booking.paymentCurrency} {toMoneyFormat(booking.grandTotal * booking.paymentRate)}</div>

                                </div>

                            </div>
                        )}
                    </Radio>}
                    {supportedCurrencies.includes(booking.paymentCurrency) &&
                        <Radio value={'mobile-money'} className="">
                            {({checked}) => (
                                <div
                                    className={`w-full ${checked ? 'border-primary ' : 'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                    <div className={'text-3xl'}>
                                        <AiOutlineMobile/>
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            Mobile Money
                                        </div>
                                        <div
                                            className={'font-bold text-lg'}>{booking.paymentCurrency} {toMoneyFormat(booking.grandTotal * booking.paymentRate)}</div>
                                    </div>
                                </div>
                            )}
                        </Radio>}
                </RadioGroup>
            </div>
        </div>
    );
}
