
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    events: [],
    loading: false
};

export const fetchEvents = createAsyncThunk(
    'events/fetchEventsStatus',
    async () => {
        const response = await axios.get(`/api/events`);
        return response.data;
    }
);

const eventSlice = createSlice({
    name: 'event',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchEvents.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchEvents.fulfilled, (state, action) => {
            state.events = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchEvents.rejected, (state) => {
            state.loading = false;
        });
    },
});

export default eventSlice.reducer;
