/**
 * CurrentPlanCard Component
 * Displays current subscription and usage information
 */

import React from 'react';
import { Crown, CheckCircle } from 'lucide-react';
import type { BillingStatus } from '../types/billing.types';

interface CurrentPlanCardProps {
  billingStatus: BillingStatus | null;
  isLoading?: boolean;
}

export const CurrentPlanCard: React.FC<CurrentPlanCardProps> = ({ billingStatus, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-32 mb-4" />
        <div className="h-12 bg-slate-700 rounded w-24 mb-4" />
        <div className="space-y-3">
          <div className="h-6 bg-slate-700 rounded w-full" />
          <div className="h-6 bg-slate-700 rounded w-full" />
        </div>
      </div>
    );
  }

  if (!billingStatus?.plan) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700 text-center">
        <p className="text-slate-400">No active plan</p>
      </div>
    );
  }

  const plan = billingStatus.plan;
  const usage = billingStatus.usage;
  const currentPeriodEnd = billingStatus.subscription?.currentPeriodEnd;

  // Format date
  const expiryDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'N/A';

  return (
    <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-2xl p-8 border border-cyan-500/30 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-5 h-5 text-yellow-500" />
            <h3 className="text-2xl font-bold text-white capitalize">{plan.name} Plan</h3>
          </div>
          <p className="text-cyan-400 text-sm">Renews on {expiryDate}</p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">${plan.price}</div>
          <p className="text-slate-400 text-sm">/month</p>
        </div>
      </div>

      {/* Usage Metrics */}
      <div className="space-y-4 mt-6">
        {/* AI Agents */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300">AI Agents</span>
            </div>
            <span className="text-white font-semibold">
              {usage?.agents?.used || 0} / {usage?.agents?.limit || 0}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(usage?.agents?.percent || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* Team Members */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-purple-400" />
              <span className="text-slate-300">Team Members</span>
            </div>
            <span className="text-white font-semibold">
              {usage?.members?.used || 0} / {usage?.members?.limit || 0}
            </span>
          </div>
          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all"
              style={{ width: `${Math.min(usage?.members?.percent || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* Properties */}
        {usage?.properties && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-slate-300">Properties</span>
              </div>
              <span className="text-white font-semibold">
                {usage.properties.used || 0} / {usage.properties.limit || 0}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(usage.properties.percent || 0, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Chat Messages — per-month quota. Hidden when unlimited (limit=-1). */}
        {usage?.messages && usage.messages.limit !== -1 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-orange-400" />
                <span className="text-slate-300">Chat Messages / month</span>
              </div>
              <span className="text-white font-semibold">
                {usage.messages.used || 0} / {usage.messages.limit || 0}
              </span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-orange-500 to-red-500 h-full rounded-full transition-all"
                style={{ width: `${Math.min(usage.messages.percent || 0, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Plan Details */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/50">
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Team Members</p>
          <p className="text-white font-bold text-lg">{plan.seats}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">AI Agents</p>
          <p className="text-white font-bold text-lg">{plan.agentsLimit}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wide">Properties</p>
          <p className="text-white font-bold text-lg">{plan.propertiesLimit}</p>
        </div>
      </div>
    </div>
  );
};
