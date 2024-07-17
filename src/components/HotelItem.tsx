import {MdOutlineBathroom, MdOutlineBathtub, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";
import Link from "next/link";


export default function HotelItem({hotel}: {
    hotel: {
        poster: string, name: string, id: number, location: {
            city: string,
            country: string,
        }, price: number, bed: number, bath: number, rating: number, maxGuests: number
    }
}) {
    const {poster, name, id, location, price, bed, bath, rating, maxGuests} = hotel;
    return <Link href={`/stay/${id}`} className={'rounded-xl'}>
        <img src={poster} alt={name} className={'rounded-xl aspect-square w-full'}/>
        <div className={'flex items-center justify-between py-4'}>
            <div>
                <h3 className={'text-xl font-semibold'}>{name}</h3>
                <h3 className={'text-lg font-light text-gray-400'}>{location.city}, {location.country}</h3>
            </div>
            <div className={'text-end text-primary text-xl text-nowrap'}>{'$'} {price.toLocaleString(undefined, {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            })}</div>
        </div>
        <div className={'flex items-center flex-wrap'}>
            <span className={'text-nowrap flex items-center gap-2 font-light pe-3 border-e border-gray-400'}><MdPersonOutline/> {maxGuests} Guests</span>
            <span className={'text-nowrap flex items-center gap-2 font-light px-3 max-md:border-e lg:border-e border-gray-400'}><IoBedOutline/> {bed} Beds</span>
            <span className={'text-nowrap flex items-center gap-2 font-light max-md:px-3 md:pe-3 lg:px-3'}><MdOutlineBathtub/> {bath} Baths</span>
        </div>
    </Link>
}