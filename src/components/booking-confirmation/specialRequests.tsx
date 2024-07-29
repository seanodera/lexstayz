'use client'
import {Textarea} from "@headlessui/react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectSpecialRequest, updateSpecialRequest} from "@/slices/confirmBookingSlice";


export default function SpecialRequests() {
    const specialRequest= useAppSelector(selectSpecialRequest)
    const dispatch = useAppDispatch()
    return <div className={''}>
        <h3 className={'text-lg font-bold'}>Special Requests</h3>
        <p className={'my-4'}>Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete</p>
        <h6 className={' font-medium'}>Please write your requests in English</h6>
        <Textarea name={'specialRequests'} className={'w-full border  border-gray-500 rounded p-4'} value={specialRequest} onChange={(e) => dispatch(updateSpecialRequest(e.target.value))}></Textarea>
    </div>;
}