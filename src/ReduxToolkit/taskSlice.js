import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API, setAuthHeader } from './api';

export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async (status, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.get('/api/tasks', { params: status });
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchUsersTask = createAsyncThunk(
  'task/fetchUsersTask',
  async (status, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.get('/api/tasks/user', { params: status });
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const fetchTaskById = createAsyncThunk(
  'task/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.get('/api/tasks/' + taskId);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const createTask = createAsyncThunk(
  'task/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.post('/api/tasks', taskData);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ id, updatedTaskData }, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      const { data } = await API.put('/api/tasks/' + id, updatedTaskData);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const assignTaskToUser = createAsyncThunk(
  'task/assignTaskToUser',
  async ({ taskId, userId }, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      // Try different endpoint patterns
      const { data } = await API.put(`/api/tasks/${taskId}/assign/${userId}`);
      return { taskId, userId, data };
    } catch (error) {
      // Try alternative endpoint
      try {
        const { data } = await API.put(`/api/tasks/${taskId}/assign`, { userId });
        return { taskId, userId, data };
      } catch (error2) {
        throw rejectWithValue(error.response?.data?.error || error.message);
      }
    }
  }
);

export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      setAuthHeader(localStorage.getItem('jwt'), API);
      await API.delete('/api/tasks/' + taskId);
      return taskId;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    tasks: [],
    loading: false,
    error: null,
    taskDetails: null,
    usersTask: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks || action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchUsersTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersTask.fulfilled, (state, action) => {
        state.loading = false;
        state.usersTask = action.payload;
      })
      .addCase(fetchUsersTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTask = action.payload;
        state.tasks = state.tasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        );
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(assignTaskToUser.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific task with the assigned user
        const { taskId, userId, data } = action.payload;
        state.tasks = state.tasks.map((task) => {
          if (task.id === taskId) {
            // Handle different response formats
            if (data && typeof data === 'object') {
              // If the response contains the full updated task
              return data;
            } else {
              // If the response is just a success message, update the task with the userId
              return { ...task, assignedUserId: userId };
            }
          }
          return task;
        });
      })
      .addCase(assignTaskToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        const deletedTaskId = action.payload;
        state.tasks = state.tasks.filter((task) => task.id !== deletedTaskId);
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.taskDetails = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default taskSlice.reducer;