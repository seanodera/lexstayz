import {Field, Fieldset, Input, Label, Legend, Select} from "@headlessui/react";


export default function ContactForm() {

    return <Fieldset className={'space-y-4'}>
        <Legend className="text-lg font-bold">Enter your Details</Legend>
        <div className={'grid grid-cols-2 gap-8 '}>
            <Field>
                <Label className={'block font-semibold'}>First Name</Label>
                <Input className={'block border border-gray-500 rounded py-1 px-2 w-full'} placeholder="First Name" required />
            </Field>
            <Field>
                <label>Last Name</label>
                <Input className={'block border border-gray-500 rounded py-1 px-2 w-full'} placeholder="Last Name" required />
            </Field>
        </div>
        <Field className={'md:w-1/2 pe-4'}>
            <Label className={'block font-semibold'}>Email</Label>
            <Input className={'block border border-gray-500 rounded py-1 px-2 w-full'} placeholder="Email" required />
            <small className={'font-light'}>Confirmation goes to this email</small>
        </Field>
        <Field className={'md:w-1/2 pe-4'}>
            <Label className={'block font-semibold'}>Country</Label>
            <Select className={'block border border-gray-500 rounded py-1 px-2 w-full'}>
                <option>Cyprus</option>
                <option>Uk</option>
                <option>Kenya</option>
            </Select>
        </Field>
        <Field className={'md:w-1/2 pe-4'}>
            <Label className={'block font-semibold'}>Phone Number</Label>
            <Input className={'block border border-gray-500 rounded py-1 px-2 w-full'} placeholder="Phone" required />
        </Field>

    </Fieldset>
}