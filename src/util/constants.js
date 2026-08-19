// Use environment variables for all environment-specific URLs.
// Define these in your .env files (e.g., .env, .env.production, .env.staging) with VITE_ prefix.
// Example .env.local:
// VITE_BASE_API_URL=https://localhost:8000/api/v1
// VITE_SLUG_URL=http://localhost:5173/organizations/
// VITE_ORG_BASE_API_URL=http://localhost:8001/api/v1

export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL ?? "https://localhost:8000/api/v1";
export const SLUG_URL = import.meta.env.VITE_SLUG_URL ?? "http://localhost:5173/organizations/";
export const ORG_BASE_API_URL = import.meta.env.VITE_ORG_BASE_API_URL ?? "http://localhost:8001/api/v1";

// Key for the authentication token (if you ever switch back to localStorage)
export const AUTH_TOKEN_KEY = "authToken";