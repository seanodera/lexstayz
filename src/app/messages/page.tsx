'use client'
import {Button, Col, Drawer, Input, Row} from "antd";
import RecipientsBox from "@/components/messages/recipentBox";
import {MenuOutlined, SearchOutlined} from "@ant-design/icons";
import ChatBox from "@/components/messages/chatBox";
import {useMediaQuery} from "react-responsive";
import {useState} from "react";

export default function MessagePage() {
    return (
        <div className="w-full grid lg:grid-cols-5 h-full">
            <div className="bg-white h-full p-4 border-solid border-0 border-t border-gray-200 overflow-auto">
                <RecipientsBox />
            </div>
            <div className="col-span-4 flex flex-col h-full max-lg:hidden ">
                <div className="flex-1 overflow-auto">
                    <ChatBox />
                </div>
                <div className="p-4 border-t border-gray-200">
                    <input
                        type="text"
                        name="message"
                        placeholder="Type a message"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>
        </div>
    );
}
// export default function MessagePage() {
//     const isMobile = useMediaQuery({query: '(max-width: 768px)'});
//     console.log(isMobile);
//     if (isMobile) {
//         return <div className={'h-full py-4 bg-white px-4'}>
//             <div className={'text-2xl'}>Messages</div>
//             <RecipientsBox/>
//         </div>
//     } else {
//         return <Row className={'h-full py-4'}>
//             <Col className={'bg-white h-full px-4 py-8'} span={6}>
//                 <div>
//                     <Input placeholder={'Search'} prefix={<SearchOutlined/>}/>
//                 </div>
//                 <RecipientsBox/>
//             </Col>
//             <Col span={18}>
//                 <ChatBox/>
//             </Col>
//         </Row>;
//     }
// }

function MessagePageNew() {
    const isMobile = useMediaQuery({query: '(max-width: 768px)'});
    const [showReservation, setShowReservation] = useState(false);
    console.log(isMobile);
    if (isMobile) {
        return <div className={'h-full py-4 bg-white px-4'}>
            <div className={'text-2xl'}>Messages</div>
            <RecipientsBox/>
        </div>
    } else {


        return (
            <div className="h-screen flex flex-col md:flex-row">
                {/* Chats Panel */}
                <div className="md:w-1/4 w-full h-full bg-gray-100 border-r overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Chats</h2>
                        {/* Example Chats */}
                        <ul>
                            <li className="mb-4 p-2 bg-white rounded shadow-sm">Chat 1</li>
                            <li className="mb-4 p-2 bg-white rounded shadow-sm">Chat 2</li>
                            <li className="mb-4 p-2 bg-white rounded shadow-sm">Chat 3</li>
                            {/* More chats here */}
                        </ul>
                        <Button
                            className="md:hidden mt-4"
                            type="primary"
                            icon={<MenuOutlined/>}
                            onClick={() => setShowReservation(true)}
                        >
                            Show Reservation
                        </Button>
                    </div>
                </div>

                {/* Messages Panel */}
                <div className="md:w-1/2 w-full h-full bg-white border-r overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Messages</h2>
                        {/* Example Messages */}
                        <div className="mb-4 p-4 bg-gray-100 rounded">Message 1</div>
                        <div className="mb-4 p-4 bg-gray-100 rounded">Message 2</div>
                        <div className="mb-4 p-4 bg-gray-100 rounded">Message 3</div>
                        {/* More messages here */}
                    </div>
                </div>

                {/* Reservations Panel (hidden on mobile) */}
                <div className="md:w-1/4 w-full h-full bg-gray-50 overflow-y-auto hidden md:block">
                    <div className="p-4">
                        <h2 className="text-lg font-semibold mb-4">Reservations</h2>
                        {/* Example Reservations */}
                        <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 1</div>
                        <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 2</div>
                        <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 3</div>
                        {/* More reservations here */}
                    </div>
                </div>

                {/* Drawer for mobile reservations */}
                <Drawer
                    title="Reservations"
                    placement="right"
                    onClose={() => setShowReservation(false)}
                    open={showReservation}
                >
                    {/* Example Reservations */}
                    <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 1</div>
                    <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 2</div>
                    <div className="mb-4 p-4 bg-white rounded shadow-sm">Reservation 3</div>
                    {/* More reservations here */}
                </Drawer>
            </div>
        );
    }
}