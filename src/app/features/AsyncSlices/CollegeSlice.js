
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    colleges: [],
    loading: false
};

export const fetchColleges = createAsyncThunk(
    'colleges/fetchCollegesStatus',
    async () => {
        const response = await axios.get(`/api/colleges`);
        return response.data;
    }
);

// prof
export const postAssignment = createAsyncThunk(
    'assignment/postAssignmentStatus',
    async ({ subCode, title, img, question }, { getState }) => {
        const response = await axios.post(`/api/courses/${subCode}/assignments`,
            { title, img, question }, // req.json
            { withCredentials: true } // to pass jwt
        );
        return response.data;
    }
);

export const deleteAssignment = createAsyncThunk(
    "assignments/delete",
    async ({ subCode, assignmentId }) => {
        const response = await axios.delete(
            `/api/courses/${subCode}/assignments`,
            {
                data: { assignmentId },
                withCredentials: true,
            }
        );
        return response.data;
    }
);

export const EditAssignment = createAsyncThunk(
    "assignments/edit",
    async ({ subCode, assignmentId, updates }) => {
        const response = await axios.put(
            `/api/courses/${subCode}/assignments`,
            { assignmentId, updates }, // req.json
            { withCredentials: true }
        );
        return response.data;
    }
);


const collegeSlice = createSlice({
    name: 'college',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchColleges.pending, (state) => {
            state.loading = true;
            console.log('pending');
        });
        builder.addCase(fetchColleges.fulfilled, (state, action) => {
            state.colleges = action.payload;
            state.loading = false;
            console.log('fulfilled');
        });
        builder.addCase(fetchColleges.rejected, (state) => {
            state.loading = false;
            console.log('rejected');
        });
        builder.addCase(postAssignment.fulfilled, (state, action) => {
            const { subCode, assignment } = action.payload;
            for (const college of state.colleges) {
                for (const year of college.years) {
                    for (const dept of year.departments) {
                        for (const term of dept.terms) {
                            const course = term.courses.find(c => c.subCode === subCode);
                            if (course) {
                                if (!course.assignments) course.assignments = [];
                                course.assignments.push(assignment);
                            }
                        }
                    }
                }
            }
        });
        builder.addCase(postAssignment.rejected, (state, action) => {
            console.error("Assignment failed", action.error.message);
        });

        builder.addCase(deleteAssignment.fulfilled, (state, action) => {
            console.log('deleted')
        });

    },
});

export default collegeSlice.reducer;