import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserDetails} from "@/data/usersData";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "@/lib/firebase";
import {redirect} from "next/navigation";
import {doc, runTransaction} from "firebase/firestore";
import {RootState} from "@/data/types";

export const getUserDetailsAsync = createAsyncThunk('authentication/user',
    async (id: string) => {
        try {
            const userDetails = await getUserDetails(id)
            if (userDetails) {
                return userDetails;
            } else {
                redirect('/user-information')
            }
        } catch (error) {
            console.error("Failed to fetch user details", error);
            throw error;
        }
    });

export const signInUserAsync:any = createAsyncThunk('authentication/signIn',
    async ({email, password}: { email: string, password: string }, {dispatch, rejectWithValue}) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const payload = await dispatch(getUserDetailsAsync(userCredential.user.uid));
            console.log(payload);
            return userCredential;
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const updateWishList = createAsyncThunk('authentication/updateWishlist',
    async ({stayId}: { stayId: string }, {getState, rejectWithValue}) => {
        const {authentication} = getState() as RootState;
        try {
            const user = authentication.user;
            if (user) {
                const userDocRef = doc(firestore, 'users', user.uid);
                await runTransaction(firestore, async (transaction) => {
                    const userDoc = await transaction.get(userDocRef);
                    if (!userDoc.exists()) {
                        throw new Error("User does not exist!");
                    }
                    const userData = userDoc.data();
                    const wishlist = userData.wishlist || [];
                    const updatedWishlist = [...wishlist, stayId];
                    transaction.update(userDocRef, {wishlist: updatedWishlist});
                });
                return stayId;
            } else {
                return rejectWithValue('User is not authenticated');
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

export const deleteFromWishList = createAsyncThunk('authentication/deleteFromWishlist',
    async ({stayId}: { stayId: string }, {getState, rejectWithValue}) => {
        const {authentication} = getState() as RootState;
        try {
            const user = authentication.user;
            if (user) {
                const userDocRef = doc(firestore, 'users', user.uid);
                await runTransaction(firestore, async (transaction) => {
                    const userDoc = await transaction.get(userDocRef);
                    if (!userDoc.exists()) {
                        throw new Error("User does not exist!");
                    }
                    const userData = userDoc.data();
                    const wishlist = userData.wishlist || [];
                    const updatedWishlist = wishlist.filter((id: string) => id !== stayId);
                    transaction.update(userDocRef, {wishlist: updatedWishlist});
                });
                return stayId;
            } else {
                return rejectWithValue('User is not authenticated');
            }
        } catch (error) {
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            }
            return rejectWithValue('An unknown error occurred');
        }
    }
);

interface AuthenticationState {
    isAuthenticated: boolean,
    user?: {
        phone: string;
        email: string;
        lastName: string;
        firstName: string;
        avatar?: any;
        uid: string;
        dob?:string;
        gender?:string
    },
    wishlist: string[],
    isLoading: boolean,
    hasError: boolean,
    errorMessage: string,
    hasRun: boolean,
}

const initialState: AuthenticationState = {
    isAuthenticated: false,
    user: undefined,
    wishlist: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false,
}
const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: initialState,
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
            state.wishlist = action.payload.wishlist;
        },
        logoutUser: (state) => {
            state.isAuthenticated = false;
            state.user = undefined;
            state.wishlist = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUserDetailsAsync.fulfilled, (state, action) => {
                state.user = action.payload as any;

                state.wishlist = action.payload.wishlist

                state.isLoading = false;
            })
            .addCase(getUserDetailsAsync.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.errorMessage = action.error.message || 'Failed to fetch user';
            })
            .addCase(getUserDetailsAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signInUserAsync.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signInUserAsync.fulfilled, (state) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(signInUserAsync.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = action.payload as string;
                state.isLoading = false;
            })
            .addCase(updateWishList.fulfilled, (state, action) => {
                state.wishlist.push(action.payload);
                console.log(action.payload)
            })
            .addCase(updateWishList.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = action.payload as string;
            })
            .addCase(deleteFromWishList.fulfilled, (state, action) => {
                state.wishlist = state.wishlist.filter((id) => id !== action.payload);
                console.log(action.payload)
            })
            .addCase(deleteFromWishList.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = action.payload as string;
            });
    }
});

export const selectCurrentUser = (state: RootState) => state.authentication.user;
export const selectIsAuthenticated = (state: RootState) => state.authentication.isAuthenticated;
export const selectWishlist = (state: RootState) => state.authentication.wishlist;

export const {loginUser, logoutUser} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer