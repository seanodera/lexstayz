'use client'
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {useState} from "react";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import '@/styles/datepicker.css';
import {addDays} from "date-fns";
import {AiOutlineCalendar} from "react-icons/ai";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectDates} from "@/slices/staysSlice";


const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
};

const isDateUnavailable = (date: Date, unavailableDates: Date[]) => {
    return unavailableDates.some(unavailableDate => isSameDay(unavailableDate, date));
};


export default function DateComponent({className = '', onChange}: {
    className?: string,
    onChange?: (startDate: Date | null, endDate: Date | null | undefined) => void
}) {
    const today = new Date();
    const dates = useAppSelector(selectDates)
    const [startDate, setStartDate] = useState<Date | null>(new Date(dates.startDate));
    const [endDate, setEndDate] = useState<Date | null | undefined>(new Date(dates.endDate));
    const dispatch = useAppDispatch()



    const handleDateChange = (dates: [Date | null, Date | null]) => {
        const [start, end] = dates;
        setStartDate(start);
        setEndDate(end);
       // dispatch(updateDates({startDate: start, endDate: end}));
        if (onChange !== undefined) {
            onChange(start, end);
        }
    };

    console.log(dates)

    return <Popover className={'relative'}>
        <PopoverButton className={`flex items-center gap-3 ${className}`}><AiOutlineCalendar size={20}/> {startDate && endDate
            ? `${startDate?.toString()} - ${endDate?.toString()}`
            : 'Select dates'}</PopoverButton>
        <PopoverPanel anchor="bottom start" className="bg-white p-8 flex flex-col h-fit w-fit">
            <DatePicker selected={startDate}
                        onChange={handleDateChange}
                        startDate={(startDate !== null)? startDate : today}
                        endDate={(endDate !== null)? endDate : undefined}
                        selectsRange
                        inline
                        minDate={new Date()}
                        monthsShown={2}/>
        </PopoverPanel>
    </Popover>
}