'use client'
import {Col, Input, Row} from "antd";
import RecipientsBox from "@/components/messages/recipentBox";
import {SearchOutlined} from "@ant-design/icons";
import ChatBox from "@/components/messages/chatBox";
import {useMediaQuery} from "react-responsive";


export default function MessagePage() {
    const isMobile = useMediaQuery({query: '(max-width: 1024px)'});
    if (isMobile) {
        return <div className={'h-full py-4 bg-white px-4'}>
            <div className={'text-2xl'}>Messages</div>
            <RecipientsBox/>
        </div>
    } else {
        return <Row className={'h-full py-4'}>
            <Col className={'bg-white h-full px-4 py-8'} span={6}>
                <div>
                    <Input placeholder={'Search'} prefix={<SearchOutlined/>}/>
                </div>
                <RecipientsBox/>
            </Col>
            <Col span={18}>
                <ChatBox/>
            </Col>
        </Row>;
    }
}