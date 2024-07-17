'use client'
import React, { useState, useRef } from 'react';
import { Popover, Transition } from '@headlessui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import { addDays, differenceInCalendarDays } from 'date-fns';

interface CustomDatePickerProps {
    unavailableDates?: Date[];
}

const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

const isDateUnavailable = (date: Date, unavailableDates: Date[]) => {
    return unavailableDates.some(unavailableDate => isSameDay(unavailableDate, date));
};

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({ unavailableDates = [] }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);

        if (start && end) {
            const daysDiff = differenceInCalendarDays(end, start);
            let validRange = true;

            for (let i = 0; i <= daysDiff; i++) {
                const dayToCheck = addDays(start, i);
                if (isDateUnavailable(dayToCheck, unavailableDates)) {
                    validRange = false;
                    break;
                }
            }

            if (!validRange) {
                setStartDate(null);
                setEndDate(null);
            }
        }
    };

    const isDayDisabled = (date: Date) => {
        return date < new Date() || isDateUnavailable(date, unavailableDates);
    };


    return (
        <div className="relative inline-block">
            <Popover className="relative">
                {({ open }) => (
                    <>
                        <Popover.Button
                            className="border border-gray-300 rounded-md p-2 w-full text-left"
                        >
                            {startDate && endDate
                                ? `${startDate.toDateString()} - ${endDate.toDateString()}`
                                : 'Select dates'}
                        </Popover.Button>

                        <Transition
                            show={open}
                            as={React.Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-1"
                            enterTo="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-1"
                        >
                            <Popover.Panel
                                static
                                className="z-10 mt-2 w-screen max-w-md p-4 bg-white border border-gray-300 rounded-md shadow-md"
                            >
                                <DatePicker
                                    className={'flex gap-2'}
                                    selected={startDate}
                                    onChange={handleDateChange}
                                    // @ts-ignore
                                    startDate={startDate} endDate={endDate}
                                    selectsRange
                                    inline
                                    minDate={new Date()}
                                    monthsShown={2}
                                />
                            </Popover.Panel>
                        </Transition>
                    </>
                )}
            </Popover>
        </div>
    );
};

export default CustomDatePicker;
