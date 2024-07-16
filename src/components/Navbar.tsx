'use client'
import Link from "next/link";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";


export default function Navbar() {
    const [windowHeight, setWindowHeight] = useState(0);
    const pathName = usePathname()
    const navBarTop = () => {
        if (window !== undefined) {
            let height = window.scrollY;
            setWindowHeight(height);
        }
    };

    useEffect(() => {
        window.addEventListener("scroll", navBarTop);
        return () => {
            window.removeEventListener("scroll", navBarTop);
        };
    }, []);
    return <div className={`w-full md:px-24 px-7 flex items-center justify-between backdrop-blur-sm py-3 fixed top-0 left-0 z-50 ${windowHeight >= 100 && pathName === '/' ? 'bg-white bg-opacity-60 text-black': ' '} transition-all duration-300 ease-linear`}>
        <nav className={'flex flex-col gap-1'}>
            <Link href="/">Home</Link>
            {/*<Link href="/">Destination</Link>*/}
        </nav>
        <Link href={'/'} className={'text-3xl font-semibold'}>LEXSTAYZ</Link>
        <button className={`py-1 px-4 rounded-full border text-lg font-medium w-max h-max ${windowHeight >= 100? 'border-black text-black': ' border-white text-white'}`}>Login</button>
    </div>
}