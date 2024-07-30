import {Card, Carousel, Image} from "antd";


export default function StayWidget({stay}: {stay: any}) {

    return <Card className={'rounded-xl'}>
        <Carousel autoplay={false} arrows>
            <Image className={'aspect-video w-full'} src={stay.poster} alt={''}/>
            {stay.images.map((image:string, index:number) => <Image className={'aspect-video w-full'} key={index} src={image} alt={'Image'}/>)}
        </Carousel>
        <h2 className={'font-bold mt-4 mb-0'}>{stay.name}</h2>
        <h3 className={'text-gray-400 font-semibold mt-0'}>{stay.location.city}, {stay.location.country}</h3>
    </Card>
}