/**
 * Billing Service
 * API calls for all billing operations
 * Pattern: All methods follow the Axios pattern with explicit return types
 */

import api from '../../../services/api';
import type {
  BillingStatus,
  Plan,
  Order,
  CreateOrderResponse,
  VerifyPaymentResponse,
  SyncSubscriptionResponse,
  InitBillingResponse,
  Invoice,
  BillingInfo,
} from '../types/billing.types';

/**
 * Get current billing status and usage
 * GET /api/billing/status or /settings/billing
 */
export const getBillingStatus = async (): Promise<BillingStatus> => {
  try {
    const response = await api.get<BillingStatus>('/billing/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching billing status:', error);
    throw error;
  }
};

/**
 * Get billing info (alias for getBillingStatus)
 * Returns: plan, usage, pricingTiers, subscription
 */
export const getBillingInfo = async (): Promise<BillingInfo> => {
  try {
    const response = await api.get<BillingInfo>('/billing/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching billing info:', error);
    throw error;
  }
};

/**
 * Get available plans
 * GET /api/billing/plans
 */
export const getPlans = async (): Promise<Plan[]> => {
  try {
    const response = await api.get<{ success: boolean; plans: Plan[] }>('/billing/plans');
    return response.data?.plans || [];
  } catch (error) {
    console.error('Error fetching plans:', error);
    throw error;
  }
};

/**
 * Create a payment order with TTT Payment Service
 * POST /api/billing/create-order
 * Body: { planId: string }
 */
export const createOrder = async (planId: string): Promise<Order> => {
  try {
    const response = await api.post<CreateOrderResponse>('/billing/create-order', {
      planId,
    });

    if (!response.data.success) {
      throw new Error('Failed to create order');
    }

    return response.data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

/**
 * Verify payment from Razorpay
 * POST /api/billing/verify-payment
 * Body: { orderId, paymentId, signature }
 */
export const verifyPayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<VerifyPaymentResponse> => {
  try {
    const response = await api.post<VerifyPaymentResponse>('/billing/verify-payment', {
      orderId,
      paymentId,
      signature,
    });
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};

/**
 * Sync subscription state with TTT Payment Service
 * POST /api/billing/sync-subscription
 */
export const syncSubscription = async (): Promise<SyncSubscriptionResponse> => {
  try {
    const response = await api.post<SyncSubscriptionResponse>('/billing/sync-subscription', {});
    return response.data;
  } catch (error) {
    console.error('Error syncing subscription:', error);
    throw error;
  }
};

/**
 * Initialize billing for the organization
 * POST /api/billing/initialize
 */
export const initializeBilling = async (): Promise<InitBillingResponse> => {
  try {
    const response = await api.post<InitBillingResponse>('/billing/initialize', {});
    return response.data;
  } catch (error) {
    console.error('Error initializing billing:', error);
    throw error;
  }
};

/**
 * Update subscription to a new plan
 * POST /settings/billing/subscribe
 * Body: { plan: planId }
 */
export const updateSubscription = async (
  planId: string
): Promise<{ message: string; paymentUrl?: string }> => {
  try {
    const response = await api.post<{ message: string; paymentUrl?: string }>(
      '/settings/billing/subscribe',
      { plan: planId }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating subscription:', error);
    throw error;
  }
};

/**
 * Get invoices for the organization
 * GET /settings/billing/invoices
 */
export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await api.get<Invoice[]>('/settings/billing/invoices');
    return response.data;
  } catch (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }
};
