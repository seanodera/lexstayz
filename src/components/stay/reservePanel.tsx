'use client'
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectExchangeRate, selectGlobalCurrency} from "@/slices/staysSlice";
import {toMoneyFormat} from "@/lib/utils";
import {selectConfirmBooking, updateBookingData} from "@/slices/confirmBookingSlice";
import dayjs from "dayjs";
import {Button, DatePicker} from "antd";
import {useMediaQuery} from "react-responsive";
import {useEffect, useState} from "react";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import Link from "next/link";
import {RangePickerProps} from "antd/es/date-picker";
import {addDays, isAfter, isWithinInterval, parseISO} from "date-fns";

const { RangePicker } = DatePicker;

export default function ReservePanel({stay}: {stay: any}) {
    const globalCurrency = useAppSelector(selectGlobalCurrency)
    const exchangeRates = useAppSelector(selectExchangeRate)
    const booking = useAppSelector(selectConfirmBooking)
    const isMobile = useMediaQuery({maxWidth: 640});
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const [numGuests, setNumGuests] = useState(booking.numGuests);
    const dispatch = useAppDispatch()

    function calculatePrice (){
        let price;
        if (exchangeRates[stay.currency] && stay.currency !== globalCurrency){
            price = stay.price * 1.02 / exchangeRates[stay.currency]
        } else {
            price = stay.price
        }
        return toMoneyFormat(price);
    }

    useEffect(() => {
        // Start with `startDate` and iterate until we find an available date
        let strDate = new Date(startDate);
        console.log(stay.bookedDates)
        // Loop to find the next available `startDate`
        while (stay.bookedDates?.includes(strDate.toISOString().split("T")[0])) {
            console.log(strDate.toISOString())
            strDate = addDays(strDate, 1); // Add one day
        }

        // Update the startDate to the available one
        setStartDate(strDate.toISOString());

        // Ensure `endDate` is after the new `startDate`
        if (!isAfter(new Date(endDate), strDate)) {
            const newEndDate = addDays(strDate, 1); // Default end date to one day after the new start date
            setEndDate(newEndDate.toISOString());
        }
    }, []);

    useEffect(() => {
        dispatch(updateBookingData({
            numGuests: numGuests,
            checkInDate: startDate,
            checkOutDate: endDate,
        }));
    }, [numGuests, startDate, endDate, dispatch]);
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        const curr = current.toISOString().split('T')[ 0 ]

        let booked;
        if (stay.type === 'Home'){
            booked = stay.bookedDates?.includes(curr);
            if (booked){
                console.log(stay.bookedDates.find((value:string) => value === curr), curr)
            }
        } else {
            booked = stay.fullyBookedDates?.includes(curr)
        }
        return booked || current.isBefore(dayjs().subtract(1,'day'));
    };

    function disabledButton (){
        let booked: boolean;
        const checkInDate = startDate;
        const checkOutDate = endDate;

        if (stay.type === "Home") {
            booked = stay.bookedDates?.some((date: string) =>
                isWithinInterval(parseISO(date), {
                    start: parseISO(checkInDate),
                    end: parseISO(checkOutDate),
                })
            );
        } else {
            booked = stay.fullyBookedDates?.some((date: string) =>
                isWithinInterval(parseISO(date), {
                    start: parseISO(checkInDate),
                    end: parseISO(checkOutDate),
                })
            );
        }
        return booked;
    }
    return <div className={'space-y-4'}>
        <h2 className={'font-bold text-xl'}>{globalCurrency} {calculatePrice()} <span className={'text-sm font-normal'}>/ night</span>
        </h2>
        <RangePicker
            panelRender={(panelNode) => (
                <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
                    {panelNode}
                </div>
            )}
            value={[dayjs(booking.checkInDate), dayjs(booking.checkOutDate)]}
            disabledDate={disabledDate}
            onChange={(value) => {
                if (value) {
                    setStartDate(dayjs(value[ 0 ]).toString());
                    setEndDate(dayjs(value[ 1 ]).toString());
                }
            }}
            className=" placeholder-gray-200 bg-opacity-75 rounded-lg  py-2 w-full"
            format="DD MMMM"
            placeholder={["Check-in", "Check-out"]}
            popupClassName=""
        />
        <div
            className={' text-dark w-full placeholder-gray-200 rounded-lg border-solid border-gray-300 flex justify-between items-center  py-2 px-2 gap-2 font-thin'}>
            <Button className={'border-dark text-current'} shape={'circle'} ghost icon={<MinusOutlined/>} size={'small'}
                    onClick={() => setNumGuests((prev) => prev > 1 ? prev - 1 : prev)}/>
            {booking.numGuests} Guests
            <Button className={'border-dark text-current'} shape={'circle'} ghost size={'small'}
                    onClick={() => setNumGuests((prev) => prev + 1)}
                    icon={<PlusOutlined/>}
            />
        </div>
        {!disabledButton() ? (
            <Link href={'/book-firm'} className={'block'}>
                <Button type={'primary'} block size={'large'}>
                    Book Now
                </Button>
            </Link>
        ) : (
            <Button disabled={true} type={'primary'} block size={'large'}>
                Book Now
            </Button>
        )}<hr/>
        <div className={'grid grid-cols-2'}>
            <h4 className={'text-gray-600'}>{booking.length} Nights</h4>
            <h4 className={'text-end'}>{globalCurrency} {toMoneyFormat(booking.subtotal)}</h4>
            <h4 className={'text-gray-600'}>LexStayz Fees</h4>
            <h4 className={'text-end'}>{globalCurrency} {toMoneyFormat(booking.fees)}</h4>
            <h3 className={'font-bold mt-4'}>Total</h3>
            <h3 className={'font-bold text-end mt-4'}>{globalCurrency} {toMoneyFormat(booking.grandTotal)}</h3>
        </div>
    </div>
}
