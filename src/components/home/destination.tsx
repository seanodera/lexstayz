'use client';

import { useEffect, useRef, useState } from "react";
import { MdOutlineBathroom, MdOutlineHotel, MdOutlineVilla } from "react-icons/md";
import { IoMdGlobe } from "react-icons/io";
import { Button, Tabs } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectAllStays, fetchStaysAsync } from "@/slices/staysSlice";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";



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
            </div>
        </section>
    );
}