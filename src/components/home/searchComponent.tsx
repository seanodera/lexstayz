'use client'
import { AutoComplete, AutoCompleteProps, Button, DatePicker, InputNumber, Space } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import {MinusOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Popover,
    PopoverButton,
    PopoverPanel
} from "@headlessui/react";
import { MdPersonOutline } from "react-icons/md";
import { BsRecordFill } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectConfirmBooking, updateBookingData } from "@/slices/confirmBookingSlice";
import algoliasearch from "algoliasearch/lite";
import debounce from "lodash/debounce";
import {useMediaQuery} from "react-responsive";

const { RangePicker } = DatePicker;

export default function SearchComponent() {
    const disabledDate: RangePickerProps['disabledDate'] = (current) => {
        return current && current < dayjs().startOf('day');
    };

    const booking = useAppSelector(selectConfirmBooking);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const isMobile = useMediaQuery({maxWidth: 640});
    const [numRooms, setNumRooms] = useState(1);
    const [numGuests, setNumGuests] = useState(booking.numGuests);
    const searchClient = algoliasearch("S192CBDSDM", "07dbe0e186e0f74a4ce9915a7fb74233");
    const [hoveredDate, setHoveredDate] = useState(null);
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

    const [options, setOptions] = useState<any>([]);

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
        setSearchTerm(value);
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
        <div className={'py-8 md:px-7 xl:p-0 px-7 flex justify-center w-full'}>
            <div className={'flex gap-2 max-md:flex-col'}>
                <Combobox value={selectedLocation} onChange={(value) => handleSelect(value || '')}>
                    <ComboboxInput className={'bg-dark text-white placeholder-gray-300 bg-opacity-75 rounded-lg border-0'} placeholder={'Anywhere'}
                                   displayValue={(item: any) => item}
                                   onChange={(e) => {
                                       debouncedHandleSearch(e.target.value)
                                       setSearchTerm(e.target.value)
                                   }}/>
                    <ComboboxOptions anchor="bottom"
                                     className="border-0 shadow-md empty:invisible bg-white rounded-lg py-2 text-nowrap gap-2">
                        <ComboboxOption className={'hover:bg-dark hover:bg-opacity-10 px-8 py-2'}
                                        value={searchTerm}>{searchTerm}</ComboboxOption>
                        {options.map((option:any, index: number) => (
                            <ComboboxOption
                                className={'hover:bg-dark hover:bg-opacity-10 px-8 py-2'}
                                key={index}
                                value={option.value}
                            >
                                {option.label}
                            </ComboboxOption>
                        ))}
                    </ComboboxOptions>
                </Combobox>
                <RangePicker
                    panelRender={(panelNode) => (
                        <div className={`flex ${isMobile ? "flex-col" : "flex-row"}`}>
                            {panelNode}
                        </div>
                    )}
                    value={[dayjs(booking.checkInDate), dayjs(booking.checkOutDate)]}

                    onChange={(value) => {
                        if (value) {
                            setStartDate(dayjs(value[0]).toString());
                            setEndDate(dayjs(value[1]).toString());
                        }
                    }}
                    className="bg-dark text-white placeholder-gray-200 bg-opacity-75 rounded-lg border-0 py-2"
                    format="DD MMMM"
                    placeholder={["Check-in", "Check-out"]}
                    popupClassName=""
                />
                <div
                    className={'bg-dark text-white placeholder-gray-200 bg-opacity-75 rounded-lg border-0 flex max-md:justify-between items-center md:w-max py-2 px-2 gap-2 font-thin'}>
                    <Button shape={'circle'} ghost icon={<MinusOutlined/>} size={'small'}
                            onClick={() => setNumGuests((prev) => prev > 1 ? prev - 1 : prev)}/>
                    {numGuests} Guests
                    <Button  shape={'circle'} ghost size={'small'}
                        onClick={() => setNumGuests((prev) => prev + 1)}
                        icon={<PlusOutlined/>}
                    />
                </div>
                <Button href={`/search?loc=${selectedLocation}`} className={'max-lg:hidden rounded-r-lg'} type={'primary'} size={'large'} icon={<SearchOutlined />}></Button>
                <Button href={`/search?loc=${selectedLocation}`} className={'lg:hidden block rounded-lg'} type={'primary'} size={'large'}>Search</Button>
            </div>
        </div>
    );
}
