import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {getUserDetails} from "@/data/usersData";


export const getUserDetailsAsync = createAsyncThunk('authentication/user',
    async (id: string) => {
        const userDetails = await getUserDetails(id)
        return userDetails;
    })

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
    }
})

export const selectCurrentUser = (state: any) => state.authentication.user;
export const selectIsAuthenticated = (state: any) => state.authentication.isAuthenticated;

export const {loginUser, logoutUser} = AuthenticationSlice.actions;
export default AuthenticationSlice.reducer