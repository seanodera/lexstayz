'use client'
import {faker} from "@faker-js/faker";
import {AiOutlineMenu} from "react-icons/ai";
import {MdOutlineBathtub, MdOutlineDashboard, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";
import CustomDatePicker from "@/components/DatePicker";
import {useState} from "react";


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
        type: 'villa',
        location: {
            city: faker.location.city(),
            country: faker.location.country(),
        },
        poster: faker.image.urlLoremFlickr({category: 'HotelRoom'}),
        images: [faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'}), faker.image.urlLoremFlickr({category: 'HotelRoom'})]
    }
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    return <div className={'lg:px-24 px-7 py-24 bg-white text-dark'}>
        <h3 className={'font-semibold text-3xl mb-4'}>{stay.name}</h3>
        <div className={'rounded-2xl flex items-end justify-end p-8 aspect-square md:aspect-video  lg:aspect-20/7'} style={{
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
        <div className={'grid grid-cols-2 md:grid-cols-5 lg:grid-cols-3 gap-4 pt-8'}>
            <div className={'col-span-2 md:col-span-3 lg:col-span-2'}>
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

            </div>
            <div className={'max-md:hidden lg:ps-12 col-span-1 md:col-span-2 lg:col-span-1'}>
                <div className={'rounded-2xl flex flex-col gap-4 p-8 shadow-md bg-primary-50 text-dark'}>
                    <span className={'font-semibold text-xl'}>{'$'} {stay.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2, maximumFractionDigits: 2
                    })} <span className={'font-light text-sm'}>night</span></span>
                    <div className={'grid grid-cols-1 lg:grid-cols-2 rounded-xl'}>
                        <div className={'p-4 border border-black rounded-tl-xl max-lg:rounded-tr-xl'}><h6 className={'font-semibold'}>Check In</h6></div>
                        <div className={'p-4 border border-black lg:rounded-tr-xl'}><h6 className={'font-semibold'}>Check Out</h6></div>
                        <div className={'p-4 border border-black rounded-b-xl lg:col-span-2'}><h6 className={'font-bold'}>Guests</h6>
                        </div>
                    </div>
                    <div className={'rounded-xl text-center py-3 bg-primary text-white font-medium'}>Reserve</div>
                </div>

            </div>
        </div>
    </div>;
}