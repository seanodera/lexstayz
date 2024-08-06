'use client'
import {useAppSelector} from "@/hooks/hooks";
import {selectWishlist} from "@/slices/authenticationSlice";
import {selectAllStays} from "@/slices/staysSlice";


export default function WishlistPage(){
    const wishlist = useAppSelector(selectWishlist)
    const stays = useAppSelector(selectAllStays)
    return <div className={'pt-24'}>

    </div>
}