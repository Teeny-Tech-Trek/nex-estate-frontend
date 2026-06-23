// ────────────────────────────────────────────────────────────────────────────
// ComponentErrorBoundary — Reusable React Error Boundary
//
// Use at three levels:
//   1. GLOBAL  — wraps the entire <App /> in main.tsx
//   2. ROUTE   — wraps individual page routes
//   3. WIDGET  — wraps dashboard panels, chat consoles, analytics cards
//
// On crash: renders a fallback UI with retry button. Isolated — a crashed
// widget won't take down the whole page.
//
// Usage:
//   <ComponentErrorBoundary level="widget" label="Recent Leads">
//     <RecentLeadsPanel />
//   </ComponentErrorBoundary>
// ────────────────────────────────────────────────────────────────────────────

import React, { Component, ErrorInfo, ReactNode } from "react";
import { reportError } from "@/lib/monitoring";

type BoundaryLevel = "global" | "route" | "widget";

interface Props {
  children: ReactNode;
  /** Controls the visual style and messaging of the fallback. */
  level?: BoundaryLevel;
  /** Human-readable label for the section that failed (e.g. "Dashboard"). */
  label?: string;
  /** Optional custom fallback UI. If not provided, uses the built-in fallback. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ComponentErrorBoundary extends Component<Props, State> {
  static defaultProps: Partial<Props> = {
    level: "widget",
    label: "Component",
  };

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Report to monitoring system
    reportError(error, {
      component: this.props.label,
      level: this.props.level,
      componentStack: errorInfo.componentStack,
    }, "ReactRenderError");
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Custom fallback takes priority
    if (this.props.fallback) {
      return this.props.fallback;
    }

    const { level, label } = this.props;

    // ── Global-level fallback: full-page recovery screen ────────────────
    if (level === "global") {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          color: "#e2e8f0",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          padding: "24px",
          textAlign: "center",
        }}>
          <div style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(12px)",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.1)",
            padding: "48px",
            maxWidth: "480px",
            width: "100%",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
            <h1 style={{ fontSize: "24px", fontWeight: 700, marginBottom: "8px" }}>
              Something went wrong
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px", lineHeight: 1.6 }}>
              The application encountered an unexpected error. Our team has been
              notified. Please try reloading the page.
            </p>
            <button
              onClick={this.handleReload}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                color: "#fff",
                border: "none",
                padding: "12px 32px",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(59,130,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    // ── Route-level fallback: inline recovery panel ──────────────────────
    if (level === "route") {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          padding: "32px",
          textAlign: "center",
          fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        }}>
          <div style={{
            background: "#fef2f2",
            borderRadius: "12px",
            border: "1px solid #fecaca",
            padding: "32px",
            maxWidth: "420px",
            width: "100%",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔧</div>
            <h2 style={{ fontSize: "18px", fontWeight: 600, color: "#991b1b", marginBottom: "8px" }}>
              {label} encountered an error
            </h2>
            <p style={{ color: "#b91c1c", fontSize: "13px", marginBottom: "20px", lineHeight: 1.5 }}>
              This section failed to load. The rest of the app is still working.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button
                onClick={this.handleRetry}
                style={{
                  background: "#dc2626",
                  color: "#fff",
                  border: "none",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                style={{
                  background: "transparent",
                  color: "#dc2626",
                  border: "1px solid #fca5a5",
                  padding: "10px 24px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ── Widget-level fallback: compact inline card ───────────────────────
    return (
      <div style={{
        background: "#fff7ed",
        borderRadius: "8px",
        border: "1px solid #fed7aa",
        padding: "20px",
        textAlign: "center",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}>
        <div style={{ fontSize: "24px", marginBottom: "8px" }}>⚡</div>
        <p style={{ fontSize: "13px", fontWeight: 600, color: "#9a3412", marginBottom: "4px" }}>
          {label} failed to load
        </p>
        <p style={{ fontSize: "12px", color: "#c2410c", marginBottom: "12px" }}>
          Click below to retry.
        </p>
        <button
          onClick={this.handleRetry}
          style={{
            background: "#ea580c",
            color: "#fff",
            border: "none",
            padding: "6px 16px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }
}

export default ComponentErrorBoundary;
