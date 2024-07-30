import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {Avatar, Dropdown} from "antd";
import Link from "next/link";


export default function UserWidget() {
    const userDetails = useAppSelector(selectCurrentUser)
    return <div className={''}>
        <Dropdown menu={{
            items: [
                {
                    key: 0,
                    label: <Link href={'/profile'}>Profile</Link>
                },
                {
                    key: 1,
                    label: <Link href={'/logout'}>Logout</Link>,
                    danger: true,
                }
            ]
        }}>
            <div className={'flex gap-1 items-center text-current'}><Avatar shape={'circle'}
                         className={'bg-primary'}> {userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}</Avatar>{userDetails.firstName} {userDetails.lastName}
            </div>
        </Dropdown>
    </div>
}