// pages/booking-confirmation.tsx
'use client'
import Link from "next/link";
import { dateReader } from "@/lib/utils";
import ContactForm from "@/components/booking-confirmation/contactForm";
import SpecialRequests from "@/components/booking-confirmation/specialRequests";
import { useAppSelector } from "@/hooks/hooks";
import { selectCurrentStay } from "@/slices/bookingSlice";
import StayDetails from "@/components/booking-confirmation/stayDetails";
import BookingDetails from "@/components/booking-confirmation/bookingDetails";
import BookingSummary from "@/components/booking-confirmation/bookingSummary";

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
                            <ContactForm />
                        </div>
                        <div className="border border-gray-200 rounded-xl p-4 md:p-8 shadow-md">
                            <SpecialRequests />
                        </div>
                        <Link href="/checkout" className="hidden max-lg:block py-3 text-center bg-primary rounded-xl font-medium text-white">
                            Checkout
                        </Link>
                    </div>
                    <div className="col-span-1 lg:col-span-1 flex flex-col gap-8 max-lg:order-first">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:gap-8 gap-4">
                            <StayDetails stay={stay} />
                            <BookingDetails stay={stay} />
                            <BookingSummary stay={stay} />
                            <Link href="/checkout" className="block max-lg:hidden py-3 text-center bg-primary rounded-xl font-medium text-white">
                                Checkout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
