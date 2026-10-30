/**
 * Global Frontend Configuration
 *
 * Vite loads .env files automatically and exposes variables prefixed with VITE_
 * via import.meta.env.VITE_*
 */
const envUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export const config = Object.freeze({
    apiBaseUrl: envUrl.replace(/\/+$/, "")
});
