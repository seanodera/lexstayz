import {MdOutlineBathroom, MdOutlineBathtub, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";
import Link from "next/link";


export default function HotelItem({hotel}: {
    hotel: {
        poster: string, name: string, id: number, location: {
            city: string,
            country: string,
        }, price: number, bed: number, bath: number, rating: number, maxGuests: number, description: string
    }
}) {
    const {poster, name, id, location, price, bed, bath, rating, maxGuests, description} = hotel;
    return <Link href={`/stay/${id}`} className={'rounded-xl'}>
        <img src={poster} alt={name} className={'rounded-xl aspect-square w-full'}/>
        <div className={'flex items-center justify-between pt-4 pb-2'}>
            <div>
                <h3 className={'text-xl font-semibold'}>{name}</h3>
                <h3 className={'font-light text-gray-400'}>{location.city}, {location.country}</h3>
            </div>
            <div className={'text-end text-primary text-xl text-nowrap'}>{'$'} {price.toLocaleString(undefined, {
                minimumFractionDigits: 2, maximumFractionDigits: 2
            })}</div>
        </div>
        <div className={''}>
            <p className={'line-clamp-3'}>{description}</p>
        </div>
    </Link>
}