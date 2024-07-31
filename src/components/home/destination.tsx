'use client'


import {useState} from "react";

import {MdOutlineBathroom, MdOutlineHotel, MdOutlineVilla} from "react-icons/md";

import HotelItem from "@/components/HotelItem";
import {IoMdGlobe} from "react-icons/io";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";
import {Tabs} from "antd";


export default function Destination() {
    const tabs = [
        {
            Icon: IoMdGlobe,
            name: 'All',
            key: 'All'
        },
        {
            Icon: MdOutlineHotel,
            name: "Hotels",
            key: 'Hotels'
        },
        {
            Icon: MdOutlineVilla,
            name: "Homes",
            key: 'Homes'
        },

    ]
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const stays = useAppSelector(selectAllStays)

    return <section className={' lg:px-16  py-12 bg-white border-t border-gray-200'}>
        <Tabs size={'large'} items={tabs.map((value) => {
            let data = [...stays]
            if (value.name === 'Hotels'){
                data = stays.filter((item) => item.type.toLowerCase() === 'hotel')
            } else if (value.name === 'Homes'){
                data = stays.filter((item) => item.type.toLowerCase() === 'home')
            }
            return {
                key: value.key,
                icon: <value.Icon/>,
                label: value.name,
                children: <div
                    className={'max-lg:px-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 py-8 text-black'}>
                    {data.map((hotel: any, index: number) => <HotelItem key={index} hotel={hotel}/>)}
                </div>
            }
        })}/>

    </section>
}