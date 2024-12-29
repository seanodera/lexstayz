'use client'
import {Button, Typography} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {useState, useEffect} from "react";

const {Title, Text} = Typography;

export default function RoomAndBedsFilter({collectedProperties}: { collectedProperties: any }) {
    // Initialize the states
    const [bedrooms, setBedrooms] = useState<number>(0);
    const [beds, setBeds] = useState<number>(0);
    const [bathrooms, setBathrooms] = useState<number>(0);
    const [maxBedrooms, setMaxBedrooms] = useState(0)
    const [maxBed, setMaxBed] = useState(0)
    const [maxBath, setMaxBath] = useState(0)

    useEffect(() => {
        // Set the initial min values
        if (collectedProperties.bedrooms.length) {
            setMaxBedrooms(Math.max(...collectedProperties.bedrooms));
        }

        if (collectedProperties.beds.length) {

            setMaxBed(Math.max(...collectedProperties.beds));
        }

        if (collectedProperties.bathrooms.length) {
            setMaxBath(Math.max(...collectedProperties.bathrooms));
        }
    }, [collectedProperties]); // Rerun when collectedProperties changes



    return <div className={'grid grid-cols-2 gap-2'}>
        <Title level={5} className={'col-span-2'}>Rooms and Beds</Title>
        <Text className={'font-semibold'}>Bedrooms</Text>
        <div className={'flex gap-2 items-center justify-end'}>
            <Button type={'primary'} ghost icon={<MinusOutlined/>} shape={'circle'} disabled={bedrooms === 0}
                    onClick={() => setBedrooms((prev: any) => {
                        if (prev === 0) {
                            return prev;
                        } else {
                            return prev - 1;
                        }
                    })}/>
            <h4 className={'font-normal mb-0 pb-0 w-6 text-center'}>{bedrooms === 0 ? 'Any' : `${bedrooms}+`}</h4>
            <Button type={'primary'} ghost icon={<PlusOutlined/>} shape={'circle'} disabled={bedrooms === maxBedrooms}
                    onClick={() => setBedrooms((prev: number) => {
                        if (prev === maxBedrooms) {
                            return prev;
                        } else {
                            return prev + 1;
                        }
                    })}/>
        </div>
        <Text className={'font-semibold'}>Beds</Text>
        <div className={'flex gap-2 items-center justify-end'}>
            <Button type={'primary'} ghost icon={<MinusOutlined/>} shape={'circle'} disabled={beds === 0}
                    onClick={() => setBeds((prev: any) => {
                        if (prev === 0) {
                            return prev;
                        } else {
                            return prev - 1;
                        }
                    })}/>
            <h4 className={'font-normal mb-0 pb-0 w-6 text-center'}>{beds === 0 ? 'Any' : `${beds}+`}</h4>
            <Button type={'primary'} ghost icon={<PlusOutlined/>} shape={'circle'} disabled={beds === maxBed}
                    onClick={() => setBeds((prev: number) => {
                        if (prev === maxBed) {
                            return prev;
                        } else {
                            return prev + 1;
                        }
                    })}/>
        </div>
        <Text className={'font-semibold'}>Bathrooms</Text>
        <div className={'flex gap-2 items-center justify-end'}>
            <Button type={'primary'} ghost icon={<MinusOutlined/>} shape={'circle'} disabled={bathrooms === 0}
                    onClick={() => setBathrooms((prev: any) => {
                        if (prev === 0) {
                            return prev;
                        } else {
                            return prev - 1;
                        }
                    })}/>

            <h4 className={'font-normal mb-0 pb-0 w-6 text-center'}>{bathrooms === 0 ? 'Any' : `${bathrooms}+`}</h4>
            <Button type={'primary'} ghost icon={<PlusOutlined/>} shape={'circle'} disabled={bathrooms === maxBath}
                    onClick={() => setBathrooms((prev: number) => {
                        if (prev === maxBath) {
                            return prev;
                        } else {
                            return prev + 1;
                        }
                    })}/>
        </div>
    </div>
}





