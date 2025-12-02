import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showDrawer: false,
};

const showDrawerSlice = createSlice({
    name: 'header',
    initialState,
    reducers: {
        setShowDrawer: (state, action) => {
            state.showDrawer = action.payload;
        }
    },

});

export default showDrawerSlice.reducer;
export const { setShowDrawer } = showDrawerSlice.actions;