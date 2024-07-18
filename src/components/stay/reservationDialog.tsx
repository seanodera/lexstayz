import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'

export default function ReservationDialog({isOpen = false, setIsOpen, room, stay}: {isOpen: boolean, setIsOpen: any, room: any, stay: any}) {
    // let [isOpen, setIsOpen] = useState(true)

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 text-dark fill-dark">
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-dark bg-opacity-40">
                <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-2xl">
                    <DialogTitle className={'font-semibold text-xl'}>Book the {room.name} at {stay.name}</DialogTitle>


                </DialogPanel>
            </div>
        </Dialog>
    )
}