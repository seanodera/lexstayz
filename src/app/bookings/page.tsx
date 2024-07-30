'use client'

import { useAppSelector } from "@/hooks/hooks";
import { selectBookings } from "@/slices/bookingSlice";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import BookingItem from "@/components/bookings/BookingItem";

export default function Page() {
    const bookings = useAppSelector(selectBookings)
    const [upcoming, setUpcoming] = useState<any[]>([])
    const [ongoing, setOngoing] = useState<any[]>([])
    const [previous, setPrevious] = useState<any[]>([])

    useEffect(() => {
        const today = new Date();
        const upcomingBookings: any[] = [];
        const ongoingBookings: any[] = [];
        const previousBookings: any[] = [];

        bookings.forEach((booking: {
            checkInDate: string,
            checkOutDate: string,
            createdAt: string,
            status: 'Pending' | 'Confirmed' | 'Canceled' | 'Rejected'
        }) => {
            const checkInDate = new Date(booking.checkInDate);
            const checkOutDate = new Date(booking.checkOutDate);

            if (booking.status === 'Canceled' || booking.status === 'Rejected') {
                previousBookings.push(booking);
            } else if (checkOutDate < today) {
                previousBookings.push(booking);
            } else if (checkInDate <= today && checkOutDate >= today) {
                ongoingBookings.push(booking);
            } else if (checkInDate > today) {
                upcomingBookings.push(booking);
            }
        });

        // Sorting the bookings by date
        upcomingBookings.sort((a, b) => dayjs(a.checkInDate).diff(dayjs(b.checkInDate)));
        ongoingBookings.sort((a, b) => dayjs(a.checkInDate).diff(dayjs(b.checkInDate)));
        previousBookings.sort((a, b) => {
            if (a.status === 'Canceled' || a.status === 'Rejected') {
                return dayjs(a.createdAt).diff(dayjs(b.createdAt));
            } else {
                return dayjs(a.checkOutDate).diff(dayjs(b.checkOutDate));
            }
        });

        setUpcoming(upcomingBookings);
        setOngoing(ongoingBookings);
        setPrevious(previousBookings);
    }, [bookings]);

    return (
        <div className={'pt-24 lg:px-24 px-7'}>
            <h1>Bookings</h1>
            <h2 className={`font-semibold ${upcoming.length === 0? 'hidden' : ''}`}>Upcoming</h2>
            <div>
                {upcoming.map((booking, index) => (
                    <BookingItem booking={booking} key={index}/>
                ))}
            </div>
            <h2 className={`font-semibold ${ongoing.length === 0? 'hidden' : '' }`}>Ongoing</h2>
            <div>
                {ongoing.map((booking, index) => (
                    <BookingItem booking={booking} key={index}/>
                ))}
            </div>
            <h2 className={`font-semibold ${previous.length === 0? 'hidden' : ''}`}>Previous Bookings</h2>
            <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-4 lg:gap-8'}>
                {previous.map((booking, index) => (
                    <BookingItem booking={booking} key={index}/>
                ))}
            </div>
        </div>
    );
}
