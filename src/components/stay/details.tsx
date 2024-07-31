import {MdOutlineBathtub, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";

export default function Details({stay}: { stay: any }) {
    return (
        <div>
            <h3 className="font-semibold text-xl">
                {stay.type} in {stay.location.city}, {stay.location.country}
            </h3>
            {stay.type !== 'Hotel' && <div className="flex items-center my-4">
                <span className="flex items-center gap-2 font-light pe-3 md:border-e border-gray-400">
                <MdPersonOutline/> {stay.maxGuests} Guests
        </span>
                <span className="flex items-center gap-2 font-light px-3 md:border-e border-gray-400">
                    <IoBedOutline/> {stay.bed} Beds
                </span>
                <span className="flex items-center gap-2 font-light px-3">
                    <MdOutlineBathtub/> {stay.bath} Baths
                </span>
            </div>}
        </div>
    );
}
