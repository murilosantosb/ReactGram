import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import messageService from "../services/messageService";

const initialState = {
    messages: [],
    contacts: [],
    message: {},
    error: false,
    success: false,
    loading: false,
}

export const getAllContacts = createAsyncThunk(
    "message/contacts",
    async (id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await messageService.getAllContacts(id,token)

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

export const sendMessage = createAsyncThunk(
    "message/sendmessage",
    async(messageData, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await messageService.sendMessage(
            {message: messageData.message},
            messageData.id,
            token
        )

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

export const getMessageId = createAsyncThunk(
    "message/chat",
    async (id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        const data = await messageService.getMessageId(id, token)

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data
    }
)

export const deleteMessage = createAsyncThunk(
    "message/delete",
    async(id, thunkAPI) => {
        const token = thunkAPI.getState().auth.user.token

        try {
        const data = await messageService.deleteMessage(id, token)

        if(data.errors){
            return thunkAPI.rejectWithValue(data.errors[0])
        }

        return data

        } catch (error) {
            throw new Error("Erro ao excluir a mensagem.")
        }
    }
)

export const messageSlice = createSlice({
    name: "message",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getAllContacts.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getAllContacts.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.contacts = action.payload,
                state.error = null;
            })
            .addCase(getAllContacts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload
            })
            .addCase(getMessageId.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(getMessageId.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.messages = action.payload;
            })
            .addCase(getMessageId.rejected, (state, action) => {
                state.loading = false ;
                state.error = action.payload;
                state.messages = []
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                state.messages = state.messages.concat(action.payload.data)
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.messages = []
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
                // state.messages = state.messages.filter(message => message._id !== action.payload.data)
                state.messages = state.messages.filter(message => message._id !== action.payload._id)
            })
            .addCase(deleteMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload,
                state.messages = []
            })
    }
})


export default messageSlice.reducer;