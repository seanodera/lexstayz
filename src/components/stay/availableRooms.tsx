'use client'
import RoomComponent from "@/components/Grid Items/roomComponent";
import {useAppSelector} from "@/hooks/hooks";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import dayjs from "dayjs";
import {current} from "immer";

export default function AvailableRooms({ stay}: { stay: any }) {
    const booking = useAppSelector(selectConfirmBooking)
    return (
        <div>
            <h3 className="text-2xl font-semibold my-2">Available Rooms</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {stay.rooms.map((room:any, index: number) => {
                    // let {bookedDates, fullDates} = room;
                    const len = dayjs(booking.checkOutDate).diff(dayjs(booking.checkInDate), 'days');
                    let available = true
                    let lowest = room.available;
                    for (let i = 0; i <= len; ++i) {
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
                        <RoomComponent room={room} stay={stay} key={index} available={available} lowest={lowest}/>
                    );
                })}
            </div>
        </div>
    );
}
