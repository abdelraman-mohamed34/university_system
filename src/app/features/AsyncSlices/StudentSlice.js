import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    students: [],
    clicked: null,
    loading: false
};

export const fetchStudents = createAsyncThunk(
    'students/fetchStudentStatus',
    async () => {
        const response = await axios.get(`/api/students`);
        return response.data;
    }
);

// student
export const postAssignmentSolution = createAsyncThunk(
    'assignmentSolution/postAssignmentSolution',
    async ({ title, id, subCode, solvedAt }, { getState }) => {
        const response = await axios.post(
            `/api/postAssignment`,
            {
                id,
                title,
                subCode,
                solvedAt,
            },
            { withCredentials: true }
        );
        return response.data;
    }
);

const studentsSlice = createSlice({
    name: 'students',
    initialState,
    reducers: {
        clickedStudentCode: (state, action) => {
            state.clicked = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchStudents.pending, (state) => {
            state.loading = true;
            console.log('pending');
        });
        builder.addCase(fetchStudents.fulfilled, (state, action) => {
            state.students = action.payload;
            state.loading = false;
            console.log('fulfilled');
        });
        builder.addCase(fetchStudents.rejected, (state) => {
            state.loading = false;
            console.log('rejected');
        });
        builder.addCase(postAssignmentSolution.fulfilled, (state, action) => {
            console.log('submitted')
        });
        builder.addCase(postAssignmentSolution.rejected, (state, action) => {
            console.log('failed to upload the solution of assignment')
        });
    },
});

export default studentsSlice.reducer;
export const { clickedStudentCode } = studentsSlice.actions;