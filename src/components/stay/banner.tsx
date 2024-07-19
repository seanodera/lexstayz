import {MdOutlineDashboard} from "react-icons/md";

export default function Banner({stay}: { stay: { name: string, poster: string } }) {
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
                <div
                    className="rounded-xl px-3 py-1 text-nowrap flex gap-2 bg-white text-dark items-center text-lg border-dark">
                    <MdOutlineDashboard/> Show all photos
                </div>
            </div>
        </div>
    );
}
