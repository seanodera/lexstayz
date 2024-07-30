import {Card} from "antd";


export default function BookingUserDetails({booking}: {booking: any}){

    return <Card className={'rounded-xl'}>
        <div className={'text-xl font-semibold mb-4'}>Main Guest</div>
        <div className={'grid grid-cols-2'}>
            <div className={''}>
                <h3 className={'mb-0'}>First Name</h3>
                <h3 className={'font-bold'}>{booking.user.firstName}</h3>
            </div>
            <div className={''}>
                <h3 className={'mb-0'}>Last Name</h3>
                <h3 className={'font-bold'}>{booking.user.lastName}</h3>
            </div>
            <div className={'col-span-2'}>
                <h3 className={'mb-0'}>Email address</h3>
                <h3 className={'font-bold'}>{booking.user.email}</h3>
            </div>
            <div className={''}>
                <h3 className={'mb-0'}>Phone Number</h3>
                <h3 className={'font-bold'}>{booking.user.phone}</h3>
            </div>
        </div>
    </Card>
}