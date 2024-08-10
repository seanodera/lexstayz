'use client'
import {Button, Card, Segmented, Slider, Checkbox, Select, DatePicker, Input, Collapse} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";
import {useEffect, useState} from "react";
import {useAppSelector} from "@/hooks/hooks";
import {selectAllStays} from "@/slices/staysSlice";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";
import {toMoneyFormat} from "@/lib/utils";
import {hotelFacilities} from "@/data/hotelsDataLocal";


const { RangePicker } = DatePicker;

export default function SearchPage() {
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
    const stays = useAppSelector(selectAllStays);

    useEffect(() => {
        setDisplayStays(stays);
        let high = 0;
        let low = Infinity;
        stays.forEach(stay => {
            if (stay.type === 'Hotel') {
                stay.rooms.forEach(room => {
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

    function generateFilters() {
        const amenitiesSet = new Set<string>();
        const locationsSet = new Set<string>();
        stays.forEach(stay => {
            stay.rooms.forEach(room => {
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


    return (
        <div className={'py-24  px-7'}>
            <div className={'grid grid-cols-5 gap-6'}>
                <div className={''}>
                    <Card>
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
                            <h3>Price</h3>
                            <span
                                className={'text-sm'}>{toMoneyFormat(lowestPrice)} - {toMoneyFormat(highestPrice)}</span>
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
                            <Collapse items={hotelFacilities.map((value:any, index) => {
                                let name:string = Object.keys(value)[ 0 ]
                                return {
                                    key: index,
                                    label: name,
                                    children: value[name].filter((value:string) => availableFilters.amenities.includes(value)).map((amenity:string, index:number) => (
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
                <div className={'col-span-4'}>
                    <div className={'text-2xl font-bold mb-2'}>Stays</div>
                    <div
                        className={'grid grid-cols-3 gap-6'}>{displayStays.map((stay: any, index) => (stay.type === 'Hotel') ?
                        <HotelItem
                            key={index} hotel={stay}/> : <HomeItem stay={stay} key={index}/>)}</div>
                </div>
            </div>
        </div>
    );
}


const sample = [
    {
        "type": "Hotel",
        "parties": "Yes",
        "checkOutTime": "14:00",
        "fullyBookedDates": [
            "2024-08-12",
            "2024-08-13",
            "2024-08-14"
        ],
        "rooms": [
            {
                "amenities": [
                    "Room Service",
                    "Closet/Wardrobe",
                    "In-Room Safe",
                    "Air Conditioning/Heating",
                    "Telephone",
                    "Work Desk",
                    "Alarm Clock/Radio",
                    "Toiletries",
                    "Wi-Fi/Internet Access"
                ],
                "available": 10,
                "maxGuests": 4,
                "poster": "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2FSEq9B8azK6zajd8zrxJl%2Fposter?alt=media&token=d0622b83-a828-4408-992e-51e691a60aa7",
                "description": "dbghjnsmnbnd",
                "id": "SEq9B8azK6zajd8zrxJl",
                "images": [
                    "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2FSEq9B8azK6zajd8zrxJl%2Fimage-0?alt=media&token=4bfa806e-abd8-412b-84f2-90c4475166d4",
                    "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2FSEq9B8azK6zajd8zrxJl%2Fimage-1?alt=media&token=76797daf-7eae-4b66-809c-a0659f99a917",
                    "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2FSEq9B8azK6zajd8zrxJl%2Fimage-2?alt=media&token=a1ddd36b-d94d-4f1d-9979-81268aa5b417",
                    "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2FSEq9B8azK6zajd8zrxJl%2Fimage-3?alt=media&token=8f3abbfc-a7e6-4c3a-8359-be338be4101d"
                ],
                "fullDates": [
                    "2024-08-12",
                    "2024-08-13",
                    "2024-08-14"
                ],
                "price": 434,
                "bookedDates": {
                    "2024-08-14": 10,
                    "2024-08-12": 10,
                    "2024-08-08": 4,
                    "2024-08-13": 10,
                    "2024-08-09": 4
                },
                "name": "ghfc",
                "beds": [
                    {
                        "number": 2,
                        "type": "Double"
                    }
                ]
            }
        ],
        "name": "The palace",
        "cancellation": {
            "cancellation": "Free",
            "rate": 20,
            "timeSpace": "Days",
            "preDate": true,
            "time": 0
        },
        "location": {
            "street2": "ddf",
            "zipCode": "ffxdd",
            "country": "Kenya",
            "district": "tgtf",
            "street": "hjncc",
            "city": "cccc"
        },
        "images": [
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-0?alt=media&token=99fff333-8d45-49be-a12c-a5c0e6561958",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-1?alt=media&token=b8b6cfc2-1057-467a-b70b-af390a3dff3f",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-2?alt=media&token=addc57e3-9e85-4812-b91a-e3617dfbc505",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-3?alt=media&token=28b2c2bf-3e94-4e92-9f19-44c0c1aa1fcd",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-4?alt=media&token=297800e4-ec16-4832-a97e-e223c4cb2c3d",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-5?alt=media&token=a3bc1bcb-a335-481f-9338-67147c5fdba1",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-6?alt=media&token=00e68ba0-503d-4f02-802d-2b6e5ccff2df",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-7?alt=media&token=38a51ce7-c6ad-42c6-9e2d-8eca5695a36e",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-8?alt=media&token=58d0057c-fcbd-4047-b8b8-d125a455a3e4",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-9?alt=media&token=7e822dd5-d8df-45e8-96d3-1ab70babcd83",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-10?alt=media&token=ce51b19c-1f87-4402-8101-c999775ecf60",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-11?alt=media&token=c34e2f3a-fb4d-4a6b-a03a-5fcd8b627695",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-12?alt=media&token=4d1237f7-ff12-4ca4-80b9-1cff7955ae04",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-13?alt=media&token=8faeb55b-6b27-4573-ae38-c70c24bd30c8",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-14?alt=media&token=00fb022d-1a55-49d2-9e05-c7e5fa19d079",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-15?alt=media&token=dcb84d50-e72a-4f6b-94d8-d27675334dd8",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-16?alt=media&token=468b06c4-74d3-4ba7-9d3e-ac79e89180cf",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-17?alt=media&token=e483d42c-e99c-42a0-8bca-b0eb2dbd85b7",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-18?alt=media&token=dc86308a-7b2f-422e-800c-7e1128bfe656",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fimage-19?alt=media&token=4ad0fb0b-a848-4a6b-90f0-33cb2a52a6a6"
        ],
        "published": true,
        "description": "gbdhnjsmknbchjfdknsmjcbhfdnxmfbhjckndmxsz,bfcdnjxm ",
        "hostId": "PTqiZj6jxJcJwy4cwi5BHG8VQuw1",
        "poster": "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/0GLQDz5UH334ElOeVjLN%2Fposter?alt=media&token=8ca73292-3962-46dc-9d0a-06d53bfa3cf9",
        "pets": "No",
        "id": "0GLQDz5UH334ElOeVjLN",
        "publishedDate": {
            "seconds": 1721990944,
            "nanoseconds": 651000000
        },
        "checkInTime": "12:00",
        "smoking": "Designated Smoking Areas",
        "facilities": [
            "Mini-Bar",
            "Work Desk",
            "Hairdryer",
            "Breakfast Buffet",
            "Massage Services",
            "Yoga/Pilates Classes",
            "Bicycle Rentals",
            "Banquet Halls",
            "Audio/Visual Equipment Rental",
            "Fax/Photocopying Services",
            "Sauna/Steam Room",
            "Swimming Pool (Indoor/Outdoor)",
            "Accessible Parking",
            "Car Rental Desk",
            "Children's Play Area",
            "Pet-Friendly Services"
        ],
        "minAge": 18
    },
    {
        "type": "Home",
        "publishedDate": "Fri Aug 09 2024 20:09:40 GMT+0300 (Eastern European Summer Time)",
        "fullyBookedDates": [
            "2024-08-12",
            "2024-08-17",
            "2024-08-18"
        ],
        "currency": "GHS",
        "homeType": "House",
        "bedrooms": 2,
        "parties": "No",
        "price": 245,
        "images": [
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-0?alt=media&token=9d9d0fd5-4c07-44e7-8669-e4873a755af6",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-1?alt=media&token=308bc691-5fca-4704-babd-bb3382b1bfbc",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-2?alt=media&token=2f718ae6-8b5c-46d7-869b-7c9f45248efb",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-3?alt=media&token=c268485f-c4d4-4e56-9153-523e70966488",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-4?alt=media&token=f9a3e2a5-f2b8-4219-af6c-2cec0703934b",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-5?alt=media&token=332eaf88-5ea7-4c3f-89b2-b1bd3d5f25bf",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-6?alt=media&token=56dc9b70-b2b0-43bf-aef0-4d7da9b6f1f5",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-7?alt=media&token=a306630c-ad48-4869-8a43-f5ea3065bcc2",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-8?alt=media&token=2dcd3ee1-7730-4487-be75-146b643ecb5f",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-9?alt=media&token=eb4ad776-cf47-487c-900d-d84b0a9fa062",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-10?alt=media&token=8da25b99-067f-49ed-98cf-5f83bc94d50e",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-11?alt=media&token=c59b8d7d-aa91-4c43-b477-7474c8e79ba8",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-12?alt=media&token=81d60a5a-bc8c-4aa3-a190-36a89dae89f6",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-13?alt=media&token=d2310258-0692-431b-9889-7414592ca8e1",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-14?alt=media&token=2df094f3-c8ed-4c13-9c2c-0059b92e2439",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-15?alt=media&token=ea98bd3e-8257-4522-9a69-296971ef3092",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-16?alt=media&token=8bb27d6e-587d-4fc5-bf5f-9ac6f7d37f0e",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-17?alt=media&token=7c4138ec-6f54-42f8-9a5c-01fae815dc9e",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-18?alt=media&token=a76bc9f3-84df-46e0-8f04-22b7cbd52bc8",
            "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fimage-19?alt=media&token=f4d2d6de-151b-4859-8cb7-3e7ebc8a189e"
        ],
        "bathrooms": 0,
        "poster": "https://firebasestorage.googleapis.com/v0/b/lexstayz.appspot.com/o/o2l9TGFCZN9euEcryxVz%2Fposter?alt=media&token=40232350-b714-485d-890c-64747aa87804",
        "minAge": 16,
        "pets": "No",
        "numReviews": 0,
        "checkInTime": "14:00",
        "description": "Its a home",
        "beds": 4,
        "hostId": "PTqiZj6jxJcJwy4cwi5BHG8VQuw1",
        "rooms": [],
        "location": {
            "street": "Erika-Mann-Straße 33",
            "street2": "Wohnung 1",
            "country": "Germany",
            "district": "",
            "zipCode": "80636",
            "city": "München"
        },
        "checkOutTime": "14:00",
        "cancellation": {
            "time": 0,
            "preDate": true,
            "cancellation": "Free",
            "rate": 20,
            "timeSpace": "Days"
        },
        "id": "o2l9TGFCZN9euEcryxVz",
        "rating": 0,
        "smoking": "Designated Smoking Areas",
        "published": true,
        "facilities": [
            "Sofa",
            "TV with Streaming Services",
            "Rug",
            "Curtains",
            "Printer",
            "Desk Lamp",
            "High-Speed Internet",
            "Bicycle Rack",
            "Lawn Equipment Storage",
            "Garage Door Opener",
            "Storage Shelves",
            "Tool Rack",
            "Deck",
            "Barbecue Grill",
            "Fence",
            "Fire Pit",
            "Smoke Detectors",
            "First Aid Kit",
            "Storage Cabinets",
            "Iron",
            "Ironing Board",
            "Sink",
            "Tableware",
            "Microwave",
            "Oven",
            "Wardrobe",
            "Mirror",
            "Chair"
        ],
        "name": "New Home"
    },
]