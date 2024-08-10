'use client'
import React, {useState} from "react";
import {Button, Card, Input, Select} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser, updateUserAsync} from "@/slices/authenticationSlice";
import {countries} from "country-data";

export default function AddressInfo() {
    const userDetails = useAppSelector(selectCurrentUser)
    const [editMode, setEditMode] = useState<boolean>(false)
    const dispatch = useAppDispatch();
    const address = userDetails?.address ? userDetails.address : {};
    const [country, setCountry] = useState<string>('');
    const [city, setCity] = useState<string>('');
    const [district, setDistrict] = useState<string>('');
    const [street, setStreet] = useState<string>('');
    const [street2, setStreet2] = useState<string>('');
    const [zipCode, setZipCode] = useState<string>('');

    const handleEditMode = () => {
        setStreet(address.street || '');
        setStreet2(address.street2 || '');
        setCity(address.city || '');
        setDistrict(address.district || '');
        setCountry(address.country || '');
        setZipCode(address.zipCode || '');
        setEditMode(true)
    }

    const handleCancel = () => {
        setStreet(address.street || '');
        setStreet2(address.street2 || '');
        setCity(address.city || '');
        setDistrict(address.district || '');
        setCountry(address.country || '');
        setZipCode(address.zipCode || '');
        setEditMode(false)
    }

    const handleApply = () => {
        dispatch(updateUserAsync({
            details: {
                address: {
                    street: street,
                    street2: street2,
                    city: city,
                    country: country,
                    zipCode: zipCode,
                    district: district
                }
            }
        }))
        setEditMode(false);
    }
    return (
        <Card title={'Your Address'} extra={<div className={'flex gap-2'}>
            {!editMode && <Button type={'primary'} ghost onClick={handleEditMode}>{'Edit'}</Button>}
            {editMode && <Button danger onClick={handleCancel}>Cancel</Button>}
            {editMode && <Button type={'primary'} onClick={handleApply}>Apply</Button>}
        </div>}>
            <div className={'space-y-4'}>
                <div>
                    <h3 className={'mb-0'}>Street Address 1</h3>

                    {editMode ? <Input className={'w-full lg:w-1/2'} value={street} defaultValue={address.street}
                                       onChange={(e) => setStreet(e.target.value)}/> :
                        <h3 className={'font-bold'}>{address.street}</h3>}
                </div>
                <div>
                    <h3 className={'mb-0'}>Street Address 2</h3>

                    {editMode ? <Input className={'w-full lg:w-1/2'} value={street2} defaultValue={address.street2}
                                       onChange={(e) => setStreet2(e.target.value)}/> :
                        <h3 className={'font-bold'}>{address.street2}</h3>}
                </div>
            </div>
            <div className={'grid grid-cols-2 gap-4'}>
                <div>
                    <h3 className={'mb-0'}>City</h3>

                    {editMode ?
                        <Input value={city} className={'w-full'} defaultValue={address.city}
                               onChange={(e) => setCity(e.target.value)}/> :
                        <h3 className={'font-bold'}>{address.city}</h3>}
                </div>
                <div>
                    <h3 className={'mb-0'}>District</h3>

                    {editMode ?
                        <Input className={'w-full'} value={district} onChange={(e) => setDistrict(e.target.value)}/> :
                        <h3 className={'font-bold'}>{address.district}</h3>}
                </div>
                <div>
                    <h3 className={'mb-0'}>Country</h3>
                    {editMode ?
                        <Select className={'w-full'} value={country} onChange={(value) => setCountry(value)} options={
                            countries.all.map((value, index) => ({
                                label: `${value.emoji ? value.emoji : ''} ${value.name}`,
                                value: value.name,
                            }))
                        }/> : <h3 className={'font-bold'}>{address.country}</h3>}
                </div>
                <div>
                    <h3 className={'mb-0'}>Postal Code</h3>
                    {editMode ?
                        <Input className={'w-full'} value={zipCode} onChange={(e) => setZipCode(e.target.value)}/> :
                        <h3 className={'font-bold'}>{address.zipCode}</h3>}
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
                onChange={e => setAddress({...address, street: e.target.value})}
            />
            <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={e => setAddress({...address, city: e.target.value})}
            />
            <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={e => setAddress({...address, state: e.target.value})}
            />
            <input
                type="text"
                placeholder="Zip Code"
                value={address.zipCode}
                onChange={e => setAddress({...address, zipCode: e.target.value})}
            />
            <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={e => setAddress({...address, country: e.target.value})}
            />
        </>
    );
}

export {AddressField};