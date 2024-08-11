'use client'
import { AutoComplete, AutoCompleteProps, Button, DatePicker, InputNumber, Space } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { MdPersonOutline } from "react-icons/md";
import { BsRecordFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectConfirmBooking, updateBookingData } from "@/slices/confirmBookingSlice";
import algoliasearch from "algoliasearch/lite";
import debounce from "lodash/debounce";

const { RangePicker } = DatePicker;

export default function SearchComponent() {
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const booking = useAppSelector(selectConfirmBooking);
    const [searchTerms, setSearchTerms] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);

    const [numRooms, setNumRooms] = useState(1);
    const [numGuests, setNumGuests] = useState(2);
    const searchClient = algoliasearch("S192CBDSDM", "07dbe0e186e0f74a4ce9915a7fb74233");
    const indexName = 'stays';
    const index = searchClient.initIndex(indexName);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(updateBookingData({
            numGuests: numGuests,
            checkInDate: startDate,
            checkOutDate: endDate,
        }));
    }, [numGuests, startDate, endDate]);

    const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

    // Debounced version of the search function
    const debouncedHandleSearch = useMemo(() => debounce(async (value: string) => {
        if (!value) return;
        setOptions([]);
        const data = await index.search(value);
        const processed = data.hits.flatMap((hit: any) => {
            const fullLocation = `${hit.location.street}, ${hit.location.city}, ${hit.location.country}`;
            const cityCountry = `${hit.location.city}, ${hit.location.country}`;
            return [
                {
                    value: fullLocation,
                    label: fullLocation,
                },
                {
                    value: cityCountry,
                    label: cityCountry,
                }
            ];
        });
        setOptions(processed);
        setSearchTerms(value);
    }, 300), [index]);

    function handleSelect(value: string) {
        setSelectedLocation(value);
        console.log('Selected Location:', value);
    }

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            debouncedHandleSearch.cancel();
        };
    }, [debouncedHandleSearch]);

    return (
        <div className={'py-8 md:px-24 xl:p-0 px-7 flex justify-center w-full'}>
            <Space.Compact className={'xl:bg-black max-xl:bg-white xl:bg-opacity-60 xl:text-white rounded-lg xl:w-full max-lg:flex max-lg:flex-col max-md:w-full max-lg:space-y-4'}>
                <AutoComplete
                    className={'lg:w-1/3 bg-transparent text-dark rounded-l-lg max-lg:rounded-lg xl:text-white xl:placeholder-gray-400'}
                    size={'large'}
                    placeholder={'Where are you going?'}
                    options={options}
                    onSelect={handleSelect}
                    onSearch={debouncedHandleSearch} // Use debounced search
                    filterOption={false}
                />
                <RangePicker
                    disabledDate={disabledDate}
                    format={'DD MMMM YYYY'}
                    value={[dayjs(booking.checkInDate), dayjs(booking.checkOutDate)]}
                    size={'large'}
                    className={'lg:w-1/3 xl:w-max bg-transparent text-current placeholder-gray-400 max-lg:rounded-lg'}
                    onChange={(value) => {
                        if (value) {
                            setStartDate(dayjs(value[0]).toString());
                            setEndDate(dayjs(value[1]).toString());
                        }
                    }}
                />
                <Popover className="relative">
                    <PopoverButton
                        as={Button}
                        size={'large'} className={'bg-transparent text-current w-full max-lg:rounded-lg'}>
                        <MdPersonOutline className={'text-lg'} /> {numGuests} Guests <BsRecordFill size={8} /> {numRooms} Rooms
                    </PopoverButton>

                    <PopoverPanel anchor="bottom" className="flex flex-col p-4 z-20 shadow-xl rounded-xl ">
                        <div className={'grid grid-cols-2 bg-white items-center justify-center rounded-xl gap-2 px-8 py-4'}>
                            <h4>Guests</h4>
                            <div>
                                <InputNumber
                                    className={'rounded-lg'}
                                    value={numGuests}
                                    onChange={(value) => setNumGuests(value || 0)}
                                    min={1}
                                />
                            </div>
                            <h4>Rooms</h4>
                            <div>
                                <InputNumber
                                    className={'rounded-lg'}
                                    value={numRooms}
                                    onChange={(value) => setNumRooms(value || 0)}
                                    min={1}
                                />
                            </div>
                        </div>
                    </PopoverPanel>
                </Popover>
                <Button href={`/search?loc=${selectedLocation}`} className={'max-lg:hidden rounded-r-lg'} type={'primary'} size={'large'} icon={<SearchOutlined />}></Button>
                <Button href={`/search?loc=${selectedLocation}`} className={'lg:hidden block rounded-lg'} type={'primary'} size={'large'}>Search</Button>
            </Space.Compact>
        </div>
    );
}
