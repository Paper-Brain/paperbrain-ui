import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ORG_BASE_API_URL } from "../util/constants.js";

// Define a service using a base URL and expected endpoints
export const orgApi = createApi({
  reducerPath: "orgApi",
  baseQuery: fetchBaseQuery({
    baseUrl: ORG_BASE_API_URL,
    // CRITICAL: This ensures cookies (access-token/refresh-token)
    // are sent with the request to your backend.
    credentials: "include",
  }),
  tagTypes: ["Organization"],

  endpoints: (builder) => ({
    //  QUERY TO FETCH ORGANIZATIONS BY USER ID
    getOrganizationsByUserId: builder.query({
      // This query takes the userId as an argument
      query: (userId) => `/organizations?user_id=${userId}`,
      // Provides the 'Organization' tag to allow mutation invalidation
      providesTags: ["Organization"],
    }),

    //  QUERY TO CHECK ORGANIZATION NAME AVILABILITY
    checkOrganizationNameAvailability: builder.query({
      query: (name) =>
        `/organizations/check-name?name=${encodeURIComponent(name)}`,
    }),

    // ✅ Mutation: Create a new organization
    createOrganization: builder.mutation({
      query: (payload) => ({
        url: "/organizations/",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Organization"], // refreshes org list automatically
    }),
  }),
});

// Export hooks for usage in functional components, which are auto-generated based on the endpoint names
export const {
  useGetOrganizationsByUserIdQuery,
  useLazyCheckOrganizationNameAvailabilityQuery,
  useCreateOrganizationMutation,
} = orgApi;
