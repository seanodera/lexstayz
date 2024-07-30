import AccountInfo from "@/components/profile/AccountInfo";
import {Tabs} from "antd";


export default function Page(){

    return<div className={'py-24 lg:px-24 px-7'}>
        <AccountInfo/>
        <Tabs  defaultValue={''} items={[
            {
                key: 'Address',
                label: 'Address',
            },
            {
            key: 'Payment Methods',
                label: 'Payment Methods'
            },
            {
                key: 'Security',
                label: 'Security'
            },
            {
                key: 'Preferences',
                label: 'Preferences'
            }
        ]}/>
    </div>
}