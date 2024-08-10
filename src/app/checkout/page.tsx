'use client'
import {Suspense, useEffect} from "react";
import CheckOutComponent from "@/components/booking-confirmation/checkOutComponent";


export default function Page() {
    useEffect(() => {

    }, []);
    return <div className={'h-full w-full pt-4 flex flex-col justify-center bg-white'}>
        <Suspense fallback={null}>
            <CheckOutComponent/>
        </Suspense>
    </div>
}