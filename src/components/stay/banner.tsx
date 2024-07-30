'use client'
import {MdOutlineDashboard} from "react-icons/md";
import {useState} from "react";
import {ShowImagesDialog} from "@/components/stay/showImages";

export default function Banner({stay}: { stay: any }) {
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
