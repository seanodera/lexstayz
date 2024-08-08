import {collection, onSnapshot, query, where} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";
import store from "@/data/store"; // Import the Redux store
import {addMessage, setUserChats} from "@/slices/messagingSlice";
import {orderBy} from "firebase/firestore"; // Import actions from the slice

let lastMessageFetch = Date.now();
const MESSAGE_FETCH_INTERVAL = 15000; // 30 seconds


export const listenToMessages = (chatId: string) => {
    const messagesRef = query(collection(firestore, 'chats', chatId, 'messages'),orderBy("timeStamp", "desc"));
    return onSnapshot(messagesRef, (snapshot) => {
        const messages = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})).reverse();
        store.dispatch(addMessage({chatId, messages})); // Dispatch an action to update the messages
    });
};

export const listenToUserChats = (userId: string) => {
    const chatsRef = query(collection(firestore, 'chats'), where('userId', '==', userId),orderBy("timeStamp", "desc"));
    return onSnapshot(chatsRef, (snapshot) => {
        const now = Date.now();
        if (now - lastMessageFetch > MESSAGE_FETCH_INTERVAL) {
            lastMessageFetch = now;
        const userChats = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
        store.dispatch(setUserChats(userChats));
        }
    });
};
