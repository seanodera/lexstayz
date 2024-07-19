// pages/booking-confirmation.tsx
'use client'
import Link from "next/link";
import {dateReader} from "@/lib/utils";
import ContactForm from "@/components/booking-confirmation/contactForm";
import SpecialRequests from "@/components/booking-confirmation/specialRequests";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentStay} from "@/slices/bookingSlice";
import StayDetails from "@/components/booking-confirmation/stayDetails";
import BookingDetails from "@/components/booking-confirmation/bookingDetails";
import BookingSummary from "@/components/booking-confirmation/bookingSummary";
import {Select} from "@headlessui/react";
import {AiFillCheckCircle, AiOutlineCheckCircle} from "react-icons/ai";

export default function Page() {
    const stay = useAppSelector(selectCurrentStay);

    if (!stay || stay.id === undefined) {
        return <div></div>;
    } else {
        return (
            <div className="bg-white py-24 lg:px-16 px-7 text-dark">
                <div className="grid grid-cols-1 lg:grid-cols-4 max-lg:gap-8 gap-4">
                    <div className="col-span-1 lg:col-span-3 flex flex-col gap-8">
                        <div className="border border-gray-200 rounded-xl p-4 md:p-8 shadow-md">
                            <ContactForm/>
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4 md:p-8 shadow-md">
                            <SpecialRequests/>
                        </div>
                        <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'}>
                            <div className={'border shadow-md p-4 rounded-xl'}><h3
                                className={'text-xl font-semibold mb-2'}>Your Arrival Time</h3>
                                <span className={'flex gap-1 items-center my-4'}><AiOutlineCheckCircle
                                    className={'text-primary'} size={35}/> Ready for check-in at 2:00 PM</span>
                                <div className={'font-medium my-2'}>Add your estimated arrival time</div>
                                <Select
                                    className={'appearance-none border border-gray-500 rounded-lg py-2 px-3 w-full'}>
                                    <option>I dont know</option>
                                    <option>00:00 - 01:00</option>
                                </Select>
                            </div>
                            <div className={'border shadow-md p-4 rounded-xl'}><h3
                                className={'text-xl font-semibold mb-2'}>Cancellation</h3>
                                <div className={'text-primary-600 my-4 font-medium'}>Free Cancellation
                                    until {dateReader({})} 00:00
                                </div>
                                <div className={'flex justify-between'}>
                                    <span className={'font-medium'}>If you cancel, you&apos;ll pay</span>
                                    <span className={'text-primary'}>$ 30.00</span>
                                </div>
                            </div>

                            <div className={'border shadow-md p-4 rounded-xl col-span-1 md:col-span-2 lg:col-span-1'}><h3
                                className={'text-xl font-semibold mb-2'}>Terms & Conditions</h3></div>
                        </div>
                        <Link href="/checkout"
                              className="hidden max-lg:block py-3 text-center bg-primary rounded-xl font-medium text-white">
                            Checkout
                        </Link>
                    </div>
                    <div className="col-span-1 lg:col-span-1 flex flex-col gap-8 max-lg:order-first">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:gap-8 gap-4">
                            <StayDetails stay={stay}/>
                            <BookingDetails stay={stay}/>
                            <BookingSummary stay={stay}/>
                            <Link href="/checkout"
                                  className="block max-lg:hidden py-3 text-center bg-primary rounded-xl font-medium text-white">
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
