import {Button, Divider} from "antd";
import {InstagramOutlined, TwitterOutlined} from "@ant-design/icons";
import Link from "next/link";


export default function Footer() {

    return <footer className="bg-[#001529] text-white py-8 px-16">
        <div className={'md:flex w-full gap-6 '}>
            <div className={'md:w-1/3'}>
                <img src={'/logo/lexstayz-high-resolution-logo-transparent.png'} alt={'Logo square logo'} className={'object-contain w-full max-w-60'}/>
            </div>
            <div className={'flex-1'}>
                <div className={'grid grid-cols-1 md:grid-cols-3'}>
                    <div className={'space-y-2'}>
                        <div className={'font-bold'}>Partners</div>
                        <Link className={'block text-sm text-gray-300'} href={'/list-your-property'}>List your Property</Link>
                        <Link className={'block text-sm text-gray-300'} href={'/affiliates'}>Affiliates</Link>
                        <Link className={'block text-sm text-gray-300'} href={'/advertise'}>advertise with Us</Link>
                    </div>
                    <div className={'space-y-2'}>
                        <div className={'font-bold'}>About</div>
                        <Link className={'block text-sm text-gray-300'} href={'/about-us'}>About Us</Link>
                        <Link className={'block text-sm text-gray-300'} href={'/contact'}>Contact Us</Link>
                        <Link className={'block text-sm text-gray-300'} href={'/faq'}>FAQ</Link>
                        <Link className={'block text-sm text-gray-300'} href={'/careers'}>Careers</Link>
                    </div>
                    <div className={'space-y-2'}>
                        <div className={'font-bold mb-2'}>Terms And Privacy</div>
                        <Link className={'block text-sm text-gray-300 '} href={'/terms-of-service'}>Terms of Service</Link>
                        <Link className={'block text-sm text-gray-300 '} href={'/privacy-policy'}>Privacy Policy</Link>

                    </div>
                </div>
            </div>
        </div>

        <Divider type={'horizontal'} className={'w-full bg-gray-700 '}/>
        <div className={'flex items-center justify-between'}>
            <div className={'font-thin text-sm'}>&copy;2024 Lexstayz</div>
            <div className={'flex gap-2'}>
                <Button size={'small'} shape={'circle'} icon={<InstagramOutlined/>}/>
                <Button size={'small'} shape={'circle'} icon={<TwitterOutlined/>}/>
            </div>
        </div>
    </footer>
}