import {Rate} from "antd";
import {dateReader} from "@/lib/utils";
import {useState} from "react";


export default function StayReviews() {
    const [reviews, setReviews] = useState<any[]>([])
    return <div>
        <h2 className={'text-2xl font-semibold'}>Reviews</h2>
        <div className={'grid grid-cols-2 gap-4 mt-4'}>
            {reviews.map((review: any, index: number) => <Review review={review} key={index}/>)}
        </div>
    </div>
}

function Review({review}: { review: any }) {
    return <div className={'rounded-xl p-4 bg-white shadow'}>
        <h3 className={'font-bold'}>{review.user.firstName}</h3>
        <div><Rate value={review.rating}/> <h4 className={'font-bold'}>{dateReader({
            date: review.date,
            day: false
        })}</h4></div>
        <div className={''}>
            <p className={'line-clamp-4'}>{review.message}</p>
        </div>
    </div>
}