import Link from "next/link";

export default function CartSummary() {
    return (
        <div>
            <h3 className="text-2xl font-semibold mb-2">Cart</h3>
            <div className="rounded-2xl bg-dark text-white p-4">
                <Link href="/booking-confirmation" className="block rounded-xl text-center py-3 bg-primary text-white font-medium w-full">
                    Confirm Reservation
                </Link>
            </div>
        </div>
    );
}
