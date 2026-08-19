// Use environment variables for all environment-specific URLs.
// Define these in your .env files (e.g., .env, .env.production, .env.staging) with VITE_ prefix.
// Example .env.local:
// VITE_BASE_API_URL=https://localhost:8000/api/v1
// VITE_SLUG_URL=http://localhost:5173/organizations/
// VITE_ORG_BASE_API_URL=http://localhost:8001/api/v1

export const BASE_API_URL = (() => {
  const url = import.meta.env.VITE_BASE_API_URL;
  if (!url) {
    console.error('❌ VITE_BASE_API_URL is not defined in environment variables.');
    // Fail fast in production – the app cannot operate without a valid API endpoint.
    throw new Error('Missing required environment variable: VITE_BASE_API_URL');
  }
  try {
    // Validate that the value is a well‑formed absolute URL and uses HTTPS.
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      console.warn('⚠️ VITE_BASE_API_URL does not use HTTPS. Ensure secure transport.');
    }
    return parsed.toString();
  } catch (e) {
    console.error('❌ VITE_BASE_API_URL is not a valid URL:', e);
    throw new Error('Invalid VITE_BASE_API_URL environment variable');
  }
})();
export const SLUG_URL = (() => {
  const url = import.meta.env.VITE_SLUG_URL;
  if (!url) {
    console.error('❌ VITE_SLUG_URL is not defined in environment variables.');
    throw new Error('Missing required environment variable: VITE_SLUG_URL');
  }
  try {
    // Validate URL – allow both http (dev) and https (prod) but warn if http in prod.
    const parsed = new URL(url);
    if (process.env.NODE_ENV === 'production' && parsed.protocol !== 'https:') {
      console.warn('⚠️ VITE_SLUG_URL is not using HTTPS in production.');
    }
    return parsed.toString();
  } catch (e) {
    console.error('❌ VITE_SLUG_URL is not a valid URL:', e);
    throw new Error('Invalid VITE_SLUG_URL environment variable');
  }
})();
export const ORG_BASE_API_URL = (() => {
  const url = import.meta.env.VITE_ORG_BASE_API_URL;
  if (!url) {
    console.error('❌ VITE_ORG_BASE_API_URL is not defined in environment variables.');
    throw new Error('Missing required environment variable: VITE_ORG_BASE_API_URL');
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') {
      console.warn('⚠️ VITE_ORG_BASE_API_URL does not use HTTPS. Ensure secure transport.');
    }
    return parsed.toString();
  } catch (e) {
    console.error('❌ VITE_ORG_BASE_API_URL is not a valid URL:', e);
    throw new Error('Invalid VITE_ORG_BASE_API_URL environment variable');
  }
})();

// Key for the authentication token (if you ever switch back to localStorage)
export const AUTH_TOKEN_KEY = "authToken";