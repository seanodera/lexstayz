'use client'
import {Avatar, Button, Card, Col, Row, Steps} from "antd";
import React, {useEffect, useState} from "react";
import {DashOutlined, LeftOutlined, RightOutlined} from "@ant-design/icons";
import {FaQuoteLeft} from "react-icons/fa";


export default function ListYourPropertyPage() {
    const [current, setCurrent] = useState(0);
    const steps = [
        {
            title: 'Create Your Account',
            description: 'Sign up as a host on LexStayz through our quick and easy registration process. Provide your basic information, and you’re ready to get started.',
        },
        {
            title: 'List Your Property',
            description: 'Complete your property profile by adding detailed descriptions, high-resolution photos, and important amenities. Set your pricing, availability, and policies with our user-friendly interface.',
        },
        {
            title: 'Maximize Your Exposure',
            description: 'Once your listing is live, our platform ensures it reaches a wide audience. Utilize our promotional tools and insights to optimize your listing and increase bookings.',
        },
        {
            title: 'Manage Bookings with Ease',
            description: 'Our intuitive dashboard allows you to handle all aspects of your property management, from booking confirmations to guest communication. Stay on top of your calendar and never miss an opportunity.',
        },
        {
            title: 'Secure Your Earnings',
            description: 'Payments are automatically deposited into your account after guests check out. LexStayz provides detailed transaction reports, helping you keep track of your income and plan for future investments.',
        },
    ];

    const strings = [
        "Home",
        "Hotel",
        "Property",
        "Apartment",
        "Guest House",
    ];

    const [textIndex, setTextIndex] = useState(0); // Tracks the current string in the list
    const [index, setIndex] = useState(0); // Tracks the character index of the current string
    const [direction, setDirection] = useState("forward"); // Determines typing or backspacing
    const [isPaused, setIsPaused] = useState(false); // Handles pause after typing

    useEffect(() => {
        if (isPaused) {
            const pauseTimeout = setTimeout(() => {
                setIsPaused(false);
                setDirection("backward");
            }, 1000); // Adjust pause duration here
            return () => clearTimeout(pauseTimeout);
        }

        const timeout = setTimeout(() => {
            const currentText = strings[textIndex];

            if (direction === "forward") {
                if (index < currentText.length) {
                    setIndex((prev) => prev + 1);
                } else {
                    setIsPaused(true);
                }
            } else {
                if (index > 0) {
                    setIndex((prev) => prev - 1);
                } else {
                    setDirection("forward");
                    setTextIndex((prev) => (prev + 1) % strings.length); // Move to the next string
                }
            }
        }, direction === "forward" ? 200 : 100); // Typing is slower, backspacing is faster

        return () => clearTimeout(timeout);
    }, [index, direction, textIndex, strings, isPaused]);

    return <div>
        <section className={'px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-14 lg:py-20'}>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                <div className={'flex flex-col justify-center max-lg:items-center'}>
                    <h1 className={'text-2xl sm:text-3xl md:text-4xl font-semibold'}>Partner with LexStayz</h1>
                    <h1 className={'text-3xl sm:text-4xl md:text-5xl lg:text-4xl xl:text-5xl font-bold max-lg:text-center lg:text-nowrap'}>
                        List Your
                        <span className={'text-primary flex lg:inline-flex items-center lg:ms-2'}>
                             {strings[textIndex].slice(0, index)}
                            <span className="animate-blink text-dark font-thin ms-1 text-3xl items-center lg:hidden">|</span>
                        </span>
                    </h1>
                    <div className={'text-gray-700 max-w-md text-sm sm:text-md md:text-lg'}>
                        Start your journey with LexStayz and experience the benefits of partnering with a leading platform in the accommodation industry. Click the link below to get started.
                    </div>
                    <Button className={'w-max mt-3'} type={'primary'} size={'large'}>Get Started</Button>
                </div>
                <div className={'flex justify-center lg:justify-end'}>
                    <img src={'/assets/banner-list-your-property.jpg'} alt={''}
                         className={'object-cover w-full  lg:max-w-md lg:aspect-square md:aspect-20/7 aspect-video rounded-xl'}/>
                </div>
            </div>
        </section>

        <section className="px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-14 lg:py-20 bg-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 text-center">Why Choose LexStayz for Your Property?</h2>
            <Row gutter={[24, 24]}>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full border-primary shadow shadow-primary">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Global Reach & Diverse Audience</h3>
                        <p>LexStayz connects you with a global community of travelers, ensuring maximum visibility and occupancy.</p>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full shadow-md">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Advanced Management Tools</h3>
                        <p>Utilize our comprehensive suite of tools to manage your property efficiently.</p>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full border-primary shadow shadow-primary">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Secure and Reliable Payments</h3>
                        <p>Enjoy peace of mind with our secure payment processing system.</p>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full shadow-md">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Dedicated Host Support</h3>
                        <p>Our dedicated support team is available 24/7 to assist you with any questions or challenges.</p>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full border-primary shadow shadow-primary">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Tailored Pricing Strategies</h3>
                        <p>Set your own rates, availability, and cancellation policies to maximize your revenue.</p>
                    </Card>
                </Col>
                <Col xs={24} md={12} lg={8}>
                    <Card className="h-full shadow-md">
                        <h3 className="text-lg md:text-xl font-bold mb-4">Quality Assurance</h3>
                        <p>We offer guidance on presenting your property to attract discerning travelers and ensure positive reviews.</p>
                    </Card>
                </Col>
            </Row>
        </section>

        <section className={'px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-14 lg:py-20 bg-primary-50'}>
            <div className={'grid grid-cols-1 lg:grid-cols-2 gap-6'}>
                <div>
                    <h1 className={'text-2xl sm:text-3xl md:text-4xl font-bold mb-8'}>How It Works</h1>
                    <Steps
                        direction="vertical"
                        current={current}
                        onChange={(currentStep) => setCurrent(currentStep)}
                        items={steps.map((step, index) => ({
                            title: step.title,
                            description: index === current ? step.description : null,
                        }))}
                    />
                </div>
                <div className={'flex justify-center lg:justify-end'}>
                    <img src={'/assets/banner-list-your-property.jpg'} alt={''}
                         className={'object-cover w-full lg:max-w-md lg:aspect-square md:aspect-20/7 aspect-video rounded-xl'}/>
                </div>
            </div>
        </section>
        <section className={'px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-14 lg:py-20'}>
            <div className={'flex justify-between items-center'}>
                <h1 className={'text-2xl sm:text-3xl md:text-4xl font-semibold'}>What our <span className={'text-primary'}>clients say</span></h1>
                <span>
                    <Button shape={'circle'} size={'large'} className={'border-gray-500 text-gray-500'} ghost icon={<LeftOutlined/>}></Button>
                    <Button shape={'circle'} size={'large'} type={'primary'} icon={<RightOutlined/>}/>
                </span>
            </div>
            <div className={'grid grid-cols-1 md:grid-cols-2 gap-6 my-8'}>
                <div className={'flex justify-center lg:justify-end'}>
                    <img className={'object-cover w-full max-w-xs sm:max-w-sm lg:max-w-md rounded-xl'} src={'/assets/testimony.jpg'}/>
                </div>
                <div className={'flex flex-col justify-center'}>
                    <h3 className={'font-semibold mb-3'}>Mint Reality Project</h3>
                    <div className={'bg-primary-100 rounded-2xl p-8 space-y-4'}>
                        <div className={'flex items-start gap-4'}>
                            <FaQuoteLeft className={'text-4xl sm:text-5xl md:text-6xl text-primary'}/>
                            <div className={'font-light leading-normal'}>
                                LexStayz has transformed the way we manage our properties. The platform’s tools are incredibly easy to use, and we love the security of knowing our payments are handled efficiently.
                            </div>
                        </div>

                        <div className={'flex items-center gap-2'}>
                            <Avatar shape={'circle'} size={'large'}/>
                            <div className={'flex md:flex-col lg:flex-row lg:gap-2'}>
                                <div className={'font-medium max-md:text-sm'}>Host Name</div>
                                <DashOutlined className={'md:hidden lg:inline-flex'}/>
                                <span className={'text-gray-500 max-lg:text-sm'}>Property Location</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className={'px-4 sm:px-6 md:px-12 lg:px-24 py-10 sm:py-14 lg:py-20 bg-primary-50'}>
            <div className={'bg-cover bg-center rounded-3xl overflow-hidden shadow-xl shadow-dark'} style={{
                backgroundImage: 'url("/assets/list-join.jpg")',
            }}>
                <div className={'lg:bg-gradient-to-r from-dark from-50% to-transparent p-8 text-white max-lg:bg-dark max-lg:bg-opacity-60 xl:aspect-[20/6]'}>
                    <div className={'w-full lg:w-1/2 px-8 flex flex-col justify-center h-full'}>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4">Ready to Grow Your Business?</h2>
                        <p className="text-sm sm:text-md md:text-lg text-gray-300 mb-8">Join the LexStayz community today and unlock the full potential of your property.</p>
                        <Button type="primary" size="large" className={'w-max'}>List Your Property Now</Button>
                    </div>
                </div>
            </div>
        </section>
    </div>
}
