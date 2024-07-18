import {faker} from "@faker-js/faker";
import ContactForm from "@/components/checkout/contactForm";
import Link from "next/link";
import SpecialRequests from "@/components/checkout/specialRequests";


export default function CheckoutPage() {
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
    return (<div className={'bg-white py-24 px-16 text-dark'}>
        <div className={'grid grid-cols-1 lg:grid-cols-4 lg:gap-4 max-md:flex-row-reverse'}>
            <div className={'col-span-1 lg:col-span-3 flex flex-col gap-8'}>
                <div className={'border border-gray-200 rounded-xl p-8 shadow-md'}>
                    <ContactForm/>
                </div>
                <div className={'border border-gray-200 rounded-xl p-8 shadow-md'}><SpecialRequests/></div>
            </div>
            <div className={'col-span-1 lg:col-span-1 flex flex-col gap-8'}>
                <div className={'border border-gray-200 rounded-xl p-4 shadow-md'}>
                    <img src={stay.poster} className={'rounded-xl aspect-video object-cover mb-4'}/>
                    <h3 className={'text-xl font-semibold'}>{stay.name}</h3>
                    <h3 className={'font-light text-gray-400 line-clamp-1'}>{stay.location.city}, {stay.location.country}</h3>
                </div>
                <div className={'border border-gray-200 rounded-xl p-4 shadow-md shadow-primary'}>
                    <h3 className={'text-xl font-semibold'}>Your Booking Details</h3>
                    <div className={'grid grid-cols-2 gap-2 mb-4'}>
                        <div className={'font-medium'}>Check In</div>
                        <div className={'font-medium'}>Check out</div>
                        <div className={'border rounded-xl p-2'}>

                        </div>
                        <div className={'border rounded-xl p-2'}>

                        </div>
                    </div>
                    <div className={'font-medium'}>Length of Stay</div>
                    <div className={'font-bold'}>5 Nights</div>

                    <hr className={'my-2'}/>
                    <h3 className={'text-xl font-semibold mb-2'}>Your Rooms</h3>
                    <div className={'text-lg font-medium'}>4 rooms for 8 adults</div>
                    <div className={'ps-4'}>
                        <span className={'text-primary'}>4</span> x Garden Room
                    </div>
                    <Link href={`/stay/${stay.id}`} className={'block w-full text-primary text-center py-2 hover:bg-primary hover:text-white my-2 rounded-xl'}>Change Selection</Link>
                </div>

            </div>
        </div>
    </div>)
}