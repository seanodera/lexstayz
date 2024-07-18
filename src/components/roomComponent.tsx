'use client'
import {IoBedOutline} from "react-icons/io5";
import {LuBedSingle} from "react-icons/lu";
import ReservationDialog from "@/components/stay/reservationDialog";
import {useState} from "react";
import {Select} from "@headlessui/react";


export default function RoomComponent({room, stay, className = ''}: {room: any, stay: any, className?: string}) {
    const [open, setOpen] = useState(false);
    console.log(open)
    return <div className={`${className? className : 'rounded-2xl p-4 shadow-md'}`}>
        <img className={'aspect-video rounded-xl object-cover'} src={room.poster} alt={room.name}/>
        <div className={'my-4 flex md:justify-between'}><h3
            className={'text-xl font-medium'}>{room.name}</h3>  <span
            className={'font-medium text-primary text-xl'}>{'$'} {stay.price.toLocaleString(undefined, {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        })} <span className={'font-light text-sm'}>/night</span></span></div>
        <div className={'flex flex-wrap gap-2 my-4'}>{room.amenities.map((amenity : string, index : number) =>
            <div
                className={'border border-gray-500 shadow-md rounded py-1 px-3 text-balance text-sm'}
                key={index}>{amenity}</div>)}</div>
        <div className={'text-lg font-medium'}>Beds</div>
        <div className={'flex items-center gap-2 mb-4'}>
            {
                room.beds.map((bed : any, index : number) => <div key={index}
                                                                  className={'p-3 text-center border border-gray-500 shadow-md rounded'}>
                    <span
                        className={'mx-auto'}>{(bed.type.toLowerCase() === 'king' || bed.type.toLowerCase() === 'double') ?
                        <IoBedOutline size={28}/> : <LuBedSingle size={28}/>}</span>
                    {bed.type} Bed x {bed.number}
                </div>)
            }
        </div>
        <div className={'flex items-center gap-2'}>
            <div className={'rounded-xl'}><Select className={'rounded-xl border border-primary py-3 px-3 text-start bg-transparent'}>
                {Array.from({ length: 11 }, (_, i) => <option value={i} key={i}>{i} {(i === 1)? 'Room':'Rooms'}</option> )}
            </Select></div>
            <button className={'rounded-xl text-center py-3 bg-primary text-white font-medium w-full'}
                    onClick={() => setOpen(true)}>Reserve
            </button>
        </div>

        <ReservationDialog isOpen={open} setIsOpen={setOpen} room={room} stay={stay}/>
    </div>
}