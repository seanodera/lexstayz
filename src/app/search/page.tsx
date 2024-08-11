'use client'
import SearchComponent from "@/components/search/searchComponent";
import {Suspense} from "react";


export default function SearchPage() {
    return <Suspense fallback={null}><SearchComponent/></Suspense>;
}
