import {Carousel, Image} from "antd";


export default function HomeItem({stay}: { stay: any }) {

    return <div>
        <div className={'aspect-video relative'}>
            <Image.PreviewGroup>
                <Carousel>
                    <Image src={stay.poster} alt={''} className={'object-cover rounded-xl'}/>
                    {stay.images.map((image: string, index: number) => <Image src={image} alt={'Image'} key={index}
                                                                              className={'object-cover rounded-xl'}/>)}
                </Carousel>
            </Image.PreviewGroup>
        </div>
    </div>
}