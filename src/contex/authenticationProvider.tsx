'use client'
import {ReactNode, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {getAuth} from "firebase/auth";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import Navbar from "@/components/navigation/Navbar";
import {fetchBookingsAsync, selectHasBookingRun} from "@/slices/bookingSlice";
import {fetchUserChatsAsync} from "@/slices/messagingSlice";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/user-information']

export default function AuthenticationProvider({children}: { children: ReactNode }) {

    const dispatch = useAppDispatch();

    const pathname = usePathname();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(pathname);
    const hasBookingsRun = useAppSelector(selectHasBookingRun);
    const pathName = usePathname()


    useEffect(() => {
        const user = getAuth().currentUser;
        if (!user && isAuthRoute){
            router.push("/login");
        }
    }, [isAuthRoute, pathname, router]);

    useEffect(() => {
        const user = getAuth().currentUser;

        if (user && !hasBookingsRun) {
            dispatch(fetchBookingsAsync());
            dispatch(fetchUserChatsAsync());
        }
    }, [dispatch, hasBookingsRun]);
    const isMessagePage = pathName.startsWith('/messages')
    return <main className={`${isMessagePage ? 'h-screen overflow-hidden' : 'overflow-auto '}`}>
        <Navbar/>
        <div className={`${isMessagePage ? 'h-[calc(100%_-_4.5rem)]':'pt-[4.5rem]'}`}>
            <div className={isMessagePage ? 'h-full overflow-auto ' :'h-full overflow-auto'}>{children}</div>
        </div>
    </main>
}
