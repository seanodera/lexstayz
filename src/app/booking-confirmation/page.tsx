import {faker} from "@faker-js/faker";
import ContactForm from "@/components/booking-confirmation/contactForm";
import Link from "next/link";
import SpecialRequests from "@/components/booking-confirmation/specialRequests";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {addDays} from "date-fns";


export default function Page() {
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
    let date = new Date();
    return (<div className={'bg-white py-24 lg:px-16 px-7 text-dark'}>
        <div className={'grid grid-cols-1 lg:grid-cols-4 max-lg:gap-8 gap-4 '}>
            <div className={'col-span-1 lg:col-span-3 flex flex-col gap-8'}>
                <div className={'border border-gray-200 rounded-xl p-8 shadow-md'}>
                    <ContactForm/>
                </div>
                <div className={'border border-gray-200 rounded-xl p-8 shadow-md'}><SpecialRequests/></div>
                <Link href={'/checkout'}
                      className={'hidden max-lg:block py-3 text-center bg-primary rounded-xl font-medium text-white'}>Checkout</Link>
            </div>
            <div className={'col-span-1 lg:col-span-1 flex flex-col gap-8 max-lg:order-first'}>
                <div className={'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 lg:gap-8 gap-4'}>
                    <div className={'border border-gray-200 rounded-xl p-4 shadow-md col-span-1 md:col-span-2 lg:col-span-1 max-lg:grid grid-cols-10 gap-2'}>
                        <img src={stay.poster} className={'rounded-xl aspect-square md:aspect-video object-cover md:mb-4 max-lg:col-span-3'} alt={stay.name}/>
                        <div className={'max-lg:col-span-7 max-lg:flex flex-col justify-center'}>
                            <h3 className={'text-xl font-semibold'}>{stay.name}</h3>
                            <h3 className={'font-light text-gray-400 line-clamp-1'}>{stay.location.city}, {stay.location.country}</h3>
                        </div>
                    </div>
                    <div className={'border border-gray-200 rounded-xl p-4 shadow-md shadow-primary'}>
                        <h3 className={'text-xl font-semibold'}>Your Booking Details</h3>
                        <div className={'grid grid-cols-2 gap-2 mt-2 mb-4'}>
                            <div className={'font-medium'}>Check In</div>
                            <div className={'font-medium'}>Check out</div>
                            <div className={'border rounded-xl p-2 font-bold text-lg'}>
                                {dateReader({date: date})}
                                <div className={'text-sm text-gray-500 font-medium'}>From 14:00</div>
                            </div>
                            <div className={'border rounded-xl p-2 font-bold text-lg'}>
                                {dateReader({date: addDays(date, 1)})}
                                <div className={'text-sm text-gray-500 font-medium'}>Until 12:00</div>
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
                        <Link href={`/stay/${stay.id}`}
                              className={'block text-primary text-center py-2 hover:bg-primary hover:text-white my-2 rounded-xl'}>Change
                            Selection</Link>
                    </div>
                    <div className={'border border-gray-200 rounded-xl p-4 shadow-md shadow-primary'}>
                        <h3 className={'text-xl font-semibold'}>Price Summary</h3>
                        <div className={'grid grid-cols-2'}>
                            <div className={'font-medium text-gray-500'}>Subtotal</div>
                            <div className={'font-medium text-end'}>$ {toMoneyFormat(4 * stay.price)}</div>

                            <div className={'font-medium text-gray-500'}>Booking fees</div>
                            <div className={'font-medium text-end'}>$ {toMoneyFormat(4 * stay.price * 0.035)}</div>

                            <hr className={'col-span-2 my-4'}/>

                            <div className={'font-medium text-xl'}>Total</div>
                            <div
                                className={'font-medium text-xl text-end'}>$ {toMoneyFormat((4 * stay.price * 1.035))}</div>
                        </div>

                    </div>
                    <Link href={'/checkout'}
                          className={'block max-lg:hidden py-3 text-center bg-primary rounded-xl font-medium text-white'}>Checkout</Link>
                </div>
            </div>
        </div>
    </div>)
}