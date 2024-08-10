'use client'
import {Avatar, List} from "antd";
import {differenceInDays, differenceInHours, differenceInMinutes, isAfter} from "date-fns";
import {useAppDispatch, useAppSelector} from "@/hooks/hooks";
import {selectFocusChat, selectUserChats, setFocusChat} from "@/slices/messagingSlice";
import {useEffect} from "react";
import {listenToUserChats} from "@/lib/firebaseListener";
import {getAuth} from "firebase/auth";
import {useMediaQuery} from "react-responsive";
import {useRouter} from "next/navigation";

export default function RecipientsBox({}) {
    const rightNow = new Date();
    const chats = useAppSelector(selectUserChats)
    const focusChat = useAppSelector(selectFocusChat)
    const dispatch = useAppDispatch();
    const isMobile = useMediaQuery({query: '(max-width: 1024px)'});
    const router = useRouter()
    const formatTimeDifference = (timeStamp: string) => {
        const date = new Date(timeStamp);
        const days = differenceInDays(rightNow, date);
        if (days > 0) return `${days}d`;
        const hours = differenceInHours(rightNow, date);
        if (hours > 0) return `${hours}h`;
        const minutes = differenceInMinutes(rightNow, date);
        return `${minutes}m`;
    };
    function handleSetFocus(chatId:string){
        dispatch(setFocusChat(chatId))
        if (isMobile){
            router.push(`/messages/${chatId}`);
        }
    }
    useEffect(() => {
        const user = getAuth().currentUser;

        if (user){

            // Set up the listener for user chats
            const chatsUnsubscribe = listenToUserChats(user.uid);

            return () => {
                // Clean up the listener for user chats
                chatsUnsubscribe();
            };
        }
    }, [dispatch]);



    return <div className={'bg-white md:px-1 py-3'}>
        {chats.map((chat, index) => <div
            className={`${(focusChat && focusChat.id === chat.id) ? 'bg-primary text-white' : ''} flex justify-between rounded-xl py-3 px-3 transition-all ease-in-out duration-200`}
            key={index} onClick={() => handleSetFocus(chat.id)}>
            <div className={'flex gap-2 items-center'}>
                <Avatar className={'bg-dark h-12 w-12 text-xl'}
                        shape={'circle'}>{chat.host.name.split(' ').map((v: string) => v.charAt(0).toUpperCase()).join('')}</Avatar>
                <div>
                    <h4 className={'font-semibold mb-0'}>{chat.host.name}</h4>
                    <p className={` line-clamp-1 text-sm mb-0 ${(focusChat && focusChat.id === chat.id) ?'text-gray-200':'text-gray-500'}`}>{chat.lastMessage}</p>
                </div>
            </div>
            <span
                className={'flex items-center'}>{formatTimeDifference(chat.timeStamp)}{(chat.user.lastOpen === 'never' || isAfter(chat.user.lastOpen, chat.timeStamp)) &&
                <div className={'h-1 w-1 bg-primary'}/>}</span>
        </div>)}
    </div>
}

export function RecipientsBoxDL({}) {
    const rightNow = new Date();
    const chats = useAppSelector(selectUserChats)
    const focusChat = useAppSelector(selectFocusChat)
    const dispatch = useAppDispatch();
    const formatTimeDifference = (timeStamp: string) => {
        const date = new Date(timeStamp);
        const days = differenceInDays(rightNow, date);
        if (days > 0) return `${days}d`;
        const hours = differenceInHours(rightNow, date);
        if (hours > 0) return `${hours}h`;
        const minutes = differenceInMinutes(rightNow, date);
        return `${minutes}m`;
    };
    function handleSetFocus(chatId:string){
        dispatch(setFocusChat(chatId))
    }
    useEffect(() => {
        const user = getAuth().currentUser;

        if (user){

            // Set up the listener for user chats
            const chatsUnsubscribe = listenToUserChats(user.uid);

            return () => {
                // Clean up the listener for user chats
                chatsUnsubscribe();
            };
        }
    }, [dispatch]);

    return <List className={'bg-white px-1 py-3'}>
        {chats.map((chat, index) => <List.Item
            className={`${(focusChat && focusChat.id === chat.id) ? 'bg-primary text-white' : ''} rounded-xl px-3 transition-all ease-in-out duration-200`}
            key={index} onClick={() => handleSetFocus(chat.id)}>
            <List.Item.Meta
                className={`${(focusChat && focusChat.id === chat.id) ? 'text-white': ''}`}
                avatar={<Avatar className={'bg-dark h-10 w-10'}
                                shape={'circle'}>{chat.host.name.split(' ').map((v:string) => v.charAt(0).toUpperCase()).join('')}</Avatar>}
                title={`${chat.host.name}`}
                description={chat.lastMessage}
            />
            <span
                className={'flex items-center'}>{formatTimeDifference(chat.timeStamp)}{(chat.user.lastOpen === 'never' || isAfter(chat.user.lastOpen, chat.timeStamp)) &&
                <div className={'h-1 w-1 bg-primary'}/>}</span>
        </List.Item>)}
    </List>
}
