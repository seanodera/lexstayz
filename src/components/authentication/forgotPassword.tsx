'use client'
import {Avatar, Card, message} from "antd";
import LogoIcon from "@/components/LogoIcon";
import { Field, Fieldset, Input, Label } from "@headlessui/react";
import React, { useState } from "react";
import { resetPassword } from "@/data/usersData";
import Image from "next/image"; // Import the resetPassword function

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6';
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        try {
            await resetPassword(email);
            messageApi.success("Password reset email sent successfully");

        } catch (error) {
            messageApi.error("Error sending password reset email");

        }
    };

    return (
        <Card className={'text-center w-full max-md:h-full md:w-1/3  rounded-xl flex flex-col justify-center px-6 py-12 lg:px-8'}>
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <Image src={'/logo/lexstayz-logo-transparent-square.png'} height={100} width={100} className="mx-auto h-20 w-20 object-cover aspect-square" alt={'logo'}/>
                <div className={'text-3xl'}>LexStayz</div>
                <h2 className="mt-12 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Forgot your password?
                </h2>
            </div>
            <Fieldset className={'text-start space-y-4'}>
                <Field className={'block'}>
                    <Label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor="email">Email</Label>
                    <Input
                        className={inputCls}
                        type="email" id="email" placeholder="Enter email" required value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <button
                    className={'flex w-full justify-center border-0 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'}
                    type="button" onClick={handleSubmit}>Send Email
                </button>
            </Fieldset>
        </Card>
    );
}
