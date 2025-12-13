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

export const solveTheExam = createAsyncThunk(
    'exams/solveTheExamStatus',
    async ({ data, examId }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/solveExam?q=${examId}`,
                data,
                { withCredentials: true }
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
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
        });
        builder.addCase(fetchStudents.fulfilled, (state, action) => {
            state.students = action.payload;
            state.loading = false;
        });
        builder.addCase(fetchStudents.rejected, (state) => {
            state.loading = false;
        });
        builder.addCase(solveTheExam.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(solveTheExam.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(solveTheExam.rejected, (state) => {
            state.loading = false;
        });
    },
});

export default studentsSlice.reducer;
export const { clickedStudentCode } = studentsSlice.actions;