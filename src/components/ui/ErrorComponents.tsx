// ────────────────────────────────────────────────────────────────────────────
// Error State UI Components
//
// A suite of premium fallback components for error, empty, loading, and
// retry states. These replace raw error messages and blank screens with
// polished, branded visuals.
//
// Usage:
//   <ErrorState message="Failed to load leads" onRetry={() => refetch()} />
//   <EmptyState title="No properties yet" description="Add your first property" />
//   <LoadingState />
//   <RetryState message="Connection lost" onRetry={retryFn} />
// ────────────────────────────────────────────────────────────────────────────

import React from "react";

/* ──────────────────────────── Shared Styles ──────────────────────────── */

const containerStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px 24px",
  textAlign: "center",
  fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
};

const buttonBase: React.CSSProperties = {
  border: "none",
  padding: "10px 28px",
  borderRadius: "8px",
  fontSize: "13px",
  fontWeight: 600,
  cursor: "pointer",
  transition: "transform 0.15s, box-shadow 0.15s",
};

/* ──────────────────────────── ErrorState ──────────────────────────── */

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "Something went wrong. Please try again.",
  onRetry,
}) => (
  <div style={containerStyle}>
    <div style={{
      background: "linear-gradient(135deg, #fef2f2, #fff1f2)",
      borderRadius: "12px",
      border: "1px solid #fecaca",
      padding: "32px 40px",
      maxWidth: "400px",
      width: "100%",
    }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>❌</div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#991b1b", marginBottom: "8px" }}>
        Error
      </h3>
      <p style={{ fontSize: "13px", color: "#b91c1c", lineHeight: 1.6, marginBottom: onRetry ? "20px" : "0" }}>
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{ ...buttonBase, background: "#dc2626", color: "#fff" }}
        >
          Try Again
        </button>
      )}
    </div>
  </div>
);

/* ──────────────────────────── EmptyState ──────────────────────────── */

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "Nothing here yet",
  description = "Get started by creating your first item.",
  actionLabel,
  onAction,
}) => (
  <div style={containerStyle}>
    <div style={{
      background: "linear-gradient(135deg, #f0f9ff, #eff6ff)",
      borderRadius: "12px",
      border: "1px solid #bfdbfe",
      padding: "32px 40px",
      maxWidth: "400px",
      width: "100%",
    }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>📭</div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#1e40af", marginBottom: "8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: "13px", color: "#3b82f6", lineHeight: 1.6, marginBottom: onAction ? "20px" : "0" }}>
        {description}
      </p>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          style={{ ...buttonBase, background: "#2563eb", color: "#fff" }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

/* ──────────────────────────── LoadingState ──────────────────────────── */

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading...",
}) => (
  <div style={containerStyle}>
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
    }}>
      {/* Animated spinner */}
      <div style={{
        width: "36px",
        height: "36px",
        border: "3px solid #e2e8f0",
        borderTopColor: "#3b82f6",
        borderRadius: "50%",
        animation: "error-comp-spin 0.8s linear infinite",
      }} />
      <p style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
        {message}
      </p>
    </div>
    <style>{`@keyframes error-comp-spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ──────────────────────────── RetryState ──────────────────────────── */

interface RetryStateProps {
  message?: string;
  onRetry: () => void;
}

export const RetryState: React.FC<RetryStateProps> = ({
  message = "Failed to load. Tap to retry.",
  onRetry,
}) => (
  <div style={containerStyle}>
    <div style={{
      background: "linear-gradient(135deg, #fffbeb, #fef3c7)",
      borderRadius: "12px",
      border: "1px solid #fde68a",
      padding: "24px 32px",
      maxWidth: "360px",
      width: "100%",
      cursor: "pointer",
      transition: "transform 0.15s",
    }}
      onClick={onRetry}
      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔄</div>
      <p style={{ fontSize: "13px", color: "#92400e", fontWeight: 600, marginBottom: "4px" }}>
        {message}
      </p>
      <p style={{ fontSize: "11px", color: "#b45309" }}>Click to retry</p>
    </div>
  </div>
);

/* ──────────────────────────── AccessDenied ──────────────────────────── */

interface AccessDeniedProps {
  message?: string;
}

export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You do not have permission to view this page.",
}) => (
  <div style={containerStyle}>
    <div style={{
      background: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
      borderRadius: "12px",
      border: "1px solid #fbcfe8",
      padding: "32px 40px",
      maxWidth: "400px",
      width: "100%",
    }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#9d174d", marginBottom: "8px" }}>
        Access Denied
      </h3>
      <p style={{ fontSize: "13px", color: "#be185d", lineHeight: 1.6 }}>
        {message}
      </p>
    </div>
  </div>
);

/* ──────────────────────────── Maintenance ──────────────────────────── */

interface MaintenanceProps {
  message?: string;
}

export const Maintenance: React.FC<MaintenanceProps> = ({
  message = "We're performing scheduled maintenance. Please check back shortly.",
}) => (
  <div style={{
    ...containerStyle,
    minHeight: "60vh",
  }}>
    <div style={{
      background: "linear-gradient(135deg, #f0fdf4, #dcfce7)",
      borderRadius: "12px",
      border: "1px solid #bbf7d0",
      padding: "32px 40px",
      maxWidth: "420px",
      width: "100%",
    }}>
      <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛠️</div>
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#166534", marginBottom: "8px" }}>
        Under Maintenance
      </h3>
      <p style={{ fontSize: "13px", color: "#15803d", lineHeight: 1.6 }}>
        {message}
      </p>
    </div>
  </div>
);
