// Use 'http' for local development consistency unless you have a fully trusted self-signed cert setup.
// BASE_API_URL points to the /api/v1 prefix of your FastAPI server
export const BASE_API_URL = "https://localhost:8000/api/v1"; 

// Key for the authentication token (if you ever switch back to localStorage)
export const AUTH_TOKEN_KEY = "authToken";