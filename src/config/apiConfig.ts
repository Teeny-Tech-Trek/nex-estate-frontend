/**
 * Centralized API Configuration
 * 
 * This module manages:
 * - Base URL configuration
 * - Axios instance creation
 * - Request interceptors (token management)
 * - Response interceptors (401 handling & token refresh)
 * 
 * Supports environment-based configuration through VITE_API_URL
 */

import axios, { AxiosError } from 'axios';
import { getCookie, setCookie, eraseCookie } from '../lib/utils';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://api.nexestate.techtrekkers.ai/api';
  // import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Create axios instance with base configuration
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add access token to Authorization header
 */
api.interceptors.request.use((config) => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/**
 * Response interceptor: Handle 401 errors and token refresh
 * 
 * Flow:
 * 1. If 401 error occurs and request is not already a refresh/login
 * 2. Attempt to refresh the access token
 * 3. Retry original request with new token
 * 4. If refresh fails, clear cookies and redirect to login
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      try {
        // Attempt refresh using HttpOnly cookie on the server
        const { data } = await api.post('/auth/refresh');

        // Store new tokens in cookies
        setCookie('accessToken', data.accessToken, 7); // 7 days

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear cookies on refresh failure
        eraseCookie('accessToken');
        eraseCookie('refreshToken');

        // Only redirect to /login when the user is on a protected route.
        // Public routes (/, /login, /signup, /pricing, /forgot-password,
        // /reset-password, /accept-invite, /agent/:id) should stay put so the
        // landing page renders normally on first load.
        const publicPathPrefixes = [
          '/login',
          '/signup',
          '/pricing',
          '/forgot-password',
          '/reset-password',
          '/accept-invite',
          '/agent/',
          '/auth/google',
        ];
        const pathname = window.location.pathname;
        const isPublic =
          pathname === '/' ||
          publicPathPrefixes.some((p) => pathname.startsWith(p));

        if (!isPublic) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
