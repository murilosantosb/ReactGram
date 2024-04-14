import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import userService from "../services/userService";

const initialState = {
    user : {},
    error: false,
    success: false,
    loading: false,
    message: null,
}

// Get user details
export const profile = createAsyncThunk(
    "user/profile" ,  async (user, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await userService.profile(user, token)

        console.log(data)

        return data
    }
)

// Update user details
export const updateProfile = createAsyncThunk(
    "user/update",
    async (user, thunkAPI) => {
        const token = await thunkAPI.getState().auth.user.token

        const data = await userService.updateProfile(user, token)

        // Check for errors
        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

export const getUserDetails = createAsyncThunk(
    "/user/getUser",
    async (id, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token

        const data = await userService.getUserDetails(id, token)

        return data
    }
)

export const following = createAsyncThunk(
    "user/following",
    async(userId, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token 

        const data = await userService.following(userId, token)

        if(data.errors) {
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

export const unfollow = createAsyncThunk(
    "user/unfollow",
    async(userId, thunkAPI) => {

        const token = thunkAPI.getState().auth.user.token

        const data = await userService.unfollow(userId, token)

        return data
    }
)


export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetMessage: (state) => {
            state.message = null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(profile.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(profile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
                state.message = "Usuário atualizado com sucesso!"
            })
            .addCase(updateProfile.rejected, (state, action) => {
                console.log(state, action);
                state.loading = false;
                state.error = action.payload;
                state.user = {};
            })
            .addCase(getUserDetails.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
            })
            .addCase(following.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(following.fulfilled, (state,action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.user = action.payload.user;
                state.message = action.payload.message;
            })
            .addCase(following.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(unfollow.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.user = action.payload;
                state.message = action.payload.message;
            })
            .addCase(unfollow.rejected, (state, action) => {
                state.loading = false; 
                state.error = action.payload
            })
    }
})

export const {resetMessage} = userSlice.actions;
export default userSlice.reducer;