import {Field, Fieldset, Input, Label, Legend, Select} from "@headlessui/react";
import {countries} from "country-data";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {useEffect, useState} from "react";
import {getCountry} from "@/lib/utils";


export default function ContactForm() {
    const userDetails = useAppSelector(selectCurrentUser)
    const [firstName, setFirsName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')

    useEffect(() => {
        if (userDetails){
            setFirsName(userDetails.firstName);
            setLastName(userDetails.lastName);
            setEmail(userDetails.email);
            setPhoneNumber(userDetails.phone);
        }
        async function fetchCountry (){
            const countryNet = await getCountry();
            if (countryNet){
                setCountry(countryNet.name)
            }
        }
        fetchCountry()
    }, [userDetails]);
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
                       required value={lastName} onChange={(event) => setLastName(event.target.value)} />
            </Field>
        </div>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Email</Label>
            <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Email" readOnly required value={email} onChange={event => setEmail(event.target.value)}/>
            <small className={'font-light'}>Confirmation goes to this email</small>
        </Field>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Country</Label>
            <Select defaultValue={'Kenya'} value={country} onChange={(e) => setCountry(e.target.value)} className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'}>
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