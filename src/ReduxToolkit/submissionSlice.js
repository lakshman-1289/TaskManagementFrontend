import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API, setAuthHeader } from './api';

export const submitTask = createAsyncThunk(
  'submissions/submitTask',
  async ({ taskId, githubLink }, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      // Send JSON object with taskId and githubLink properties in the request body
      const { data } = await API.post('/api/submissions', { taskId, githubLink });
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchAllSubmission = createAsyncThunk(
  'submissions/fetchAllSubmissions',
  async (_, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.get('/api/submissions');
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchSubmissionsByTaskId = createAsyncThunk(
  'submissions/fetchSubmissionsByTaskId',
  async (taskId, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.get(`/api/submissions/task/${taskId}`);
      return { taskId, submissions: data };
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const acceptDeclineSubmission = createAsyncThunk(
  'submissions/acceptDeclineSubmission',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      // Send status as a query parameter instead of in the request body
      const { data } = await API.put(`/api/submissions/${id}?status=${status}`);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const submissionSlice = createSlice({
  name: 'submission',
  initialState: {
    submissions: [],
    taskSubmissions: {}, // Store submissions by task ID
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitTask.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(submitTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions.push(action.payload);
      })
      .addCase(submitTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchAllSubmission.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.submissions = action.payload;
      })
      .addCase(fetchAllSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchSubmissionsByTaskId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchSubmissionsByTaskId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Store submissions by task ID
        state.taskSubmissions[action.payload.taskId] = action.payload.submissions;
      })
      .addCase(fetchSubmissionsByTaskId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(acceptDeclineSubmission.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const updatedSubmission = action.payload;
        state.submissions = state.submissions.map((item) =>
          item.id === updatedSubmission.id ? updatedSubmission : item
        );
        
        // Also update in taskSubmissions
        Object.keys(state.taskSubmissions).forEach(taskId => {
          state.taskSubmissions[taskId] = state.taskSubmissions[taskId].map(item =>
            item.id === updatedSubmission.id ? updatedSubmission : item
          );
        });
      })
      .addCase(acceptDeclineSubmission.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default submissionSlice.reducer;