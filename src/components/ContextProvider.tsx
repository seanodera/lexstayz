'use client'
import Navbar from "@/components/Navbar";
import {useEffect} from "react";
import {useAppDispatch} from "@/hooks/hooks";
import hotelsData from "@/data/hotelsData";
import {setAllStays} from "@/slices/bookingSlice";

export default function ContextProvider({children}: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    useEffect(() => {
        const stays = hotelsData;
        dispatch(setAllStays(stays));
    },)
    return <div>
        <Navbar/>
        <main>{children}</main>
    </div>
}