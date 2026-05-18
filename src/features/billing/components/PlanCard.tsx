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
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  currentPlanName,
  onUpgradeSuccess,
}) => {
  const isCurrentPlan = currentPlanName?.toLowerCase() === plan.name.toLowerCase();

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
          {plan.isCustom ? (
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-cyan-400">Custom</span>
              <span className="text-slate-400 text-sm">Talk to our team</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">${plan.price}</span>
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

        {/* Plan Details Grid */}
        <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="text-center">
            <p className="text-slate-500 text-xs mb-1">Team</p>
            <p className="font-bold text-white">{plan.seats}</p>
          </div>
          <div className="text-center border-l border-r border-slate-700/50">
            <p className="text-slate-500 text-xs mb-1">Agents</p>
            <p className="font-bold text-white">{plan.agentsLimit}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-500 text-xs mb-1">Properties</p>
            <p className="font-bold text-white">{plan.propertiesLimit}</p>
          </div>
        </div>

        {/* CTA Button */}
        <UpgradeButton
          planId={plan.id}
          planName={plan.name}
          currentPlan={currentPlanName}
          onUpgradeSuccess={onUpgradeSuccess}
          disabled={isCurrentPlan}
          className="w-full"
        />
      </div>
    </div>
  );
};
