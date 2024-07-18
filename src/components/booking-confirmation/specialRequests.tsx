import {Textarea} from "@headlessui/react";


export default function SpecialRequests() {

    return <div className={''}>
        <h3 className={'text-lg font-bold'}>Special Requests</h3>
        <p className={'my-4'}>Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete</p>
        <h6 className={' font-medium'}>Please write your requests in English</h6>
        <Textarea name={'specialRequests'} className={'w-full border  border-gray-500 rounded p-4'}></Textarea>
    </div>;
}