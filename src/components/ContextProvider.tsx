'use client'
import Navbar from "@/components/Navbar";
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";

import {fetchStaysAsync, selectHasRun, selectIsLoading, setAllStays} from "@/slices/bookingSlice";
import Preloader from "@/components/preloader/preloader";
import LoadingScreen from "@/components/LoadingScreen";

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
  const hasRun = useAppSelector(selectHasRun)
    const isLoading = useAppSelector(selectIsLoading)
    useEffect(() => {
        const fetchData = async () => {
            if (!hasRun) {

                // @ts-ignore
                dispatch(fetchStaysAsync());
            }
        };
        fetchData()
    },)
    if (isLoading){
        return <div className={'h-screen w-screen'}>
            <LoadingScreen />
        </div> ;
    } else {
    return <div>
        <Preloader/>
        <Navbar/>
        <main>{children}</main>
    </div>}
}