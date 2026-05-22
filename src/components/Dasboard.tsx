import React from 'react';
import { LucideIcon } from "lucide-react";

import { 
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  Award,
  Target
} from 'lucide-react';

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useDashboardLogic } from '../Logics/useDashboardLogic';
import { usePlanLimits } from '../hooks/usePlanLimits';
import { PlanLimitAlert } from '../hooks/PlanLimitAlert';

const Dashboard = () => {
  const {
    headerInfo,
    kpiMetrics,
    leadsData,
    conversionData,
    recentActivities,
    topAgents,
    loading,
    error,
    refreshDashboard,
  } = useDashboardLogic();

  // Surface a banner when the org has hit its monthly chat-message limit.
  // The hook reads /api/billing/status, so the alert reflects the real
  // server-side counter — not optimistic UI state.
  const planLimits = usePlanLimits();
  const messagesAtLimit =
    !planLimits.isLoading && planLimits.isAtLimit?.messages;

  const safeTotalVisits = conversionData.totalVisits > 0 ? conversionData.totalVisits : 1;
  const conversionStroke = Math.min(
    Math.max((conversionData.closedDeals / safeTotalVisits) * 502, 0),
    502
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] p-10 text-white">
        <p className="text-xl">Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] p-10 text-red-400">
        <p className="text-xl mb-4">Error loading dashboard: {error.message}</p>
        <p className="text-md text-slate-400 mb-5">Please try again later or contact support.</p>
        <button
          type="button"
          onClick={() => void refreshDashboard()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]" style={{ padding: "clamp(16px, 3vw, 40px)" }}>
      <div className="max-w-[1920px] mx-auto">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="min-w-0">
              <h1 className="font-bold font-syne-bold text-white mb-1 truncate" style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)" }}>
                Welcome back, {headerInfo.userName}
              </h1>
              <p className="text-slate-400" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
                {headerInfo.greeting}
              </p>
            </div>
            <div className="text-right">
              <div className="text-cyan-400 text-sm font-medium">{headerInfo.currentDate}</div>
              <div className="text-slate-500 text-xs">{headerInfo.updatedStatus}</div>
            </div>
          </div>
        </div>

        {/* Quota-exceeded banner — only renders when the org has used its
            full monthly chat-message allowance. Click-through goes to the
            settings/billing page (PlanLimitAlert handles that internally). */}
        {messagesAtLimit && (
          <div className="mb-6">
            <PlanLimitAlert
              type="message"
              current={planLimits.messages.used}
              limit={planLimits.messages.limit}
              planName={planLimits.planName}
            />
          </div>
        )}

        {/* KPI Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {kpiMetrics.map((metric) => (
            <KPICard
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              change={metric.change}
              trend={metric.trend}
              iconColor={metric.iconColor || 'cyan'}
            />
          ))}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Leads Trend Chart - Spans 2 columns */}
          <div className="lg:col-span-2 bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Leads Trend (30 Days)</h2>
              <p className="text-slate-400 text-sm">Daily new leads vs closed</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={leadsData}>
                <defs>
                  <linearGradient id="newLeadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="closedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#64748b" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0d1b2a', 
                    border: '1px solid #06b6d4',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="newLeads" 
                  stroke="#06b6d4" 
                  strokeWidth={3}
                  name="New Leads"
                  dot={{ fill: '#06b6d4', r: 4 }}
                  activeDot={{ r: 6, fill: '#06b6d4' }}
                  fill="url(#newLeadsGradient)"
                />
                <Line 
                  type="monotone" 
                  dataKey="closed" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  name="Closed Deals"
                  dot={{ fill: '#10b981', r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                  fill="url(#closedGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Visit to Conversion */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Visit to Conversion</h2>
              <p className="text-slate-400 text-sm">How many visits turn into deals</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="relative">
                <svg width="200" height="200" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#1e3a5f"
                    strokeWidth="16"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="url(#conversionGradient)"
                    strokeWidth="16"
                    strokeDasharray={`${conversionStroke} 502`}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  />
                  <defs>
                    <linearGradient id="conversionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="50%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-bold text-white">{conversionData.conversionRate}%</div>
                  <div className="text-slate-400 text-sm">Conversion</div>
                </div>
              </div>
              <div className="mt-6 space-y-3 w-full">
                <ConversionStep label="Total Visits" value={String(conversionData.totalVisits)} color="blue" />
                <ConversionStep label="Qualified Leads" value={String(conversionData.qualifiedLeads)} color="cyan" />
                <ConversionStep label="Closed Deals" value={String(conversionData.closedDeals)} color="green" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Recent Activity</h2>
              <p className="text-slate-400 text-sm">Latest leads, visits & chats</p>
            </div>
            {recentActivities.length === 0 ? (
              <div className="text-slate-400 text-sm py-6 text-center border border-slate-700/30 rounded-lg">
                No recent activity yet.
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </div>

          {/* Top Agents */}
          <div className="bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-6 shadow-xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-white mb-1">Top Agents</h2>
              <p className="text-slate-400 text-sm">By conversions & revenue</p>
            </div>
            {topAgents.length === 0 ? (
              <div className="text-slate-400 text-sm py-6 text-center border border-slate-700/30 rounded-lg">
                No agents available yet.
              </div>
            ) : (
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <AgentCard key={agent.id} agent={agent} rank={index + 1} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
interface KPICardProps {
  icon?: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  iconColor: 'cyan' | 'blue' | 'purple' | 'green' | 'emerald';
}

interface ActivityItemProps {
  activity: {
    id: string | number;
    type: string;
    title: string;
    time: string;
    icon?: React.ComponentType<{ className?: string }>;
    color?: 'cyan' | 'blue' | 'purple' | 'green';
  };
}

interface AgentCardProps {
  agent: {
    id: string | number;
    name: string;
    conversions: number;
    revenue: number;
    avatar: string;
    trend?: number;
  };
  rank: number;
}

interface ConversionStepProps {
  label: string;
  value: string;
  color: 'blue' | 'cyan' | 'green';
}

const colorMap = {
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', icon: 'text-cyan-400', glow: 'shadow-cyan-500/20' },
  blue: { bg: 'from-blue-500/20 to-blue-600/10', icon: 'text-blue-400', glow: 'shadow-blue-500/20' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10', icon: 'text-purple-400', glow: 'shadow-purple-500/20' },
  green: { bg: 'from-green-500/20 to-green-600/10', icon: 'text-green-400', glow: 'shadow-green-500/20' },
  emerald: { bg: 'from-emerald-500/20 to-emerald-600/10', icon: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
};

function KPICard({ 
  icon: Icon, 
  label, 
  value, 
  change = '', 
  trend = 'up', 
  iconColor 
}: KPICardProps) {
  const colors = colorMap[iconColor];

  return (
    <div className={`bg-gradient-to-br from-[#0d1b2a] to-[#162335] rounded-xl border border-cyan-500/10 p-5 shadow-xl hover:shadow-2xl ${colors.glow} transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
          {Icon && <Icon className={`w-5 h-5 ${colors.icon}`} />}
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {change}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-slate-400 text-sm">{label}</div>
    </div>
  );
}

function ActivityItem({ activity }: ActivityItemProps) {
  const activityColorMap = {
    cyan: 'bg-cyan-500/10 text-cyan-400',
    blue: 'bg-blue-500/10 text-blue-400',
    purple: 'bg-purple-500/10 text-purple-400',
    green: 'bg-green-500/10 text-green-400',
  };

  const Icon = activity.icon;
  const colorClass = activity.color ? activityColorMap[activity.color] : 'bg-cyan-500/10 text-cyan-400';

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors border border-slate-700/30">
      <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
        {Icon && <Icon className="w-5 h-5" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{activity.title}</div>
        <div className="text-slate-400 text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {activity.time}
        </div>
      </div>
    </div>
  );
}

function AgentCard({ agent, rank }: AgentCardProps) {
  const maxConversions = 48;
  const percentage = Math.min(Math.max((agent.conversions / maxConversions) * 100, 0), 100);
  const trend = agent.trend ?? 0;
  const revenueLabel = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(agent.revenue || 0);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-all border border-slate-700/30">
      <div className="flex items-center gap-3 flex-1">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-semibold">
            {agent.avatar}
          </div>
          {rank === 1 && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Award className="w-3 h-3 text-yellow-900" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-medium">{agent.name}</span>
            <span className={`text-xs flex items-center gap-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {agent.conversions} deals
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {revenueLabel}
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConversionStep({ label, value, color }: ConversionStepProps) {
  const conversionColorMap = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    green: 'bg-green-500',
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${conversionColorMap[color]}`} />
        <span className="text-slate-300 text-sm">{label}</span>
      </div>
      <span className="text-white font-semibold">{value}</span>
    </div>
  );
}

export default Dashboard;
