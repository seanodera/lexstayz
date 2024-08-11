import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";
import {Button, Card, Checkbox, Collapse, Segmented, Select, Slider} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {toMoneyFormat} from "@/lib/utils";
import {hotelFacilities} from "@/data/hotelsDataLocal";


export default function SearchFilter({stays, onFilter}: { stays: any[ ], onFilter: (filteredList: any[]) => void }) {

    const [displayStays, setDisplayStays] = useState<any[]>([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [highestPrice, setHighestPrice] = useState(200);
    const [lowestPrice, setLowestPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([lowestPrice, highestPrice]);
    const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
    const [locationFilter, setLocationFilter] = useState<string | null>(null);
    const [roomCountFilter, setRoomCountFilter] = useState<number | null>(null);
    const [ratingFilter, setRatingFilter] = useState<number[]>([0, 5]);
    const [availableFilters, setAvailableFilters] = useState<{
        amenities: string[],
        locations: string[]
    }>({amenities: [], locations: []});
    useEffect(() => {
        onFilter(stays)
    },);

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

    }, [onFilter, stays]);

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

        // Filter by location
        if (locationFilter) {
            filteredStays = filteredStays.filter(stay => stay.location === locationFilter);
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

    }

    return <div >
        <Card className={'space-y-2'}>
            <div className={'flex gap-2'}>
                <Button onClick={() => {
                    setTypeFilter('All');
                    setPriceRange([lowestPrice, highestPrice]);
                    setAmenityFilters([]);
                    setLocationFilter(null);
                    setRoomCountFilter(null);
                    setRatingFilter([0, 5]);
                    setDisplayStays(stays);
                }}>Reset</Button>
                <Button type={'primary'} onClick={applyFilters}>Apply</Button>
            </div>
            <div>
                <h3>Type</h3>
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
                />
            </div>
            <div>
                <div className={'flex justify-between'}><h3>Price</h3>
                    <span
                        className={' text-primary'}>${toMoneyFormat(lowestPrice)} - ${toMoneyFormat(highestPrice)}</span>
                </div>
                <Slider
                    range
                    min={lowestPrice}
                    max={highestPrice}
                    value={priceRange}
                    onChange={setPriceRange}
                />
            </div>
            <div>
                <h3>Location</h3>
                <Select
                    placeholder="Select a location"
                    style={{width: '100%'}}
                    onChange={value => setLocationFilter(value)}
                >
                    {availableFilters.locations.map((location, index) => (
                        <Select.Option key={index} value={location}>
                            {location}
                        </Select.Option>
                    ))}
                </Select>
            </div>
            <div>
                <h3>Room Count</h3>
                <Slider
                    min={1}
                    max={10}
                    onChange={value => setRoomCountFilter(value)}
                    marks={{1: '1', 10: '10+'}}
                />
            </div>
            <div>
                <h3>Rating</h3>
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
            <div className={''}>
                <h3>Amenities</h3>
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
                })}/>

            </div>
        </Card>
    </div>
}