import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    showSnackbar: {
        state: false,
        message: '',
        severity: '',
    },
};

const showSnackbarSlice = createSlice({
    name: 'snackbar',
    initialState,
    reducers: {
        setShowSnackbar: (state, action) => {
            state.showSnackbar = action.payload;
        }
    },

});

export default showSnackbarSlice.reducer;
export const { setShowSnackbar } = showSnackbarSlice.actions;