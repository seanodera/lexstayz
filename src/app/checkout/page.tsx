'use client'
import {Button, Result} from "antd";
import {CheckCircleOutlined, CheckOutlined} from "@ant-design/icons";
import {useEffect} from "react";


export default function Page() {
    useEffect(() => {

    }, []);
    return <div className={'h-full w-full pt-24 flex flex-col justify-center bg-white'}><Result
        icon={<CheckCircleOutlined/>} title={'Booking Request Sent'}
        status={'success'}
        subTitle={'Your booking has been received successfully. Please wait for the host to accept your booking.'}
        extra={<Button href={'/bookings'} type={'primary'} ghost>View Bookings</Button>}/>
    </div>
}