import { configureStore } from '@reduxjs/toolkit';

import authReducer from './oSlice';
import taskReducer from './taskSlice';
import submissionReducer from './submissionSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    task: taskReducer,
    submission: submissionReducer,
  },
});

export default store;