/**
 * UpgradeButton Component
 * Handles plan upgrade flow with Razorpay checkout
 */

import React, { useState } from 'react';
import { useToast } from '../../../hooks/use-toast';
import * as razorpayUtils from '../utils/razorpay';
import * as billingService from '../services/billing.service';
import type { RazorpayPaymentResponse } from '../types/billing.types';

interface UpgradeButtonProps {
  planId: string;
  planName: string;
  currentPlan?: string;
  onUpgradeSuccess?: () => void;
  className?: string;
  disabled?: boolean;
}

export const UpgradeButton: React.FC<UpgradeButtonProps> = ({
  planId,
  planName,
  currentPlan,
  onUpgradeSuccess,
  className = '',
  disabled = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      ) : (
        'Get Started'
      )}
    </button>
  );
};
