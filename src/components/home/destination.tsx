'use client'


import {useTabs} from "@/hooks/use-tabs";
import {useState} from "react";
import {Framer} from '@/lib/framer';
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {AiOutlineApartment} from "react-icons/ai";
import hotelsData from "@/data/hotelsData";
import HotelsData from "@/data/hotelsData";
import HotelItem from "@/components/HotelItem";

export default function Destination() {
    const tabs = [
        {
            Icon: MdOutlineVilla,
            name: "Villa",
        },
        {
            Icon: AiOutlineApartment,
            name: "Apartment",
        },
        {
            Icon: MdOutlineHotel,
            name: "Hotel",
        }
    ]
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    return <section className={'md:px-16 px-7 py-12 bg-white border-t border-gray-200'}>
        <div
            className="text-lg text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700">
            <ul className="flex flex-wrap -mb-px">
                {
                    tabs.map((tab, index) => <li key={index} className="me-2">
                        <span onClick={() => setActiveTabIndex(index)}
                           className={`inline-flex items-center justify-center border-b-2 p-4 gap-3 rounded-t-lg ${activeTabIndex === index ? "border-primary text-primary" : 'border-transparent'} hover:text-primary-400 hover:border-primary-400 group transition-all duration-300 ease-in`}
                           aria-current="page">{<tab.Icon className={''}/>} {tab.name}</span>
                    </li>)
                }
            </ul>
        </div>
        <div className={'grid grid-cols-4 gap-8 py-8 text-black'}>
            {hotelsData.map((hotel, index) => <HotelItem key={index} hotel={hotel}/> )}
        </div>

    </section>
}