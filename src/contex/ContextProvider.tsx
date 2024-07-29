'use client'
import Navbar from "@/components/Navbar";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import 'antd/dist/reset.css';
import {fetchStaysAsync, selectHasRun, selectIsLoading, setAllStays} from "@/slices/bookingSlice";
import Preloader from "@/components/preloader/preloader";
import LoadingScreen from "@/components/LoadingScreen";
import AuthenticationProvider, {authRoutes} from "@/contex/authenticationProvider";
import {usePathname, useRouter} from "next/navigation";
import {getAuth} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {loginUser, selectCurrentUser} from "@/slices/authenticationSlice";

const authNeededRoutes = ['/bookings', '/booking-confirmation', '/checkout']

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const hasRun = useAppSelector(selectHasRun)
    const isLoading = useAppSelector(selectIsLoading)
    const currentUser = useAppSelector(selectCurrentUser)
    const router = useRouter();
    useEffect(() => {
        const fetchData = async () => {
            if (!hasRun) {
                const user = getAuth().currentUser;
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
                // @ts-ignore
                dispatch(fetchStaysAsync());
            }
        };
        fetchData()
    },)
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