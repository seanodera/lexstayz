'use client'
import {Description, Dialog, DialogPanel, DialogTitle, Input, Textarea} from "@headlessui/react";
import {Button, Rate, Slider} from "antd";
import {useState} from "react";


export default function ReviewDialog({isOpen, setIsOpen, stay, booking}: {isOpen: boolean,setIsOpen: any, booking: any,stay: any}) {
    const [comfort,setComfort] =useState<number>()
    const [cleanliness,setCleanliness] =useState<number>()
    const [location,setLocation] =useState<number>()
    const [staff,setStaff] =useState<number>()
    const [facilities,setFacilities] =useState<number>()
    const [valueForMoney,setValueForMoney] =useState<number>()
    return <Dialog open={isOpen} onClose={() => setIsOpen(false)} className={''}>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-dark bg-opacity-40">
            <DialogPanel className="max-w-2xl space-y-4 w-full bg-white p-12 rounded-xl">
                <DialogTitle className="font-bold">Review Your Stay at {stay.name}</DialogTitle>
                <div className={'grid grid-cols-3 gap-2'}>
                    <div className={'space-y-6'}>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Cleanliness</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={cleanliness} onChange={(value) => setCleanliness(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Location</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={location} onChange={(value) => setLocation(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Comfort</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={comfort} onChange={(value) => setComfort(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Staff</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={staff} onChange={(value) => setStaff(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Facilities</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={facilities} onChange={(value) => setFacilities(value)}/>
                        </div>
                        <div>
                            <div className={'text-gray-500 font-semibold'}>Value for money</div>
                            <Rate className={'text-primary text-xl'} allowHalf={true} value={valueForMoney} onChange={(value) => setValueForMoney(value)}/>
                        </div>
                    </div>
                    <div className={'col-span-2'}>
                        <Textarea rows={5} className={'rounded-xl w-full'} placeholder={'Write a short review'}/>

                    </div>
                </div>
                <div className={'flex justify-end gap-6'}>
                    <Button danger={true} onClick={()=> setIsOpen(false)}>Cancel</Button>
                    <Button type={'primary'}>Confirm</Button>
                </div>
            </DialogPanel>
        </div>
    </Dialog>
}