'use client'
import {Button, Card, Segmented, Slider, Checkbox} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";


export default function SearchPage() {
    const [displayStays, setDisplayStays] = useState<any[]>([]);
    const [typeFilter, setTypeFilter] = useState('All');
    const [highestPrice, setHighestPrice] = useState(200);
    const [lowestPrice, setLowestPrice] = useState(0);
    const [priceRange, setPriceRange] = useState([lowestPrice, highestPrice]); // Example price range
    const [amenityFilters, setAmenityFilters] = useState<string[]>([]);
    const stays = useAppSelector(selectAllStays);

    useEffect(() => {
        setDisplayStays(stays);
        let high = 0;
        let low = Infinity;
        stays.forEach(stay => {
            stay.rooms.forEach(room => {
                if (room.price > high) {
                    high = room.price;
                }
                if (room.price < low) {
                    low = room.price;
                }
            });
        });
        setHighestPrice(high);
        setLowestPrice(low);
        setPriceRange([low, high]);
        console.log(stays)
    }, [stays]);

    function generateFilters() {
        const amenitiesSet = new Set<string>();
        stays.forEach(stay => {
            stay.rooms.forEach(room => {
                room.amenities.forEach((amenity: string) => {
                    amenitiesSet.add(amenity);
                });
            });
            stay.facilities.forEach((facility: string) => {
                amenitiesSet.add(facility);
            });
        });
        return Array.from(amenitiesSet);
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
                return stay.rooms.some(room => room.price >= priceRange[ 0 ] && room.price <= priceRange[ 1 ]);
            } else {
                return stay.price >= priceRange[ 0 ] && stay.price <= priceRange[ 1 ];
            }
        });

        // Filter by amenities
        if (amenityFilters.length > 0) {
            filteredStays = filteredStays.filter(stay => {
                return stay.rooms.some(room => {
                    return amenityFilters.every(amenity => room.amenities.includes(amenity));
                });
            });
        }

        setDisplayStays(filteredStays);
    }

    const availableAmenities = generateFilters();

    return (
        <div className={'my-24'}>
            <div className={'grid grid-cols-5 gap-6'}>
                <div className={''}>
                    <Card>
                        <div className={'flex gap-2'}>
                            <Button onClick={() => {
                                setTypeFilter('All');
                                setPriceRange([lowestPrice, highestPrice]);
                                setAmenityFilters([]);
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
                            <h3>Price</h3>
                            <Slider
                                range
                                min={lowestPrice}
                                max={highestPrice}
                                defaultValue={priceRange}
                                onChange={setPriceRange}
                            />
                        </div>
                        <div className={''}>
                            <h3>Amenities</h3>
                            {availableAmenities.map((amenity, index) => (
                                <Checkbox
                                    key={index}
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
                            ))}
                        </div>
                    </Card>
                </div>
                <div className={'col-span-4'}>
                    <div
                        className={'grid grid-cols-3 gap-6'}>{displayStays.map((stay: any, index) => (stay.type === 'Hotel') ?
                        <HotelItem
                            key={index} hotel={stay}/> : <HomeItem stay={stay} key={index}/>)}</div>
                </div>
            </div>
        </div>
    );
}
