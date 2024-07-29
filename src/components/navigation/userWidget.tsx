import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";
import {Avatar, Dropdown} from "antd";


export default function UserWidget() {
    const userDetails = useAppSelector(selectCurrentUser)
    return <div className={''}>
        <Dropdown>
            <div><Avatar shape={'circle'}
                         className={'bg-primary'}>{userDetails.firstName.charAt(0)}{userDetails.lastName.charAt(0)}</Avatar>{userDetails.firstName} {userDetails.lastName}
            </div>
        </Dropdown>
    </div>
}