// Central API configuration
// In production this points to the deployed Render backend.
// In local dev it defaults to /api and uses Vite proxy to backend.
const rawApiUrl = (import.meta.env.VITE_API_URL || '/api').trim();
const withoutTrailingSlash = rawApiUrl.replace(/\/+$/, '');
const API_URL = withoutTrailingSlash.endsWith('/api') ? withoutTrailingSlash : `${withoutTrailingSlash}/api`;

export default API_URL;
