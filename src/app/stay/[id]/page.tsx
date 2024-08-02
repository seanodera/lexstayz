'use client'
import { faker } from "@faker-js/faker";
import { MdOutlineBathtub, MdOutlineDashboard, MdPersonOutline } from "react-icons/md";
import { IoBedOutline } from "react-icons/io5";
import React, { useEffect, useState } from "react";
import RoomComponent from "@/components/Grid Items/roomComponent";
import DateComponent from "@/components/DateComponent";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
    resetBooking, selectCart,

} from "@/slices/bookingSlice";



import Banner from "@/components/stay/banner";
import Details from "@/components/stay/details";
import Description from "@/components/stay/description";
import StayDate from "@/components/stay/stayDate";
import MobileCartSummary from "@/components/stay/MobileCartSummary";
import CartSummary from "@/components/stay/cartSummary";
import FeaturedRoom from "@/components/stay/featuredRoom";
import AvailableRooms from "@/components/stay/availableRooms";
import {selectCurrentId, selectCurrentStay, selectDates, setCurrentStayFromId} from "@/slices/staysSlice";


export default function Stay() {
    const params = useParams()['id'];
    const dispatch = useAppDispatch();
    const currentId = useAppSelector(selectCurrentId);

    useEffect(() => {

            dispatch(setCurrentStayFromId(params.toString()));

    }, [dispatch, params]);

    const stay = useAppSelector(selectCurrentStay);
    const dates = useAppSelector(selectDates);


    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
        return (
            <div className="lg:px-24 px-7 py-24 bg-white text-dark">
                <Banner stay={stay} />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-8">
                    <div className="col-span-2">
                        <Details stay={stay} />
                        <Description stay={stay} />
                        <StayDate />
                        <AvailableRooms stay={stay} />
                    </div>
                    <div className="max-lg:hidden lg:ps-12 col-span-1 md:col-span-2 lg:col-span-1">
                        <FeaturedRoom stay={stay} />
                        <CartSummary stay={stay} />
                    </div>
                </div>
                <MobileCartSummary dates={dates} />
            </div>
        );
    }
}
