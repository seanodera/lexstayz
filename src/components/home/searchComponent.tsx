'use client'
import {Button, DatePicker, Input, InputNumber, Space} from "antd";
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from "dayjs";
import {SearchOutlined} from "@ant-design/icons";
import {useEffect, useState} from "react";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {MdPersonOutline} from "react-icons/md";
import {BsRecordFill} from "react-icons/bs";
import {useAppDispatch} from "@/hooks/hooks";
import {updateBookingData} from "@/slices/confirmBookingSlice";
import {en} from "@faker-js/faker";
import {updateDates} from "@/slices/staysSlice";

const { RangePicker } = DatePicker;

export default function SearchComponent(){
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        // Can not select days before today and today
        return current < dayjs().subtract(1,'day').endOf('day');
    };

    const [searchTerms, setSearchTerms] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [numRooms, setNumRooms] = useState(1);
    const [numGuests, setNumGuests] = useState(2);
    const dispatch = useAppDispatch()
    useEffect(( )=> {
        dispatch(updateBookingData({
            numGuests:numGuests,
            checkInDate: startDate,
            checkOutDate: endDate,
        }))
        dispatch(updateDates({
            length: 0,
            startDate:startDate,
            endDate: endDate,
        }))
    }, [numGuests,startDate,endDate])

    return (
        <div className={'py-8 md:px-24 xl:p-0 px-7 flex justify-center w-full'}>
            <Space.Compact className={'xl:bg-black max-xl:bg-white xl:bg-opacity-60 xl:text-white rounded-lg xl:w-full max-md:flex max-md:flex-col max-md:w-full max-md:space-y-4'}>
                <Input
                    className={'md:w-1/3 bg-transparent xl:text-white rounded-l-lg max-md:rounded-lg'}
                    classNames={{
                        input: 'bg-transparent xl:text-white xl:placeholder-gray-400',

                    }}
                    size={'large'}
                    placeholder={'where are you going?'}
                />
                <RangePicker
                    disabledDate={disabledDate}
                    size={'large'}
                    className={'md:w-1/3 bg-transparent text-current placeholder-gray-400 max-md:rounded-lg'}
                    onChange={(value) => {
                        if (value) {
                            setStartDate(dayjs(value[0]).toString());
                            setEndDate(dayjs(value[1]).toString());
                        }
                    }}
                />
                <Popover className="relative md:w-1/3" >
                    <PopoverButton
                        as={Button}
                        size={'large'} className={'bg-transparent text-current w-full max-md:rounded-lg'}>
                        <MdPersonOutline className={'text-lg'} /> {numGuests} Guests <BsRecordFill size={8} /> {numRooms} Rooms
                    </PopoverButton>

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
                                <h4>Rooms</h4>
                                <div>
                                    <InputNumber
                                        className={'rounded-lg'}
                                        value={numRooms}
                                        onChange={(value) => setNumRooms(value ? value : 0)}
                                        min={1}
                                    />
                                </div>
                            </div>
                        </PopoverPanel>

                </Popover>
                <Button className={'max-md:hidden'} type={'primary'} size={'large'} icon={<SearchOutlined/>}></Button>
                <Button className={'md:hidden block rounded-lg'} type={'primary'} size={'large'}>Search</Button>
            </Space.Compact>
        </div>
    );
}
