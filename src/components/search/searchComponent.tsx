'use client'
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";
import {useEffect, useMemo, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {selectConfirmBooking} from "@/slices/confirmBookingSlice";
import {searchClient} from "@/lib/firebase";
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

const {RangePicker} = DatePicker;

export default function SearchComponent(){
    const stays = useAppSelector(selectAllStays);
    const [preFilter, setPreFilter] = useState<any[]>(stays)
    const [displayStays, setDisplayStays] = useState<any[]>(stays); // Initialize with all stays
    const [open, setOpen] = useState(false);
    const params = useSearchParams();
    const booking = useAppSelector(selectConfirmBooking);
    const [searchTerms, setSearchTerms] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [startDate, setStartDate] = useState(booking.checkInDate);
    const [endDate, setEndDate] = useState(booking.checkOutDate);
    const [numRooms, setNumRooms] = useState(1);
    const [numGuests, setNumGuests] = useState(2);
    const indexName = 'stays';
    const index = searchClient.initIndex(indexName);
    const router = useRouter();
    const [dates, setDates] = useState<any[]>([]);
    const [hoveredDate, setHoveredDate] = useState(null);
    const isMobile = useMediaQuery({maxWidth: 640});
    const [options, setOptions] = useState<any[]>([]);

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
        if (params.has('loc')) {
            if (params.get('loc')) {
                setSearchTerms(params.get('loc') || '');
            }
        }
    }, [params]);

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

        // Update displayStays with search results
        // setDisplayStays(data.hits);
        setPreFilter(data.hits)

    }, 300), [index]);

    function handleSelect(value: string) {
        setSelectedLocation(value);
        let filteredStays = stays;
        console.log('Selected Location:', value);
        value.split(',').forEach((item, index) => {
            filteredStays.filter(stay => {
                let locationString = JSON.stringify(stay.location);
                const values = Object.values(stay.location).map((value:any) => String(value).toLowerCase());

                return values.includes(item)
            })
        })
        console.log(filteredStays);
        setPreFilter(filteredStays);
    }

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
                                           displayValue={(item: any) => item.label}
                                           onChange={(e) => debouncedHandleSearch(e.target.value)}/>
                            <ComboboxOptions anchor="bottom"
                                             className="border empty:invisible bg-white rounded-lg px-8 py-2 text-nowrap">
                                {options.map((option, index) => <ComboboxOption key={index}
                                                                                value={option.value}>{option.label}</ComboboxOption>)}
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
                            className="bg-gray-200 rounded-lg border-0"
                            format="DD MMMM"
                            placeholder={["Check-in", "Check-out"]}
                            dropdownClassName="custom-popover"
                        />
                        <Popover className={'block'}>
                            <PopoverButton
                                className={'bg-gray-200 rounded-lg border-0 flex items-center w-max h-full gap-2'}>
                                <Button icon={<MinusOutlined/>}/> {numGuests} Guests <Button icon={<PlusOutlined/>}/>
                            </PopoverButton>
                            <PopoverPanel>

                            </PopoverPanel>
                        </Popover>
                    </div>
                    <Button className={'bg-gray-200 text-gray-500'} onClick={showDrawer} size={'large'} type={'text'}
                            ghost
                            icon={<FilterOutlined/>}>Filter</Button>
                </div>
            </Affix>
            <div
                className={'px-7 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'}>{displayStays.map((stay: any, index) => (stay.type === 'Hotel') ?
                <HotelItem
                    key={index} hotel={stay}/> : <HomeItem stay={stay} key={index}/>)}</div>
            <Drawer title="Filter Stays" onClose={onClose} open={open} classNames={{
                body: 'p-0'
            }}>
                <SearchFilter stays={preFilter} onFilter={(filteredList) => setDisplayStays(filteredList)}/>
            </Drawer>
        </div>
    );
}