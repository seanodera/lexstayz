'use client'
import {faker} from "@faker-js/faker";
import {MdOutlineBathtub, MdOutlineDashboard, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";
import {useState} from "react";
import RoomComponent from "@/components/roomComponent";
import DateComponent from "@/components/DateComponent";
import Link from "next/link";


export default function Stay() {
    const stay = {
        id: 0,
        name: 'The ' + faker.person.lastName() + ' Inn',
        price: faker.number.int({max: 1000}),
        rating: faker.number.int({max: 1000}) / 100,
        bath: faker.number.int({max: 10}),
        bed: faker.number.int({max: 10}),
        maxGuests: faker.number.int({max: 10}),
        description: faker.lorem.paragraphs(8),
        type: 'hotel',
        rooms: [
            {
                id: 0,
                name: 'Garden Room',
                poster: faker.image.urlLoremFlickr({category: 'gardenRoom'}),
                maxGuests: 4,
                beds: [
                    {
                        number: 1,
                        type: 'King'
                    },
                    {
                        number: 2,
                        type: 'Single'
                    },
                    {
                        number: 1,
                        type: 'Double'
                    }
                ],
                amenities: ['pool', 'beach', 'Air Conditioning'],
                price: 380.56,
                discounted: true,
                discount: {
                    oldPrice: 400,
                    dealId: 0,
                    message: ''
                },
                available: 10,
            }
        ],
        location: {
            city: faker.location.city(),
            country: faker.location.country(),
        },
        poster: faker.image.urlLoremFlickr({category: 'HotelRoom'}),
        images: [faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'})]
    }


    return <div className={'lg:px-24 px-7 py-24 bg-white text-dark'}>
        <h3 className={'font-semibold text-3xl mb-4'}>{stay.name}</h3>
        <div className={'rounded-2xl flex items-end justify-end p-8 aspect-video  lg:aspect-20/7'}
             style={{
                 backgroundImage: `url("${stay.poster}")`,
                 backgroundSize: 'cover',
                 backgroundRepeat: 'no-repeat',
                 backgroundPosition: 'center',
             }}>
            <div
                className={'rounded-xl px-3 py-1 text-nowrap flex gap-2 bg-white text-dark items-center text-lg border-dark'}>
                <MdOutlineDashboard/> Show all photos
            </div>
        </div>
        <div className={'grid grid-cols-2 lg:grid-cols-3 gap-4 pt-8'}>
            <div className={'col-span-2'}>
                <h3 className={'font-semibold text-xl'}>{stay.type} in {stay.location.city}, {stay.location.country}</h3>
                <div className={'flex items-center my-4'}>
                    <span
                        className={'flex items-center gap-2 font-light pe-3 md:border-e border-gray-400'}><MdPersonOutline/> {stay.maxGuests} Guests</span>
                    <span
                        className={'flex items-center gap-2 font-light px-3 md:border-e border-gray-400'}><IoBedOutline/> {stay.bed} Beds</span>
                    <span
                        className={'flex items-center gap-2 font-light px-3'}><MdOutlineBathtub/> {stay.bath} Baths</span>
                </div>

                <div className={'py-4 border-t border-b border-gray-500 '}>
                    <p className={'max-lg:line-clamp-5 '}>{stay.description}</p>
                </div>

                <div className={'bg-primary-50 rounded-2xl p-4 my-4 shadow-md'}>
                    <div className={'text-xl font-semibold mb-1'}>Date</div>
                    <div className={'flex max-md:flex-col gap-4'}>
                        <div className={'border border-gray-500 rounded-xl py-2 px-3'}>
                            <DateComponent onChange={(startDate, endDate) => {
                            }}/>
                        </div>
                        {/*<div className={'border border-gray-500 rounded-xl py-2 px-3'}>*/}
                        {/*    <GuestComponent/>*/}
                        {/*</div>*/}

                        <div className={'shadow-md rounded-xl bg-primary py-2 px-3 text-white'}>Check Availability</div>
                    </div>
                </div>

                <div>
                    <h3 className={'text-2xl font-semibold my-2'}>Available Rooms</h3>
                    <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}>
                        {stay.rooms.map((room, index) => <RoomComponent room={room} stay={stay} key={index}/>)}
                    </div>
                </div>

                <div>
                    <h3 className={'text-2xl font-semibold my-2'}>Reviews</h3>
                    <div className={'grid grid-cols-1 md:grid-cols-2 gap-8'}></div>
                </div>
            </div>
            <div className={'max-lg:hidden lg:ps-12 col-span-1 md:col-span-2 lg:col-span-1'}>
                <div className={'mb-4'}>
                    <h3 className={'text-2xl font-semibold mb-2'}>Featured Room</h3>
                    {stay.rooms.slice(0, 1).map((room, index) => <RoomComponent room={room} stay={stay} key={index}
                                                                                className={'shadow-md bg-primary-50 text-dark rounded-2xl p-4'}/>)}
                </div>
                <div className={''}>
                    <h3 className={'text-2xl font-semibold mb-2'}>Cart</h3>
                    <div className={'rounded-2xl bg-dark text-white p-4'}>
                        <Link href={'/checkout'} className={'block rounded-xl text-center py-3 bg-primary text-white font-medium w-full'}>Confirm Reservation
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </div>;
}

