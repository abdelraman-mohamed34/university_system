import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
export const fetchBooks = createAsyncThunk('library/fetchBooks', async () => {
    try {
        const res = await axios.get('/api/books')
        return res.data
    } catch (error) {
        throw error.response?.data || error.message
    }
})

const librarySlice = createSlice({
    name: 'library',
    initialState: { books: [], loading: false, error: null },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => { state.loading = true })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.loading = false
                state.books = action.payload
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.loading = false
                state.error = action.error.message
            })
    },
})

export default librarySlice.reducer
