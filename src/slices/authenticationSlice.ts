import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserDetails} from "@/data/usersData";
import {signInWithEmailAndPassword} from "firebase/auth";
import {auth} from "@/lib/firebase";
import {redirect} from "next/navigation";


export const getUserDetailsAsync = createAsyncThunk('authentication/user',
    async (id: string) => {
    try {
        const userDetails = await getUserDetails(id)
        if (userDetails){
            return userDetails;
        } else {
            redirect('/user-information')
        }
    } catch (error){

    }
    })
export const signInUserAsync:any= createAsyncThunk('authentication/signIn',
    async ({email,password}:{email: string, password: string}, { dispatch, getState, rejectWithValue }) => {
       try {
           const userCredential = await signInWithEmailAndPassword(auth, email, password)
           const payload = await dispatch(getUserDetailsAsync(userCredential.user.uid));
           console.log(payload)
           return userCredential;
       } catch (error){
           if (error instanceof Error) {
               return rejectWithValue(error.message);
           }
           return rejectWithValue('An unknown error occurred');
       }
    });
const AuthenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        isAuthenticated: false,
        user: {},
        isLoading: false,
        hasError: false,
        errorMessage: '',
        hasRun: false
    },
    reducers: {
        loginUser: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logoutUser: (state, action) => {
            state.isAuthenticated = false;
            state.user = {}
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getUserDetailsAsync.fulfilled, (state, action) => {
            state.user = action.payload as any;
            state.isLoading = false;
        })
            .addCase(getUserDetailsAsync.rejected, (state, action) => {
                state.hasError = true;
                state.isLoading = false;
                state.errorMessage= action.error.message || 'Failed to fetch user';
            })
            .addCase(getUserDetailsAsync.pending, (state, action) => {
                state.isLoading = true;
            })
            .addCase(signInUserAsync.pending, (state, action) => {
                state.isLoading = true
        })
            .addCase(signInUserAsync.fulfilled,(state,action) => {
                state.isAuthenticated = true;
                state.isLoading = false;
                state.hasError = false;
                state.errorMessage = '';
                redirect('/')
            })
            .addCase(signInUserAsync.rejected,(state, action)=> {
                state.hasError = true;
                state.errorMessage = action.payload as string;
                state.isLoading = false
            })
    }
})

export const selectCurrentUser = (state: any) => state.authentication.user;
export const selectIsAuthenticated = (state: any) => state.authentication.isAuthenticated;

export const {loginUser, logoutUser} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer