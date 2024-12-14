'use client'
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectConfirmBooking, updateBookingData} from "@/slices/confirmBookingSlice";
import {useEffect, useMemo, useState} from "react";
import {useSearchParams} from "next/navigation";
import {useMediaQuery} from "react-responsive";
import debounce from "lodash/debounce";
import {Affix, Button, DatePicker, Drawer} from "antd";
import {isWithinInterval, parseISO} from "date-fns";
import {Combobox, ComboboxInput, ComboboxOption, ComboboxOptions} from "@headlessui/react";
import {FilterOutlined, MinusOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";
import SearchFilter from "@/components/search/searchFilter";
import dayjs from "dayjs";
import {
    searchAsync,
    selectPreFilteredList,
    selectProcessedList,
    selectSearchResults,
    updatePreFilter
} from '@/slices/searchSlice';
import {selectAllStays} from "@/slices/staysSlice";
import {Stay} from "@/lib/types";

const {RangePicker} = DatePicker;

export default function SearchComponent() {
    const dispatch = useAppDispatch();

    const allStays = useAppSelector(selectAllStays)
    const stays = useAppSelector(selectSearchResults);
    const preFilter = useAppSelector(selectPreFilteredList);
    const processedOptions = useAppSelector(selectProcessedList);
    const [displayStays, setDisplayStays] = useState<any[]>(stays); // Initialize with all stays
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const booking = useAppSelector(selectConfirmBooking);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const [numGuests, setNumGuests] = useState(booking.numGuests);
    const isMobile = useMediaQuery({maxWidth: 640});


    const [searchTerm, setSearchTerm] = useState("");


    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        setDisplayStays(filterStaysByDate(allStays));
    }, [allStays]);

    useEffect(() => {
        if (params.has('loc')) {
            const location = params.get('loc') || '';
            if (location) {
                setSelectedLocation(location);
                setSearchTerm(location);

                dispatch(searchAsync(location));
            }
        }
    }, [params, dispatch]);

    const debouncedHandleSearch = useMemo(() => debounce((value: string) => {
        if (!value) return;

        dispatch(searchAsync(value));
    }, 300), [dispatch]);

    function handleSelect(value: string) {
        setSelectedLocation(value);
        let filteredStays = filterStaysByDate(stays)
        // Implement filtering logic here using the stays or preFilter data from Redux
        value.split(',').forEach((item) => {
            filteredStays.filter(stay => {
                const values = Object.values(stay.location).map((val: any) => String(val).toLowerCase());

                let booked: boolean;
                const checkInDate = startDate;
                const checkOutDate = endDate;

                    if (stay.type === "Home") {
                        booked = stay.bookedDates?.some((date: string) =>
                            isWithinInterval(parseISO(date), {
                                start: parseISO(checkInDate),
                                end: parseISO(checkOutDate),
                            })
                        );
                    } else {
                        booked = stay.fullyBookedDates?.some((date: string) =>
                            isWithinInterval(parseISO(date), {
                                start: parseISO(checkInDate),
                                end: parseISO(checkOutDate),
                            })
                        );
                    }


                console.log(values.includes(item.toLowerCase()), 'values: ', values)
                return !booked && values.includes(item.toLowerCase());
            });
        })


        if (value === ''){
            dispatch(updatePreFilter(filterStaysByDate(allStays)))
        } else {
            setDisplayStays(filteredStays);
            console.log('Filtered', filteredStays, 'value: ', value);
            dispatch(updatePreFilter(filteredStays))
        }
    }

    useEffect(() => {
        if (stays.length > 0) {
            let data = filterStaysByDate(stays)
            setDisplayStays(data);
            dispatch(updatePreFilter(data))
        }
    }, [stays, startDate, endDate, dispatch]);



    useEffect(() => {
        return () => {
            debouncedHandleSearch.cancel();
        };
    }, [debouncedHandleSearch]);

    function filterStaysByDate (stays: Stay[]){

        return [...stays].filter((stay) => {
            const bookedDates = stay.type === "Home" ? stay.bookedDates : stay.fullyBookedDates;
            if (!bookedDates) return true; // If no booked dates, it's available

            return !bookedDates.some((date: string) =>
                isWithinInterval(parseISO(date), {start: startDate, end: endDate})
            );
        });

    }

    useEffect(() => {
        dispatch(updateBookingData({
            numGuests: numGuests,
            checkInDate: startDate,
            checkOutDate: endDate,
        }));
    }, [numGuests, startDate, endDate, dispatch]);

    return (
        <div className={'bg-white'}>
            <Affix offsetTop={0} className={'z-30'}>
                <div
                    className={'flex justify-between gap-2 sticky-top z-50 bg-white py-3 px-7 border-solid border-gray-100 border-0 border-t border-b'}>
                    <div></div>
                    <div className={'flex max-md:flex-col gap-2'}>
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
                            disabledDate={(current) => current.isBefore(dayjs().subtract(1,'day'))}
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
                        <Button icon={<SearchOutlined/>} type={'primary'}/>
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
                <SearchFilter stays={preFilter} onFilter={(filteredList: any) => {
                    const data = filterStaysByDate(filteredList);
                    console.log('Prefilter: ',preFilter,' Filtered list: ', filteredList, 'data: ', data);
                    setDisplayStays(data)
                }}/>
            </Drawer>
        </div>
    );
}
