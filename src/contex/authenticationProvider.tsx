'use client'
import {ReactNode, Suspense, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {loginUser, logoutUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {auth} from "@/lib/firebase";
import {browserLocalPersistence, getAuth, onAuthStateChanged, setPersistence} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import Navbar from "@/components/navigation/Navbar";
import {fetchBookingsAsync, selectHasBookingRun} from "@/slices/bookingSlice";
import {fetchUserChatsAsync} from "@/slices/messagingSlice";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/user-information']

export default function AuthenticationProvider({children}: { children: ReactNode }) {
    const [userLoaded, setUserLoaded] = useState(false);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser)
    const pathname = usePathname();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(pathname);
    const hasBookingsRun = useAppSelector(selectHasBookingRun);
    console.log('Authentication Provider')
    useEffect(() => {
        const initializeAuth = async () => {
            await setPersistence(auth, browserLocalPersistence);
            onAuthStateChanged(auth, async (user) => {
                console.log(user)
                if (user) {
                    if (!currentUser || currentUser.uid !== user.uid) {
                        const userDetails = await getUserDetails(user.uid);
                        if (userDetails) {
                            dispatch(loginUser(userDetails));
                            setUserLoaded(true)
                        } else {
                            router.push('/user-information')
                        }
                    }
                } else {
                    if (!isAuthRoute) {
                        setUserLoaded(false)
                        dispatch(logoutUser());
                        router.push('/');
                    }
                }
            });
        };
        if (!userLoaded) {
            initializeAuth();
        }
        const user = getAuth().currentUser
        if (user && !hasBookingsRun) {
            console.log('bookings')

            dispatch(fetchBookingsAsync());


            dispatch(fetchUserChatsAsync())
        }
    });
    return <Suspense fallback={null}>
        <div className={''}>
            <Navbar/>
            <main className={''}>{children}</main>
        </div>
    </Suspense>
}