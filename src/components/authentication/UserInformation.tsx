'use client'
import {useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword, getAuth} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {createUser} from "@/data/usersData";
import {Card} from "antd";
import LogoIcon from "@/components/LogoIcon";
import {Field, Fieldset, Input, Label, Select} from "@headlessui/react";
import Link from "next/link";
import {loginUser} from "@/slices/authenticationSlice";


export default function UserInformation(){

    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6';
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('Individual');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const dispatch = useAppDispatch()
    const router = useRouter();
    async function handleSignup(e: any) {
        e.preventDefault();
        let details = {};
        const user = getAuth().currentUser
        if (user){
        if (accountType === 'Individual') {
            details = {
                uid: user.uid,
                firstName: firstName,
                lastName: lastName,
                email: user.email,
                accountType: accountType,
                phone: phone,
            }
        } else {
            details = {
                uid: user.uid,
                companyName: companyName,
                email: user.email,
                accountType: accountType,
                phone: phone,
            }
        }
        await createUser(details, user.uid);
        dispatch(loginUser(details))
        router.push('/');
        }
    }

    return <Card className={'text-center w-1/3 rounded-xl flex flex-col justify-center px-6 py-10 lg:px-8'}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <LogoIcon className="mx-auto h-20 w-auto"/>
            <div className={'text-3xl'}>LexStayz</div>
            <h2 className="mt-8 mb-4 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Create an account
            </h2>
        </div>
        <Fieldset className={'text-start space-y-4'}>
            {/*<Field>*/}
            {/*    <Label className={'block text-sm font-medium leading-6 text-gray-900'}>Account Type</Label>*/}
            {/*    <Select className={'appearance-none ' + inputCls} value={accountType} id="accountType"*/}
            {/*            onChange={(e) => setAccountType(e.target.value)}>*/}
            {/*        <option value="Individual">Individual</option>*/}
            {/*        <option value="Organization">Organisation</option>*/}
            {/*    </Select>*/}
            {/*</Field>*/}
            {accountType === 'Individual' && (<div className={'grid grid-cols-2 gap-4'}>
                <Field>
                    <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                           htmlFor={"firstName"}>First Name</Label>
                    <Input className={inputCls} type="text" id="firstName" placeholder="First Name"
                           required value={firstName} onChange={(e) => setFirstName(e.target.value)}/>
                </Field>
                <Field>
                    <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                           htmlFor={"lastName"}>Last
                        Name</Label>
                    <Input className={inputCls} type="text" id="lastName" placeholder="Last Name" value={lastName}
                           required onChange={(e) => setLastName(e.target.value)}/>
                </Field>
            </div>)}
            {accountType === 'Organization' && (<Field>
                <Label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor={'companyName'}>Company
                    Name</Label>
                <Input className={inputCls} type={'text'} id={'companyName'} placeholder={'Company Number'} required
                       value={companyName} onChange={(e) => setCompanyName(e.target.value)}/>
            </Field>)}
            <Field className={'block'}>
                <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                       htmlFor="phone">Phone</Label>
                <Input
                    className={inputCls}
                    type={'tel'} id="phone" placeholder="Enter phone number" value={phone} onChange={(e) => setPhone(e.target.value)}
                    required/>
            </Field>
            <Field>
                <button
                    className={'flex w-full justify-center border-0 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'}
                    type="submit" onClick={(e) => handleSignup(e)}>Add Account Details
                </button>
            </Field>
        </Fieldset>
        <p className="mt-10 text-center text-sm text-gray-500">
            User another account?{' '}
            <Link href="/register" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
                use new credentials
            </Link>
        </p>
    </Card>
}