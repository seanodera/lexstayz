import {Suspense} from "react";
import ConfirmBooking from "@/components/confirm-booking/confirmBooking";


export default function ConfirmBookingPage() {

    return <Suspense fallback={null}><ConfirmBooking/></Suspense>
}