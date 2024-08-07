'use client';
import {useState, useEffect, useRef} from 'react';
import {Avatar, Button, Empty, Input} from 'antd';
import {ArrowUpOutlined, ExclamationCircleOutlined, PaperClipOutlined} from '@ant-design/icons';
import {timeFromDate} from "@/lib/utils";
import dayjs from "dayjs";
import BookingBox from "@/components/messages/bookingBox";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {fetchMessages, selectFocusChat, sendMessageAsync} from "@/slices/messagingSlice";
import {listenToMessages} from "@/lib/firebaseListener";

const {TextArea} = Input;

export default function ChatBox() {
    const [messages, setMessages] = useState<any>([]);
    const [inputValue, setInputValue] = useState('');
    const dispatch = useAppDispatch();
    const chat = useAppSelector(selectFocusChat)
    const handleInputChange = (e: any) => {
        setInputValue(e.target.value);
    };

    useEffect(() => {
        if (chat) {
            // Set up the listener for messages in the focused chat
            const messagesUnsubscribe = listenToMessages(chat.id);

            return () => {
                // Clean up the listener for messages
                messagesUnsubscribe();
            };
        }
    }, [chat]);

    const handleSubmit = () => {
        if (inputValue.trim()) {
            // @ts-ignore
            dispatch(sendMessageAsync({message: inputValue, chatId: chat.id}));
            // setMessages([
            //     ...messages,
            //     {
            //         message: inputValue,
            //         sender: 'user',
            //         timestamp: new Date().toISOString(),
            //     }
            // ]);
            setInputValue('');

        }
    };

    if (!chat){
        return <div className={'h-full w-full'}>
            <Empty/>
        </div>;
    } else {
    return (
        <div className={'flex h-full w-full'}>
            <div className="flex flex-col items-center justify-end h-full w-full">
                <div className={'flex justify-between bg-white py-3 w-full px-4'}>
                    <div className={'flex items-center gap-1'}>
                        <Avatar className={'bg-primary h-8 w-8'}
                                shape={'circle'}>{chat.host.name.split(' ').map((v) => v.charAt(0).toUpperCase()).join('')}</Avatar>
                        <div className={'font-bold'}>{chat.host.name}</div>
                    </div>
                    <Button type={'text'} icon={<ExclamationCircleOutlined/>}/>
                </div>
                <div className="h-full flex-1 px-4 overflow-auto border-white border-solid border-b-0 w-full pt-2">
                    {chat.messages?.map((message, index) => {

                        return (
                            <div key={index}
                                 className={` p-2 max-w-sm w-max text-white  ${message.sender === 'user' ? 'bg-dark rounded-s-xl ms-auto rounded-tr-xl' : 'bg-primary rounded-e-xl me-auto rounded-tl-xl'}`}>
                                <div>{message.message}</div>
                                <small
                                    className={`${message.sender === 'host' ? 'text-right' : 'text-left'}`}>{timeFromDate({
                                    date: dayjs(message.timeStamp).toDate(),
                                    am_pm: true
                                })}</small>
                            </div>
                        );
                    })}
                </div>
                <div className="flex gap-2 md:max-w-xl bg-white w-full px-4 py-2 text-lg rounded-3xl items-end">
                    <Button icon={<PaperClipOutlined/>} shape="circle"/>
                    <TextArea
                        autoSize={{minRows: 1, maxRows: 4}}
                        className="appearance-none w-full py-0 border-0 hover:border-0 shadow-none focus:border-0 border-transparent ring-0 mb-1.5"
                        placeholder="Message Person"
                        value={inputValue}
                        onChange={handleInputChange}
                        style={{overflowY : 'hidden'}} // Hide scrollbar
                    />
                    <Button
                        icon={<ArrowUpOutlined/>}
                        type="primary"
                        shape="circle"

                        onClick={handleSubmit}
                    />
                </div>
            </div>
            <div className={'h-full w-full max-w-sm'}>
                <BookingBox/>
            </div>
        </div>
    );}
}
