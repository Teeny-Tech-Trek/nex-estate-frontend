/**
 * useBilling Hook
 * Manages billing data, loading/error states, and operations
 * Used by components to fetch and manage billing information
 */

import { useCallback, useEffect, useState } from 'react';
import * as billingService from '../services/billing.service';
import type {
  BillingStatus,
  Plan,
  Order,
  Subscription,
  BillingInfo,
} from '../types/billing.types';

interface UseBillingState {
  billingStatus: BillingStatus | null;
  plans: Plan[] | null;
  isLoading: boolean;
  error: string | null;
}

export const useBilling = () => {
  const [state, setState] = useState<UseBillingState>({
    billingStatus: null,
    plans: null,
    isLoading: true,
    error: null,
  });

  /**
   * Fetch billing status
   */
  const fetchBillingStatus = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const status = await billingService.getBillingStatus();
      setState((prev) => ({ ...prev, billingStatus: status, isLoading: false }));
      return status;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to fetch billing status';
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Fetch available plans
   */
  const fetchPlans = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const plans = await billingService.getPlans();
      setState((prev) => ({ ...prev, plans, isLoading: false }));
      return plans;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to fetch plans';
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      throw error;
    }
  }, []);

  /**
   * Create order for payment
   */
  const createOrder = useCallback(async (planId: string): Promise<Order> => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const order = await billingService.createOrder(planId);
      return order;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to create order';
      setState((prev) => ({ ...prev, error: errorMsg }));
      throw error;
    }
  }, []);

  /**
   * Verify payment from Razorpay
   */
  const verifyPayment = useCallback(
    async (orderId: string, paymentId: string, signature: string) => {
      try {
        setState((prev) => ({ ...prev, error: null }));
        const result = await billingService.verifyPayment(orderId, paymentId, signature);
        // Refresh billing status after successful payment
        await fetchBillingStatus();
        return result;
      } catch (error: any) {
        const errorMsg = error?.response?.data?.error || error?.message || 'Failed to verify payment';
        setState((prev) => ({ ...prev, error: errorMsg }));
        throw error;
      }
    },
    [fetchBillingStatus]
  );

  /**
   * Sync subscription with backend
   */
  const syncSubscription = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, error: null }));
      const result = await billingService.syncSubscription();
      // Refresh billing status after sync
      await fetchBillingStatus();
      return result;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to sync subscription';
      setState((prev) => ({ ...prev, error: errorMsg }));
      throw error;
    }
  }, [fetchBillingStatus]);

  /**
   * Initialize billing for organization
   */
  const initializeBilling = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const result = await billingService.initializeBilling();
      await fetchBillingStatus();
      return result;
    } catch (error: any) {
      const errorMsg = error?.response?.data?.error || error?.message || 'Failed to initialize billing';
      setState((prev) => ({ ...prev, error: errorMsg, isLoading: false }));
      throw error;
    }
  }, [fetchBillingStatus]);

  /**
   * Load initial billing data on mount
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));
        const [status, plans] = await Promise.all([
          billingService.getBillingStatus(),
          billingService.getPlans().catch(() => []), // Plans fetch is optional
        ]);
        setState((prev) => ({
          ...prev,
          billingStatus: status,
          plans: plans || null,
          isLoading: false,
        }));
      } catch (error: any) {
        const errorMsg = error?.response?.data?.error || error?.message || 'Failed to load billing data';
        setState((prev) => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
        }));
      }
    };

    loadInitialData();
  }, []);

  return {
    // State
    billingStatus: state.billingStatus,
    plans: state.plans,
    isLoading: state.isLoading,
    error: state.error,

    // Operations
    fetchBillingStatus,
    fetchPlans,
    createOrder,
    verifyPayment,
    syncSubscription,
    initializeBilling,

    // Derived state
    currentPlan: state.billingStatus?.plan,
    usage: state.billingStatus?.usage,
    pricingTiers: state.billingStatus?.pricingTiers,
    subscription: state.billingStatus?.subscription,
  };
};
