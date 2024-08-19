'use client'
import Link from "next/link";
import {useEffect, useState} from "react";
import {usePathname} from "next/navigation";
import UserWidget from "@/components/navigation/userWidget";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";

export default function Navbar() {
    const [windowHeight, setWindowHeight] = useState(0);
    const pathName = usePathname();
    const userDetails = useAppSelector(selectCurrentUser);

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

    const isHomePage = pathName === '/';
    const isMessagePage = pathName.startsWith('/messages');
    console.log(isMessagePage);
    return (
        <div
            className={`w-full lg:px-24 px-7 flex items-center justify-between py-3  ${
                isHomePage ? (windowHeight >= 100 ? 'bg-white text-dark shadow-md shadow-primary-100 fixed z-50' : 'text-white fixed top-0 left-0 z-50') :
                    isMessagePage ? 'bg-white text-dark shadow-md shadow-primary-100  ' :
                        'bg-white text-dark shadow-md shadow-primary-100 fixed z-50'
            } transition-all duration-300 ease-linear`}
        >
            <Link href={'/'} className={'text-3xl font-semibold block'}>
                <img
                    className={`${
                        isHomePage ? (windowHeight >= 100 ? 'h-12' : ' h-16') : 'h-12'
                    } transition-all duration-300 ease-linear`}
                    src={`/logo/${
                        isHomePage ? (windowHeight >= 100 ? 'lexstayz-high-resolution-logo-transparent.png' : 'lexstayz-high-resolution-logo-white-transparent.png') :
                            'lexstayz-high-resolution-logo-transparent.png'
                    }`}
                    alt={'logo'}
                />
            </Link>
            {userDetails ?
                <UserWidget /> :
                <Link href={'/login'}
                      className={`py-1 px-4 rounded-xl border text-lg font-medium w-max h-max ${
                          windowHeight < 100 && isHomePage ? ' border-white text-white hover:bg-white hover:text-dark' :
                              'border-black text-black hover:bg-primary hover:text-white'
                      }`}
                >
                    Login
                </Link>
            }
        </div>
    );
}
