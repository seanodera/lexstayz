'use client'
import Navbar from "@/components/navigation/Navbar";
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectIsLoading} from "@/slices/bookingSlice";
import LoadingScreen from "@/components/LoadingScreen";
import AuthenticationProvider, {authRoutes} from "@/contex/authenticationProvider";
import {usePathname, useRouter} from "next/navigation";
import {getAuth} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {loginUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {fetchStaysAsync, selectHasRun, selectIsStayLoading} from "@/slices/staysSlice";
import ErrorDialog from "@/components/dialogs/ErrorDialog";
import Footer from "@/components/navigation/Footer";

const authNeededRoutes = ['/bookings', '/booking-confirmation', '/checkout', '/wishlist', '/profile', '/messages']

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const hasRun = useAppSelector(selectHasRun)
    const isLoading = useAppSelector(selectIsLoading)
    const isStayLoading = useAppSelector(selectIsStayLoading)
    const currentUser = useAppSelector(selectCurrentUser)

    const router = useRouter();
    const [hasRunLocal,setHasRunLocal] =   useState(false)
    useEffect(() => {
        const fetchData = async () => {
            const user = getAuth().currentUser;

               if (!hasRun) {
                   setHasRunLocal(true)


                   dispatch(fetchStaysAsync());

               }

            if (user) {
                if (!currentUser || currentUser.uid !== user.uid){
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
            if (!currentUser){

            }
        }
    })
    if (isLoading || isStayLoading) {
        return <div className={'h-screen w-screen'}>
            <LoadingScreen/>
        </div>;
    } else if (authRoutes.includes(pathname)) {
        return <div>{children}</div>
    } else if (authNeededRoutes.includes(pathname)) {
        return <AuthenticationProvider>{children}</AuthenticationProvider>
    } else {
        return <div className={''}>
            <Navbar/>
            {children}
            <Footer/>
            <ErrorDialog/>

        </div>
    }
}