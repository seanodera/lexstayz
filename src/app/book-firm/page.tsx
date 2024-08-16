'use client'
import {Button, Card} from "antd";
import {BiChevronLeft} from "react-icons/bi";
import SpecialRequests from "@/components/booking-confirmation/specialRequests";
import ContactForm from "@/components/booking-confirmation/contactForm";
import {LeftOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {createBooking, handlePaymentAsync, selectConfirmBooking, setBookingStay} from "@/slices/confirmBookingSlice";
import {dateReader, toMoneyFormat} from "@/lib/utils";
import {selectCurrentStay} from "@/slices/staysSlice";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {count} from "@firebase/firestore";
import {differenceInDays} from "date-fns";
import {generateID} from "@/data/bookingData";
import axios from "axios";


export default function BookFirmPage() {
    const booking = useAppSelector(selectConfirmBooking)
    const stay = useAppSelector(selectCurrentStay)
    const router = useRouter()
    const [length, setLength] = useState(0);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (!stay) {
            router.push('/');
        }
        const user = getAuth().currentUser;
        if (!user) {
            router.push('/login');
        }

    });
    useEffect(() => {
        dispatch(setBookingStay(stay))
        setLength(differenceInDays(booking.checkOutDate, booking.checkInDate));
    }, [booking.checkInDate, booking.checkOutDate]);

    if (!booking || !stay) {
        return <div></div>;
    }


    async function handleConfirm() {
        // const id = generateID()
        // const testResponse = await axios.post('/api/createCharge', {
        //     email: booking.contact.email, amount: booking.totalPrice,  reference:id
        // })
        // console.log(testResponse)

        dispatch(handlePaymentAsync({preserve: true})).then((value: any) => {
            if (value.meta.requestStatus === 'fulfilled'){
                router.push(value.payload)
            } else {
                // messageApi.error(value.payload)
            }
            const errObj = {
                "type": "confirmBooking/handlePaymentAsync/rejected",
                "payload": "An error occurred. Please try again. AxiosError: Request failed with status code 400",
                "meta": {
                    "requestId": "oCMUSpkxfyB6kukDNDz5e",
                    "rejectedWithValue": true,
                    "requestStatus": "rejected",
                    "aborted": false,
                    "condition": false
                },
                "error": {
                    "message": "Rejected"
                }
            }
            const successObj = {
                "type": "confirmBooking/handlePaymentAsync/fulfilled",
                "payload": "https://checkout.paystack.com/pm2dcx9va7dbdqe",
                "meta": {
                    "requestId": "OUpeWvkm0ndDGy2sxzw93",
                    "requestStatus": "fulfilled"
                }
            }

        })

        // dispatch(createBooking({
        //     id: id, paymentData: {}
        // })).then(action => {
        //     console.log(action);
        //     // router.push('/bookings');
        // })
    }

    return (
        <div>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 '}>
                <div className={'md:col-span-2'}>
                    <Card className={'md:px-20 pb-16 rounded-none'}>
                        <Button type={'text'} icon={<LeftOutlined/>} onClick={() => router.back()}>Stay</Button>
                        <div className={'py-8'}>
                            <ContactForm/>
                        </div>
                        <div className={'border-solid border-gray-200 p-4 rounded-xl my-8'}>
                            <h3 className={'font-semibold'}>Cancellation Policy</h3>
                            <p className={''}>Free Cancellation Before nov 30</p>
                            <p>After that,the reservation is non-refundable</p>

                            <hr className={'my-8'}/>

                            <h3 className={'font-semibold'}>Ground Rules</h3>
                            <p>We request guests to remember a few simple things about what makes a good guests</p>
                            <ul>
                                <li>Follow the house rules</li>
                                <li>Treat the home as your own</li>
                            </ul>

                        </div>
                        <SpecialRequests/>
                    </Card>
                </div>
                <div className={'md:pe-16'}>
                    <Card className={'bg-transparent'} classNames={{
                        body: 'space-y-4'
                    }}>
                        <div className={'rounded-xl'} style={{
                            backgroundImage: 'url("' + stay.poster + '")',
                            backgroundSize: 'cover',
                        }}>
                            <div
                                className={'rounded-xl bg-dark bg-opacity-50 aspect-video p-4 flex flex-col justify-end'}>
                                <div>
                                    <div
                                        className={'text-white font-medium'}>{stay.name} | {stay.location?.city},{stay.location?.country}</div>
                                    <div
                                        className={'flex text-gray-200'}>{stay.beds} Beds &bull; {stay.bathrooms} Bath &bull; {stay.bedrooms} Bedrooms
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3>Your Trip Summary</h3>
                            <hr/>
                            <div className={'grid grid-cols-2 gap-2 '}>
                                <div className={'mb-0 text-gray-500'}>Check-in</div>
                                <div className={'mb-0 text-end'}>{dateReader({
                                    date: booking.checkInDate,
                                    weekDay: true
                                })}</div>
                                <div className={'mb-0 text-gray-500'}>Check-out</div>
                                <div className={'mb-0 text-end'}>{dateReader({
                                    date: booking.checkOutDate,
                                    weekDay: true
                                })}</div>
                                <div className={'mb-0 text-gray-500'}>Guests</div>
                                <div className={'mb-0 text-end'}>{booking.numGuests} Adults</div>
                            </div>
                        </div>

                        <div>
                            <h3>Pricing Breakdown</h3>
                            <hr/>
                            <div className={'grid grid-cols-2 gap-2 '}>
                                <div className={'mb-0 text-gray-500'}>Price X <span
                                    className={'text-dark'}>{booking.length} night</span></div>
                                <div className={'text-end'}>
                                    <div className={'mb-0'}>{stay.currency} {toMoneyFormat(stay.price)}</div>
                                    <div
                                        className={'mb-0 text-primary'}>{stay.currency} {toMoneyFormat(booking.totalPrice)}</div>
                                </div>
                                <div className={'mb-0 text-gray-500'}>Booking Fees</div>
                                <div
                                    className={'mb-0 text-end'}>{stay.currency} {toMoneyFormat(0.035 * booking.totalPrice)}</div>
                                <hr className={'col-span-2 w-full'}/>
                                <div className={'mb-0 text-lg font-medium'}>Total</div>
                                <div
                                    className={'mb-0 text-lg text-end font-medium'}>{stay.currency} {toMoneyFormat(1.035 * booking.totalPrice)}</div>
                            </div>
                        </div>
                        <Button block type={'primary'} size={'large'} onClick={handleConfirm}>Confirm</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}