'use client'
import {useEffect, useState} from "react";
import {Button, Card, Checkbox, Collapse, Divider, Segmented, Select, Slider, Typography} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {toMoneyFormat} from "@/lib/utils";
import {homeFacilities, hotelFacilities} from "@/data/hotelsDataLocal";
import {useAppSelector} from "@/hooks/hooks";
import {selectExchangeRate, selectGlobalCurrency} from "@/slices/staysSlice";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import LocationFilterComponent, {LocationFilter} from "@/components/search/locationFilter";
import RoomAndBedsFilter from "@/components/search/roomAndBedsFilter";



const {Title, Text} = Typography;
// (filteredList: any[]) => void
export default function SearchFilter({stays, onFilter}: { stays: any[ ], onFilter: any }) {
    const globalCurrency = useAppSelector(selectGlobalCurrency)
    const exchangeRates = useAppSelector(selectExchangeRate)
    const [displayStays, setDisplayStays] = useState<any[]>([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [highestPrice, setHighestPrice] = useState(200);
    const [lowestPrice, setLowestPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([lowestPrice, highestPrice]);
    const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
    const [locationFilter, setLocationFilter] = useState<LocationFilter>();
    const [roomCountFilter, setRoomCountFilter] = useState<number | null>(null);
    const [ratingFilter, setRatingFilter] = useState<number[]>([0, 5]);
    const [availableFilters, setAvailableFilters] = useState<{
        amenities: string[],
        locations: string[]
    }>({amenities: [], locations: []});
    const [collected, setCollectedProperties] = useState<{
        [ key: string ]: any[];
    }>({});
    const [locationProperties, setLocationProperties] = useState<{
        [ key: string ]: any[];
    }>({})

    function calculatePrice(price: number) {
        let convertedPrice = price * 1.02 / exchangeRates[ 'USD' ]

        return toMoneyFormat(convertedPrice);
    }

    // useEffect(() => {
    //     onFilter(stays)
    // },[stays]);

    useEffect(() => {
        const collectedProperties: { [key: string]: any[] } = {};
        const locationProps: { [key: string]: any[] } = {};
        const locFilter: LocationFilter = {
            city: undefined,
            country: undefined,
            district: undefined,
            street2: undefined,
            street: undefined,
        }

        stays.forEach(item => {
            // const location = item.location || {};
            const { location, ...otherProps } = item;

            for (let key in otherProps) {
                collectedProperties[key] = collectedProperties[key] || [];
                if (!collectedProperties[key].includes(otherProps[key])) {
                    collectedProperties[key].push(otherProps[key]);
                }
            }

            for (let subKey in location) {
                if (location[subKey] !== '') {
                    locationProps[subKey] = locationProps[subKey] || [];
                    if (!locationProps[subKey].includes(location[subKey])) {
                        locationProps[subKey].push(location[subKey]);
                    }
                }
            }
        });

        const keys = ['country', 'city', 'district', 'street2', 'street'];
        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (locationProps[key] && locationProps[key].length === 1) {
                locFilter[key as keyof LocationFilter] = locationProps[key][0];
            } else {
                break;
            }
        }

        setLocationFilter(locFilter);
        setLocationProperties(locationProps);
        setCollectedProperties(collectedProperties);

        console.log(collectedProperties, locationProps);
    }, []);

    useEffect(() => {
        setDisplayStays(stays);
        let high = 0;
        let low = Infinity;
        stays.forEach(stay => {
            if (stay.type === 'Hotel') {
                stay.rooms.forEach((room: any) => {
                    if (room.price > high) {
                        high = room.price;
                    }
                    if (room.price < low) {
                        low = room.price;
                    }
                });
            } else {
                if (stay.price > high) {
                    high = stay.price;
                }
                if (stay.price < low) {
                    low = stay.price;
                }
            }
        });
        setHighestPrice(high);
        setLowestPrice(low);
        setPriceRange([low, high]);
        setAvailableFilters(generateFilters());

    }, [stays]);

    useEffect(() => {
        onFilter(displayStays);
    }, [displayStays, onFilter]);

    function generateFilters() {
        const amenitiesSet = new Set<string>();
        const locationsSet = new Set<string>();
        stays.forEach(stay => {
            stay.rooms.forEach((room: any) => {
                room.amenities.forEach((amenity: string) => {
                    amenitiesSet.add(amenity);
                });
            });
            stay.facilities.forEach((facility: string) => {
                amenitiesSet.add(facility);
            });
            locationsSet.add(stay.location.city); // Assuming stays have a location field
        });
        return {
            amenities: Array.from(amenitiesSet),
            locations: Array.from(locationsSet),
        };
    }

    function applyFilters() {
        let filteredStays = stays;

        // Filter by type
        if (typeFilter !== 'All') {
            filteredStays = filteredStays.filter(stay => stay.type === typeFilter);
        }

        // Filter by price
        filteredStays = filteredStays.filter(stay => {
            if (stay.type === 'Hotel') {
                return stay.rooms.some((room: any) => room.price >= priceRange[ 0 ] && room.price <= priceRange[ 1 ]);
            } else {
                return stay.price >= priceRange[ 0 ] && stay.price <= priceRange[ 1 ];
            }
        });

        // Filter by amenities
        if (amenityFilters.length > 0) {
            filteredStays = filteredStays.filter(stay => {
                return stay.rooms.some((room: any) => {
                    return amenityFilters.every(amenity => room.amenities.includes(amenity));
                });
            });
        }


        // Filter by room count
        if (roomCountFilter) {
            filteredStays = filteredStays.filter(stay => stay.rooms.length === roomCountFilter);
        }

        // Filter by rating
        filteredStays = filteredStays.filter(stay => {
            return stay.rating >= ratingFilter[ 0 ] && stay.rating <= ratingFilter[ 1 ];
        });

        setDisplayStays(filteredStays);
        onFilter(filteredStays);
    }

    return <div>
        <Card className={'space-y-2'} classNames={{
            body: 'space-y-4'
        }}>
            <div className={'flex gap-2'}>
                <Button onClick={() => {
                    setTypeFilter('All');
                    setPriceRange([lowestPrice, highestPrice]);
                    setAmenityFilters([]);
                    setLocationFilter(undefined);
                    setRoomCountFilter(null);
                    setRatingFilter([0, 5]);
                    setDisplayStays(stays);
                }}>Reset</Button>
                <Button type={'primary'} onClick={applyFilters}>Apply</Button>
            </div>
            <div>
                <Title level={5}>Type</Title>
                <Segmented
                    options={[
                        {
                            icon: <IoMdGlobe/>,
                            label: 'All',
                            value: 'All',
                        },
                        {
                            icon: <MdOutlineHotel/>,
                            label: "Hotels",
                            value: "Hotel",
                        },
                        {
                            icon: <MdOutlineVilla/>,
                            label: "Homes",
                            value: "Home",
                        },
                    ]}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    size={'large'}
                    block={true}
                />
            </div>
            <Divider type={'horizontal'}/>
            {((typeFilter === 'Home') && collected.homeType) && <div>
                <Title level={5}>Home Type</Title>
                <Select className={'w-full'} size={'large'} placeholder={'Home type'} options={[{
                    value: undefined,
                    label: 'Any Type'
                }, ...collected.homeType.map((value) => ({value: value, label: value}))]}/>
            </div>}
            <div>
                <div className={'flex justify-between'}><h3>Price</h3>
                    <span
                        className={' text-primary'}>{globalCurrency} {calculatePrice(lowestPrice)} - {globalCurrency} {calculatePrice(highestPrice)}</span>
                </div>
                <Slider
                    range
                    min={lowestPrice}
                    max={highestPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                />
            </div>

            <LocationFilterComponent stays={stays}/>
            <Divider type={'horizontal'}/>
            <RoomAndBedsFilter collectedProperties={collected}/>
            <Divider type={'horizontal'}/>
            <div>
                <Title level={5}>Rating</Title>
                <Slider
                    range
                    min={0}
                    max={5}
                    step={0.5}
                    value={ratingFilter}
                    onChange={setRatingFilter}
                    marks={{0: '0', 5: '5'}}
                />
            </div>
            <Divider type={'horizontal'}/>
            {collected.parties && <div>
                <Title level={5}>Parties</Title>
                <Select
                    className={'w-full'}
                    placeholder={'Parties'}
                    options={[{
                        value: undefined,
                        label: 'Any'
                    }, ...collected.parties.map((value) => ({value: value, label: value})).reverse()]}
                    onChange={(value) => {
                        console.log(value); // Handle selection logic here
                    }}
                />
            </div>}

            {collected.smoking && <div>
                <Title level={5}>Smoking</Title>
                <Select
                    className={'w-full'}
                    placeholder={'Smoking'}
                    options={[{
                        value: undefined,
                        label: 'Any'
                    }, ...collected.smoking.map((value) => ({value: value, label: value})).reverse()]}
                    onChange={(value) => {
                        console.log(value); // Handle selection logic here
                    }}
                />
            </div>}
            {collected.pets && <div>
                <Title level={5}>Pets Allowed</Title>
                <Select
                    className={'w-full'}
                    placeholder={'Pets'}
                    options={[{
                        value: undefined,
                        label: 'Any'
                    }, ...collected.pets.map((value) => ({value: value, label: value})).reverse()]}
                    onChange={(value) => {
                        console.log(value); // Handle selection logic here
                    }}
                />
            </div>}
            {typeFilter === 'Hotel' && <div className={''}>
                <Title level={5}>Hotel Amenities</Title>
                <Collapse ghost items={hotelFacilities.map((value: any, index) => {
                    let name: string = Object.keys(value)[ 0 ]
                    return {
                        key: index,
                        label: name,
                        children: value[ name ].filter((value: string) => availableFilters.amenities.includes(value)).map((amenity: string, index: number) => (
                            <Checkbox
                                key={index}
                                className={'flex'}
                                checked={amenityFilters.includes(amenity)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAmenityFilters([...amenityFilters, amenity]);
                                    } else {
                                        setAmenityFilters(amenityFilters.filter(a => a !== amenity));
                                    }
                                }}
                            >
                                {amenity}
                            </Checkbox>
                        )),
                    };
                }).filter((value: any) => value.children.length > 0)}/>

            </div>}
            {typeFilter === 'Home' && <div className={''}>
                <Title level={5}>Home Amenities</Title>
                <Collapse ghost items={homeFacilities.map((value: any, index) => {
                    let name: string = Object.keys(value)[ 0 ]
                    return {
                        key: index,
                        label: value.name ? value.name : name,
                        children: value.features.filter((value: string) => availableFilters.amenities.includes(value)).map((amenity: string, index: number) => (
                            <Checkbox
                                key={index}
                                className={'flex'}
                                checked={amenityFilters.includes(amenity)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setAmenityFilters([...amenityFilters, amenity]);
                                    } else {
                                        setAmenityFilters(amenityFilters.filter(a => a !== amenity));
                                    }
                                }}
                            >
                                {amenity}
                            </Checkbox>
                        )),
                    };
                }).filter((value: any) => value.children.length > 0)}/>
            </div>}
        </Card>
    </div>
}
