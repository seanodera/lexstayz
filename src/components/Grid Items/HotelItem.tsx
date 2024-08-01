import {MdOutlineBathroom, MdOutlineBathtub, MdPersonOutline} from "react-icons/md";
import {IoBedOutline} from "react-icons/io5";
import Link from "next/link";
import {Button, Carousel, Image, Rate, Tooltip} from "antd";
import {useEffect} from "react";
import {toMoneyFormat} from "@/lib/utils";
import {Ellipsis} from "react-bootstrap/PageItem";
import {HeartOutlined} from "@ant-design/icons";


export default function HotelItem({hotel}: {
    hotel: {
        poster: string, name: string, id: number, location: {
            city: string,
            country: string,
        }, rating?: number, maxGuests: number, description: string, images: string[], rooms: any[]
    }
}) {
    const {poster, name, id, location, rating, maxGuests, description, images, rooms} = hotel;
    const descriptionLimit = 50;

    return <Link href={`/stay/${id}`}
                 className={'text-current rounded-xl gap-3 transition-all duration-300 ease-in-out'}>
        <div>
            <div className={'relative'}>
                <div className={'aspect-video '}>
                    <Image.PreviewGroup>
                        <Carousel>
                            <Image src={poster} alt={''} className={'object-cover rounded-xl aspect-video'}/>
                            {images.slice(0, 3).map((image: string, index: number) => <Image src={image} alt={'Image'}
                                                                                             key={index}
                                                                                             className={'object-cover rounded-xl aspect-video'}/>)}
                        </Carousel>
                    </Image.PreviewGroup>
                </div>
                <div className={'absolute right-0 top-0 p-3'}>
                    <Tooltip title={'Wishlist'}>
                        <Button className={'bg-white'} size={'large'} icon={<HeartOutlined/>} shape={'circle'}/>
                    </Tooltip>
                </div>
            </div>
            <div className={'flex items-center justify-between '}>
                <div className={'py-2'}>
                    <h3 className={'font-medium  mb-0 leading-none'}>{name}</h3>
                    <h3 className={'font-light   leading-none text-gray-400 line-clamp-1'}>{location.city}, {location.country}</h3>
                </div>
                <div className={'flex flex-col justify-start'}>
                    <Rate count={5} value={3} className={'text-primary text-sm my-0'}/>
                </div>
            </div>
            <div className={'max-md:text-sm flex flex-nowrap'}>
                <p className={'line-clamp-1 text-nowrap flex-nowrap'}>{description}</p>{(description.length > descriptionLimit) &&
                <Ellipsis
                    className={'flex-nowrap text-nowrap'}/>}
            </div>
            <h4 className={'text-primary leading-none font-medium text-nowrap'}>From
                $ {toMoneyFormat(getLowestPrice(rooms))} / night</h4>
        </div>
    </Link>
}


function getLowestPrice(rooms: any[]) {
    let lowest = 100000;
    rooms.forEach((room) => {
        if (room.price < lowest) {
            lowest = room.price;
        }
    })
    return lowest;
}