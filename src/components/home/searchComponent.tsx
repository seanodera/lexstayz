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

    const [numRooms, setNumRooms] = useState(0);
    const [numGuests, setNumGuests] = useState(2);

    const [popoverVisible, setPopoverVisible] = useState(false);

    return (
        <div className={'py-8 md:px-24 px-7 flex justify-center'}>
            <Space.Compact className={'w-2/3'}>
                <Input
                    className={'w-1/3'}
                    addonBefore={<SearchOutlined />}
                    size={'large'}
                    placeholder={'where are you going?'}
                />
                <RangePicker
                    disabledDate={disabledDate}
                    size={'large'}
                    className={'w-1/3'}
                    onChange={(value) => {
                        if (value) {
                            setStartDate(dayjs(value[0]).toString());
                            setEndDate(dayjs(value[1]).toString());
                        }
                    }}
                />
                <Popover className="relative" >
                    <PopoverButton
                        as={Button}
                        size={'large'}>
                        <MdPersonOutline className={'text-lg'} /> {numGuests} Guests <BsRecordFill size={8} /> {numRooms} Rooms
                    </PopoverButton>

                        <PopoverPanel anchor="bottom" className="flex flex-col p-4 z-20 shadow-xl rounded-xl mt-4 ">
                            <div className={'grid grid-cols-2 bg-white items-center justify-center gap-2'}>
                                <h4>Guests</h4>
                                <div>
                                    <InputNumber
                                        className={'rounded-lg'}
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
                <Button type={'primary'} size={'large'}>Search</Button>
            </Space.Compact>
        </div>
    );
}