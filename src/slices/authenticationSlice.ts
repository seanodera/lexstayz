import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserDetails} from "@/data/usersData";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth, firestore} from "@/lib/firebase";
import {doc, runTransaction, updateDoc} from "firebase/firestore";
import {RootState} from "@/data/types";
import {getCurrentUser} from "@/data/bookingData";
import {getCountry} from "@/lib/utils";

export const getUserDetailsAsync = createAsyncThunk('authentication/user',
    async (id: string) => {
        try {
            const userDetails = await getUserDetails(id)

            return userDetails;

        } catch (error) {
            console.error("Failed to fetch user details", error);
            throw error;
        }
    });

export const signInUserAsync = createAsyncThunk('authentication/signIn',
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

export const updateUserAsync = createAsyncThunk('authentication/updateUser',
    async ({details}: { details: any }, {rejectWithValue}) => {
        try {
            const user = getCurrentUser()
            await updateDoc(doc(firestore, 'users', user.uid), details);
            return details;
        } catch (error) {
            console.log(error)
            if (error instanceof Error) {
                return rejectWithValue(error.message);
            } else {
                return rejectWithValue('An unknown error occurred');
            }
        }
    })

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

export const loginUser = createAsyncThunk('auth/auto', async (data: {
    phone: string;
    email: string;
    lastName: string;
    firstName: string;
    avatar?: any;
    uid: string;
    dob?: string;
    gender?: string;
    address?: any;
    paymentMethods?: any[];
    wishlist: string[]
} | any, {rejectWithValue}) => {
    try {
        const country = await getCountry()
        console.log({
            data: data,
            country: country ? country : {currency: "GHS", emoji: "GH", name: "Ghana"},
        })
        return {
            data: data,
            country: country ? country : {currency: "GHS", emoji: "GH", name: "Ghana"},
        };
    } catch (e) {
        console.error("Error fetching user data", e);
        return rejectWithValue('An unknown error occurred');
    }
})

interface AuthenticationState {
    isAuthenticated: boolean,
    user?: {
        phone: string;
        email: string;
        lastName: string;
        firstName: string;
        avatar?: any;
        uid: string;
        dob?: string;
        gender?: string;
        address?: any;
        paymentMethods?: any[];
    },
    wishlist: string[],
    isLoading: boolean,
    hasError: boolean,
    errorMessage: string,
    hasRun: boolean,
    country: {
        name: string,
        emoji: string,
        currency: string,
    }
}

const initialState: AuthenticationState = {
    country: {currency: "", emoji: "", name: ""},
    isAuthenticated: false,
    user: undefined,
    wishlist: [],
    isLoading: false,
    hasError: false,
    errorMessage: '',
    hasRun: false
}
const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: initialState,
    reducers: {

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
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isAuthenticated = true;
                state.user = action.payload.data;
                state.wishlist = action.payload.data.wishlist;
                state.country = action.payload.country;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.hasError = true;
                state.errorMessage = action.payload as string;
                state.isLoading = false;
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
            .addCase(updateUserAsync.fulfilled, (state, action) => {
                state.user = {...state.user, ...action.payload};
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';
            })
            .addCase(updateUserAsync.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.errorMessage = action.payload as string || 'Failed to update user';
            })
            .addCase(updateUserAsync.pending, (state) => {
                state.isLoading = true;
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

export const {logoutUser} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer
