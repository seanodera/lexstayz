'use client'
import RoomComponent, {RoomComponentPortrait} from "@/components/Grid Items/roomComponent";
import dayjs from "dayjs";
import {useAppSelector} from "@/hooks/hooks";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";

export default function FeaturedRoom({ stay } : any)  {
    const booking = useAppSelector(selectConfirmBooking)
    return (
        <div className="mb-4">
            <h3 className="text-2xl font-semibold mb-2">Featured Room</h3>
            {stay.rooms.slice(0, 1).map((room:any, index: number) => {
                const len = dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), 'days');
                let available = false
                let lowest = room.available;
                for (let i = 0; i <= len; ++i) {
                    console.log(booking.checkInDate)
                    console.log()
                    let current = dayjs(booking.checkInDate).add(i,'day').toDate().toISOString().split('T')[0]
                    if (room.fullDates && room.fullDates.includes(current)) {
                        available = false;
                    }
                    if (room.bookedDates){
                        if (room.bookedDates[current]){
                            if (room.bookedDates[current] <= lowest) {
                                lowest = room.bookedDates[current];
                            }
                        }
                    }
                }
                return (
                    <RoomComponentPortrait
                        room={room}
                        stay={stay}
                        key={index}
                        available={available} lowest={lowest}
                        className="shadow-md bg-primary-50 text-dark rounded-2xl p-4"
                    />
                );
            })}
        </div>
    );
}
