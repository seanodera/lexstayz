import {Input} from "@headlessui/react";


export default function Banner() {
    return <section className={'bg-center bg-cover pt-24 pb-16 md:px-12 px-7 w-screen aspect-[10/15] md:aspect-[10/8] lg:aspect-[20/7]'} style={{
        backgroundImage: 'url("/assets/banner.jpg")',
    }}>
        <div className={'h-full w-full flex flex-col justify-between'}>
            <div className={'md:flex justify-between items-end h-full py-16'}>
                <div className={'h-full'}>
                    [vertical selector]
                </div>
                <span className={'max-md:hidden md:text-6xl lg:text-9xl'}>Nairobi</span>
            </div>
            <div className={'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'}>
                <div className={'col-span-2 md:col-span-4 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin'} placeholder={'Where do you want to go?'}/></div>
                <div className={'col-span-1 lg:col-span-1 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'} placeholder={'Budget'}/></div>
                <div className={'col-span-1 lg:col-span-1 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'} placeholder={'Guests'}/></div>
                <div className={'col-span-1 lg:col-span-1 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'} placeholder={'Bedrooms'}/></div>
                <div className={'col-span-1 lg:col-span-1 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'} placeholder={'Bathrooms'}/></div>
            </div>
        </div>
    </section>
}