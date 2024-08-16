import {Steps} from "antd";


export default function ListYourPropertyPage() {

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

    return <div>
        <section className={'px-7 lg:px-24 py-20'}>
            <div className={'grid grid-cols-2 gap-6'}>
                <div className={'flex flex-col justify-center'}>
                    <h1 className={'text-5xl font-bold'}>List Your <span className={'text-primary'}>Property</span></h1>
                    <p>
                        An informative section
                    </p>
                </div>
                <div>
                    <img src={'/assets/banner-list-your-property.jpg'} alt={''}
                         className={'object-cover w-full max-w-sm aspect-square rounded-xl'}/>
                </div>
            </div>
        </section>
        <section className={'px-7 lg:px-24 py-20'}>
            <div className={'grid grid-cols-2 gap-6'}>
                <div>
                    <h1 className={''}>How It Works</h1>
                    <Steps direction="vertical" items={steps}/>
                </div>
            </div>
        </section>
    </div>
}