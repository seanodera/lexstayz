'use client'
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import Link from "next/link";
import {Avatar, Card} from "antd";
import {useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import {useRouter} from "next/navigation";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {createUser} from "@/data/usersData";


export default function RegisterComponent() {
    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6';
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('Individual');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const dispatch = useAppDispatch()
    const router = useRouter();
    async function handleSignup(e: any) {
        e.preventDefault();
        const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
        let details = {};
        if (accountType === 'Individual') {
            details = {
                uid: userCredentials.user.uid,
                firstName: firstName,
                lastName: lastName,
                email: email,
                accountType: accountType
            }
        } else {
            details = {
                uid: userCredentials.user.uid,
                companyName: companyName,
                email: email,
                accountType: accountType
            }
        }
        await createUser(details, userCredentials.user.uid)
        router.push('/login');
    }

    return <Card className={'text-center w-full max-md:h-screen md:w-1/3 rounded-xl flex flex-col justify-center md:px-6 py-10 lg:px-8'}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Avatar src={'/logo/lexstayz-logo-transparent-square.png'} shape={'square'} className="mx-auto h-20 w-20 object-cover aspect-square"/>
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
            <Field className={'block'}>
                <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                       htmlFor="email">Email</Label>
                <Input
                    className={inputCls}
                    type="email" id="email" placeholder="Enter email" value={email}
                    onChange={(e) => setEmail(e.target.value)} required/>
            </Field>
            <Field>
                <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </Label>

                <Input
                    className={inputCls}
                    type="password" id="password"
                    placeholder="Enter password" required value={password} invalid={password !== confirmPassword}
                    onChange={(e) => setPassword(e.target.value)}/>
            </Field>
            <Field>
                <Label className={'block text-sm font-medium leading-6 text-gray-900'}
                       htmlFor="password_confirmation">Confirm Password</Label>
                <Input className={inputCls} type="password" id="password_confirmation"
                       placeholder="Confirm Password" required value={confirmPassword} invalid={password !== confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}/>
            </Field>
            <Field>
                <button
                    className={'flex w-full justify-center border-0 rounded-md bg-primary-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600'}
                    type="submit" onClick={(e) => handleSignup(e)}>Create an account
                </button>
            </Field>
        </Fieldset>
        <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <Link href="/login" className="font-semibold leading-6 text-primary-600 hover:text-primary-500">
                sign in to your account
            </Link>
        </p>
    </Card>
}