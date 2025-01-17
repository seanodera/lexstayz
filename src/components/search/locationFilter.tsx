'use client'
import { Stay, Location } from "@/lib/types";
import {Select, Typography} from "antd";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {setLocationFilter} from "@/slices/searchSlice";

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
    const {locationFilter, collectedProperties} = useAppSelector(state => state.search);
    const locationProperties = collectedProperties? collectedProperties.location : {};
    // const keys = ['country', 'city', 'district', 'street2', 'street'];
    useEffect(() => {

        // minFilters()
    }, []);




    // function minFilters() {
    //     const locationProps = locationProperties;
    //     const locFilter: LocationFilter = {
    //         city: undefined,
    //         country: undefined,
    //         district: undefined,
    //         street2: undefined,
    //         street: undefined,
    //     }
    //     for (let i = 0; i < keys.length; i++) {
    //         const key = keys[ i ];
    //         if (locationProps[ key ] && locationProps[ key ].length === 1) {
    //             locFilter[ key as keyof LocationFilter ] = locationProps[ key ][ 0 ];
    //         } else {
    //             break;
    //         }
    //     }
    //
    //     dispatch(setLocationFilter(locFilter));
    // }





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
                value={locationProperties.country}
                onChange={value => dispatch(setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    country: value
                } : {city: value, country: undefined, district: undefined, street: undefined, street2: undefined}))}
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
                onChange={value => dispatch(setLocationFilter({
                    ...locationFilter,
                    city: value
                }))}
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
                onChange={value => dispatch(setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    district: value
                } : {city: undefined, country: undefined, district: value, street: undefined, street2: undefined}))}
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
                onChange={value => dispatch(setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    street2: value
                } : {city: undefined, country: undefined, district: undefined, street: undefined, street2: value}))}
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
                onChange={value => dispatch(setLocationFilter(locationFilter ? {
                    ...locationFilter,
                    street: value
                } : {city: undefined, country: undefined, district: undefined, street: value, street2: undefined}))}
            />
        </div>}
    </div>
}
