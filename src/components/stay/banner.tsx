'use client'
import { MdOutlineDashboard } from "react-icons/md";
import { useState } from "react";
import { ShowImagesDialog } from "@/components/stay/showImages";
import { Image } from "antd";

export default function Banner({ stay }: { stay: any }) {
    const [showImages, setShowImages] = useState(false);

    return (
        <div>
            <h3 className="font-semibold text-3xl mb-4">{stay.name}</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 grid-rows-3 gap-2 w-full aspect-[20/7]">
                <div className="col-span-3 row-span-3">
                    <img src={stay.poster} className="w-full h-full object-cover rounded-xl" />
                </div>
                {stay.images.slice(0, 2).map((image: string, index: number) => (
                    <div key={index} className="col-span-1 row-span-1">
                        <img src={image} className="w-full h-full object-cover rounded-xl" />
                    </div>
                ))}
                <div
                    className="col-span-1 row-span-1 relative w-full h-full bg-cover bg-center rounded-xl"
                    style={{ backgroundImage: `url("${stay.images[2]}")` }}
                >
                    <div
                        className="absolute inset-0 bg-dark bg-opacity-40 flex items-center justify-center cursor-pointer rounded-xl"
                        onClick={() => setShowImages(true)}
                    >
                        <span className="text-white font-semibold text-lg">+ More</span>
                    </div>
                </div>
            </div>
            <ShowImagesDialog open={showImages} setOpen={setShowImages} images={stay.images} />
        </div>
    );
}


export  function BannerOld({stay}: { stay: any }) {
    const [showImages, setShowImages] = useState(false);

    return (
        <div>
            <h3 className="font-semibold text-3xl mb-4">{stay.name}</h3>
            <div
                className="rounded-2xl flex items-end justify-end p-8 aspect-video lg:aspect-20/7"
                style={{
                    backgroundImage: `url("${stay.poster}")`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}>
                <button
                    onClick={(event) => {
                        event.preventDefault();
                        setShowImages(true);
                    }}
                    type="button"
                    className="rounded-xl px-3 py-1 text-nowrap flex gap-2 bg-white text-dark items-center text-lg border-dark">
                    <MdOutlineDashboard/> Show all photos
                </button>
            </div>
            <ShowImagesDialog open={showImages} setOpen={setShowImages} images={stay.images}/>
        </div>
    );
}