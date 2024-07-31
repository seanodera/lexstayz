import {Button, Card} from "antd";
import {Field, Input, Label} from "@headlessui/react";


export default function SecurityInfo() {
    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6';

    return <Card>
        <form className={'space-y-2'}>
            <Field className={'grid grid-cols-1 md:grid-cols-3 xl:w-1/2'}>
                <Label className={'mb-0'}>Old Password</Label>
                <Input className={`appearance-none ${inputCls}`} placeholder={'Old Password'} required/>
            </Field>
            <Field className='grid grid-cols-1 md:grid-cols-3 xl:w-1/2 mt-4'>
                <Label className='mb-0'>New Password</Label>
                <Input className={`appearance-none ${inputCls}`} placeholder='New Password' required minLength={8}/>
            </Field>
            <Field className='grid grid-cols-1 md:grid-cols-3 xl:w-1/2 mt-4'>
                <Label className='mb-0'>Confirm New Password</Label>
                <Input className={`appearance-none ${inputCls}`} placeholder='Confirm New Password' required/>
            </Field>
            <Button type={'primary'} >Change Password </Button>
        </form>
    </Card>
}