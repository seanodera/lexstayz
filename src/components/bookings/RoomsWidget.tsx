'use client'
import {Button, Card, Modal} from "antd";
import {toMoneyFormat} from "@/lib/utils";
import {ReloadOutlined} from "@ant-design/icons";
import {useState} from "react";
import PaymentMethods from "@/components/confirm-booking/paymentMethods";
import {useAppDispatch} from "@/hooks/hooks";
import {setBookingStay, updateBookingData, updateContact} from "@/slices/confirmBookingSlice";
import {payExistingBooking} from "@/slices/confirmBookingThunks/payExistingBooking";
import { useRouter } from "next/navigation";


export default function RoomsWidget({booking, stay}: { booking: any, stay: any }) {
    const stayCurrency = stay.currency ? stay.currency : 'USD'
    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    return <Card className={'rounded-xl'}>
        <div className={'text-xl font-semibold'}>Price Breakdown</div>
        <hr className={'mb-4'}/>
        <div>
            {stay.type === 'Hotel' ? booking.rooms.map((value: any, index: number) => <h4 key={index}
                                                                                          className={'flex justify-between h3'}>
                <div
                    className={'flex gap-4 capitalize'}>{value.numRooms} {value.name}</div>
                <div className={'text-primary'}>{booking.currency} {toMoneyFormat(value.price * booking.usedRate)}</div>
            </h4>) : <div></div>}
            {stay.type === 'hotel' && <hr/>}

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
                    <div
                        className={`${booking.isConfirmed ? 'text-current' : booking.status === 'Pending' ? 'text-warning' : 'text-danger'}`}>
                        <h3 className={'mb-0'}>You {booking.isConfirmed ? 'Paid' : 'Owe'}</h3>
                        <h3 className={'font-bold mb-0'}>{booking.paymentCurrency} {toMoneyFormat(booking.grandTotal * booking.paymentRate)}</h3>
                        <h4 className={'text-gray-400'}>{booking.paymentCurrency} {toMoneyFormat(booking.fees * booking.paymentRate)} Fees</h4>
                        {!booking.isConfirmed && <Button type={'text'} className={'text-primary'} onClick={() => {
                            dispatch(setBookingStay(stay))
                            dispatch(updateBookingData({numGuests: booking.numGuests,checkInDate: booking.checkInDate,checkOutDate: booking.checkOutDate}))
                            dispatch(updateContact(booking.user))
                            setShowModal(true);
                        }} icon={<ReloadOutlined/>}>Retry Payment</Button>}
                    </div>
                </div>
            </div>
        </div>
        <RetryPaymentModal show={showModal} setShow={setShowModal} booking={booking} />
    </Card>

}

export function RetryPaymentModal({show, setShow, booking}: { show: boolean, setShow: (value: boolean) => void, booking: any }) {
const dispatch = useAppDispatch();
const router = useRouter();
function proceedWithPayment (){
    dispatch(payExistingBooking(booking)).then((value) => {
        if (value.meta.requestStatus === 'fulfilled') {
            router.push(value.payload)
        }
    })
}
    return <Modal open={show} onCancel={() => setShow(false)} onClose={() => setShow(false)} footer={null}>
       <div className={'py-8 px-4 space-y-4'}>
           <PaymentMethods/>
           <Button size={'large'} type={'primary'} onClick={() => proceedWithPayment()}>Pay Now</Button>
       </div>
    </Modal>
}
