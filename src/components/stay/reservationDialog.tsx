import {CloseButton, Dialog, DialogPanel, Select} from '@headlessui/react';
import {useState, useEffect} from 'react';
import {DialogBody} from 'next/dist/client/components/react-dev-overlay/internal/components/Dialog';
import {Button, Carousel, Divider, Image} from 'antd';
import {getAmenityIcon} from '@/components/utilities/amenityIcon';
import {CloseIcon} from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import {CloseOutlined} from "@ant-design/icons";
import {updateCart} from "@/slices/bookingSlice";

export default function ReservationDialog({isOpen = false, setIsOpen, room, stay, numRoom, setNumRoom}: {
    isOpen: boolean,
    setIsOpen: any,
    room: any,
    stay: any,
    numRoom: number,
    setNumRoom: any,
}) {
    const [bedsText, setBedsText] = useState('');
    const [numRooms, setNumRooms] = useState<number>(numRoom);

    useEffect(() => {
        const bedDescriptions = room.beds.map((bed: any) => {
            return `${bed.number} ${bed.type} Bed${bed.number === 1 ? '' : 's'}`;
        });
        setBedsText(bedDescriptions.join(' or '));
    }, [room.beds]);

    useEffect(() => {
        setNumRooms(numRoom)
    }, [numRoom]);

    function handleUpdate() {
        setNumRoom(numRooms);
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50 text-dark fill-dark">
            <div className="fixed inset-0 flex w-screen items-center justify-center md:p-4 bg-dark bg-opacity-40">
                <DialogPanel
                    className="md:max-w-xl lg:max-w-6xl max-md:h-screen space-y-4 bg-white px-6 max-md:pt-10 pb-10 md:rounded-2xl w-full">
                    <DialogBody>
                        <div
                            className={'md:hidden shadow-md fixed start-0 top-0 w-full bg-white z-10 flex justify-between border border-gray-200 px-7'}>
                            <div className={'flex w-full justify-between items-center py-3'}>
                                <h2 className={'font-semibold mb-0'}>Room Details</h2>
                                <div onClick={() => setIsOpen(false)}><CloseOutlined className={'text-xl'}/></div>
                            </div>
                        </div>
                        <div className={'max-md:hidden flex w-full justify-between items-center py-3'}>
                            <h2 className={'font-semibold mb-0'}>Room Details</h2>
                            <div onClick={() => setIsOpen(false)}><CloseOutlined className={'text-xl'}/></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-5 gap-8 max-md:mt-5">
                            <div className=" lg:col-span-3 space-y-4">
                                <div className="aspect-video">
                                    <Image.PreviewGroup>
                                        <Carousel arrows>
                                            <Image
                                                src={room.poster}
                                                alt=""
                                                className="object-cover rounded-xl aspect-video"
                                            />
                                            {room.images.slice(0, 3).map((image: string, index: number) => (
                                                <Image
                                                    src={image}
                                                    alt="Image"
                                                    key={index}
                                                    className="object-cover rounded-xl aspect-video"
                                                />
                                            ))}
                                        </Carousel>
                                    </Image.PreviewGroup>
                                </div>
                                <div className={'flex justify-between items-center'}>
                                    <div className="text-2xl font-bold capitalize mb-0">{room.name}</div>
                                    <div
                                        className={'text-primary text-lg font-bold'}>{stay.currency} {room.price.toFixed(2)}/night
                                    </div>
                                </div>
                                <span className="flex gap-1 items-center flex-wrap">
                                    <div className="max-md:text-sm mb-0">Up to {room.maxGuests} Guests</div>
                                    <Divider className="bg-gray-500" type="vertical"/>
                                    <h4 className={'max-md:text-sm mb-0'}>{bedsText}</h4>
                                </span>
                                <p>{room.description}</p>
                            </div>
                            <div className="text-nowrap">
                                <h3 className="font-bold">Room Amenities</h3>
                                <div>
                                    {room.amenities.slice(0, 3).map((amenity: string, index: number) => {
                                        const IconComponent = getAmenityIcon(amenity);

                                        return (
                                            <h4 className="flex items-center gap-2" key={index}>
                                                <div className="text-primary"><IconComponent/></div>
                                                {amenity}
                                            </h4>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <div className={'flex max-md:hidden justify-end gap-2'}>
                            <Button type={'text'} size={'large'} onClick={() => {
                                setIsOpen(false)
                            }}>Back</Button>

                            <Select value={numRooms}
                                    onChange={(e) => setNumRooms(parseInt(e.target.value))}
                                    className={'appearance-none rounded-lg border border-primary text-sm py-2 px-4 text-start bg-transparent'}>
                                {Array.from({length: 11}, (_, i) => <option value={i}
                                                                            key={i}>{i} {(i === 1) ? 'Room' : 'Rooms'}</option>)}
                            </Select>
                            <Button type={'primary'} size={'large'} onClick={handleUpdate}>Select</Button>
                        </div>
                        <div
                            className="md:hidden fixed end-0 bottom-0 w-full bg-primary-50 z-10 flex justify-between border border-gray-200 py-3 px-7">
                            <div className={'flex w-full justify-end gap-2'}>
                                <Button type={'primary'} className={'border-dashed'} ghost size={'large'}
                                        onClick={() => {
                                            setIsOpen(false)
                                        }}>Back</Button>
                                <Select value={numRooms}
                                        onChange={(e) => setNumRooms(parseInt(e.target.value))}
                                        className={'appearance-none rounded-lg border border-primary text-sm py-2 px-4 text-start bg-transparent'}>
                                    {Array.from({length: 11}, (_, i) => <option value={i}
                                                                                key={i}>{i} {(i === 1) ? 'Room' : 'Rooms'}</option>)}
                                </Select>
                                <Button type={'primary'} size={'large'} onClick={handleUpdate}>Select</Button>
                            </div>
                        </div>
                    </DialogBody>
                </DialogPanel>
            </div>
        </Dialog>
    );
}
