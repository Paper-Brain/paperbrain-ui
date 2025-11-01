import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

export const store = configureStore({
  reducer: {
    // Add the generated reducer from authApi
    [authApi.reducerPath]: authApi.reducer,
    // Add other reducers here if needed
  },
  // Adding the api middleware enables caching, invalidation, polling, and other features
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware),
});
