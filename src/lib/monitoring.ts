// ────────────────────────────────────────────────────────────────────────────
// Frontend Monitoring — Client-side Error Collector
//
// Captures unhandled errors from:
//   1. window.onerror (global script errors)
//   2. window.onunhandledrejection (unhandled promise rejections)
//   3. React Error Boundaries (render crashes)
//
// Batches and sends error reports to the backend. Falls back silently if the
// backend is unreachable. Never crashes the app.
//
// Usage:
//   import { initMonitoring, reportError } from "@/lib/monitoring";
//   initMonitoring(); // call once in main.tsx
//   reportError(error, { component: "Dashboard" }); // manual report
// ────────────────────────────────────────────────────────────────────────────

/** Error report shape sent to backend. */
interface ErrorReport {
  message: string;
  stack?: string;
  type: "ScriptError" | "UnhandledRejection" | "ReactRenderError" | "ManualReport";
  url: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

/** Buffer for batching reports. */
let buffer: ErrorReport[] = [];
let flushTimer: ReturnType<typeof setTimeout> | null = null;
const FLUSH_INTERVAL = 5000; // 5 seconds
const MAX_BUFFER_SIZE = 10;

/**
 * Flush buffered error reports to the backend.
 * Fire-and-forget — never blocks the UI.
 */
async function flush(): Promise<void> {
  if (buffer.length === 0) return;
  const batch = [...buffer];
  buffer = [];

  try {
    // Use native fetch to avoid circular dependency with the Axios client
    await fetch("/api/monitoring/logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ errors: batch }),
    });
  } catch {
    // Silently swallow — monitoring must never break the app.
    // Re-add to buffer if we want retry logic in the future.
  }
}

function scheduleFlush(): void {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    flush();
  }, FLUSH_INTERVAL);
}

function enqueue(report: ErrorReport): void {
  buffer.push(report);
  if (buffer.length >= MAX_BUFFER_SIZE) {
    flush();
  } else {
    scheduleFlush();
  }
}

/**
 * Manually report an error (e.g. from an Error Boundary's componentDidCatch).
 */
export function reportError(
  error: Error | string,
  metadata?: Record<string, unknown>,
  type: ErrorReport["type"] = "ManualReport"
): void {
  const err = typeof error === "string" ? new Error(error) : error;
  enqueue({
    message: err.message,
    stack: err.stack,
    type,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    metadata,
  });
}

/**
 * Initialize global error listeners. Call once from main.tsx.
 * Returns a cleanup function to remove listeners.
 */
export function initMonitoring(): () => void {
  const handleError = (event: ErrorEvent) => {
    enqueue({
      message: event.message || "Unknown script error",
      stack: event.error?.stack,
      type: "ScriptError",
      url: window.location.href,
      timestamp: new Date().toISOString(),
      metadata: {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      },
    });
  };

  const handleRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    enqueue({
      message: reason?.message || String(reason) || "Unhandled promise rejection",
      stack: reason?.stack,
      type: "UnhandledRejection",
      url: window.location.href,
      timestamp: new Date().toISOString(),
    });
  };

  window.addEventListener("error", handleError);
  window.addEventListener("unhandledrejection", handleRejection);

  // Flush remaining buffer on page unload
  const handleUnload = () => flush();
  window.addEventListener("beforeunload", handleUnload);

  return () => {
    window.removeEventListener("error", handleError);
    window.removeEventListener("unhandledrejection", handleRejection);
    window.removeEventListener("beforeunload", handleUnload);
    if (flushTimer) clearTimeout(flushTimer);
  };
}
