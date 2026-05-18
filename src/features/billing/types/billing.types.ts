/**
 * Billing Domain Types
 * Defines all TypeScript interfaces for billing operations
 */

// ── Plan & Pricing ───────────────────────────────────────────────────
export interface Plan {
  id: string;
  name: string;
  price: number;
  seats: number;
  agentsLimit: number;
  propertiesLimit: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  isCustom?: boolean;
}

export interface PricingTier {
  name: string;
  seats: number;
  agentsLimit: number;
  propertiesLimit: number;
  price: number;
  features?: string[];
}

// ── Organization Subscription ────────────────────────────────────────
export interface Subscription {
  status: 'inactive' | 'active' | 'trial' | 'expired' | 'cancelled' | 'payment_failed';
  centralBillingCustomerId: string;
  currentPeriodEnd: string; // ISO date
  planId: string;
  lastSyncedAt: string; // ISO date
}

// ── Billing Status & Usage ───────────────────────────────────────────
export interface UsageMetric {
  used: number;
  limit: number;
  percent: number;
}

export interface BillingStatus {
  plan: {
    name: string;
    seats: number;
    agentsLimit: number;
    propertiesLimit: number;
    price: number;
  };
  usage: {
    agents: UsageMetric;
    members: UsageMetric;
    properties?: UsageMetric;
  };
  pricingTiers: {
    [key: string]: PricingTier;
  };
  subscription?: Subscription;
}

// ── Orders & Payments ────────────────────────────────────────────────
export interface Order {
  orderId: string;
  customerId: string;
  planId: string;
  amount: number;
  currency: string;
  status: 'created' | 'captured' | 'failed' | 'refunded';
  receiptId?: string;
  createdAt: string; // ISO date
  expireBy?: string; // ISO date
}

export interface PaymentVerification {
  success: boolean;
  message: string;
  subscription?: Subscription;
  subscription_status?: string;
}

// ── Razorpay Checkout Options ────────────────────────────────────────
export interface RazorpayCheckoutOptions {
  key: string;
  order_id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  image?: string;
  handler?: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
}

export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ── Billing Info (Complete Response) ─────────────────────────────────
export interface BillingInfo {
  plan: {
    name: 'free' | 'pro' | 'enterprise';
    seats: number;
    agentsLimit: number;
    propertiesLimit: number;
    price: number;
  };
  usage: {
    agents: UsageMetric;
    members: UsageMetric;
  };
  pricingTiers: {
    [key: string]: PricingTier;
  };
  subscription?: Subscription;
}

// ── Invoice ──────────────────────────────────────────────────────────
export interface Invoice {
  invoiceId: string;
  amount: number;
  currency: string;
  status: 'paid' | 'pending' | 'failed';
  pdfUrl: string;
  date: string; // ISO date
}

// ── Billing Service Response Types ───────────────────────────────────
export interface CreateOrderResponse {
  success: boolean;
  order: Order;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  subscription?: Subscription;
}

export interface SyncSubscriptionResponse {
  success: boolean;
  message: string;
  subscription: Subscription;
  subscription_status: string;
}

export interface InitBillingResponse {
  success: boolean;
  message: string;
  organization: {
    _id: string;
    name: string;
    subscription: Subscription;
  };
}
