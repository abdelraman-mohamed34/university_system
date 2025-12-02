import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    images: [],
    loading: false,
    error: null,
};

export const fetchCloudinary = createAsyncThunk(
    'images/fetchImagesStatus',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "hc4oy14c");

            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dq5eot3pv/upload",
                formData
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const imgSlice = createSlice({
    name: 'image',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCloudinary.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCloudinary.fulfilled, (state, action) => {
                state.loading = false;
                state.images.push(action.payload);
            })
            .addCase(fetchCloudinary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "حدث خطأ أثناء الرفع";
            });
    },
});

export default imgSlice.reducer;
