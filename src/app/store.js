import { configureStore } from '@reduxjs/toolkit';
import studentsReducer from './features/AsyncSlices/StudentSlice.js';
import professorsReducer from './features/AsyncSlices/ProfSlice.js';
import adminsReducer from './features/AsyncSlices/AdminsSlice.js';
import usersReducer from './features/AsyncSlices/UsersSlice.js'
import foodsReducer from './features/AsyncSlices/FoodSlice.js';
import booksReducer from './features/AsyncSlices/LibrarySlice.js';
import eventsReducer from './features/AsyncSlices/EventSlice.js';
import searchReducer from './features/NormalSlices/searchSlice.js';
import drawerReducer from './features/NormalSlices/drawerSlice.js';
import snackbarReducer from './features/NormalSlices/snackSlice.js';
import collegesReducer from './features/AsyncSlices/CollegeSlice.js';
import imagesReducer from './features/AsyncSlices/ImagesSlice.js';

export const store = configureStore({
    reducer: {
        users: usersReducer,
        students: studentsReducer,
        professors: professorsReducer,
        admins: adminsReducer,
        food: foodsReducer,
        library: booksReducer,
        events: eventsReducer,
        searches: searchReducer,
        colleges: collegesReducer,
        images: imagesReducer,
        drawer: drawerReducer,
        snackbar: snackbarReducer,
    },
});