'use client'

import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Radio, RadioGroup} from "@headlessui/react";
import {CiCreditCard2} from "react-icons/ci";
import {selectConfirmBooking, selectPaymentMethod, setPaymentMethod} from "@/slices/confirmBookingSlice";
import {toMoneyFormat} from "@/lib/utils";
import {AiOutlineMobile} from "react-icons/ai";

// Define the types for the user's payment methods

export default function PaymentMethods() {
    const booking = useAppSelector(selectConfirmBooking)
    const supportedCurrencies = ['GHS', 'KES']
    const paymentMethod = useAppSelector(selectPaymentMethod);
    const dispatch = useAppDispatch();

    return (
        <div>
            <h3 className="font-semibold">Payment Methods</h3>
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
                    <Radio value={'card-payment'} className="">
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
                    </Radio>
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
