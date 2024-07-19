import {Input} from "@headlessui/react";
import DateComponent from "@/components/DateComponent";


export default function Banner() {
    return <section className={'bg-center bg-cover pt-24 pb-16 md:px-12 px-7 w-screen aspect-[10/15] md:aspect-[10/8] lg:aspect-[18/7]'} style={{
        backgroundImage: 'url("/assets/banner.jpg")',
    }}>
        <div className={'h-full w-full flex flex-col justify-between'}>
            <div className={'md:flex justify-between items-end h-full max-md:py-16'}>
                <div className={'hidden h-full flex-col gap-4 justify-center  bg-transparent bg-gradient-to-b from-transparent via-primary-100 to-transparent bg-[size:2px_auto] bg-repeat-y bg-left ps-2'}>
                    <div className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-gray-300 text-white px-4 py-1 '}>Nairobi </div>
                    <div className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-white px-5 py-1 text-xl ms-3'}>Nairobi </div>
                    <div className={'w-max rounded-full bg-dark bg-opacity-30 backdrop-blur-lg border border-gray-300 text-white px-4 py-1 '}>Nairobi </div>
                </div>

                <span className={'max-md:hidden md:text-6xl lg:text-9xl'}>Nairobi</span>
            </div>
            <SearchComponent/>
        </div>
    </section>
}

function SearchComponent() {
    return <div className={'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4'}>
        <div className={'col-span-2 md:col-span-4 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}>
            <Input className={'w-full border-0 decoration-0 bg-transparent text-white font-thin'}
                   placeholder={'Where do you want to go?'}/></div>
        <div className={'col-span-2 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><DateComponent
            className={'w-full border-0 decoration-0 bg-transparent text-white font-thin'}/></div>
        <div className={'col-span-2 rounded-full backdrop-blur-lg border border-gray-500 px-4 py-2'}><Input
            className={'w-full border-0 decoration-0 bg-transparent text-white font-thin overflow-hidden'}
            type={'number'} step={1} placeholder={'Guests'}/></div>
    </div>
}