'use client'
import { Stay, Location } from "@/lib/types";
import {Select, Typography} from "antd";
import {useEffect, useState} from "react";

const {Title, Text} = Typography;

export interface LocationFilter {
    city: string | undefined;
    country: string | undefined;
    district: string | undefined;
    street2: string | undefined;
    street: string | undefined;
}

export default function LocationFilterComponent({stays, onFilter}: { stays: Stay[]; onFilter: (stays: Stay[], locationFilter: LocationFilter | undefined) => void }) {
    const [locationProperties, setLocationProperties] = useState<{
        [ key: string ]: any[];
    }>({})
    const [locationFilter, setLocationFilter] = useState<LocationFilter>();
    const keys = ['country', 'city', 'district', 'street2', 'street'];
    useEffect(() => {
        generateFilters(stays);
        minFilters()
    }, []);

    function generateFilters(locStays: any[]) {
        const collectedProperties: { [ key: string ]: any[] } = {};
        const locationProps: { [ key: string ]: any[] } = {};


        locStays.forEach(item => {
            const {location} = item;


            for (let subKey in location) {
                if (location[ subKey ] !== '') {
                    locationProps[ subKey ] = locationProps[ subKey ] || [];
                    if (!locationProps[ subKey ].includes(location[ subKey ])) {
                        locationProps[ subKey ].push(location[ subKey ]);
                    }
                }
            }
        });


        setLocationProperties(locationProps);


        console.log(collectedProperties, locationProps);
    }

    function minFilters() {
        const locationProps = locationProperties;
        const locFilter: LocationFilter = {
            city: undefined,
            country: undefined,
            district: undefined,
            street2: undefined,
            street: undefined,
        }
        for (let i = 0; i < keys.length; i++) {
            const key = keys[ i ];
            if (locationProps[ key ] && locationProps[ key ].length === 1) {
                locFilter[ key as keyof LocationFilter ] = locationProps[ key ][ 0 ];
            } else {
                break;
            }
        }

        setLocationFilter(locFilter);
    }

    function applyFilters() {
        const output = stays.filter(stay => {
            const location = stay.location;
            return !locationFilter || Object.keys(locationFilter).every(key => {
                const filterValue = locationFilter[key as keyof LocationFilter];
                return filterValue ? filterValue === location[key as keyof Location] : true;
            });
        });
        onFilter(output, locationFilter);
        console.log(output.length, stays.length, output.length === stays.length);
        generateFilters(output);
    }

    useEffect(() => {
        applyFilters()
    }, [locationFilter]);

    return <div className={'space-y-4'}>
        <Title level={5}>Location</Title>
        <div>
            <Title level={5}>Country</Title>
            <Select
                className={'w-full'}
                placeholder="Select a country"
                options={locationProperties.country ? locationProperties.country.map((value) => ({
                    value: value,
                    label: value
                })) : []}
                onChange={value => setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    country: value
                } : {city: value, country: undefined, district: undefined, street: undefined, street2: undefined})}
            />
        </div>

        {locationFilter && locationFilter.country && <div>
            <Title level={5}>City</Title>
            <Select
                className={'w-full'}
                placeholder="Select a city"
                options={locationProperties.city ? locationProperties.city.map((value) => ({
                    value: value,
                    label: value
                })) : []}
                onChange={value => setLocationFilter({
                    ...locationFilter,
                    city: value
                })}
            />
        </div>}

        {locationFilter && locationFilter.city && <div>
            <Title level={5}>District</Title>
            <Select
                className={'w-full'}
                placeholder="Select a district"
                options={locationProperties.district ? locationProperties.district.map((value) => ({
                    value: value,
                    label: value
                })) : []}
                onChange={value => setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    district: value
                } : {city: undefined, country: undefined, district: value, street: undefined, street2: undefined})}
            />
        </div>}
        {locationFilter && locationFilter.district && <div>
            <Title level={5}>Street 2</Title>
            <Select
                className={'w-full'}
                placeholder="Select an option for Street 2"
                options={locationProperties.street2 ? locationProperties.street2.map((value) => ({
                    value: value,
                    label: value
                })) : []}
                onChange={value => setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    street2: value
                } : {city: undefined, country: undefined, district: undefined, street: undefined, street2: value})}
            />
        </div>}
        {locationFilter && locationFilter.street2 && <div>
            <Title level={5}>Street</Title>
            <Select
                className={'w-full'}
                placeholder="Select a street"
                options={locationProperties.street ? locationProperties.street.map((value) => ({
                    value: value,
                    label: value
                })) : []}
                onChange={value => setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    street: value
                } : {city: undefined, country: undefined, district: undefined, street: value, street2: undefined})}
            />
        </div>}
    </div>
}
