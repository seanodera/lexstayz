'use client'

import React, {useEffect} from "react";
import {useParams} from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";

import Banner from "@/components/stay/banner";
import Details from "@/components/stay/details";
import Description from "@/components/stay/description";
import StayDate from "@/components/stay/stayDate";
import MobileCartSummary from "@/components/stay/MobileCartSummary";
import CartSummary from "@/components/stay/cartSummary";
import FeaturedRoom from "@/components/stay/featuredRoom";
import AvailableRooms from "@/components/stay/availableRooms";
import {selectCurrentStay, setCurrentStayFromId} from "@/slices/staysSlice";
import {selectCart, updateCart} from "@/slices/bookingSlice";
import HouseRules from "@/components/stay/houseRules";
import {Calendar, Card} from "antd";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import {UnknownAction} from "redux";
import {AppDispatch} from "@/data/types";

// Extend dayjs with the required plugins
dayjs.extend(isBetween);


export default function StayPage() {
    const params = useParams(); // useParams to get the id
    const dispatch = useAppDispatch();

    const stay = useAppSelector(selectCurrentStay);
    const cart = useAppSelector(selectCart);
    const booking = useAppSelector(selectConfirmBooking);
    const stayId = params.id as string;
    // useEffect(() => {
    //
    //     if (stayId) {
    //         dispatch(setCurrentStayFromId(stayId) as any);
    //
    //         let newCart = [...cart];
    //         newCart.forEach((value, index) => {
    //             if (value.stayId !== stayId) {
    //                 newCart.splice(index, 1);
    //             }
    //         });
    //         dispatch(updateCart(newCart));
    //     }
    // }, [stayId]);

    useEffect(() => {
        if (stayId && stayId !== stay.id){
            dispatch(setCurrentStayFromId(stayId))
        }
        console.log(stayId)
    }, [dispatch, stayId]);
    if (!stay || stay.id === undefined) {

        return <div></div>;
    }
    const checkInDate = dayjs(booking.checkInDate);
    const checkOutDate = dayjs(booking.checkOutDate);
    console.log(stay)
    return (
        <div className="lg:px-24 px-7 py-4 bg-white text-dark">
            <Banner stay={stay}/>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
                <div className="col-span-2">
                    <Details stay={stay}/>
                    <Description stay={stay}/>
                    <StayDate stay={stay}/>
                    {stay.type === 'Hotel' && <AvailableRooms stay={stay}/>}
                    <HouseRules stay={stay}/>
                </div>
                {stay.type === 'Hotel' ?
                    <div className="max-lg:hidden lg:ps-12 col-span-1 md:col-span-2 lg:col-span-1">
                            <Calendar
                                fullscreen={false}
                                disabledDate={(date) =>
                                {
                                    const curr = date.toISOString().split('T')[ 0 ]
                                    let booked = false;
                                    if (stay.type === 'Home'){
                                        booked = stay.bookedDates?.includes(curr);
                                        console.log(booked)
                                    } else {
                                        booked = stay.fullyBookedDates?.includes(curr)
                                    }
                                    return date.isBefore(dayjs()) || booked || (stay.fullDates && stay.fullDates.includes(date.toISOString().split("T")[0]));
                                }}
                                fullCellRender={(date) => {
                                    const isCheckIn = date.isSame(checkInDate, 'date');
                                    const isCheckOut = date.isSame(checkOutDate, 'date');
                                    const inRange = date.isBetween(checkInDate, checkOutDate);

                                    let className = 'ant-picker-cell-inner  hover:text-primary';
                                    if (isCheckIn || isCheckOut || inRange) {
                                        className += ' ant-picker-cell-selected bg-primary text-white hover:text-white';
                                    }
                                    if (date.toDate().getDate() === 17) {
                                        console.log(isCheckOut, date, checkOutDate);
                                    }
                                    return (
                                        <div className={className + ''}>
                                            {date.date()}
                                        </div>
                                    );
                                }}
                            />
                        <CartSummary stay={stay}/>
                    </div> : <div className="max-lg:hidden lg:ps-12 col-span-1 md:col-span-2 lg:col-span-1 ">
                        <Card className={'rounded-xl'}>
                            <Calendar
                                fullscreen={false}
                                disabledDate={(date) => {
                                    return date.isBefore(dayjs());
                                }}
                                fullCellRender={(date) => {
                                    const isCheckIn = date.isSame(checkInDate, 'date');
                                    const isCheckOut = date.isSame(checkOutDate, 'date');
                                    const inRange = date.isBetween(checkInDate, checkOutDate);

                                    let className = 'ant-picker-cell-inner  hover:text-primary';
                                    if (isCheckIn || isCheckOut || inRange) {
                                        className += ' ant-picker-cell-selected bg-primary text-white hover:text-white';
                                    }
                                    if (date.toDate().getDate() === 17) {
                                        console.log(isCheckOut, date, checkOutDate);
                                    }
                                    return (
                                        <div className={className + ''}>
                                            {date.date()}
                                        </div>
                                    );
                                }}
                            />
                        </Card>
                        <h3 className={'mt-4 font-bold'}>Your Host</h3>
                        <Card className={'rounded-xl aspect-video'}>

                        </Card>
                        <h3 className={'mt-4 font-bold'}>Where You&apos;ll be</h3>
                        <Card className={'rounded-xl aspect-square'}>

                        </Card>
                    </div>}
            </div>

            <MobileCartSummary/>
        </div>
    );

}
