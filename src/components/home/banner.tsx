'use client'
import {Input} from "@headlessui/react";
import DateComponent from "@/components/DateComponent";
import {Button, Carousel, Divider, Rate} from "antd";
import {useAppSelector} from "@/hooks/hooks";

import {StarFilled} from "@ant-design/icons";
import {Stay} from "@/lib/types";
import Link from "next/link";
import {selectAllStays} from "@/slices/staysSlice";


export default function Banner(){

    const stays = useAppSelector(selectAllStays)
    return <section>
        <Carousel arrows autoplay>
            {stays.map((stay: Stay, index: number) => <div key={index}>
                <div
                    className={'bg-center bg-cover w-screen aspect-[10/15] md:aspect-[10/8] lg:aspect-[18/7]'}
                    style={{
                        backgroundImage: `url("${stay.poster}")`,
                    }}>
                    <div
                        className={'h-full w-full flex flex-col justify-end text-white bg-dark bg-opacity-30 pt-24 pb-16 md:px-12 px-7 '}>
                        <div className={'md:w-1/2 lg:w-1/3'}>
                            <h1 className={'md:text-2xl lg:text-5xl mb-0'}>{stay.name}</h1>
                            <h2 className={'font-light text-gray-200 line-clamp-1 mb-0'}>{stay.location.city}, {stay.location.country}</h2>
                            <div className={'flex gap-2 items-center'}>
                                <h3 className={'mb-0 text-gray-300'}>{stay.type}</h3> <Divider className={'bg-white'} type={'vertical'}/> <Rate disabled defaultValue={3} className={'h3 mb-0'}/>
                            </div>
                            <p className={'line-clamp-5'}>{stay.description}</p>
                            <div>
                                <Link href={`/stay/${stay.id}`} className={'block bg-primary rounded px-4 py-2 w-max text-white'}>See More</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>)}
        </Carousel>
    </section>
}

export function BannerOld() {
    return <section
        className={'bg-center bg-cover pt-24 pb-16 md:px-12 px-7 w-screen aspect-[10/15] md:aspect-[10/8] lg:aspect-[18/7]'}
        style={{
            backgroundImage: 'url("/assets/banner.jpg")',
        }}>
        <div className={'h-full w-full flex flex-col justify-between'}>
            <div className={'md:flex justify-end items-end h-full max-md:py-16'}>
                <div
                    className={'hidden h-full flex-col gap-4 justify-center  bg-transparent bg-gradient-to-b from-transparent via-primary-100 to-transparent bg-[size:2px_auto] bg-repeat-y bg-left ps-2'}>
                    <div
                        className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-gray-300 text-white px-4 py-1 '}>Nairobi
                    </div>
                    <div
                        className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-white px-5 py-1 text-xl ms-3'}>Nairobi
                    </div>
                    <div
                        className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-gray-300 text-white px-4 py-1 '}>Nairobi
                    </div>
                </div>

                <div className={'text-end max-md:hidden md:text-6xl lg:text-9xl'}>Nairobi</div>
            </div>
            <SearchComponent/>
        </div>
    </section>
}

function SearchComponent() {
    return <div className={'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'}>
        <div className={'col-span-2 md:col-span-4 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}>
            <Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin'}
                   placeholder={'Where do you want to go?'}/></div>
        <div className={'col-span-2 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><DateComponent
            className={'w-full border-0 decoration-0 bg-transparent text-white font-thin'}/></div>
        <div className={'col-span-2 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input
            className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'}
            type={'number'} step={1} placeholder={'Guests'}/></div>
    </div>
}