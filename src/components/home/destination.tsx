'use client';

import { useEffect, useRef, useState } from "react";
import { MdOutlineBathroom, MdOutlineHotel, MdOutlineVilla } from "react-icons/md";
import { IoMdGlobe } from "react-icons/io";
import { Button, Tabs } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectAllStays, fetchStaysAsync } from "@/slices/staysSlice";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";
import {doc, updateDoc, WriteBatch} from "firebase/firestore";
import {arrayUnion, writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import {Location} from "@/lib/types"



export default function Destination() {
    const dispatch = useAppDispatch();
    const {stays, isLoading, staysCount, homesCount, hotelsCount, fetchedPages} = useAppSelector(state => state.stays);
    const [activeTabIndex, setActiveTabIndex] = useState(0);
    const [page, setPage] = useState(1); // Track pagination
    const [isPulling, setIsPulling] = useState(false); // Track pull-to-refresh state
    const pullStartY = useRef<number | null>(null); // Track start position of the pull gesture
    const contentRef = useRef<HTMLDivElement>(null); // Ref for the scrollable content

    const tabs = [
        {
            Icon: IoMdGlobe,
            name: "All",
            key: "All",
        },
       (hotelsCount === 0) && {
            Icon: MdOutlineHotel,
            name: "Hotels",
            key: "Hotels",
        },
        {
            Icon: MdOutlineVilla,
            name: "Homes",
            key: "Homes",
        },
    ].filter((value) =>  value !== false);

    const shouldFetchMoreStays = (type: string) => {
        if (type === 'All') {
            return stays.length < staysCount;
        } else if (type === 'Homes') {
            return stays.filter((stay) => stay.type.toLowerCase() === 'home').length < homesCount;
        } else if (type === 'Hotels') {
            return stays.filter((stay) => stay.type.toLowerCase() === 'hotel').length < hotelsCount;
        }
        return false;
    };

    useEffect(() => {
        const type = tabs[activeTabIndex].name;
      if (!isLoading && shouldFetchMoreStays(type) && !fetchedPages[type].includes(page)){
        dispatch(fetchStaysAsync({ page, type }));
        console.log('From destination')
      }
    }, [dispatch, activeTabIndex, page]);

    const handleTouchStart = (e: React.TouchEvent) => {
        if (contentRef.current?.scrollTop === 0) {
            pullStartY.current = e.touches[0].clientY;
        }
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (pullStartY.current !== null) {
            const pullDistance = e.touches[0].clientY - pullStartY.current;
            if (pullDistance > 0) {
                setIsPulling(true);
                contentRef.current!.style.transform = `translateY(${Math.min(
                    pullDistance,
                    100
                )}px)`;
            }
        }
    };

    const handleTouchEnd = () => {
        if (isPulling) {
            setIsPulling(false);
            pullStartY.current = null;
            contentRef.current!.style.transition = "transform 0.3s ease-out";
            contentRef.current!.style.transform = "translateY(0px)";
            setTimeout(() => {
                contentRef.current!.style.transition = "";
            }, 300);
            loadMore();
        } else {
            pullStartY.current = null;
        }
    };

    const loadMore = () => {
        const type = tabs[activeTabIndex].name;
        if (shouldFetchMoreStays(type)){
            setPage((prevPage) => prevPage + 1);
            console.log('See more')
        }
    };

    const [searchLoading, setSearchLoading] = useState(false);

    async function createIndexesFromCurrentProperties (stays: any[]){
        setSearchLoading(true);
        try {

            const batch = writeBatch(firestore);
            stays.forEach(stay => {
                updateCollectedProperties(stay,batch);
            })
            await batch.commit();

        } catch (e) {
            console.error(e);
        }
        setSearchLoading(false);
    }

    return (
        <section className="lg:px-16 px-4 py-12 bg-white border-t border-gray-200">
            <Tabs
                size="large"
                activeKey={tabs[activeTabIndex].key}
                onChange={(key) => {
                    const tabIndex = tabs.findIndex((tab) => tab.key === key);
                    setActiveTabIndex(tabIndex);
                    setPage(1); // Reset to the first page when switching tabs
                }}
                items={tabs.map((value) => {
                    let filteredData = stays;

                    if (value.name === "Hotels") {
                        filteredData = stays.filter((item) => item.type.toLowerCase() === "hotel");
                    } else if (value.name === "Homes") {
                        filteredData = stays.filter((item) => item.type.toLowerCase() === "home");
                    }

                    return {
                        key: value.key,
                        icon: <value.Icon />,
                        label: value.name,
                        children: (
                            <div
                                ref={contentRef}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 text-black overflow-y-auto"
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                            >
                                {filteredData.map((stay: any, index) =>
                                    stay.type === "Hotel" ? (
                                        <HotelItem key={index} hotel={stay} />
                                    ) : (
                                        <HomeItem stay={stay} key={index} />
                                    )
                                )}
                            </div>
                        ),
                    };
                })}
            />
            <div className="text-center mt-8">
               {shouldFetchMoreStays(tabs[activeTabIndex].key) && <Button
                    onClick={loadMore}
                    type="primary"

                >
                    Load More
                </Button>}
                {!shouldFetchMoreStays(tabs[activeTabIndex].key) && (
                    <Button loading={searchLoading} size={'large'} onClick={() => createIndexesFromCurrentProperties(stays)} type={'primary'}>Create Search Data</Button>
                )}
            </div>
        </section>
    );
}



 function updateCollectedProperties(stay: any, batch:WriteBatch) {
    const docRef = doc(firestore, "general", "collectedProperties");

    const { location, rooms, ...otherProps } = stay;

    const updateData: { [key: string]: any } = {};
    updateData.type = arrayUnion(stay.type)
    updateData.smoking = arrayUnion(stay.smoking)
    updateData.pets = arrayUnion(stay.pets)
    updateData.parties = arrayUnion(stay.parties)

    if (stay.type === 'Home'){
        updateData.price = arrayUnion(stay.price)
        updateData.maxGuests = arrayUnion(stay.maxGuests)
        updateData.beds = arrayUnion(stay.beds)
        updateData.bedrooms = arrayUnion(stay.bedrooms)
        updateData.bathrooms = arrayUnion(stay.bathrooms)
        updateData.homeType = arrayUnion(stay.homeType)
    }
    updateData['location.country'] = arrayUnion(location['country'])
     updateLocationIndexes(location, batch);
    // Process room prices
    if (rooms) {
        for (let room of rooms) {
            if (room.price) {
                updateData["price"] = arrayUnion([...(updateData.price? updateData.price : [] ) ,room.price]);
            }
        }
    }

    // Update the Firestore document

    batch.set(docRef, updateData, {merge: true});

    console.log("Collected properties updated successfully using arrayUnion!");
}



export function updateLocationIndexes(location: Location, batch:WriteBatch) {



    // Base reference for general location data
    const locationRef = doc(firestore, "general", "locations");

    // Add country-level data
    if (location.country) {
        batch.set(locationRef, { country: arrayUnion(location.country) }, { merge: true });

        const countryRef = doc(locationRef, `countries/${location.country}`);
        batch.set(countryRef, { name: location.country }, { merge: true });

        // Add city-level data
        if (location.city) {
            batch.set(countryRef, { city: arrayUnion(location.city) }, { merge: true });

            const cityRef = doc(countryRef, `cities/${location.city}`);
            batch.set(cityRef, { name: location.city, district: [] }, { merge: true });

            batch.set(locationRef, { city: arrayUnion(location.city) }, { merge: true });

            // Add district-level data
            if (location.district) {
                batch.set(cityRef, { district: arrayUnion(location.district) }, { merge: true });

                const districtRef = doc(cityRef, `districts/${location.district}`);
                batch.set(districtRef, { name: location.district, street2: [] }, { merge: true });

                batch.set(locationRef, { district: arrayUnion(location.district) }, { merge: true });

                // Add street2-level data
                if (location.street2) {
                    batch.set(districtRef, { street2: arrayUnion(location.street2) }, { merge: true });

                    const street2Ref = doc(districtRef, `street2/${location.street2}`);
                    batch.set(street2Ref, { name: location.street2, street: [] }, { merge: true });

                    batch.set(locationRef, { street2: arrayUnion(location.street2) }, { merge: true });

                    // Add street-level data
                    if (location.street) {
                        batch.set(street2Ref, { street: arrayUnion(location.street) }, { merge: true });

                        batch.set(locationRef, { street: arrayUnion(location.street) }, { merge: true });
                    }
                }
            }
        }
    }

    // Commit all changes in a single batch


}


