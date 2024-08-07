import {Col, Input, Row} from "antd";
import RecipientsBox from "@/components/messages/recipentBox";
import {SearchOutlined} from "@ant-design/icons";
import ChatBox from "@/components/messages/chatBox";


export default function MessagePage() {

    return<Row className={'h-full py-20'}>
        <Col className={'bg-white h-full px-4 py-8'} span={6}>
            <div>
                <Input placeholder={'Search'} prefix={<SearchOutlined />} />
            </div>
            <RecipientsBox/>
        </Col>
        <Col span={18}>
            <ChatBox/>
        </Col>
    </Row>
    ;
}