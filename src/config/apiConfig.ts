/**
 * Centralized API Configuration
 * 
 * This module manages:
 * - Base URL configuration
 * - Axios instance creation
 * - Request interceptors (token management + X-Trace-Id injection)
 * - Response interceptors (401 handling, token refresh, error mapping)
 * 
 * Supports environment-based configuration through VITE_API_URL
 */

import axios, { AxiosError } from 'axios';
import { getCookie, setCookie, eraseCookie } from '../lib/utils';
import { mapAxiosError, type MappedError } from '../lib/errorMapper';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'https://api.nexestate.techtrekkers.ai/api';
  // import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generate a UUID v4 trace ID for request correlation.
 */
function generateTraceId(): string {
  // Use crypto.randomUUID if available (modern browsers), fallback to manual
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `t-${crypto.randomUUID()}`;
  }
  return `t-${'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  })}`;
}

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
 * Request interceptor:
 *   1. Add access token to Authorization header
 *   2. Generate and inject X-Trace-Id for request tracing
 */
api.interceptors.request.use((config) => {
  // ── Auth token ──────────────────────────────────────────────────────
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  // ── Trace ID ────────────────────────────────────────────────────────
  config.headers['X-Trace-Id'] = generateTraceId();

  return config;
});

let refreshPromise: Promise<any> | null = null;

export const getRefreshPromise = (): Promise<any> => {
  if (!refreshPromise) {
    refreshPromise = api.post('/auth/refresh')
      .then((res) => {
        refreshPromise = null;
        return res;
      })
      .catch((err) => {
        refreshPromise = null;
        throw err;
      });
  }
  return refreshPromise;
};

/**
 * Response interceptor: Handle 401 errors, token refresh, and error mapping
 * 
 * Flow:
 * 1. If 401 error occurs and request is not already a refresh/login
 * 2. Attempt to refresh the access token
 * 3. Retry original request with new token
 * 4. If refresh fails, clear cookies and redirect to login
 * 5. For all errors, map to standardized MappedError via errorMapper
 */
api.interceptors.response.use(
  (response) => {
    const resData = response.data;
    if (resData && typeof resData === 'object' && resData.success === true && 'data' in resData) {
      const unwrapped = resData.data;
      if (unwrapped && (typeof unwrapped === 'object' || Array.isArray(unwrapped))) {
        try {
          for (const key of Object.keys(resData)) {
            if (key === 'data') {
              if (!(key in unwrapped)) {
                Object.defineProperty(unwrapped, 'data', {
                  get() { return unwrapped; },
                  configurable: true,
                  enumerable: false
                });
              }
            } else {
              if (!(key in unwrapped)) {
                Object.defineProperty(unwrapped, key, {
                  value: resData[key],
                  writable: true,
                  configurable: true,
                  enumerable: false
                });
              }
            }
          }
        } catch (e) {
          // Ignore
        }
      }
      response.data = unwrapped;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login')
    ) {
      originalRequest._retry = true;
      try {
        // Attempt refresh using HttpOnly cookie on the server
        const { data } = await getRefreshPromise();

        // Store new tokens in cookies
        setCookie('accessToken', data.accessToken, 7); // 7 days

        // Retry original request with new token
        if (originalRequest.headers) {
          if (typeof originalRequest.headers.set === 'function') {
            originalRequest.headers.set('Authorization', `Bearer ${data.accessToken}`);
          } else {
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          }
        }
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

    // ── Map the error to a standardised client error ──────────────────
    const mapped: MappedError = mapAxiosError(error);

    // Attach the mapped error to the Axios error so consumers can access it
    // via `(err as any).mapped` without re-parsing.
    (error as any).mapped = mapped;

    return Promise.reject(error);
  }
);

export default api;
