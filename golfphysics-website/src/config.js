/**
 * Website Configuration
 *
 * Uses environment variables with fallback to window.location.origin
 * This allows the website to work on any domain without hardcoded URLs.
 */

// API Base URL - uses env var or defaults to same origin
// For development, set VITE_API_BASE_URL in .env
// For production, leave unset to use the same origin as the website
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// If API_BASE_URL is empty, API calls will be relative (same origin)
// This works when the website is served from the same domain as the API

// Environment detection
export const ENVIRONMENT = import.meta.env.VITE_ENVIRONMENT || 'production';
export const IS_DEVELOPMENT = ENVIRONMENT === 'development';

// Helper to build API URLs
export const getApiUrl = (path) => {
  const base = API_BASE_URL || window.location.origin;
  return `${base}${path}`;
};

export default {
  API_BASE_URL,
  ENVIRONMENT,
  IS_DEVELOPMENT,
  getApiUrl,
};
