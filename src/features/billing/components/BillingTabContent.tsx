/**
 * BillingTabContent Component
 * Renders the complete billing tab in Settings page
 * Shows current subscription and available plans for upgrade
 */

import React from 'react';
import { CurrentPlanCard } from './CurrentPlanCard';
import { PlanCard } from './PlanCard';
import type { BillingStatus, PricingTier } from '../types/billing.types';

interface BillingTabContentProps {
  billingStatus: BillingStatus | null;
  canManageBilling: boolean;
  onUpgradeSuccess?: () => void;
}

/**
 * Section header component for consistent styling
 */
const SectionHeader = ({ color, title }: { color: string; title: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-1 h-6 bg-gradient-to-b ${color} rounded-full`} />
    <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
  </div>
);

export const BillingTabContent: React.FC<BillingTabContentProps> = ({
  billingStatus,
  canManageBilling,
  onUpgradeSuccess,
}) => {
  if (!billingStatus) {
    return <div className="text-slate-400">No billing information available</div>;
  }

  const currentPlanName = billingStatus.plan?.name;

  // Convert pricingTiers to Plan array for PlanCard component
  const plans = Object.entries(billingStatus.pricingTiers || {}).map(([key, tier]) => ({
    id: key,
    name: tier.name,
    price: tier.price,
    seats: tier.seats,
    agentsLimit: tier.agentsLimit,
    propertiesLimit: tier.propertiesLimit,
    description: getDescriptionForPlan(tier.name),
    features: getPlanFeatures(tier.name),
    isPopular: tier.name.toLowerCase() === 'pro',
    isCustom: tier.name.toLowerCase() === 'enterprise',
  }));

  return (
    <div className="space-y-8">
      {/* Current Subscription */}
      <div>
        <SectionHeader color="from-emerald-500 to-green-500" title="Current Subscription" />
        <div className="mt-5">
          <CurrentPlanCard billingStatus={billingStatus} />
        </div>
      </div>

      {/* Available Plans */}
      {canManageBilling && (
        <div>
          <SectionHeader color="from-blue-500 to-cyan-500" title="Available Plans" />
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                currentPlanName={currentPlanName}
                onUpgradeSuccess={onUpgradeSuccess}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to get description for plan
 */
function getDescriptionForPlan(planName: string): string {
  const descriptions: Record<string, string> = {
    free: 'Perfect for getting started with real estate',
    starter: 'Perfect for individual agents getting started',
    pro: 'Recommended for growing teams',
    professional: 'Recommended for growing teams',
    enterprise: 'Custom solution for large organizations',
  };
  return descriptions[planName.toLowerCase()] || 'Advanced real estate management';
}

/**
 * Helper function to get features for plan
 */
function getPlanFeatures(planName: string): string[] {
  const featureMap: Record<string, string[]> = {
    free: [
      'Up to 2 AI Agents',
      'Basic property management',
      'Email support',
      'Limited integrations',
    ],
    starter: [
      'Up to 5 AI Agents',
      'Core team collaboration',
      'Email support',
      'Standard integrations',
      'Basic analytics',
    ],
    pro: [
      'Unlimited AI Agents',
      'Advanced collaboration tools',
      'Priority support',
      'Full integrations',
      'Advanced analytics',
      'Custom workflows',
    ],
    professional: [
      'Unlimited AI Agents',
      'Advanced collaboration tools',
      'Priority support',
      'Full integrations',
      'Advanced analytics',
      'Custom workflows',
    ],
    enterprise: [
      'Everything in Pro',
      'Custom team size',
      'Dedicated support',
      'Custom integrations',
      'Advanced security',
      'SLA guarantees',
      'White-label options',
    ],
  };
  return featureMap[planName.toLowerCase()] || ['Full access to all features'];
}
