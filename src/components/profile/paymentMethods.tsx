'use client'
import {Card} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {selectPaymentMethod, setPaymentMethod} from "@/slices/confirmBookingSlice";
import {Radio, RadioGroup} from "@headlessui/react";
import {SiMastercard, SiVisa} from "react-icons/si";
import {CiCreditCard2} from "react-icons/ci";
import {PaymentMethod} from "@/data/types";


export default function PaymentMethods(){
    const userDetails = useAppSelector(selectCurrentUser);
    const paymentMethod = useAppSelector(selectPaymentMethod);
    const dispatch = useAppDispatch();
    return <Card>
        <h3 className="font-semibold">Payment Methods</h3>
        <div>
            <RadioGroup
                value={paymentMethod}
                onChange={(value) => dispatch(setPaymentMethod(value))}
                className="grid grid-cols-2 gap-4"
            >
                {userDetails?.paymentMethods?.map((paymentMethod: PaymentMethod, index: number) => {
                    console.log(paymentMethod.card_type.trim() === 'visa')
                    return (
                        <Radio key={index} value={paymentMethod.authorization_code} className="">
                            {({checked}) => (
                                <div
                                    className={`w-full ${checked ? 'border-primary ' : 'border-gray-400'} flex gap-2 border-solid py-3 px-2 rounded-xl `}>
                                    <div className={'text-3xl'}>
                                        {paymentMethod.card_type.trim() === 'visa' ?
                                            <SiVisa/> : paymentMethod.card_type.trim() === 'mastercard' ?
                                                <SiMastercard/> :
                                                <CiCreditCard2/>}
                                    </div>
                                    <div>
                                        <div className="font-semibold">
                                            {paymentMethod.card_type} ending in {paymentMethod.last4}
                                        </div>
                                        <div>Expiry {paymentMethod.exp_month}/{paymentMethod.exp_year}</div>
                                    </div>
                                </div>
                            )}
                        </Radio>
                    );
                })}
            </RadioGroup>
        </div>
    </Card>
}