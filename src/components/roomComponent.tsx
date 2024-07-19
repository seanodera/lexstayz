'use client'
import {IoBedOutline} from "react-icons/io5";
import {LuBedSingle} from "react-icons/lu";
import ReservationDialog from "@/components/stay/reservationDialog";
import {useEffect, useState} from "react";
import {Select} from "@headlessui/react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCart, updateCart} from "@/slices/bookingSlice";


export default function RoomComponent({room, stay, className = ''}: { room: any, stay: any, className?: string }) {
    const dispatch = useAppDispatch();
    const globalCart = useAppSelector(selectCart)
    const fullState = useAppSelector((state: any) => state.booking);
    const [numRooms, setNumRooms] = useState<number>(0);
    const [open, setOpen] = useState(false);
    const [roomIndex, setRoomIndex] = useState<number>(-1);

    useEffect(() => {
        let _roomIndex = globalCart.findIndex((value: any) => value.roomId === room.id);
        setRoomIndex(_roomIndex)
        if (_roomIndex !== -1){
            setNumRooms(globalCart[_roomIndex].numRooms)
        }

    }, [globalCart])

    function handleCart() {
        // Clone the global cart array to avoid mutating the original array
        let newCart = [...globalCart];

        // Check if the number of rooms is greater than zero
        if (numRooms > 0) {
            // Check if the room is already in the cart by its index
            if (roomIndex !== -1) {
                // Update the existing room entry in the cart
                newCart[roomIndex] = {
                    numRooms: numRooms,
                    roomId: room.id,
                    stayId: stay.id
                };
            } else {
                // Add a new room entry to the cart
                newCart.push({
                    numRooms: numRooms,
                    roomId: room.id,
                    stayId: stay.id
                });
            }
        } else if (numRooms === 0 && roomIndex !== -1) {
            // Remove the room from the cart if the number of rooms is zero
            newCart.splice(roomIndex, 1);
        }

        // Dispatch the updated cart
        dispatch(updateCart(newCart));
    }

    return <div className={`${(roomIndex !== -1) && 'shadow-primary'} ${className ? className : 'rounded-2xl p-4 shadow-md'}`}>
        <img className={'aspect-video rounded-xl object-cover'} src={room.poster} alt={room.name}/>
        <div className={'my-4 flex justify-between'}><h3
            className={'text-xl font-medium'}>{room.name}</h3>  <span
            className={'font-medium text-primary text-xl'}>{'$'} {room.price.toLocaleString(undefined, {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        })} <span className={'font-light text-sm'}>/night</span></span></div>
        <div className={'flex flex-wrap gap-2 my-4'}>{room.amenities.map((amenity: string, index: number) =>
            <div
                className={'border border-gray-500 shadow-md rounded py-1 px-3 text-balance text-sm'}
                key={index}>{amenity}</div>)}</div>
        <div className={'text-lg font-medium'}>Beds</div>
        <div className={'flex items-center gap-2 mb-4 overflow-x-scroll'}>
            {
                room.beds.map((bed: any, index: number) => <div key={index}
                                                                className={'p-3 text-center border border-gray-500 shadow-md rounded text-nowrap'}>
                    <span
                        className={'mx-auto'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                        <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                    {bed.type} Bed x {bed.number}
                </div>)
            }
        </div>
        <div className={'flex items-center gap-2'}>
            <div className={'rounded-xl'}><Select value={numRooms}
                                                  onChange={(e) => setNumRooms(parseInt(e.target.value))}
                                                  className={'appearance-none rounded-xl border border-primary py-3 px-3 text-start bg-transparent'}>
                {Array.from({length: 11}, (_, i) => <option value={i}
                                                            key={i}>{i} {(i === 1) ? 'Room' : 'Rooms'}</option>)}
            </Select></div>
            <button className={'rounded-xl text-center py-3 bg-primary text-white font-medium w-full'}
                    onClick={handleCart}>Reserve
            </button>
        </div>

        <ReservationDialog isOpen={open} setIsOpen={setOpen} room={room} stay={stay}/>
    </div>
}