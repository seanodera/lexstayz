"use client";
import LoadingScreen from "@/components/LoadingScreen";
import Footer from "@/components/navigation/Footer";
import Navbar from "@/components/navigation/Navbar";
import AuthenticationProvider, {
    authRoutes,
} from "@/contex/authenticationProvider";
import { getUserDetails } from "@/data/usersData";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { auth } from "@/lib/firebase";
import {
    initializeAppAsync,
    loginUser,
    logoutUser,
    selectCurrentUser,
} from "@/slices/authenticationSlice";
import { fetchBookingsAsync, selectIsLoading } from "@/slices/bookingSlice";
import {
    fetchExchangeRates,
    fetchPawaPayConfigs,
} from "@/slices/confirmBookingSlice";
import {
    fetchStaysAsync,
    selectHasRun,
    selectIsStayLoading,
} from "@/slices/staysSlice";
import {
    browserLocalPersistence,
    getAuth,
    onAuthStateChanged,
    setPersistence,
} from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const authNeededRoutes = [
  "bookings",
  "booking-confirmation",
  "checkout",
  "wishlist",
  "profile",
  "messages",
  "book-firm",
];

export default function ContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const hasRun = useAppSelector(selectHasRun);
  const isLoading = useAppSelector(selectIsLoading);
  const isStayLoading = useAppSelector(selectIsStayLoading);
  const currentUser = useAppSelector(selectCurrentUser);
  const {initialized, appLoading} = useAppSelector(state => state.authentication)
  const router = useRouter();
  const [hasRunLocal, setHasRunLocal] = useState(false);

  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
        if (!appLoading && !initialized){
            await dispatch(initializeAppAsync())
        }
    };

    fetchInitialData();
  }, []);

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
              router.push("/user-information");
            }
          }
        } else {
          if (currentUser) {
            dispatch(logoutUser());
            router.push("/");
          }
        }
      });
    };
    console.log("Context csledl");
    if (!userLoaded) {
      initializeAuth();
    }
  }, []);
  const { isLoading: isMessagingLoading } = useAppSelector(
    (state) => state.messaging
  );
  const { status } = useAppSelector((state) => state.confirmBooking);
  const { isLoading: isAuthLoading } = useAppSelector(
    (state) => state.authentication
  );

  if (
    appLoading ||
    isLoading ||
    isStayLoading ||
    status === "loading" ||
    isAuthLoading ||
    isMessagingLoading
  ) {
    console.log(
        appLoading,
      isLoading,
      isStayLoading,
      status === "loading",
      isAuthLoading,
      isMessagingLoading
    );
    return (
      <div className={"h-screen w-screen"}>
        <LoadingScreen />
      </div>
    );
  } else if (authRoutes.includes(pathname)) {
    return <div>{children}</div>;
  } else if (
    pathname.split("/").length > 1 &&
    authNeededRoutes.includes(pathname.split("/")[1])
  ) {
    return <AuthenticationProvider>{children}</AuthenticationProvider>;
  } else {
    return (
      <div className={"min-h-screen"}>
        {pathname === "/" ? (
          <Navbar />
        ) : (
          <div>
            <Navbar />
          </div>
        )}
        <div
          className={pathname === "/" ? "" : "h-full overflow-auto pt-[4.5rem]"}
        >
          {children}
        </div>
        <Footer />
      </div>
    );
  }
}
