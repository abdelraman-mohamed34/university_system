import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    users: [],
};

// fetch users
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await axios.get(`/api/users`);
        return response.data;
    }
);

// upload profile image
export const uploadProfileImage = createAsyncThunk(
    'profileImage/uploadProfileImage',
    async ({ id, img }) => {
        const response = await axios.post(
            `/api/users`,
            {
                id,
                img,
            }, // req.json
            { withCredentials: true } // to pass jwt
        );
        return response.data;
    }
);

// upload profile image
export const deleteProfileImage = createAsyncThunk(
    'profileImage/deleteProfileImage',
    async ({ id }) => {
        const response = await axios.delete(
            `/api/users`,
            {
                data: { id },
            }, // req.json
            { withCredentials: true } // to pass jwt
        );
        return response.data;
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state, action) => {
            console.log('users pending')
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            console.log('users fulfilled')
            state.users = action.payload
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            console.log('users rejected')
        });
        builder.addCase(uploadProfileImage.pending, () => {
            console.log('uploaded the profile pending')
        });
        builder.addCase(uploadProfileImage.fulfilled, (state, action) => {
            console.log('uploaded the profile image')
        });
        builder.addCase(uploadProfileImage.rejected, () => {
            console.log('failed to upload the new profile image')
        });
    },
});

export default usersSlice.reducer;
export const { clickedStudentCode } = usersSlice.actions;