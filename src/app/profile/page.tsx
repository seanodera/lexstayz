import AccountInfo from "@/components/profile/AccountInfo";
import {Tabs} from "antd";
import AddressInfo from "@/components/profile/AddressInfo";
import PaymentMethods from "@/components/profile/paymentMethods";
import SecurityInfo from "@/components/profile/SecurityInfo";
import PreferencesTab from "@/components/profile/preferencesTab";


export default function Page(){

    return<div className={'py-24 lg:px-24 px-7'}>
        <AccountInfo/>
        <Tabs  defaultValue={''} items={[
            {
                key: 'Address',
                label: 'Address',
                children: <AddressInfo/>
            },
            {
            key: 'Payment Methods',
                label: 'Payment Methods',
                children: <PaymentMethods/>
            },
            {
                key: 'Security',
                label: 'Security',
                children: <SecurityInfo/>
            },
            {
                key: 'Preferences',
                label: 'Preferences',
                children: <PreferencesTab/>
            }
        ]}/>
    </div>
}