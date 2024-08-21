import {Card} from "antd";
import {toMoneyFormat} from "@/lib/utils";


export default function RoomsWidget({booking, stay}: { booking: any,stay: any }) {
    const stayCurrency = stay.currency? stay.currency : 'USD'
    return <Card className={'rounded-xl'}>
        <div className={'text-xl font-semibold'}>Price Breakdown</div>
        <hr className={'mb-4'}/>
        <div>
            {stay.type === 'Hotel'? booking.rooms.map((value: any, index: number) => <h4 key={index} className={'flex justify-between h3'}>
                    <div
                        className={'flex gap-4 capitalize'}>{value.numRooms} {value.name}</div>
                    <div className={'text-primary'}>{booking.currency} {toMoneyFormat(value.price * booking.usedRate)}</div>
                </h4>) : <div></div>}
            <hr/>

            <div className={'grid grid-cols-2'}>
                <div>
                    <div className={''}>
                        <h3 className={'mb-0'}>Subtotal</h3>
                        <h3 className={'font-bold'}>{booking.currency} {toMoneyFormat(booking.subtotal)}</h3>
                    </div>
                    <div className={''}>
                        <h3 className={'mb-0'}>Booking Fees</h3>
                        <h3 className={'font-bold'}>{booking.currency} {toMoneyFormat(booking.fees)}</h3>
                    </div>
                </div>
                <div className={'flex flex-col justify-center'}>
                    <div className={`${booking.isConfirmed?  'text-current':  booking.status === 'Pending'? 'text-warning' :'text-danger'}`}>
                        <h3 className={'mb-0'}>You {booking.isConfirmed? 'Paid': 'Owe'}</h3>
                        <h3 className={'font-bold mb-0'}>{booking.paymentCurrency} {toMoneyFormat(booking.grandTotal * booking.paymentRate)}</h3>
                        <h4 className={'text-gray-400'}>{booking.paymentCurrency} {toMoneyFormat(booking.fees  * booking.paymentRate)} Fees</h4>
                    </div>
                </div>
            </div>
        </div>
    </Card>

}