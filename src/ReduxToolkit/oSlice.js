import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { API, setAuthHeader } from './api';

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/signin', userData);
      localStorage.setItem('jwt', data.jwt);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await API.post('/auth/signup', userData);
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      throw rejectWithValue(error.message);
    }
  }
);

export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (jwt, { rejectWithValue }) => {
    try {
      setAuthHeader(jwt, API);
      const { data } = await API.get('/api/users/profile');
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

export const getUserList = createAsyncThunk(
  'auth/getUserList',
  async (jwt, { rejectWithValue }) => {
    try {
      setAuthHeader(jwt, API);
      const { data } = await API.get('/api/users/users');
      return data;
    } catch (error) {
      throw rejectWithValue(error.response?.data?.error || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    jwt: null,
    users: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.loggedIn = true;
        // Automatically fetch user profile after successful login
        if (action.payload.jwt) {
          // We'll handle this in the App component
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.jwt = action.payload.jwt;
        state.loggedIn = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.loggedIn = true;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserList.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUserList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.jwt = null;
        state.users = [];
        state.error = null;
        state.loggedIn = false;
      });
  },
});

export default authSlice.reducer;