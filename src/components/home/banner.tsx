'use client'
import {Carousel, Divider, Rate} from "antd";
import {useAppSelector} from "@/hooks/hooks";

import {Stay} from "@/lib/types";
import Link from "next/link";
import {selectAllStays} from "@/slices/staysSlice";
import SearchComponent from "@/components/home/searchComponent";


export default function Banner() {
    const stays = useAppSelector(selectAllStays);
    return (
        <section className={'relative'}>
            <Carousel arrows autoplay>
                {stays.slice(0, 3).map((stay: Stay, index: number) => (
                    <div key={index}>
                        <div
                            className={'bg-center bg-cover w-screen aspect-[10/15] md:aspect-[10/8] lg:aspect-[18/7]'}
                            style={{
                                backgroundImage: `url("${stay.poster}")`,
                            }}>
                            <div
                                className={'h-full w-full flex flex-col justify-end text-white bg-dark bg-opacity-30 pt-24 pb-16 md:px-12 px-7 '}>
                                <div className={'md:w-1/2 lg:w-1/3'}>
                                    <h1 className={'md:text-2xl lg:text-5xl mb-0'}>{stay.name}</h1>
                                    <h2 className={'font-light text-gray-200 line-clamp-1 mb-0'}>
                                        {stay.location.city}, {stay.location.country}
                                    </h2>
                                    <div className={'flex gap-2 items-center'}>
                                        <h3 className={'mb-0 text-gray-300'}>{stay.type}</h3>
                                        <Divider className={'bg-white'} type={'vertical'}/>
                                        <Rate disabled defaultValue={3} className={'h3 mb-0'}/>
                                    </div>
                                    <p className={'line-clamp-5'}>{stay.description}</p>
                                    <div>
                                        <Link href={`/stay/${stay.id}`}
                                              className={'block bg-primary rounded px-4 py-2 w-max text-white z-40'}>See
                                            More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </Carousel>
            <div className="absolute max-xl:hidden top-1/2 left-1/4 flex items-center justify-center z-10">
                <SearchComponent/>
            </div>
        </section>
    );
}
