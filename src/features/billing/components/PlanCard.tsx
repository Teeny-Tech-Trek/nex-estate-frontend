/**
 * PlanCard Component
 * Displays a single pricing plan option
 */

import React from 'react';
import { Check, Zap } from 'lucide-react';
import { UpgradeButton } from './UpgradeButton';
import type { Plan } from '../types/billing.types';

interface PlanCardProps {
  plan: Plan;
  currentPlanName?: string;
  onUpgradeSuccess?: () => void;
  userEmail?: string;
  userName?: string;
}

/**
 * Format a paise-denominated price as ₹X (whole rupees). The backend always
 * sends prices in paise — both from TTT (DB) and from local PLAN_FEATURES.
 */
const formatPrice = (priceInPaise: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format((priceInPaise || 0) / 100);

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  currentPlanName,
  onUpgradeSuccess,
  userEmail,
  userName,
}) => {
  const isCurrentPlan = currentPlanName?.toLowerCase() === plan.name.toLowerCase();
  const isContactOnly = !!plan.isContactOnly || !!plan.isCustom;
  const isFreePlan = (plan.slug || plan.name).toLowerCase() === 'free';

  return (
    <div
      className={`
        relative rounded-2xl transition-all duration-300 overflow-hidden
        ${
          isCurrentPlan
            ? 'border-2 border-cyan-500 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 shadow-lg shadow-cyan-500/20'
            : plan.isPopular
              ? 'border-2 border-yellow-500/50 bg-gradient-to-br from-yellow-900/10 to-orange-900/10 shadow-lg shadow-yellow-500/10 transform scale-105'
              : 'border border-slate-700 bg-gradient-to-br from-slate-800/50 to-slate-900/50'
        }
      `}
    >
      {/* Popular Badge */}
      {plan.isPopular && (
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full p-1">
          <div className="bg-slate-900 rounded-full px-3 py-1 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-500">POPULAR</span>
          </div>
        </div>
      )}

      {/* Current Plan Indicator */}
      {isCurrentPlan && (
        <div className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
          Current Plan
        </div>
      )}

      {/* Content */}
      <div className="p-8">
        {/* Plan Name & Price */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white capitalize mb-2">{plan.name}</h3>
          {isContactOnly ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400">Custom</span>
              <span className="text-slate-400 text-sm">Talk to our team</span>
            </div>
          ) : isFreePlan || plan.price === 0 ? (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">Free</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{formatPrice(plan.price)}</span>
              <span className="text-slate-400">/month</span>
            </div>
          )}
        </div>

        {/* Description */}
        {plan.description && (
          <p className="text-slate-300 text-sm mb-6 h-10">{plan.description}</p>
        )}

        {/* Features */}
        <div className="space-y-3 mb-8">
          {plan.features.map((feature, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <span className="text-slate-300 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Plan Details Grid — renders 'Unlimited' for any -1 value so the
            Enterprise tier reads correctly. Messages cell is added in the
            4-tier launch; falls back gracefully when missing. */}
        <div className="grid grid-cols-2 gap-3 mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-center">
            <p className="text-slate-500 text-xs mb-1">Messages / mo</p>
            <p className="font-bold text-white">
              {plan.messagesLimit === -1 || plan.messagesLimit == null
                ? 'Unlimited'
                : plan.messagesLimit.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="text-center border-l border-slate-700/50">
            <p className="text-slate-500 text-xs mb-1">AI Agents</p>
            <p className="font-bold text-white">
              {plan.agentsLimit === -1 ? 'Unlimited' : plan.agentsLimit}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs mb-1">Properties</p>
            <p className="font-bold text-white">
              {plan.propertiesLimit === -1 ? 'Unlimited' : plan.propertiesLimit}
            </p>
          </div>
          <div className="text-center border-l border-slate-700/50">
            <p className="text-slate-500 text-xs mb-1">Team Seats</p>
            <p className="font-bold text-white">
              {plan.seats === -1 ? 'Unlimited' : plan.seats}
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <UpgradeButton
          planId={plan.id}
          planName={plan.name}
          planSlug={plan.slug}
          currentPlan={currentPlanName}
          onUpgradeSuccess={onUpgradeSuccess}
          disabled={isCurrentPlan}
          isContactOnly={isContactOnly}
          userEmail={userEmail}
          userName={userName}
          className="w-full"
        />
      </div>
    </div>
  );
};
