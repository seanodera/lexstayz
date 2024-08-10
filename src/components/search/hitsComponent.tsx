import { Highlight } from "react-instantsearch";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { deleteFromWishList, selectCurrentUser, selectWishlist, updateWishList } from "@/slices/authenticationSlice";
import Link from "next/link";
import { Button, Carousel, Image, Rate, Tooltip } from "antd";
import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import { Ellipsis } from "react-bootstrap/PageItem";
import { toMoneyFormat } from "@/lib/utils";

export default function HitsComponent({ hit }:{hit:any}) {
    const { poster, id, location, rating, maxGuests, description, images, rooms } = hit;
    const descriptionLimit = 50;
    const wishlist = useAppSelector(selectWishlist);
    const dispatch = useAppDispatch();

    function handleWishlist(e: any) {
        e.preventDefault();
        if (wishlist.includes(id)) {

            // @ts-ignore
            dispatch(deleteFromWishList({ stayId: id })).then((value) => {
                console.log(value);
            });
        } else {
            // @ts-ignore
            dispatch(updateWishList({ stayId: id })).then((value) => {
                console.log(value);
            });
        }
    }

    const user = useAppSelector(selectCurrentUser);

    return (
        <div className={'text-current rounded-xl transition-all duration-300 ease-in-out'}>
            <div className={'relative z-0'}>
                <Link href={`/stay/${id}`} className={'block aspect-video'}>
                    <Image.PreviewGroup>
                        <Carousel>
                            <Image src={poster} alt={''} className={'object-cover rounded-xl aspect-video'} />
                            {images.slice(0, 3).map((image: string, index: number) => (
                                <Image
                                    src={image}
                                    alt={'Image'}
                                    key={index}
                                    className={'object-cover rounded-xl aspect-video'}
                                />
                            ))}
                        </Carousel>
                    </Image.PreviewGroup>
                </Link>
                <div className={'absolute right-0 top-0 p-3 z-20'}>
                    <Tooltip title={'Wishlist'}>
                        <Button
                            className={'bg-white'}
                            size={'large'}
                            onClick={handleWishlist}
                            icon={wishlist.includes(id) ? <HeartFilled className={'text-primary'} /> : <HeartOutlined />}
                            shape={'circle'}
                        />
                    </Tooltip>
                </div>
            </div>
            <Link href={`/stay/${id}`} className={'block text-current'}>
                <div className={'flex items-center justify-between'}>
                    <div className={'py-2'}>
                        <h3 className={'font-medium mb-0 leading-none'}>
                            <Highlight attribute="name" hit={hit} />
                        </h3>
                        <h3 className={'font-light leading-none text-gray-400 line-clamp-1'}>
                            <Highlight attribute="location.city" hit={hit} />,{' '}
                            <Highlight attribute="location.country" hit={hit} />
                        </h3>
                    </div>
                    <div className={'flex flex-col justify-start'}>
                        <Rate count={5} disabled value={rating} className={'text-primary text-sm my-0'} />
                    </div>
                </div>
                <div className={'max-md:text-sm flex flex-nowrap'}>
                    <p className={'line-clamp-1 text-nowrap flex-nowrap'}>
                        <Highlight attribute="description" hit={hit} />
                    </p>
                    {description.length > descriptionLimit && <Ellipsis className={'flex-nowrap text-nowrap'} />}
                </div>
                <h4 className={'text-primary leading-none font-medium text-nowrap'}>
                    From $ {toMoneyFormat(0)} / night
                </h4>
            </Link>
        </div>
    );
}
