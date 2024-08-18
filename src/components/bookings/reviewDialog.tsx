'use client'
import {Description, Dialog, DialogPanel, DialogTitle, Input, Textarea} from "@headlessui/react";
import {Button, Rate, Slider} from "antd";
import {useState} from "react";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {writeReview} from "@/slices/bookingSlice";
import {generateID, getCurrentUser} from "@/data/bookingData";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function ReviewDialog({isOpen, setIsOpen, stay, booking}: {
    isOpen: boolean,
    setIsOpen: any,
    booking: any,
    stay: any
}) {
    const [comfort, setComfort] = useState<number>(1)
    const [cleanliness, setCleanliness] = useState<number>(1)
    const [location, setLocation] = useState<number>(1)
    const [staff, setStaff] = useState<number>(1)
    const [facilities, setFacilities] = useState<number>(1)
    const [valueForMoney, setValueForMoney] = useState<number>(1)
    const dispatch = useAppDispatch()
    const userDetails = useAppSelector(selectCurrentUser);

    function handleSubmit() {
        const sum = comfort +
            cleanliness +
            location +
            staff +
            facilities +
            valueForMoney
        const avg = sum / 6
        if (userDetails) {
            dispatch(writeReview({
                id: generateID(),
                bookingId: booking.id,
                stayId: stay.id,
                comfort,
                cleanliness,
                location,
                staff,
                facilities,
                valueForMoney,
                createdAt: new Date().toISOString(),
                userId: userDetails.uid,
                name: userDetails.firstName,
                rating: avg,
            }))
        }
    }

    return <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={''}>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-dark bg-opacity-40">
            <DialogPanel className="max-w-2xl space-y-4 w-full bg-white p-12 rounded-xl">
                <DialogTitle className="font-bold">Review Your Stay at {stay.name}</DialogTitle>
                <div className={'grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-2'}>
                    <div className={'lg:space-y-6 gap-6 max-lg:grid-cols-2 max-lg:grid'}>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Cleanliness</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={cleanliness}
                                  onChange={(value) => setCleanliness(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Location</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={location}
                                  onChange={(value) => setLocation(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Comfort</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={comfort}
                                  onChange={(value) => setComfort(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Staff</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={staff}
                                  onChange={(value) => setStaff(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Facilities</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={facilities}
                                  onChange={(value) => setFacilities(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Value for money</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={valueForMoney}
                                  onChange={(value) => setValueForMoney(value)}/>
                        </div>
                    </div>
                    <div className={'col-span-2'}>
                        <Textarea rows={5} className={'rounded-xl w-full'} placeholder={'Write a short review'}/>

                    </div>
                </div>
                <div className={'flex justify-end gap-6'}>
                    <Button danger={true} onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button type={'primary'} onClick={() => handleSubmit()}>Confirm</Button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
}