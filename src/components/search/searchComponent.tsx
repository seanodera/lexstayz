'use client'
import {useAppSelector, useAppDispatch} from "@/hooks/hooks";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useMediaQuery} from "react-responsive";
import debounce from "lodash/debounce";
import {Affix, Button, DatePicker, Drawer} from "antd";
import {
    Combobox,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Popover,
    PopoverButton,
    PopoverPanel
} from "@headlessui/react";
import {FilterOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";
import SearchFilter from "@/components/search/searchFilter";
import dayjs from "dayjs";
import {
    searchAsync,
    selectSearchResults,
    selectIsLoading,
    selectProcessedList,
    selectPreFilteredList,
    updatePreFilter
} from '@/slices/searchSlice';
import {selectAllStays} from "@/slices/staysSlice";
import {all} from "axios";

const {RangePicker} = DatePicker;

export default function SearchComponent() {
    const dispatch = useAppDispatch();

    const allStays = useAppSelector(selectAllStays)
    const stays = useAppSelector(selectSearchResults);
    const preFilter = useAppSelector(selectPreFilteredList);
    const processedOptions = useAppSelector(selectProcessedList);
    const isLoading = useAppSelector(selectIsLoading);
    const [displayStays, setDisplayStays] = useState<any[]>(stays); // Initialize with all stays
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const booking = useAppSelector(selectConfirmBooking);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const [numRooms, setNumRooms] = useState(1);
    const [numGuests, setNumGuests] = useState(2);
    const router = useRouter();
    const [dates, setDates] = useState<any[]>([]);
    const [hoveredDate, setHoveredDate] = useState(null);
    const isMobile = useMediaQuery({maxWidth: 640});
    const [options, setOptions] = useState<any[]>(processedOptions);
    const [count, setCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const handleChange = (value: any) => {
        setDates(value);
    };

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setDisplayStays(allStays)
    }, []);

    useEffect(() => {
        if (params.has('loc')) {
            const location = params.get('loc') || '';
            if (location) {
                setSelectedLocation(location);
                setSearchTerm(location);
                // @ts-ignore
                dispatch(searchAsync(location));
            }
        }
    }, [params, dispatch]);

    const debouncedHandleSearch = useMemo(() => debounce((value: string) => {
        if (!value) return;
        // @ts-ignore
        dispatch(searchAsync(value));
    }, 300), [dispatch]);

    function handleSelect(value: string) {
        setSelectedLocation(value);
        let filteredStays = stays
        // Implement filtering logic here using the stays or preFilter data from Redux
        value.split(',').forEach((item) => {
            filteredStays.filter(stay => {
                const values = Object.values(stay.location).map((val: any) => String(val).toLowerCase());
                console.log(values.includes(item.toLowerCase()), 'values: ', values)
                return values.includes(item.toLowerCase());
            });
        })


        if (value === ''){
            dispatch(updatePreFilter(allStays))
        } else {
            setDisplayStays(filteredStays);
            console.log('Filtered', filteredStays, 'value: ', value);
            dispatch(updatePreFilter(filteredStays))
        }
    }

    useEffect(() => {
        if (stays.length > 0) {
            setDisplayStays(stays);
            dispatch(updatePreFilter(stays))
        }
    }, [stays]);

    useEffect(() => {
        console.log('selectedLocation: ',selectedLocation);
    }, [selectedLocation]);

    useEffect(() => {
        return () => {
            debouncedHandleSearch.cancel();
        };
    }, [debouncedHandleSearch]);

    return (
        <div className={'bg-white'}>
            <Affix offsetTop={0} className={'z-30'}>
                <div
                    className={'flex justify-between gap-2 sticky-top z-50 bg-white py-3 px-7 border-solid border-gray-100 border-0 border-t border-b'}>
                    <div></div>
                    <div className={'flex gap-2'}>
                        <Combobox value={selectedLocation} onChange={(value) => handleSelect(value || '')}>
                            <ComboboxInput className={'bg-gray-200 rounded-lg border-0'} placeholder={'Anywhere'}
                                           displayValue={(item: any) => item}
                                           onChange={(e) => {
                                               debouncedHandleSearch(e.target.value)
                                               setSearchTerm(e.target.value)
                                           }}/>
                            <ComboboxOptions anchor="bottom"
                                             className="border-0 shadow-md empty:invisible bg-white rounded-lg py-2 text-nowrap gap-2">
                                <ComboboxOption className={'hover:bg-dark hover:bg-opacity-10 px-8 py-2'} value={searchTerm}>{searchTerm}</ComboboxOption>
                                {processedOptions.map((option, index) => (
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
                            onCalendarChange={handleChange}
                            onMouseLeave={() => setHoveredDate(null)}
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
                            className="bg-gray-200 rounded-lg border-0 "
                            format="DD MMMM"
                            placeholder={["Check-in", "Check-out"]}
                            popupClassName=""
                        />
                        <div
                            className={'bg-gray-200 rounded-lg border-0 flex items-center w-max px-2 gap-2'}>
                            <Button icon={<MinusOutlined/>}
                                    onClick={() => setNumGuests((prev) => prev > 1 ? prev - 1 : prev)}/>
                            {numGuests} Guests
                            <Button
                                onClick={() => setNumGuests((prev) => prev + 1)}
                                icon={<PlusOutlined/>}
                            />
                        </div>

                    </div>
                    <Button className={'bg-gray-200 text-gray-500'} onClick={showDrawer} size={'large'} type={'text'}
                            icon={<FilterOutlined/>}>Filter</Button>
                </div>
            </Affix>
            <div
                className={'px-7 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'}>
                {displayStays.map((stay: any, index) => (
                    stay.type === 'Hotel' ?
                        <HotelItem key={index} hotel={stay}/>
                        : <HomeItem stay={stay} key={index}/>
                ))}
            </div>
            <Drawer title="Filter Stays" onClose={onClose} open={open} classNames={{
                body: 'p-0'
            }}>
                <SearchFilter stays={preFilter} onFilter={(filteredList) => {
                    console.log('Prefilter: ',preFilter,' Filtered list: ', filteredList);
                    setDisplayStays(filteredList)
                }}/>
            </Drawer>
        </div>
    );
}
