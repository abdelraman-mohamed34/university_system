
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

export const createTeacher = createAsyncThunk(
    'admins/fetchAdmins',
    async (uploaded) => {
        const response = await axios.post(`/api/professors`,
            uploaded, // req.json()
            { withCredentials: true } // to pass jwt
        );
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
        });
        builder.addCase(fetchProfessors.fulfilled, (state, action) => {
            state.professors = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchProfessors.rejected, (state) => {
            state.loading = false;
        });
    },
});

export default professorSlice.reducer;
