import {Avatar, Card, Divider, Typography} from "antd";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectCurrentStay, setCurrentHostById} from "@/slices/staysSlice";
import {useEffect} from "react";

const {Title, Text} = Typography;
export default function YourHost() {
const {currentHost,currentStay} = useAppSelector(state => state.stays)
const dispatch = useAppDispatch();
    useEffect(() => {
        if (currentStay && currentStay.hostId){
            if (!currentHost || currentHost.uid !== currentStay.hostId){
                dispatch(setCurrentHostById(currentStay.hostId))
            }
        }
    }, [currentHost, currentStay, dispatch]);
    return <Card className={'rounded-xl aspect-20/7'}>
        <div className={'flex px-4 py-2 items-center gap-4'}>
            <div className={'aspect-square w-32 bg-primary rounded-full p-4 text-2xl text-white shadow'}>
                <div>
                    {currentHost?.accountType === 'Individual'? `${currentHost?.firstName.charAt(0).toUpperCase()}${currentHost?.lastName.charAt(0).toUpperCase()}` : currentHost?.companyName.charAt(0)}
                </div>
            </div>
            <div className={'w-full flex flex-col justify-between'}>
                <Title level={5}>{currentHost?.accountType === 'Individual'? `${currentHost?.firstName} ${currentHost?.lastName}` : currentHost?.companyName}</Title>
                <div className={'flex justify-between'}>
                    <div className={'text-center'}>
                        <div className={'font-bold'}>
                            {currentHost?.published.length}
                        </div>
                        <Text className={'text-nowrap'}>Stays</Text>
                    </div>
                    <Divider orientation={'center'} type={'vertical'} className={'bg-black'}/>
                    <div className={'text-center'}>
                        <div className={' font-bold'}>
                            {currentHost?.joined}
                        </div>
                        <Text className={'text-nowrap'}>Joined</Text>
                    </div>
                </div>
            </div>
        </div>
    </Card>
}
