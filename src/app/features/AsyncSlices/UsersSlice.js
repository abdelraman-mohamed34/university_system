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
    async ({ img }) => {
        const response = await axios.post(
            `/api/users`,
            {
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
    async () => {
        const response = await axios.delete(
            `/api/users`,
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
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.users = action.payload
        });
    },
});

export default usersSlice.reducer;
export const { clickedStudentCode } = usersSlice.actions;