
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    professors: [],
    loading: false
};

export const fetchProfessors = createAsyncThunk(
    'professors/fetchProfessorStatus',
    async () => {
        const response = await axios.get(`/api/professors`);
        return response.data;
    }
);

const professorSlice = createSlice({
    name: 'professors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProfessors.pending, (state) => {
            state.loading = true;
            console.log('pending');
        });
        builder.addCase(fetchProfessors.fulfilled, (state, action) => {
            state.professors = action.payload;
            state.loading = false;
            console.log('fulfilled');
        });
        builder.addCase(fetchProfessors.rejected, (state) => {
            state.loading = false;
            console.log('rejected');
        });
    },
});

export default professorSlice.reducer;
