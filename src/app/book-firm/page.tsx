'use client'
import {Button, Card} from "antd";
import {BiChevronLeft} from "react-icons/bi";
import SpecialRequests from "@/components/booking-confirmation/specialRequests";
import ContactForm from "@/components/booking-confirmation/contactForm";
import {LeftOutlined} from "@ant-design/icons";
import Link from "next/link";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {
    convertCart,
    createBooking,
    fetchExchangeRates,
    handlePaymentAsync,
    selectConfirmBooking,
    setBookingStay
} from "@/slices/confirmBookingSlice";
import {dateReader, getExchangeRate, getFeePercentage, toMoneyFormat} from "@/lib/utils";
import {selectCurrentStay} from "@/slices/staysSlice";
import {useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import {getAuth} from "firebase/auth";
import {count} from "@firebase/firestore";
import {differenceInDays} from "date-fns";
import {generateID} from "@/data/bookingData";
import axios from "axios";
import PaymentMethods from "@/components/confirm-booking/paymentMethods";
import CancellationPolicy from "@/components/booking-confirmation/cancellationPolicy";
import {selectCart} from "@/slices/bookingSlice";


export default function BookFirmPage() {
    const booking = useAppSelector(selectConfirmBooking)
    const stay = useAppSelector(selectCurrentStay)
    const router = useRouter()
    const [length, setLength] = useState(0);
    const dispatch = useAppDispatch();
    const [loading, setLoading] = useState(false);
    const cart = useAppSelector(selectCart);

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





    useEffect(() => {
        dispatch(convertCart(cart));
    }, [cart]);

    if (!booking || !stay) {
        return <div></div>;
    }

    function calculatePrice(amount: number) {
        let price = 0
        if (booking.exchangeRates[ stay.currency ] && stay.currency !== booking.currency) {
            price = amount * 1.02 / booking.exchangeRates[ stay.currency ]
        } else {
            price = amount
        }
        return toMoneyFormat(price);
    }

    async function handleConfirm() {
        setLoading(true)


        dispatch(handlePaymentAsync({preserve: true})).then((value: any) => {
            setLoading(false)
            if (value.meta.requestStatus === 'fulfilled') {

                router.push(value.payload)

            } else {
                // messageApi.error(value.payload)
            }
        })


    }

    console.log(booking, stay)

    if (loading || !stay.id) {
        return <div className={'flex flex-col items-center justify-center h-full w-full min-h-96 bg-white'}>
            <div className={'loader-circle w-12'}></div>
        </div>
    }
    return (
        <div>
            <div className={'grid grid-cols-1 md:grid-cols-3 gap-2 '}>
                <div className={'md:col-span-2'}>


                    <Card className={'md:px-20 pb-16 rounded-none'}>
                        <Button size={'large'} type={'text'} icon={<LeftOutlined/>}
                                onClick={() => router.back()}>Stay</Button>

                        <div className={'border-solid border-gray-200 p-4 rounded-xl my-8'}>
                            <PaymentMethods/>
                        </div>
                        <div className={'py-8'}>
                            <ContactForm/>
                        </div>
                        <CancellationPolicy stay={stay}/>
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
                                {stay.type !== 'Hotel' && <div className={'mb-0 text-gray-500'}>Price X <span
                                    className={'text-dark'}>{booking.length} night</span></div>}
                                {stay.type !== 'Hotel' && <div className={'text-end'}>
                                    <div
                                        className={'mb-0'}>{booking.currency} {toMoneyFormat(stay.price * booking.usedRate)}</div>
                                    <div
                                        className={'mb-0 text-primary'}>{booking.currency} {toMoneyFormat(booking.subtotal)}</div>
                                </div>}
                                {booking.rooms.map((cartItem: any, index: number) => <div key={index} className={'col-span-2 grid grid-cols-2'}>
                                    <div
                                        className="capitalize text-gray-500">{stay.rooms.find((value: any) => value.id === cartItem.roomId).name}</div>
                                    <div
                                        className="capitalize text-end">{booking.currency} {calculatePrice(cartItem.numRooms * stay.rooms.find((value: any) => value.id === cartItem.roomId).price)}</div>
                                </div>)}
                                <div className={'mb-0 text-gray-500'}>Booking Fees</div>
                                <div
                                    className={'mb-0 text-end'}>{booking.currency} {toMoneyFormat(booking.fees)}</div>
                                <hr className={'col-span-2 w-full'}/>
                                <div className={'mb-0 text-lg font-medium'}>Total</div>
                                <div
                                    className={'mb-0 text-lg text-end font-medium'}>{booking.currency} {toMoneyFormat(booking.grandTotal)}</div>

                            </div>
                        </div>
                        {booking.currency !== booking.paymentCurrency? <div>
                            <small className={'italic text-gray-400 text-center block'}>We currently only accept
                                payments in {booking.paymentCurrency}</small>
                            <div
                                className={'text-primary text-center font-medium h4 my-2 '}> 1 {booking.currency} = {toMoneyFormat(booking.paymentRate)} {booking.paymentCurrency}</div>
                            <div className={'text-lg font-medium'}>You will Pay</div>
                            <div
                                className={'text-xl font-bold'}>{booking.paymentCurrency} {toMoneyFormat(booking.grandTotal * booking.paymentRate)}</div>
                        </div> : <div>
                            <div className={'text-lg font-medium'}>You will Pay</div>
                            <div
                                className={'text-xl font-bold'}>{booking.currency} {toMoneyFormat(booking.grandTotal)}</div>
                        </div>}
                        <Button block type={'primary'} size={'large'} onClick={handleConfirm}>Confirm</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}