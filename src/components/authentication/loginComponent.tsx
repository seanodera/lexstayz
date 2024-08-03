'use client'
import {Field, Fieldset, Input, Label} from "@headlessui/react";
import Link from "next/link";
import {Avatar, Card, message} from "antd";
import {useState} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import {useRouter} from "next/navigation";
import {signInWithEmailAndPassword, signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {getUserDetails} from "@/data/usersData";
import {loginUser} from "@/slices/authenticationSlice";


export default function LoginComponent() {
    const inputCls = 'block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userDetails = await getUserDetails(userCredential.user.uid);
            if (userDetails){
                dispatch(loginUser(userDetails));
                router.push('/');
            } else {
                router.push('/user-information')
            }
        } catch (error) {

            // @ts-ignore
            message.error(`Error logging in: ${error.message}`);
        }
    };



    return <Card className={'text-center w-full max-md:h-full md:w-1/3 rounded-xl flex flex-col justify-center md:px-6 py-12 lg:px-8'}>
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Avatar src={'/logo/lexstayz-logo-transparent-square.png'} shape={'square'} className="mx-auto h-20 w-20 object-cover aspect-square"/>
            <div className={'text-3xl'}>LexStayz</div>
            <h2 className="mt-12 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Sign in to your account
            </h2>
        </div>
        <form onSubmit={(event) => {
            event.preventDefault();
            handleLogin()
        }} >
            <Fieldset className={'text-start space-y-4'}>
                <Field className={'block'}>
                    <Label className={'block text-sm font-medium leading-6 text-gray-900'} htmlFor="email">Email</Label>
                    <Input
                        className={inputCls}
                        type="email" id="email" placeholder="Enter email" required value={email} onChange={(e) => setEmail(e.target.value)}/>
                </Field>
                <Field>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Password
                        </Label>
                        <Link href="/forgot-password" className="text-sm font-semibold text-primary hover:text-primary">
                            Forgot password?
                        </Link>
                    </div>

                    <Input
                        className={inputCls}
                        type="password" id="password"
                        placeholder="Enter password" required value={password} onChange={(e) => setPassword(e.target.value)}/>
                </Field>
                <Field>
                    <button
                        className={'flex w-full justify-center border-0 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary'}
                        type="submit">Submit
                    </button>
                </Field>
            </Fieldset>
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{' '}
            <Link href="/register" className="font-semibold leading-6 text-primary-600 hover:text-primary">
                create an account
            </Link>
        </p>
    </Card>
}