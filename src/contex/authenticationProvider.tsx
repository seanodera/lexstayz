'use client'
import {ReactNode, Suspense, useEffect, useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {loginUser, logoutUser, selectCurrentUser} from "@/slices/authenticationSlice";
import {auth} from "@/lib/firebase";
import {browserLocalPersistence, onAuthStateChanged, setPersistence} from "firebase/auth";
import {getUserDetails} from "@/data/usersData";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import Navbar from "@/components/Navbar";
import LoadingScreen from "@/components/LoadingScreen";

export const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/user-information']

export default function AuthenticationProvider({ children }: { children: ReactNode }) {
    const [userLoaded, setUserLoaded] = useState(false);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser)
    const pathname = usePathname();
    const router = useRouter();
    const isAuthRoute = authRoutes.includes(pathname);
    console.log('Authentication Provider')
    useEffect(() => {
        const initializeAuth = async () => {
            await setPersistence(auth, browserLocalPersistence);
            onAuthStateChanged(auth, async (user) => {
                console.log(user)
                if (user) {
                    if (currentUser.uid !== user.uid){
                        const userDetails = await getUserDetails(user.uid);
                        if (userDetails){
                        dispatch(loginUser(userDetails));
                        setUserLoaded(true)
                        } else {
                            router.push('/user-information')
                        }
                    }
                } else {
                    if (!isAuthRoute) {
                        setUserLoaded(false)
                        dispatch(logoutUser({}));
                        router.push('/login');
                    }
                }
            });
        };
        if (!userLoaded){
            initializeAuth();
        }
    }, []);
    return <Suspense fallback={null}>
        <div>
            <Navbar/>
            <main>{children}</main>
        </div>
    </Suspense>
}