'use client';
import { useState, useEffect } from 'react';
import { Affix, Avatar, Button, Empty, Input } from 'antd';
import { ArrowUpOutlined, ExclamationCircleOutlined, PaperClipOutlined } from '@ant-design/icons';
import { dateReader, timeFromDate } from "@/lib/utils";
import dayjs from "dayjs";
import BookingBox from "@/components/messages/bookingBox";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { selectFocusChat, sendMessageAsync } from "@/slices/messagingSlice";
import { listenToMessages } from "@/lib/firebaseListener";
import { useMediaQuery } from "react-responsive";
import RecipientsBox from "@/components/messages/recipentBox";

const { TextArea } = Input;

export default function ChatBox() {
    const [inputValue, setInputValue] = useState('');
    const dispatch = useAppDispatch();
    const chat = useAppSelector(selectFocusChat);
    const [container, setContainer] = useState<HTMLDivElement | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        if (inputValue.trim() && chat) {
            dispatch(sendMessageAsync({ message: inputValue, chatId: chat.id }));
            setInputValue('');
        }
    };

    const isMobile = useMediaQuery({ query: '(max-width: 1024px)' });

    if (!chat) {
        return (
            <div className="h-full w-full">
                <Empty />
            </div>
        );
    } else {
        return (
            <div className="h-full overscroll-y-none overflow-y-hidden flex" ref={setContainer}>
                {/* {!isMobile && <div><RecipientsBox/></div>} */}
                <div className="flex flex-col justify-between overscroll-none overflow-y-hidden h-full w-full items-center">
                    <div className="flex justify-between bg-white py-3 w-full px-4 static">
                        <div className="flex items-center gap-1">
                            <Avatar className="bg-primary h-8 w-8" shape="circle">
                                {chat.host.name.split(' ').map((v) => v.charAt(0).toUpperCase()).join('')}
                            </Avatar>
                            <div className="font-bold">{chat.host.name}</div>
                        </div>
                        <Button type="text" icon={<ExclamationCircleOutlined />} />
                    </div>
                    <div className="flex flex-col justify-end py-2 px-4 overflow-y-scroll overscroll-contain h-full w-full pt-2">
                        {chat.messages?.map((message, index) => {
                            let diffDay = false;
                            if (index !== 0 && chat.messages) {
                                const prev = chat.messages[index - 1];
                                if (dayjs(message.timeStamp).toISOString().split('T')[0] !== dayjs(prev.timeStamp).toISOString().split('T')[0]) {
                                    diffDay = true;
                                }
                            } else {
                                diffDay = true;
                            }
                            return (
                                <div key={index}>
                                    {diffDay && (
                                        <div className="my-3 w-max mx-auto rounded text-sm text-gray-400">
                                            {dateReader({ date: message.timeStamp })}
                                        </div>
                                    )}
                                    <div
                                        key={index}
                                        className={`my-1 p-2 max-w-sm w-max text-white ${
                                            message.sender === 'user'
                                                ? 'bg-dark rounded-s-xl ms-auto rounded-tr-xl'
                                                : 'bg-primary rounded-e-xl me-auto rounded-tl-xl'
                                        }`}
                                    >
                                        <div>{message.message}</div>
                                        <small
                                            className={`${
                                                message.sender === 'host' ? 'text-right' : 'text-left'
                                            }`}
                                        >
                                            {timeFromDate({
                                                date: dayjs(message.timeStamp).toDate(),
                                                am_pm: true,
                                            })}
                                        </small>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-2 md:max-w-xl bg-white w-full px-4 py-2 text-lg rounded-3xl items-end">
                        <Button icon={<PaperClipOutlined />} shape="circle" />
                        <TextArea
                            autoSize={{ minRows: 1, maxRows: 4 }}
                            className="appearance-none w-full py-0 border-0 hover:border-0 shadow-none focus:border-0 border-transparent ring-0 mb-1.5"
                            placeholder="Message Person"
                            value={inputValue}
                            onChange={handleInputChange}
                            style={{ overflowY: 'hidden' }} // Hide scrollbar
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                        />
                        <Button
                            icon={<ArrowUpOutlined />}
                            type="primary"
                            shape="circle"
                            onClick={handleSubmit}
                        />
                    </div>
                </div>
                <div className="h-full w-full max-w-sm max-md:hidden">
                    <BookingBox />
                </div>
            </div>
        );
    }
}
