// ────────────────────────────────────────────────────────────────────────────
// Error Mapper — Frontend
//
// Maps server error responses (standard envelope) and Axios error codes to
// user-friendly strings. The UI shows THESE messages, never raw technical
// details like "CastError" or "ECONNREFUSED".
//
// Usage:
//   import { mapErrorToMessage, mapAxiosError } from "@/lib/errorMapper";
//   const friendly = mapAxiosError(axiosError);
// ────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError } from "axios";

/**
 * Maps known server `errorCode` values to user-friendly messages.
 */
const ERROR_CODE_MAP: Record<string, string> = {
  AUTH_UNAUTHENTICATED: "Session expired. Please log in again.",
  AUTH_UNAUTHORIZED: "Access denied. You do not have permission to perform this action.",
  RESOURCE_NOT_FOUND: "The requested resource could not be found.",
  ROUTE_NOT_FOUND: "The page or endpoint you requested does not exist.",
  RESOURCE_CONFLICT: "This resource already exists or conflicts with an existing one.",
  VALIDATION_FAILED: "Please check your input and try again.",
  RATE_LIMIT_EXCEEDED: "Too many requests. Please wait a moment and try again.",
  FILE_UPLOAD_ERROR: "File upload failed. Please check the file and try again.",
  PAYMENT_ERROR: "Payment processing failed. Please try again or contact support.",
  AI_PROVIDER_ERROR: "Our AI service is temporarily unavailable. Please try again shortly.",
  EXTERNAL_SERVICE_ERROR: "An external service is temporarily unavailable.",
  DATABASE_ERROR: "Something went wrong on our end. Our team has been notified.",
  INTERNAL_SERVER_ERROR: "Something went wrong on our end. Our team has been notified.",
};

/**
 * Maps HTTP status codes to fallback messages when no errorCode is present.
 */
const STATUS_CODE_MAP: Record<number, string> = {
  400: "Invalid request. Please check your input.",
  401: "Session expired. Please log in again.",
  403: "Access denied. You do not have permission to view this resource.",
  404: "Resource not found.",
  409: "This resource conflicts with an existing one.",
  429: "Too many requests. Please slow down and try again.",
  500: "Something went wrong on our end. Please try again later.",
  502: "Service temporarily unavailable. Please try again.",
  503: "Service under maintenance. Please try again later.",
};

/**
 * Maps Axios network-level error codes to user-friendly messages.
 */
const NETWORK_ERROR_MAP: Record<string, string> = {
  ERR_NETWORK: "Connection lost. Please check your internet connection.",
  ECONNABORTED: "Server is taking too long to respond. Please try again.",
  ERR_CANCELED: "Request was cancelled.",
  ETIMEDOUT: "Connection timed out. Please try again.",
};

export interface MappedError {
  message: string;
  errorCode: string | null;
  statusCode: number | null;
  traceId: string | null;
  isNetworkError: boolean;
  isAuthError: boolean;
}

/**
 * Map a server error code to a user-friendly message.
 */
export function mapErrorCodeToMessage(errorCode: string): string {
  return ERROR_CODE_MAP[errorCode] || "An unexpected error occurred.";
}

/**
 * Map an Axios error to a fully structured MappedError object.
 * This is the primary function used by the API interceptor and UI components.
 */
export function mapAxiosError(error: AxiosError<any>): MappedError {
  // ── Network-level errors (no response received) ──────────────────────
  if (!error.response) {
    const code = error.code || "ERR_NETWORK";
    return {
      message: NETWORK_ERROR_MAP[code] || "Connection failed. Please check your internet settings.",
      errorCode: code,
      statusCode: null,
      traceId: null,
      isNetworkError: true,
      isAuthError: false,
    };
  }

  // ── Server responded with an error ────────────────────────────────────
  const { status, data } = error.response;
  const serverErrorCode = data?.errorCode || null;
  const traceId = data?.traceId || null;

  // Determine user-friendly message (specific server message takes priority)
  let message: string = data?.message || data?.error || "";
  if (!message) {
    if (serverErrorCode && ERROR_CODE_MAP[serverErrorCode]) {
      message = ERROR_CODE_MAP[serverErrorCode];
    } else if (STATUS_CODE_MAP[status]) {
      message = STATUS_CODE_MAP[status];
    } else {
      message = "An unexpected error occurred.";
    }
  }

  return {
    message,
    errorCode: serverErrorCode,
    statusCode: status,
    traceId,
    isNetworkError: false,
    isAuthError: status === 401 || status === 403,
  };
}

/**
 * Safely extracts a user-friendly error message from any caught error.
 */
export function getFriendlyErrorMessage(error: unknown, fallback: string = "Something went wrong"): string {
  if (axios.isAxiosError(error)) {
    return (
      (error as any).mapped?.message ||
      error.response?.data?.message ||
      error.message ||
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
}
