import {Image} from "antd";

const StayDetails = ({ stay }: any) => (
    <div className="border border-gray-200 rounded-xl p-4 shadow-md col-span-1 md:col-span-2 lg:col-span-1 max-lg:grid grid-cols-3 gap-2">
        <Image
            src={stay.poster}
            className="rounded-xl aspect-square md:aspect-video object-cover md:mb-4 max-lg:col-span-1"
            alt={stay.name}
        />
        <div className="max-lg:col-span-2 max-lg:flex flex-col justify-center">
            <h3 className="text-xl font-semibold">{stay.name}</h3>
            <h3 className="font-light text-gray-400 line-clamp-1">
                {stay.location.city}, {stay.location.country}
            </h3>
        </div>
    </div>
);

export default StayDetails;
