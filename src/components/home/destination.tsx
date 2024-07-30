'use client'



import {useState} from "react";

import {MdOutlineBathroom, MdOutlineHotel, MdOutlineVilla} from "react-icons/md";

import HotelItem from "@/components/HotelItem";
import {IoMdGlobe} from "react-icons/io";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";


export default function Destination() {
    const tabs = [
        {
            Icon: IoMdGlobe,
            name: 'All'
        },
        {
            Icon: MdOutlineHotel,
            name: "Hotels",
        },
        {
            Icon: MdOutlineVilla,
            name: "Homes",
        },

    ]
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const stays = useAppSelector(selectAllStays)
    return <section className={' lg:px-16  py-12 bg-white border-t border-gray-200'}>
        <div
            className="max-lg:px-7 text-lg text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-nowrap overflow-x-scroll -mb-px">
                {
                    tabs.map((tab, index) => <li key={index} className="me-2">
                        <span onClick={() => setActiveTabIndex(index)}
                           className={`inline-flex items-center justify-center border-b-2 p-4 gap-3 rounded-t-lg ${activeTabIndex === index ? "border-primary text-primary" : 'border-transparent'} hover:text-primary-400 hover:border-primary-400 group transition-all duration-300 ease-in`}
                           aria-current="page">{<tab.Icon className={''}/>} {tab.name}</span>
                    </li>)
                }
            </ul>
        </div>
        <div className={'max-lg:px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-8 text-black'}>
            {stays.map((hotel:any, index:number) => <HotelItem key={index} hotel={hotel}/> )}
        </div>

    </section>
}