'use client'
import OnlineConnectionUndraw from "@/assets/OnlineConnectionUndraw";
import TargetUndraw from "@/assets/TargetUndraw";
import AnalyticsUndraw from "@/assets/AnalyticsUndraw";
import {useState, useEffect} from "react";
import {Button} from "antd";

export default function AdvertisePage() {
    const [reachIndex, setReachIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setReachIndex((prevIndex) => (prevIndex + 1) % 3);
        }, 5000); // Change the image every 5 seconds

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, []);

    return (
        <div className={'pt-[4.5rem]'}>
            <div className={'bg-white lg:px-24 px-7'}>
                <div className={'aspect-video max-md:py-8 md:aspect-[20/6] w-full grid md:grid-cols-3'}>
                    <div className={'flex flex-col justify-center col-span-2'}>
                        <h1 className={'font-semibold text-5xl xl:text-7xl mb-1'}>Advertise with us</h1>
                        <h4 className={'text-gray-500 font-normal'}>
                            Maximize Your Reach in Africa’s Thriving Property and Travel Markets
                        </h4>
                    </div>
                    <div className={'flex flex-col justify-center items-center p-8 xl:p-16 max-md:hidden'}>
                        <div className={'border-dashed border-primary flex flex-col justify-center items-center rounded-3xl h-full aspect-square'}>
                            <h3 className={'text-lg font-bold text-dark'}>Could be you</h3>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'lg:px-24 px-7 py-24 shadow-primary shadow-md'}>
                <h2 className={'text-3xl font-bold mb-4 text-center'}>Why LexStayz</h2>
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-4 text-center'}>
                    <div>
                        <div className={'text-primary object-contain aspect-video w-full'}>
                            <OnlineConnectionUndraw className={'w-full aspect-video object-contain'} />
                        </div>
                        <h3 className="font-semibold">High Engagement</h3>
                        <p className={'text-sm'}>
                            Our platform attracts users who are actively involved in the property and travel markets,
                            making your ads more impactful.
                        </p>
                    </div>
                    <div>
                        <div className={'text-primary object-contain aspect-video'}>
                            <TargetUndraw className={'w-full aspect-video object-contain'} />
                        </div>
                        <h3 className="font-semibold">Precision Targeting</h3>
                        <p className={'text-sm'}>
                            Utilize our advanced targeting tools to connect with users based on location, interests, and
                            behavior, ensuring that your campaigns reach those most likely to convert.
                        </p>
                    </div>
                    <div>
                        <div className={'text-primary object-contain aspect-video w-full'}>
                            <AnalyticsUndraw className={'w-full aspect-video object-contain'} />
                        </div>
                        <h3 className="font-semibold">Proven ROI</h3>
                        <p className={'text-sm'}>
                            With data-driven insights and performance analytics, you can optimize your campaigns for
                            maximum return on investment.
                        </p>
                    </div>
                </div>
            </div>

            <div className={'lg:px-24 px-7 py-24 bg-primary-100'}>
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
                    <div>
                        <h2 className={'text-3xl font-bold mb-4 text-start'}>What More Do We Offer</h2>
                        <p className={'font-medium'}>
                            LexStayz offers a unique opportunity to connect with a rapidly growing audience in
                            Africa&apos;s
                            dynamic property and travel sectors.
                        </p>
                    </div>
                    <div className={'col-span-2 grid grid-cols-1 md:grid-cols-4 gap-4 w-full md:aspect-[20/7]'}>
                        <div
                            className={`${reachIndex === 0 && 'md:col-span-2'} bg-cover bg-center rounded-2xl overflow-hidden transition-all duration-500 h-full`}
                            style={{
                                backgroundImage: 'url("/assets/advert-1.jpg")',
                            }}
                        >
                            <div
                                className={'w-full h-full flex flex-col justify-end text-center bg-dark bg-opacity-50 text-white p-4 transition-all duration-500'}
                            >
                                <h3 className={''}>Strategic Targeting</h3>
                                <p className={`${reachIndex !== 0 && 'hidden'} text-gray-100 text-sm transition-all duration-500`}>
                                    Reach a specific audience of property owners, travelers, and real estate
                                    professionals who are actively seeking services like yours
                                </p>
                            </div>
                        </div>

                        <div
                            className={`${reachIndex === 1 && 'md:col-span-2'} bg-cover bg-center rounded-2xl overflow-hidden transition-all duration-500`}
                            style={{
                                backgroundImage: 'url("/assets/advert-2.jpg")',
                            }}
                        >
                            <div
                                className={'w-full h-full flex flex-col justify-end text-center bg-dark bg-opacity-60 text-white p-4  transition-all duration-500'}
                            >
                                <h3 className={''}>Broad Visibility</h3>
                                <p className={`text-gray-100 text-sm text-opacity-0 ${reachIndex === 1 && 'text-opacity-100'} transition-all duration-500`}>
                                    {reachIndex === 1 && 'Increase your brand’s presence across multiple African countries where demand for travel and property services is on the rise.'}

                                </p>
                            </div>
                        </div>

                        <div
                            className={`${reachIndex === 2 && 'md:col-span-2'} bg-cover bg-center rounded-2xl overflow-hidden transition-all duration-500`}
                            style={{
                                backgroundImage: 'url("/assets/advert-3.jpg")',
                            }}
                        >
                            <div
                                className={'w-full h-full flex flex-col justify-end text-center bg-dark bg-opacity-60 text-white p-4 transition-opacity duration-500'}
                            >
                                <h3 className={''}>Custom Campaigns</h3>
                                <p className={`${reachIndex !== 2 && 'hidden'} text-gray-100 text-sm  transition--all duration-500`}>
                                    We offer tailored advertising solutions that align with your brand’s goals and
                                    budget, ensuring that your message resonates with the right audience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={'lg:px-24 px-7 py-24 bg-dark text-white'}>
                <h2 className={'text-3xl font-bold mb-8 text-center'}>Comprehensive Advertising Options</h2>
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-4'}>
                    <div>
                        <h3 className={'font-semibold'}>Display Ads</h3>
                        <p className={'text-gray-300 text-sm text-balance'}>Place your brand front and center on our
                            high-traffic pages, where users are most likely to see and engage with your message.</p>
                    </div>
                    <div>
                        <h3 className={'font-semibold'}>Sponsored Content</h3>
                        <p className={'text-gray-300 text-sm text-balance'}>Integrate your brand into relevant
                            content on LexStayz, offering value to users while promoting your services.</p>
                    </div>
                    <div>
                        <h3 className={'font-semibold'}>Email Campaigns</h3>
                        <p className={'text-gray-300 text-sm text-balance'}>Reach our growing list of
                            subscribers directly with tailored email campaigns that highlight your brand’s
                            offerings.</p>
                    </div>
                </div>
            </div>

            <div className="flex-grow container mx-auto px-6 py-12">


                <section className="bg-white shadow-md rounded-lg p-8 xl:p-24 text-center">
                    <h2 className="text-2xl font-bold mb-4">Collaborate with Us Today</h2>
                    <p className="mb-6">
                        Join forces with LexStayz to elevate your brand in Africa’s emerging markets. Contact us at{' '}
                        <a href="mailto:contact@lexstayz.com" className="text-indigo-600 underline">
                            contact@lexstayz.com
                        </a>{' '}
                        to discuss customized advertising opportunities and start driving results.
                    </p>
                    <Button href={'mailto:contact@lexstayz.com'} type={'primary'} size={'large'} className=" text-white font-bold">
                        Get in Touch
                    </Button>
                </section>
            </div>
        </div>
    );
}
