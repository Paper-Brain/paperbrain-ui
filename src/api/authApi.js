import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URL } from '../util/constants.js';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: BASE_API_URL,
    // CRITICAL: This ensures cookies (access-token/refresh-token) 
    // are sent with the request to your backend.
    credentials: 'include', 
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    // Endpoint to fetch the currently authenticated user
    getMe: builder.query({
      query: () => 'users/me',
      providesTags: ['User'],
    }),

    // Endpoint for logging out (optional, but good practice)
    logout: builder.mutation({
      query: () => ({
        url: 'auth/logout', // Replace with your actual logout endpoint
        method: 'POST',
      }),
      invalidatesTags: ['User'], // Clear the user cache upon logout
    }),

    // Optional: Mutation to start the GitHub OAuth flow (useful for front-end integration)
    githubLogin: builder.mutation({
      query: () => ({
        url: 'auth/github/login',
        method: 'GET',
        // Note: For actual redirection, you might need to handle this outside of RTK Query 
        // using window.location or handle the response redirect URL.
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are auto-generated based on the endpoint names
export const { 
    useGetMeQuery, 
    useLogoutMutation, 
    useGithubLoginMutation 
} = authApi;
