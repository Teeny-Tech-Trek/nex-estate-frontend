/**
 * Razorpay Payment Utility
 * Handles Razorpay script initialization and checkout flow
 */

import type { RazorpayCheckoutOptions, RazorpayPaymentResponse } from '../types/billing.types';

declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Load Razorpay script dynamically
 * Returns true if script loaded successfully
 */
export const initializeRazorpay = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => {
      resolve(true);
    };

    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Open Razorpay checkout popup
 * Call this after getting an order from the backend
 */
export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions,
  onSuccess: (response: RazorpayPaymentResponse) => void,
  onError: (error: any) => void
): Promise<void> => {
  try {
    const loaded = await initializeRazorpay();
    if (!loaded) {
      throw new Error('Failed to initialize Razorpay');
    }

    const razorpay = new window.Razorpay({
      ...options,
      handler: (response: RazorpayPaymentResponse) => {
        onSuccess(response);
      },
    });

    razorpay.on('payment.failed', (error: any) => {
      onError(error);
    });

    razorpay.open();
  } catch (error) {
    onError(error);
  }
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });
  return formatter.format(amount / 100); // Razorpay amounts are in paise
};

/**
 * Get Razorpay key from environment
 */
export const getRazorpayKey = (): string => {
  const key = import.meta.env.VITE_RAZORPAY_KEY;
  if (!key) {
    throw new Error('VITE_RAZORPAY_KEY environment variable is not set');
  }
  return key;
};
