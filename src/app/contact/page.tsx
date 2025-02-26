import {Card} from "antd";
import {HiOutlineSupport} from "react-icons/hi";
import {current} from "immer";
import Link from "next/link";
import {FaHandshake} from "react-icons/fa6";
import CalendarHeader from "antd/es/calendar/Header";
import {BsTelephone} from "react-icons/bs";


export default function ContactUsPage() {

    return <div className={'pt-[4.5rem]'}>
        <div className={'text-center py-8'}>
            <img className={'aspect-square object-contain w-20 mb-8 '} src={'/logo/lexstayz-logo-transparent-square.png'} alt={'logo'}/>
            <h1 className={'font-semibold text-5xl mb-1'}>Contact Our Friendly Team</h1>
            <h3 className={'text-gray-400 font-medium text-xl'}>Let us know how we can help</h3>
        </div>

        <div className={'grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:px-24 px-7 mb-16'}>
            <Card className={'aspect-square'} classNames={{body: 'h-full'}}>
                <div className={'flex flex-col justify-between h-full'}>
                    <div className={'rounded-lg p-2 text-2xl border-solid border-gray-200 w-max aspect-square text-center'}>
                        <HiOutlineSupport/>
                    </div>
                    <div className={''}>
                        <h3 className={'text-xl font-semibold mb-0'}>Chat To Support</h3>
                        <h4 className={'text-gray-400 mb-3'}>We are here to help</h4>
                        <Link className={'underline font-bold text-dark'} href={'mailto:hello@fadorteclimited.com'}>hello@fadorteclimited.com</Link>
                    </div>
                </div>
            </Card>
            {/*<Card className={'aspect-square'} classNames={{body: 'h-full'}}>*/}
            {/*    <div className={'flex flex-col justify-between h-full'}>*/}
            {/*        <div className={'rounded-lg p-2 text-2xl border-solid border-gray-200 w-max aspect-square text-center'}>*/}
            {/*            <FaHandshake/>*/}
            {/*        </div>*/}
            {/*        <div className={''}>*/}
            {/*            <h3 className={'text-xl font-semibold mb-0'}>Partnerships and Advertising</h3>*/}
            {/*            <h4 className={'text-gray-400 mb-3'}>For partnering and advertising </h4>*/}
            {/*            <Link className={'underline font-bold text-dark'} href={'mailto:affilliates@lexstayz.com'}>affilliate@lexstayz.com</Link>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</Card>*/}
            <Card className={'aspect-square'} classNames={{body: 'h-full'}}>
                <div className={'flex flex-col justify-between h-full'}>
                    <div className={'rounded-lg p-2 text-2xl border-solid border-gray-200 w-max aspect-square text-center'}>
                        <HiOutlineSupport/>
                    </div>
                    <div className={''}>

                        <h3 className={'text-xl font-semibold mb-0'}>General Inquiries</h3>
                        <h4 className={'text-gray-400 mb-3'}>+447438549761</h4>
                        <Link className={'underline font-bold text-dark'} href={'mailto:hello@fadorteclimited.com'}>hello@fadorteclimited.com</Link>
                    </div>
                </div>
            </Card>
            <Card className={'aspect-square'} classNames={{body: 'h-full'}}>
                <div className={'flex flex-col justify-between h-full'}>
                    <div className={'rounded-lg p-2 text-2xl border-solid border-gray-200 w-max aspect-square text-center'}>
                        <BsTelephone/>
                    </div>
                    <div className={''}>

                        <h3 className={'text-xl font-semibold mb-0'}>Call us</h3>
                        <h4 className={'text-gray-400 mb-3'}>Mon-Fri from 9 AM to 5 PM (GMT)</h4>
                        <Link className={'underline font-bold text-dark'} href={'tel:h+447438549761'}>+447438549761</Link>
                    </div>
                </div>
            </Card>
        </div>
    </div>
}
