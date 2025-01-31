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
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    differenceInDays,
    differenceInMonths, differenceInWeeks, differenceInYears,
    isAfter,
    isWithinInterval,
    parseISO
} from "date-fns";
import {Hotel} from "@/lib/types";

const {RangePicker} = DatePicker;

export default function ReservePanel({stay}: { stay: any }) {
    const globalCurrency = useAppSelector(selectGlobalCurrency)
    const exchangeRates = useAppSelector(selectExchangeRate)
    const booking = useAppSelector(selectConfirmBooking)
    const isMobile = useMediaQuery({maxWidth: 640});
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const [numGuests, setNumGuests] = useState(booking.numGuests);
    const [weeklyPrice, setWeeklyPrice] = useState<number>();
    const [monthPrice, setMonthPrice] = useState<number>();
    const [yearlyPrice, setYearlyPrice] = useState<number>();
    const dispatch = useAppDispatch()

    function calculatePrice(amount: number) {
        let price;
        if (exchangeRates[ stay.currency ] && stay.currency !== globalCurrency) {
            price = amount * 1.02 / exchangeRates[ stay.currency ]
        } else {
            price = amount
        }
        return toMoneyFormat(price);
    }

    useEffect(() => {
        // Start with `startDate` and iterate until we find an available date
        let strDate = new Date(startDate);
        console.log(stay.bookedDates)
        // Loop to find the next available `startDate`
        while (stay.bookedDates?.includes(strDate.toISOString().split("T")[ 0 ])) {
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

    // const [isWeek, setIsWeek] = useState(false);
    // const [isMonth, setIsMonth] = useState(false);
    // const [isYear, setIsYear] = useState(false);
    //
    // useEffect(() => {
    //     if (!startDate || !endDate) return;
    //
    //     setIsWeek(isAfter(endDate, addWeeks(startDate, 1)));
    //     setIsMonth(isAfter(endDate, addMonths(startDate, 1)));
    //     setIsYear(isAfter(endDate, addYears(startDate, 1)));
    //
    // }, [startDate, endDate]);



    useEffect(() => {
        if (!stay) return;
        let totalWeekly: number | undefined ;
        let totalMonthly: number | undefined ;
        let totalYearly: number | undefined ;
        const checkOutDate = endDate;
        const checkInDate = endDate;
        const years = differenceInYears(checkOutDate, checkInDate);
        const months = differenceInMonths(checkOutDate, checkInDate);
        const weeks = differenceInWeeks(checkOutDate, checkInDate);
        if (stay.type === 'Hotel' && booking.rooms) {
            // Sum up room prices
            totalWeekly = 0;
            totalMonthly = 0;
            totalYearly = 0;
            booking.rooms.forEach((value) => {
                const room = (stay as Hotel).rooms.find((room) => room.id === value.roomId);
                if (room) {
                    const {pricing} = room;
                    let basePrice = pricing?.base || room.price;
                    if (pricing?.weekly){
                        totalWeekly! += value.numRooms * (pricing?.weekly ?? basePrice);
                    }

                    if (pricing?.monthly){
                        totalMonthly! += value.numRooms * (pricing?.monthly ?? basePrice);
                    }

                    if (pricing?.yearly){
                        totalYearly! += value.numRooms * pricing.yearly;
                    }

                }
            });
        } else if (stay.type === 'Home') {
            // Sum up home prices
            const {pricing} = stay;
            let basePrice = pricing?.base || stay.price;
            if (pricing?.weekly){
                totalWeekly = pricing.weekly;
            }
            if (pricing?.monthly){
                totalMonthly = pricing.monthly;
            }
            if (pricing?.yearly){
                totalYearly = pricing.yearly;
            }
        }

        setWeeklyPrice(totalWeekly);
        setMonthPrice(totalMonthly);
        setYearlyPrice(totalYearly);
    }, [stay, booking]);


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
        if (stay.type === 'Home') {
            booked = stay.bookedDates?.includes(curr);
            if (booked) {
                console.log(stay.bookedDates.find((value: string) => value === curr), curr)
            }
        } else {
            booked = stay.fullyBookedDates?.includes(curr)
        }
        return booked || current.isBefore(dayjs().subtract(1, 'day'));
    };

    function disabledButton() {
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
        <h2 className={'font-bold text-xl'}>{globalCurrency} {calculatePrice(stay.price)} <span
            className={'text-sm font-normal'}>/ night</span>
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
        )}
        <hr/>
        <div className={'grid grid-cols-2'}>
            {weeklyPrice && (
                <div className={'col-span-2 grid grid-cols-2'}>
                    <h4 className={'text-gray-600'}>Weekly Price</h4>
                    <h4 className={'text-end'}>{globalCurrency} {calculatePrice(weeklyPrice)}</h4>
                </div>
            )}
            {monthPrice && (
                <div className={'col-span-2 grid grid-cols-2'}>
                    <h4 className={'text-gray-600'}>Monthly Price</h4>
                    <h4 className={'text-end'}>{globalCurrency} {calculatePrice(monthPrice)}</h4>
                </div>
            )}
            {yearlyPrice && (
                <div className={'col-span-2 grid grid-cols-2'}>
                    <h4 className={'text-gray-600'}>Yearly Price</h4>
                    <h4 className={'text-end'}>{globalCurrency} {calculatePrice(yearlyPrice)}</h4>
                </div>
            )}
            <h4 className={'text-gray-600'}>
                {yearlyPrice && differenceInYears(endDate, startDate) > 0
                    ? `${differenceInYears(endDate, startDate)} Years ${differenceInMonths(endDate, startDate) % 12} Months`
                    : monthPrice && differenceInMonths(endDate, startDate) > 0
                        ? `${differenceInMonths(endDate, startDate)} Months ${differenceInDays(endDate, addMonths(startDate, differenceInMonths(endDate, startDate)))} Nights`
                        : weeklyPrice && differenceInWeeks(endDate, startDate) > 0
                            ? `${differenceInWeeks(endDate, startDate)} Weeks ${differenceInDays(endDate, addWeeks(startDate, differenceInWeeks(endDate, startDate)))} Nights`
                            : `${booking.length} Nights`}
            </h4>
            <h4 className={'text-end'}>{globalCurrency} {toMoneyFormat(booking.subtotal)}</h4>
            <h4 className={'text-gray-600'}>LexStayz Fees</h4>
            <h4 className={'text-end'}>{globalCurrency} {toMoneyFormat(booking.fees)}</h4>
            <h3 className={'font-bold mt-4'}>Total</h3>
            <h3 className={'font-bold text-end mt-4'}>{globalCurrency} {toMoneyFormat(booking.grandTotal)}</h3>
        </div>
    </div>
}
