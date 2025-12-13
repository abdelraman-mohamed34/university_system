
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    colleges: [],
    exams: [],
    status: '',
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

// edit
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

// delete
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

export const fetchExams = createAsyncThunk(
    'exams/fetchExamsStatus',
    async ({ si }) => {
        const response = await axios.get(`/api/exams?si=${si}`);
        return response.data;
    }
);

export const addExam = createAsyncThunk(
    'exams/addExamStatus',
    async ({ req, si }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/exams?si=${si}`,
                req,
                { withCredentials: true } // to pass jwt
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteExam = createAsyncThunk(
    'exams/deleteExamStatus',
    async ({ subjectId, examId }, thunkAPI) => {
        try {
            const response = await axios.delete(
                `/api/exams?si=${subjectId}&ei=${examId}`,
                { withCredentials: true } // to pass jwt
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const postSubjectData = createAsyncThunk(
    'courses/postSubjectDataStatus',
    async ({ subCode, uploaded }, thunkAPI) => {
        try {
            const response = await axios.post(
                `/api/postSubjectData?sc=${subCode}`,
                { uploaded },
                { withCredentials: true } // to pass jwt
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const deleteData = createAsyncThunk(
    'exams/deleteDataStatus',
    async ({ savedSubjectCode, savedDataCode }, thunkAPI) => {
        try {
            const response = await axios.delete(
                `/api/postSubjectData?sc=${savedSubjectCode}`,
                {
                    data: { id: savedDataCode },
                    withCredentials: true
                }
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);


const collegeSlice = createSlice({
    name: 'college',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchColleges.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchColleges.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.colleges = action.payload;
            })
            .addCase(fetchColleges.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
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
        builder.addCase(fetchExams.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(fetchExams.fulfilled, (state, action) => {
            state.loading = false;
            state.exams = action.payload;
        });
        builder.addCase(fetchExams.rejected, (state, action) => {
            state.loading = false;
        });
        builder.addCase(addExam.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(addExam.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(addExam.rejected, (state, action) => {
            state.loading = false;
        });
        builder.addCase(postSubjectData.pending, (state, action) => {
            state.loading = true;
        });
        builder.addCase(postSubjectData.fulfilled, (state, action) => {
            state.loading = false;
        });
        builder.addCase(postSubjectData.rejected, (state, action) => {
            state.loading = false;
        });
    },
});

export default collegeSlice.reducer;