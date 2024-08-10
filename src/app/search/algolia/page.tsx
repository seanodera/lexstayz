'use client'
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination, RangeInput } from 'react-instantsearch-hooks-web';
import {useAppSelector} from "@/hooks/hooks";
import HotelItem from "@/components/Grid Items/HotelItem";
import HomeItem from "@/components/Grid Items/HomeItem";
import {useState} from "react";
import {Button, Card, Segmented} from "antd";
import {IoMdGlobe} from "react-icons/io";
import {MdOutlineHotel, MdOutlineVilla} from "react-icons/md";

// Initialize Algolia
const searchClient = algoliasearch("S192CBDSDM", "07dbe0e186e0f74a4ce9915a7fb74233");
const indexName = 'stays';

export default function SearchPage() {
    // const stays = useAppSelector(selectAllStays);  // Assuming you use this to fetch data for initial indexing or filtering
    const [typeFilter, setTypeFilter] = useState('All');

    return (
        <div className={'my-24'}>
            <InstantSearch searchClient={searchClient} indexName={indexName}>
                <div className={'grid grid-cols-5 gap-6'}>
                    <div className={''}>
                        <Card>
                            <div className={'flex gap-2'}>
                                <Button onClick={() => setTypeFilter('All')}>Reset</Button>
                                <Button type={'primary'}>Apply</Button>
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
                                <h3>Search</h3>
                                <SearchBox />
                            </div>
                            <div>
                                <h3>Price</h3>
                                <RangeInput attribute="price" />
                            </div>
                            <div>
                                <h3>Location</h3>
                                <RefinementList attribute="location" />
                            </div>
                            <div>
                                <h3>Amenities</h3>
                                <RefinementList attribute="amenities" />
                            </div>
                            <div>
                                <h3>Room Count</h3>
                                <RefinementList attribute="rooms_count" />
                            </div>
                            <div>
                                <h3>Rating</h3>
                                <RangeInput attribute="rating" min={0} max={5} />
                            </div>
                        </Card>
                    </div>
                    <div className={'col-span-4'}>
                        <Hits hitComponent={HitComponent} />
                        <Pagination />
                    </div>
                </div>
            </InstantSearch>
        </div>
    );
}

// Customize the display of each hit (stay)
function HitComponent({ hit }: any) {
    return hit.type === 'Hotel' ? (
        <HotelItem hotel={hit} />
    ) : (
        <HomeItem stay={hit} />
    );
}
