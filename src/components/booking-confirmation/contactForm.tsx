'use client'
import {Field, Fieldset, Input, Label, Legend, Select} from "@headlessui/react";
import {countries} from "country-data";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {useEffect, useState} from "react";
import {updateContact} from "@/slices/confirmBookingSlice";


export default function ContactForm() {
    const {user: userDetails, country: countryNet} = useAppSelector(state => state.authentication)
    const [firstName, setFirsName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (userDetails) {
            setFirsName(userDetails.firstName);
            setLastName(userDetails.lastName);
            setEmail(userDetails.email);
            setPhoneNumber(userDetails.phone);
        }


        if (countryNet) {
            setCountry(countryNet.name)
        }

    }, [countryNet, userDetails]);
    useEffect(() => {
        dispatch(updateContact({
            firstName: firstName,
            lastName: lastName,
            email: email,
            country: country,
            phone: phoneNumber,
        }))
    }, [country, email, firstName, lastName, phoneNumber]);
    return <Fieldset className={'space-y-4'}>
        <Legend className="text-lg font-bold">Enter your Details</Legend>
        <div className={'grid grid-cols-2 gap-8 '}>
            <Field>
                <Label className={'block font-semibold'}>First Name</Label>
                <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="First Name"
                       required value={firstName} onChange={(event) => setFirsName(event.target.value)}/>
            </Field>
            <Field>
                <Label className={'block font-semibold'}>Last Name</Label>
                <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Last Name"
                       required value={lastName} onChange={(event) => setLastName(event.target.value)}/>
            </Field>
        </div>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Email</Label>
            <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Email" readOnly
                   required value={email} onChange={event => setEmail(event.target.value)}/>
            <small className={'font-light'}>Confirmation goes to this email</small>
        </Field>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Country</Label>
            <Select defaultValue={'Kenya'} value={country} onChange={(e) => setCountry(e.target.value)}
                    className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'}>
                {countries.all.map((country, index) => <option key={index}
                                                               value={country.name}>{country.name}</option>)}
            </Select>
        </Field>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Phone Number</Label>
            <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Phone" required
                   value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}/>
        </Field>

    </Fieldset>
}
