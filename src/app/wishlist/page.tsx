'use client'
import {useAppSelector} from "@/hooks/hooks";
import {selectWishlist} from "@/slices/authenticationSlice";
import {selectAllStays} from "@/slices/staysSlice";
import HotelItem from "@/components/Grid Items/HotelItem";


export default function WishlistPage(){
    const wishlist = useAppSelector(selectWishlist)
    const stays = useAppSelector(selectAllStays)
    return <div className={'pt-24 px-7 md:px-24'}>
        <div className={'text-2xl font-semibold mb-4'}>Wishlist</div>
        <div className={'grid grid-cols-4 gap-4'}>
            {stays.filter((value: any, index: number) => wishlist.includes(value.id)).map((value: any, index: number) => <div key={index} className={'bg-white rounded-xl p-4'}><HotelItem hotel={value}/></div>)}
        </div>
    </div>
}