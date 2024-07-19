import {Field, Fieldset, Input, Label, Legend, Select} from "@headlessui/react";
import {countries} from "country-data";


export default function ContactForm() {

    return <Fieldset className={'space-y-4'}>
        <Legend className="text-lg font-bold">Enter your Details</Legend>
        <div className={'grid grid-cols-2 gap-8 '}>
            <Field>
                <Label className={'block font-semibold'}>First Name</Label>
                <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="First Name" required />
            </Field>
            <Field>
                <Label className={'block font-semibold'}>Last Name</Label>
                <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Last Name" required />
            </Field>
        </div>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Email</Label>
            <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Email" required />
            <small className={'font-light'}>Confirmation goes to this email</small>
        </Field>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Country</Label>
            <Select defaultValue={'Kenya'} className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'}>
                {countries.all.map((country, index) => <option key={index} value={country.name}>{country.name}</option> )}
            </Select>
        </Field>
        <Field className={'md:w-1/2 md:pe-4'}>
            <Label className={'block font-semibold'}>Phone Number</Label>
            <Input className={'block border border-gray-500 rounded-lg py-2 px-3 w-full'} placeholder="Phone" required />
        </Field>

    </Fieldset>
}