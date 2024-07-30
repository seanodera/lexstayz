'use client'
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {logoutUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {Avatar, Dropdown} from "antd";
import Link from "next/link";
import {signOut} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {useRouter} from "next/navigation";


export default function UserWidget() {
    const userDetails = useAppSelector(selectCurrentUser)
    const dispatch = useAppDispatch()
    const router = useRouter()
    function handleLogout(e:any){
        console.log('Signing out')
        signOut(auth);
        dispatch(logoutUser({}))
        router.push('/')
    }
    return <div className={''}>
        <Dropdown menu={{
            items: [
                {
                    key: 0,
                    label: <Link href={'/bookings'}>Bookings</Link>
                },
                {
                    key: 1,
                    label: <Link href={'/profile'}>Profile</Link>
                },
                {
                    key: 2,
                    label: 'Logout',
                    danger: true,
                    onClick:handleLogout
                }
            ]
        }}>
            <div className={'flex gap-1 items-center text-current'}><Avatar shape={'circle'}
                         className={'bg-primary'}> {userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}</Avatar><div className={'hidden md:block'}>{userDetails.firstName} {userDetails.lastName}</div>
            </div>
        </Dropdown>
    </div>
}