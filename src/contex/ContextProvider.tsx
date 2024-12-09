'use client'
import Navbar from "@/components/navigation/Navbar";
import {useContext, useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {fetchBookingsAsync, selectIsLoading} from "@/slices/bookingSlice";
import LoadingScreen from "@/components/LoadingScreen";
import AuthenticationProvider, {authRoutes} from "@/contex/authenticationProvider";
import {usePathname, useRouter} from "next/navigation";
import {browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {loginUser, logoutUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {fetchStaysAsync, selectHasRun, selectIsStayLoading} from "@/slices/staysSlice";
import Footer from "@/components/navigation/Footer";
import {fetchExchangeRates} from "@/slices/confirmBookingSlice";
import ErrorContext from "@/contex/errorContext";
import {auth} from "@/lib/firebase";


const authNeededRoutes = ['bookings', 'booking-confirmation', 'checkout', 'wishlist', 'profile', 'messages', 'book-firm']

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const pathname = usePathname()
    const dispatch = useAppDispatch();
    const hasRun = useAppSelector(selectHasRun)
    const isLoading = useAppSelector(selectIsLoading)
    const isStayLoading = useAppSelector(selectIsStayLoading)
    const currentUser = useAppSelector(selectCurrentUser)

    const router = useRouter();
    const [hasRunLocal, setHasRunLocal] = useState(false)

    const [userLoaded, setUserLoaded] = useState(false);


    useEffect(() => {
        const fetchInitialData = async () => {
            const user = getAuth().currentUser;

            if (!hasRun) {
                setHasRunLocal(true);
                dispatch(fetchStaysAsync());
                // You only want to fetch these once
                dispatch(fetchExchangeRates());

                if (user) {
                    dispatch(fetchBookingsAsync());
                }
            }
        };

        fetchInitialData();
    }, [hasRun, dispatch]);


    // useEffect(() => {
    //     const initializeUserState = async () => {
    //         const user = getAuth().currentUser;
    //
    //         if (user) {
    //             if (!currentUser || currentUser.uid !== user.uid) {
    //                 const userDetails = await getUserDetails(user.uid);
    //                 if (userDetails) {
    //                     await dispatch(loginUser(userDetails));
    //                 } else {
    //                     router.push('/user-information');
    //                 }
    //             }
    //         }
    //     };
    //
    //     initializeUserState();
    // }, [currentUser, dispatch, router]);

    useEffect(() => {
        const initializeAuth = async () => {
            await setPersistence(auth, browserLocalPersistence);
            onAuthStateChanged(auth, async (user) => {
                setUserLoaded(true);
                if (user) {
                    if (!currentUser || currentUser.uid !== user.uid) {
                        const userDetails = await getUserDetails(user.uid);
                        if (userDetails) {
                            await dispatch(loginUser(userDetails));

                        } else {
                            router.push('/user-information');
                        }
                    }
                } else {
                    if (currentUser){
                        dispatch(logoutUser());
                        router.push('/');
                    }
                }
            });
        };
        console.log('Context csledl')
        if (!userLoaded) {
            initializeAuth();
        }
    }, []);
    const {
        isLoading: isMessagingLoading,
    } = useAppSelector(state => state.messaging)
    const {status} = useAppSelector(state => state.confirmBooking)
    const {
        isLoading: isAuthLoading,

    } = useAppSelector(state => state.authentication)

    if (isLoading || isStayLoading || status === 'loading' || isAuthLoading || isMessagingLoading) {
        console.log(isLoading, isStayLoading, status === 'loading' , isAuthLoading , isMessagingLoading)
        return <div className={'h-screen w-screen'}>
            <LoadingScreen/>
        </div>;
    } else if (authRoutes.includes(pathname)) {
        return <div>{children}</div>
    } else if (pathname.split('/').length > 1 && authNeededRoutes.includes(pathname.split('/')[ 1 ])) {

        return <AuthenticationProvider>{children}</AuthenticationProvider>
    } else {
        return <div className={'min-h-screen'}>
            {pathname === '/' ? <Navbar/> : <div><Navbar/></div>}
            <div className={pathname === '/' ? '' : 'h-full overflow-auto pt-auto'}>{children}</div>
            <Footer/>

        </div>
    }
}
