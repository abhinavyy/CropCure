// Central API configuration
// In development: falls back to localhost:10000
// In production: set VITE_API_BASE_URL in Render dashboard (Frontend service)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:10000';

export default API_BASE_URL;
