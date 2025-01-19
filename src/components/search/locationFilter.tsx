'use client'
import { Stay, Location } from "@/lib/types";
import {Select, Typography} from "antd";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {fetchNextLocationLevel, setLocationFilter} from "@/slices/searchSlice";

const {Title} = Typography;

export interface LocationFilter {
    city: string | undefined;
    country: string | undefined;
    district: string | undefined;
    street2: string | undefined;
    street: string | undefined;
}

export default function LocationFilterComponent({stays }: { stays: Stay[] }) {


    const dispatch = useAppDispatch();
    const {locationFilter, locationProperties} = useAppSelector(state => state.search);
    console.log(locationProperties)

    useEffect(() => {
        // Initial fetch for countries
        if (!locationProperties.country) {
            dispatch(fetchNextLocationLevel({ level: "country", path: "locations/countries" }));
        }
    }, [dispatch, locationProperties.country]);

    const handleSelect = (level: string, value: string) => {
        const newFilter = { ...locationFilter, [level]: value };

        // Reset subsequent filters
        if (level === "country") {
            newFilter.city = undefined;
            newFilter.district = undefined;
            newFilter.street2 = undefined;
            newFilter.street = undefined;

            // Fetch cities for the selected country
            dispatch(fetchNextLocationLevel({ level: "city", path: `locations/countries/${value}/cities` }));
        } else if (level === "city") {
            newFilter.district = undefined;
            newFilter.street2 = undefined;
            newFilter.street = undefined;

            // Fetch districts for the selected city
            dispatch(fetchNextLocationLevel({ level: "district", path: `locations/countries/${locationFilter?.country}/cities/${value}/districts` }));
        } else if (level === "district") {
            newFilter.street2 = undefined;
            newFilter.street = undefined;

            // Fetch street2 for the selected district
            dispatch(fetchNextLocationLevel({ level: "street2", path: `locations/countries/${locationFilter?.country}/cities/${locationFilter?.city}/districts/${value}/street2` }));
        } else if (level === "street2") {
            newFilter.street = undefined;

            // Fetch streets for the selected street2
            dispatch(fetchNextLocationLevel({ level: "street", path: `locations/countries/${locationFilter?.country}/cities/${locationFilter?.city}/districts/${locationFilter?.district}/street2/${value}/streets` }));
        }

        dispatch(setLocationFilter(newFilter));
    };

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
                value={locationFilter?.country}
                onChange={value => handleSelect('country', value)}
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
                value={locationFilter.city}
                onChange={value => handleSelect('city', value)}
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
                value={locationFilter.district}
                onChange={value => handleSelect('district', value)}
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
                value={locationFilter.street2}
                onChange={value => handleSelect('street2', value)}
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
                value={locationFilter.street}
                onChange={value => handleSelect('street', value)}
            />
        </div>}
    </div>
}
