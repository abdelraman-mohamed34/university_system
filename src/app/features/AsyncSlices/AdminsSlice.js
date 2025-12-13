import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    admins: [],
    loading: false
};

export const fetchAdmins = createAsyncThunk(
    'admins/fetchAdmins',
    async () => {
        const response = await axios.get(`/api/admins`);
        return response.data;
    }
);

const adminSlice = createSlice({
    name: 'professors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAdmins.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchAdmins.fulfilled, (state, action) => {
            state.admins = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchAdmins.rejected, (state) => {
            state.loading = false;
        });
    },
});

export default adminSlice.reducer;
