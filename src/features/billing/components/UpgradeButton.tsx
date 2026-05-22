/**
 * UpgradeButton Component
 * Handles plan upgrade flow with Razorpay checkout
 */

import React, { useState } from 'react';
import { useToast } from '../../../hooks/use-toast';
import * as razorpayUtils from '../utils/razorpay';
import * as billingService from '../services/billing.service';
import type { RazorpayPaymentResponse } from '../types/billing.types';
import { isPaymentsDisabledError } from '@/config/paymentToggle';
import PaymentsDisabledModal from './PaymentsDisabledModal';

interface UpgradeButtonProps {
  planId: string;
  planName: string;
  planSlug?: string;
  currentPlan?: string;
  onUpgradeSuccess?: () => void;
  className?: string;
  disabled?: boolean;
  // Enterprise tier — no Razorpay flow; clicking opens a mailto to sales.
  isContactOnly?: boolean;
  userEmail?: string;
  userName?: string;
}

// Read from Vite env at build time; fall back to a sensible default so the
// button always has something to mailto. Override via VITE_SUPPORT_EMAIL.
const SUPPORT_EMAIL =
  (import.meta.env.VITE_SUPPORT_EMAIL as string | undefined) ||
  'sales@nexestate.techtrekkers.ai';

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  planId,
  planName,
  planSlug,
  currentPlan,
  onUpgradeSuccess,
  className = '',
  disabled = false,
  isContactOnly = false,
  userEmail,
  userName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [paymentsDisabledOpen, setPaymentsDisabledOpen] = useState(false);
  const { toast } = useToast();

  const isFreePlan = (planSlug || planName).toLowerCase() === 'free';

  const handleUpgradeClick = async () => {
    // If upgrading to the same plan, show message
    if (currentPlan?.toLowerCase() === planName.toLowerCase()) {
      toast({
        title: 'Current Plan',
        description: `You are already on the ${planName} plan`,
        variant: 'default',
      });
      return;
    }

    if (isFreePlan) {
      toast({
        title: 'Free Plan',
        description: 'Free plan is active by default',
        variant: 'default',
      });
      return;
    }

    if (isContactOnly) {
      // Enterprise — open the user's mail client pre-filled with a sales
      // enquiry. No Razorpay; the sales team handles activation manually.
      const subject = encodeURIComponent('NexEstate Enterprise enquiry');
      const body = encodeURIComponent(
        `Hi NexEstate team,\n\nI'd like to discuss the Enterprise plan.\n\nName: ${userName || ''}\nEmail: ${userEmail || ''}\n\n— Tell us about your needs:\n`,
      );
      window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
      return;
    }

    // No preemptive frontend check for the global payments kill-switch —
    // the backend is the sole authority. If payments are off, the
    // create-order call below returns 503 PAYMENTS_DISABLED and the catch
    // block opens the modal. Backend env (PAYMENTS_ENABLED) is the only
    // place you flip this.

    setIsLoading(true);

    try {
      // Step 1: Create order from backend
      const order = await billingService.createOrder(planId);

      if (!order?.orderId) {
        throw new Error('Failed to create order - no order ID received');
      }

      // Step 2: Initialize Razorpay
      const razorpayKey = razorpayUtils.getRazorpayKey();

      const checkoutOptions = {
        key: razorpayKey,
        order_id: order.orderId,
        name: 'NexEstate',
        description: `Upgrade to ${planName} Plan`,
        amount: order.amount,
        currency: order.currency || 'INR',
        image: '/logo.png',
        prefill: {
          name: 'Organization',
          email: '',
        },
        theme: {
          color: '#0ea5e9',
        },
      };

      // Step 3: Open Razorpay checkout
      await razorpayUtils.openRazorpayCheckout(
        checkoutOptions,
        (response: RazorpayPaymentResponse) => {
          // Payment success - verify with backend
          handlePaymentSuccess(response, order.orderId);
        },
        (error: any) => {
          // Payment failure
          toast({
            title: 'Payment Failed',
            description: error?.message || 'Payment was not completed. Please try again.',
            variant: 'destructive',
          });
          setIsLoading(false);
        }
      );
    } catch (error: any) {
      console.error('Upgrade error:', error);
      // Backend says payments are off — surface the same Contact us modal
      // even if the frontend toggle was misaligned. Backend is authoritative.
      if (isPaymentsDisabledError(error)) {
        setPaymentsDisabledOpen(true);
        setIsLoading(false);
        return;
      }
      const errorMsg =
        error?.response?.data?.error || error?.message || 'Failed to initiate upgrade';
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (
    paymentResponse: RazorpayPaymentResponse,
    orderId: string
  ) => {
    try {
      // Verify payment with backend
      const verifyResult = await billingService.verifyPayment(
        paymentResponse.razorpay_order_id || orderId,
        paymentResponse.razorpay_payment_id,
        paymentResponse.razorpay_signature
      );

      if (verifyResult.success) {
        toast({
          title: 'Success!',
          description: `Successfully upgraded to ${planName} plan`,
          variant: 'default',
        });

        // Callback for parent to refresh
        onUpgradeSuccess?.();
      } else {
        throw new Error(verifyResult.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment verification error:', error);
      toast({
        title: 'Verification Failed',
        description: error?.message || 'Payment was received but verification failed',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <PaymentsDisabledModal
      open={paymentsDisabledOpen}
      onClose={() => setPaymentsDisabledOpen(false)}
      planName={planName}
    />
    <button
      onClick={handleUpgradeClick}
      disabled={disabled || isLoading}
      className={`
        px-6 py-2 rounded-lg font-semibold
        transition-all duration-300
        ${
          disabled || isLoading
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/50'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Processing...
        </div>
      ) : currentPlan?.toLowerCase() === planName.toLowerCase() ? (
        'Current Plan'
      ) : isFreePlan ? (
        'Free Plan'
      ) : isContactOnly ? (
        'Contact sales'
      ) : (
        'Get Started'
      )}
    </button>
    </>
  );
};
