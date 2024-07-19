import Link from "next/link";
import {useAppSelector} from "@/hooks/hooks";
import {selectCart} from "@/slices/bookingSlice";

export default function CartSummary({stay}: any) {
    const cart = useAppSelector(selectCart);

    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Cart</h3>
            {cart.map((cartItem: any, index: number) => {

                return <div key={index}></div>
            })}
            <div className="rounded-2xl bg-dark text-white p-4">
                <Link href="/booking-confirmation" className="block rounded-xl text-center py-3 bg-primary text-white font-medium w-full">
                    Confirm Reservation
                </Link>
            </div>
        </div>
    );
}
