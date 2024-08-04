import {InfoCircleOutlined, InfoOutlined, LoginOutlined, LogoutOutlined} from "@ant-design/icons";
import {MdOutlinePartyMode, MdOutlinePets, MdPersonOutline} from "react-icons/md";
import {PiCigaretteLight, PiDiscoBallThin} from "react-icons/pi";
import {Divider} from "antd";


export default function HouseRules({stay}: { stay: any }) {

    return <div>
        <div className={'text-2xl font-bold mt-8 mb-4'}>{stay.type} Rules</div>
        <div className={'border-gray-200 border-solid rounded-xl p-4'}>
            <div className={'grid grid-cols-1 md:grid-cols-4'}>
                <div className={'font-bold text-lg pb-4'}>
                    <LoginOutlined/> Check-In
                </div>
                <div className={'md:col-span-3'}>
                    From {stay.checkInTime}
                    <p className={'text-sm'}>Guests are required to show a photo ID and credit card at check-in.</p>
                    <p className={'text-sm'}>You need to let the property know what time you&apos;ll be arriving in
                        advance. </p>
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <LogoutOutlined/> Check-Out
                </div>
                <div className={'md:col-span-3'}>
                    until {stay.checkOutTime}
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <InfoCircleOutlined/> Cancellation
                </div>
                <div className={'md:col-span-3'}>
                    <p>{(stay.cancellation.cancellation === 'Other') ? `Free cancellation until ${stay.cancellation.time} ${stay.cancellation.timeSpace} ${(stay.cancellation.preDate) ? 'Before Check In' : 'After Booking Date'}` : stay.cancellation.cancellation}</p>
                    <p>{(stay.cancellation.cancellation === 'Other') && `${100 - stay.cancellation.rate} Refundable`}</p>
                    {(stay.cancellation.cancellation === 'Free') &&
                        <p className={'text-sm text-gray-300 italic'}><InfoOutlined/> Booking fee is not refundable</p>}
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <MdPersonOutline/> Age Restriction
                </div>
                <div className={'md:col-span-3'}>
                    Minimum checkin age is {stay.minAge}
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <MdOutlinePets/> Pets
                </div>
                <div className={'md:col-span-3'}>
                    <p>Pets are{stay.pets === 'Yes' ? '' : ' Not'} allowed</p>
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <PiDiscoBallThin/> Parties
                </div>
                <div className={'md:col-span-3'}>
                    <p>{stay.parties === 'Yes' ? 'Parties are allowed' : 'No parties allowed'}</p>
                </div>
                <Divider type={'horizontal'} className={'md:col-span-4 w-full bg-gray-200 h-0.5'}/>
                <div className={'font-bold text-lg pb-4'}>
                    <PiCigaretteLight/> Smoking
                </div>
                <div className={'md:col-span-3'}>
                    <p>{stay.smoking}</p>
                </div>
            </div>
        </div>
    </div>
}