'use client'
import Link from "next/link";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import {getAuth} from "firebase/auth";
import UserWidget from "@/components/navigation/userWidget";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function Navbar() {
    const [windowHeight, setWindowHeight] = useState(0);
    const pathName = usePathname();
    const userDetails = useAppSelector(selectCurrentUser)
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
    return <div
        className={`w-full lg:px-24 px-7 flex items-center justify-between backdrop-blur-sm py-3 fixed top-0 left-0 z-50 ${pathName === '/' ? windowHeight >= 100 ? 'bg-white text-dark' : ' ' : 'bg-white text-dark shadow-md shadow-primary-50'} transition-all duration-300 ease-linear`}>
        <nav className={'max-lg:hidden flex flex-col gap-1'}>
            {/*<Link href="/">Home</Link>*/}
            {/*<Link href="/">Destination</Link>*/}
        </nav>
        <Link href={'/'} className={'text-3xl font-semibold block'}><img className={'h-12'}
                                                                         src={'/logo/lexstayz-high-resolution-logo-transparent.png'}
                                                                         alt={'logo'}/></Link>
        {(userDetails.uid) ? <UserWidget/> : <button
            className={`py-1 px-4 rounded-full border text-lg font-medium w-max h-max ${(windowHeight < 100 && pathName === '/' ? ' border-white text-white hover:bg-white hover:text-dark' : 'border-black text-black hover:bg-dark hover:text-white')}`}>Login</button>}
    </div>
}