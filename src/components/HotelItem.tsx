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
    return <Link href={`/stay/${id}`} className={'text-current rounded-xl max-md:grid grid-cols-3 gap-3 max-md:shadow max-md:px-4 max-md:py-2 p-4 transition-all duration-300 ease-in-out  hover:shadow-md'}>
        <div className={'flex flex-col justify-center'}><img src={poster} alt={name}
                  className={'rounded-xl aspect-square w-full object-cover'}/></div>
        <div className={'col-span-2'}>
            <div className={'lg:flex items-center justify-between md:pt-4 pb-2'}>
                <div>
                <h3 className={'text-sm md:text-xl font-semibold'}>{name}</h3>
                    <h3 className={'font-light text-gray-400 line-clamp-1'}>{location.city}, {location.country}</h3>
                </div>
                {/*<div*/}
                {/*    className={'lg:text-end text-primary  md:font-semibold lg:text-xl text-nowrap'}>{'$'} {price.toLocaleString(undefined, {*/}
                {/*    minimumFractionDigits: 2, maximumFractionDigits: 2*/}
                {/*})}</div>*/}
            </div>
            <div className={'max-md:text-sm'}>
                <p className={'line-clamp-3'}>{description}</p>
            </div>
        </div>
    </Link>
}