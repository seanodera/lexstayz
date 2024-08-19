'use client'
import {Button, Carousel, Image, Rate, Tooltip} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {deleteFromWishList, selectWishlist, updateWishList} from "@/slices/authenticationSlice";
import Link from "next/link";
import {HeartFilled, HeartOutlined, StarFilled} from "@ant-design/icons";
import {Ellipsis} from "react-bootstrap/PageItem";
import {formatRating, roundToNearest5, toMoneyFormat} from "@/lib/utils";
import {selectExchangeRate, selectGlobalCurrency} from "@/slices/staysSlice";


export default function HomeItem({stay}: { stay: any }) {
    const {poster, name, id, location, rating, maxGuests, description, images} = stay;
    const wishlist = useAppSelector(selectWishlist)
    const dispatch = useAppDispatch()
    const globalCurrency = useAppSelector(selectGlobalCurrency)
    const exchangeRates = useAppSelector(selectExchangeRate)

    function handleWishlist(e: any) {
        e.preventDefault();
        if (wishlist.includes(id)) {
            dispatch(deleteFromWishList({stayId: id})).then((value) => {

            })
        } else {

            dispatch(updateWishList({stayId: id})).then((value) => {

            })
        }
    }

    function calculatePrice() {
        let price = 0
        if (exchangeRates[ stay.currency ] && stay.currency !== globalCurrency) {
            price = stay.price * 1.02 / exchangeRates[ stay.currency ]
        } else {
            price = stay.price
        }
        return toMoneyFormat(price);
    }

    return <div
        className={'text-current rounded-xl transition-all duration-300 ease-in-out'}>
        <div className={'relative'}>
            <Link href={`/stay/${id}`} className={'block aspect-video '}>
                <Image.PreviewGroup>
                    <Carousel>
                        <Image src={poster} alt={''} className={'object-cover rounded-xl aspect-video'}/>
                        {images.slice(0, 3).map((image: string, index: number) => <Image src={image} alt={'Image'}
                                                                                         key={index}
                                                                                         className={'object-cover rounded-xl aspect-video'}/>)}
                    </Carousel>
                </Image.PreviewGroup>
            </Link>
            <div className={'absolute right-0 top-0 p-3'}>
                <Tooltip title={'Wishlist'}>
                    <Button className={'bg-white'} size={'large'} onClick={handleWishlist}
                            icon={(wishlist.includes(id)) ? <HeartFilled className={'text-primary'}/> :
                                <HeartOutlined/>} shape={'circle'}/>
                </Tooltip>
            </div>
        </div>
        <Link href={`/stay/${id}`} className={'block text-current'}>
            <div className={'flex items-center justify-between '}>
                <div className={'py-2'}>
                    <h3 className={'font-medium  mb-0 leading-none'}>{name}</h3>
                    <h3 className={'font-light   leading-none text-gray-400 line-clamp-1'}>{location.city}, {location.country}</h3>
                </div>

                <span><StarFilled className={'text-primary'}/> {formatRating(rating || 0.0)}</span>

            </div>
            <div className={'max-md:text-sm flex flex-nowrap'}>
                <p className={'line-clamp-1 text-nowrap flex-nowrap'}>{description}</p>
            </div>
            <h4 className={'text-primary leading-none font-medium text-nowrap'}>
                {globalCurrency} {calculatePrice()} / night</h4>
        </Link>
    </div>
}