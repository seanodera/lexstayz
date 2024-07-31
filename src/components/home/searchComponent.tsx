'use client'
import {Button, DatePicker, Input, InputNumber, Space} from "antd";
import {RangePickerProps} from "antd/es/date-picker";
import dayjs from "dayjs";
import {SearchOutlined} from "@ant-design/icons";
import {useState} from "react";
import {Popover, PopoverButton, PopoverPanel} from "@headlessui/react";
import {MdPersonOutline} from "react-icons/md";
import {BsRecordFill} from "react-icons/bs";

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

    const [popoverVisible, setPopoverVisible] = useState(false);

    return (
        <div className={'py-8 md:px-24 xl:p-0 px-7 flex justify-center w-full'}>
            <Space.Compact className={'bg-black bg-opacity-60 text-white rounded-lg xl:w-full'}>
                <Input
                    className={'w-1/3 bg-transparent text-white rounded-l-lg '}
                    classNames={{
                        input: 'bg-transparent text-white placeholder-gray-400',

                    }}
                    size={'large'}
                    placeholder={'where are you going?'}
                />
                <RangePicker
                    disabledDate={disabledDate}
                    size={'large'}
                    className={'w-1/3 bg-transparent text-current placeholder-gray-400'}
                    onChange={(value) => {
                        if (value) {
                            setStartDate(dayjs(value[0]).toString());
                            setEndDate(dayjs(value[1]).toString());
                        }
                    }}
                />
                <Popover className="relative w-1/3" >
                    <PopoverButton
                        as={Button}
                        size={'large'} className={'bg-transparent text-current w-full'}>
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
                <Button type={'primary'} size={'large'} icon={<SearchOutlined/>}></Button>
            </Space.Compact>
        </div>
    );
}
