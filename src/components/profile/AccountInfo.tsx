'use client'
import {Avatar, Card, Col, Image, Row} from "antd";
import {useAppSelector} from "@/hooks/hooks";
import {selectCurrentUser} from "@/slices/authenticationSlice";


export default function AccountInfo(){
    const user = useAppSelector(selectCurrentUser)
    return <Card className={''}>
        <Row gutter={[16,16]}>
            <Col span={6}>
                {user.avatar? <Image className={'bg-primary aspect-square rounded-full w-full'} src={user.avatar}/>:
                    <div className={'bg-primary aspect-square rounded-full flex items-center justify-center text-5xl w-max p-8 text-white'}>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</div>}
            </Col>
            <Col span={18}>
                <div className={'grid grid-cols-2'}>
                    <div className={''}>
                        <h3 className={'mb-0'}>First Name</h3>
                        <h3 className={'font-bold'}>{user.firstName}</h3>
                    </div>
                    <div className={''}>
                        <h3 className={'mb-0'}>Last Name</h3>
                        <h3 className={'font-bold'}>{user.lastName}</h3>
                    </div>
                    <div className={'col-span-2'}>
                        <h3 className={'mb-0'}>Email address</h3>
                        <h3 className={'font-bold'}>{user.email}</h3>
                    </div>
                    <div className={''}>
                        <h3 className={'mb-0'}>Phone Number</h3>
                        <h3 className={'font-bold'}>{user.phone}</h3>
                    </div>
                </div>
            </Col>
        </Row>
    </Card>
}