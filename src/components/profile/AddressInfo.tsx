'use client'
import React, { useState } from "react";
import {Card} from "antd";
import {faker} from "@faker-js/faker";

export default function AddressInfo() {
    const address = faker.location;
    return (
        <Card>
            <div className={'grid grid-cols-1 md:grid-cols-2'}>
                <div>
                    <h3 className={'mb-0'}>Street Address 1</h3>
                    <h3 className={'font-bold'}>{address.street()}</h3>
                </div>
                <div>
                    <h3 className={'mb-0'}>Street Address 2</h3>
                    <h3 className={'font-bold'}>{address.secondaryAddress()}</h3>
                </div>
            </div>
            <div className={'col-span-2 grid grid-cols-3'}>
                <div>
                    <h3 className={'mb-0'}>City</h3>
                    <h3 className={'font-bold'}>{address.city()}</h3>
                </div>
                <div>
                    <h3 className={'mb-0'}>County</h3>
                    <h3 className={'font-bold'}>{address.county()}</h3>
                </div>
                <div>
                    <h3 className={'mb-0'}>Postal Code</h3>
                    <h3 className={'font-bold'}>{address.zipCode()}</h3>
                </div>
                <div>
                    <h3 className={'mb-0'}>Country</h3>
                    <h3 className={'font-bold'}>{address.country()}</h3>
                </div>
            </div>
        </Card>
    );
}



const AddressField = () => {
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
    });

    return (
        <>
            <input
                type="text"
                placeholder="Street"
                value={address.street}
                onChange={e => setAddress({ ...address, street: e.target.value })}
            />
            <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={e => setAddress({ ...address, city: e.target.value })}
            />
            <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={e => setAddress({ ...address, state: e.target.value })}
            />
            <input
                type="text"
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={e => setAddress({ ...address, zipCode: e.target.value })}
            />
            <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={e => setAddress({ ...address, country: e.target.value })}
            />
        </>
    );
}

export {AddressField};