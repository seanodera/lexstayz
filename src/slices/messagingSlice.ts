import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

import {collection, doc, getDocs, query, where, writeBatch} from "@firebase/firestore";
import {firestore} from "@/lib/firebase";

import {getDoc, setDoc} from "firebase/firestore";
import {getCurrentUser} from "@/data/bookingData";
import {RootState} from "@/data/types";




export const sendMessageAsync = createAsyncThunk(
    'messaging/sendMessage',
    async ({chatId,  message}: {
        chatId: string,
        message: string
    }, {rejectWithValue}) => {
        const timestamp = new Date().toISOString();
        try {
            const user = getCurrentUser();
            const batch = writeBatch(firestore);
            const chatRef = doc(collection(firestore, 'chats'), chatId);
            const now = new Date().toISOString();
            const messageData = {
                senderId: user.uid,
                sender: 'user',
                type: 'text',
                message: message,
                timeStamp: now,
            };

            const docRef = doc(collection(firestore, "chats", chatId, "messages"));
            batch.update(chatRef, {lastMessage: messageData.message, timeStamp: now,});
            batch.set(docRef, messageData);

            await batch.commit();

            return messageData;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const fetchUserChatsAsync = createAsyncThunk(
    'messaging/fetchUserChats',
    async (_, {rejectWithValue}) => {
        try {
            const user = getCurrentUser()
            const q = query(collection(firestore, 'chats'), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);

            const userChats = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
            return userChats;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    }
);

export const startChatAsync = createAsyncThunk('messaging/startChat',
    async ({hostId}: {hostId: string}, {getState, rejectWithValue}) => {
        const state = getState() as RootState;
        try {
            console.log(state)
            const user = getCurrentUser();
            const docRef = doc(collection(firestore, 'chats'));
            const now = new Date().toISOString();
            const {authentication,messaging} = state;
            const existingChat = messaging.userChats.find((value) => value.hostId === hostId)
            if (existingChat){
                return undefined;
            }
            const hostSnap = await getDoc(doc(firestore, 'hosts',hostId ))
            const host = hostSnap.data()
            if (host){
                const chatItem = {
                    lastMessage: '',
                    timeStamp: now,
                    dateStarted: now,
                    id: docRef.id, hostId: hostId, userId: user.uid,
                    host: {
                        role: 'host',
                        lastOpen: 'never',
                        name: (host.accountType === 'Individual' ? `${host.firstName}  ${host.lastName}` : host.companyName),
                    },
                    user: {
                        role: 'user',
                        lastOpen: now,
                        firstName: authentication.user?.firstName,
                        lastName: authentication.user?.lastName,
                    }
                }
                await setDoc(docRef, chatItem);
                return chatItem;
            }



        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    })

export const fetchMessages = createAsyncThunk('messaging/fetchMessages', async (chatId: string) => {
    const q = collection(firestore, 'chats', chatId, 'messages')
    const querySnapshot = await getDocs(q);
    const messages = querySnapshot.docs.map(doc => doc.data());
    return {id: chatId, messages: messages};
})

interface ChatItem {
    lastMessage: string,
    timeStamp: string,
    dateStarted: string,
    messages?: any[],
    id: string,
    host: { role: 'host', lastOpen: string, name: string },
    user: { role: 'user', lastOpen: string, firstName: string, lastName: string },
    hostId: string,
    userId: string,

}

interface MessageState {
    chat: ChatItem | undefined,
    userChats: any[],
    isLoading: boolean,
    hasError: boolean,
    errorMessage: string
}

const initialState: MessageState = {
    chat: undefined,
    userChats: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
}


const MessagingSlice = createSlice({
    name: "messaging",
    initialState: initialState,
    reducers: {
        setFocusChat: (state, action: PayloadAction<string>) => {
            state.chat = state.userChats.find((chat) => chat.id === action.payload);
        },
        addMessage: (state, action: PayloadAction<{ chatId: string, messages: any[] }>) => {
            if (state.chat && state.chat.id === action.payload.chatId && state.chat.messages?.length !== action.payload.messages.length) {
                state.chat.messages = action.payload.messages;

            }
        },
        setUserChats: (state, action: PayloadAction<any[]>) => {
            state.userChats = action.payload;
        },
        resetMessagingError: (state) => {
            state.hasError = false;
            state.errorMessage = '';
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle sendMessageAsync
            .addCase(sendMessageAsync.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = '';
            })
            .addCase(sendMessageAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                // state.chat?.messages?.push(action.payload);
            })
            .addCase(sendMessageAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload as string || 'An error occurred sending the message';
            })
            // Handle fetchUserChatsAsync
            .addCase(fetchUserChatsAsync.pending, (state) => {
                state.isLoading = true;
                state.errorMessage = '';
            })
            .addCase(fetchUserChatsAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                state.userChats = action.payload;
            })
            .addCase(fetchUserChatsAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload as string || '';
            })
            .addCase(startChatAsync.pending, (state, action) => {
                state.isLoading = false;
            })
            .addCase(startChatAsync.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload){
                    state.userChats = [...state.userChats, action.payload];
                }
            })
            .addCase(startChatAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'An error occurred starting the chat';
            })
            .addCase(fetchMessages.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'An error occurred fetching the messages';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.isLoading = false;
                if (state.chat){
                    state.chat.messages =  action.payload.messages
                }
            });
    }
});
export const selectUserChats = (state: RootState) => state.messaging.userChats;
export const selectFocusChat = (state: RootState) => state.messaging.chat;
export const {setFocusChat,addMessage,setUserChats,resetMessagingError} = MessagingSlice.actions;

export default MessagingSlice.reducer;
