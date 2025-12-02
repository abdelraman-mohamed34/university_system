import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    foods: [],
    count: 1,
    loading: false
};

export const fetchFood = createAsyncThunk(
    'food/fetchFood',
    async () => {
        const response = await axios.get('/api/food', { withCredentials: true });
        return response.data;
    }
);

export const updateFood = createAsyncThunk(
    'food/updateFood',
    async ({ id, stock, sales }) => {
        const response = await axios.put('/api/food', { id, stock, sales }, { withCredentials: true });
        return response.data;
    }
);

const foodSlice = createSlice({
    name: 'food',
    initialState,
    reducers: {
        increment: (state, action) => {
            const item = action.payload
            state.count < item.stock ? state.count += 1 : null;
        },
        decrement: (state) => {
            state.count > 1 ? state.count -= 1 : null;
        },
        backDefaultCount: (state) => {
            state.count = 1
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFood.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFood.fulfilled, (state, action) => {
                state.foods = action.payload;
                state.loading = false;
            })
            .addCase(fetchFood.rejected, (state) => {
                state.loading = false;
            })
            .addCase(updateFood.fulfilled, (state, action) => {
                const updated = action.payload;
                state.foods = state.foods.map(food =>
                    food.id === updated.id ? updated : food
                );
            });
    },
});

export const { increment, decrement, backDefaultCount } = foodSlice.actions;
export default foodSlice.reducer;
