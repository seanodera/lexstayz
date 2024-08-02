'use client'
import Navbar from "@/components/navigation/Navbar";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {fetchBookingsAsync, selectIsLoading} from "@/slices/bookingSlice";
import Preloader from "@/components/preloader/preloader";
import LoadingScreen from "@/components/LoadingScreen";
import AuthenticationProvider, {authRoutes} from "@/contex/authenticationProvider";
import {usePathname, useRouter} from "next/navigation";
import {getAuth} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {loginUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {fetchStaysAsync, selectHasRun} from "@/slices/staysSlice";

const authNeededRoutes = ['/bookings', '/booking-confirmation', '/checkout']

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const hasRun = useAppSelector(selectHasRun)
    const isLoading = useAppSelector(selectIsLoading)
    const currentUser = useAppSelector(selectCurrentUser)

    const router = useRouter();
    const [hasRunLocal,setHasRunLocal] =   useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const user = getAuth().currentUser;

               if (!hasRun) {
                   setHasRunLocal(true)

                   // @ts-ignore
                   dispatch(fetchStaysAsync());

               }

            if (user) {
                if (currentUser.uid !== user.uid){
                    const userDetails = await getUserDetails(user.uid);
                    if (userDetails){
                        dispatch(loginUser(userDetails));
                    } else {
                        router.push('/user-information')
                    }
                } else {

                }
            }
        };
        fetchData()
    })
    useEffect(()=> {
        const user = getAuth().currentUser;
        if (user){
            if (!currentUser.uid){

            }
        }
    })
    if (isLoading) {
        return <div className={'h-screen w-screen'}>
            <LoadingScreen/>
        </div>;
    } else if (authRoutes.includes(pathname)) {
        return <div>{children}</div>
    } else if (authNeededRoutes.includes(pathname)) {
        return <AuthenticationProvider>{children}</AuthenticationProvider>
    } else {
        return <div>
            <Navbar/>
            <main className={'h-full w-full'}>{children}</main>
        </div>
    }
}