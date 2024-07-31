'use client'
import DateComponent from "@/components/DateComponent";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {Button, DatePicker} from "antd";
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from "dayjs";
import {selectDates, updateDates} from "@/slices/staysSlice";
import {selectConfirmBooking, updateBookingData} from "@/slices/confirmBookingSlice";

const { RangePicker } = DatePicker;

export default function StayDate() {
    const dispatch = useAppDispatch();
    const booking = useAppSelector(selectConfirmBooking)
    const dates = useAppSelector(selectDates)
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current < dayjs().subtract(1,'day').endOf('day');
    };
    return (
        <div className="bg-primary-50 rounded-2xl p-4 my-4 shadow-md">
            <div className="text-xl font-semibold mb-1">Date</div>
            <div className="flex max-md:flex-col gap-4">
                <div className="">
                    <RangePicker
                    disabledDate={disabledDate}
                    size={'large'}
                    className={'border border-gray-500 rounded-xl py-2 px-3 bg-transparent'}
                    value={[dayjs(dates.startDate),dayjs(dates.endDate)]}
                    onChange={(value) => {
                    if (value) {
                        dispatch(updateDates({
                            startDate: dayjs(value[0]).toString(),
                            endDate: dayjs(value[1]).toString(),
                            length: 0
                        }))
                        dispatch(updateBookingData({
                            numGuests: booking.numGuests,
                            checkInDate: dayjs(value[0]).toString(),
                            checkOutDate: dayjs(value[1]).toString(),
                        }))
                    }
                }}
                    />

                </div>
                <Button size={'large'} type={'primary'}>Check Availability</Button>
            </div>
        </div>
    );
}
