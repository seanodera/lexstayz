'use client'

import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Button, DatePicker, InputNumber} from "antd";
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from "dayjs";
import {selectConfirmBooking, updateBookingData} from "@/slices/confirmBookingSlice";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {MdPersonOutline} from "react-icons/md";
import {useEffect, useState} from "react";

const { RangePicker } = DatePicker;

export default function StayDate() {
    const dispatch = useAppDispatch();
    const booking = useAppSelector(selectConfirmBooking)
    const [numGuests, setNumGuests] = useState(booking.numGuests);
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);


    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current < dayjs().subtract(1,'day').endOf('day');
    };
    useEffect(() => {
        dispatch(updateBookingData({
            numGuests: numGuests,
            checkInDate: startDate,
            checkOutDate: endDate,
        }))
    }, [numGuests,startDate,endDate])
    return (
        <div className="bg-primary-50 rounded-2xl p-4 my-4 shadow-md">
            <div className="flex max-md:flex-col gap-4">
                <div className="">
                    <RangePicker
                    disabledDate={disabledDate}
                    size={'large'}
                    format={'DD MMMM YYYY'}
                    className={'border border-gray-500 rounded-xl py-2 px-3 bg-transparent'}
                    value={[dayjs(booking.checkInDate),dayjs(booking.checkOutDate)]}
                    onChange={(value) => {
                    if (value) {

                        setStartDate(dayjs(value[0]).toString())
                        setEndDate(dayjs(value[1]).toString())
                    }
                }}
                    />

                </div>
                <Popover className="relative" >
                    <PopoverButton
                        as={Button}
                        size={'large'} className={'bg-transparent text-current max-md:rounded-lg border-black w-max'}>
                        <MdPersonOutline className={'text-lg'} /> {numGuests} Guests</PopoverButton>

                    <PopoverPanel anchor="bottom" className="flex flex-col p-4 z-20 shadow-xl rounded-xl ">
                        <div className={'grid grid-cols-2 bg-white items-center justify-center rounded-xl gap-2 px-8 py-4'}>
                            <h4>Guests</h4>
                            <div>
                                <InputNumber
                                    className={' rounded-lg'}
                                    value={numGuests}
                                    onChange={(value) => setNumGuests(value ? value : 0)}
                                    min={1}
                                />
                            </div>

                        </div>
                    </PopoverPanel>
                </Popover>
                <Button size={'large'} type={'primary'}>Check Availability</Button>
            </div>
        </div>
    );
}
