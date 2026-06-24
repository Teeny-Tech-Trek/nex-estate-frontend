/**
 * Dashboard Logic Hook
 * 
 * Fetches real dashboard data from the backend using the dashboard service.
 * Implements performance optimization with Promise.all and useCallback.
 * Handles loading and error states.
 * 
 * Architecture: Services → Logics → UI Components
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { dashboardService } from '@/services/dashboard.service';
import type {
  KPIMetric,
  LeadTrendDataPoint,
  ConversionStats,
  RecentActivity,
  Agent,
} from '@/services/dashboard.service';
import { calculateTimeAgo, getActivityIcon, getActivityColor, formatNumber } from '../lib/dashboardUtils';
import { getFriendlyErrorMessage } from '@/lib/errorMapper';

interface DashboardHeaderInfo {
  userName: string;
  greeting: string;
  currentDate: string;
  updatedStatus: string;
}

interface UseDashboardLogicReturn {
  headerInfo: DashboardHeaderInfo;
  kpiMetrics: KPIMetric[];
  leadsData: LeadTrendDataPoint[];
  conversionData: ConversionStats;
  recentActivities: RecentActivity[];
  topAgents: Agent[];
  loading: boolean;
  error: string | null;
  refreshDashboard: () => Promise<void>;
}

/**
 * ============================================================================
 * MAIN HOOK
 * ============================================================================
 */

export const useDashboardLogic = (): UseDashboardLogicReturn => {
  // State management
  const [headerInfo, setHeaderInfo] = useState<DashboardHeaderInfo>({
    userName: 'User',
    greeting: "Here's your real estate performance overview",
    currentDate: new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }),
    updatedStatus: 'Updating...',
  });

  const [kpiMetrics, setKpiMetrics] = useState<KPIMetric[]>([]);
  const [leadsData, setLeadsData] = useState<LeadTrendDataPoint[]>([]);
  const [conversionData, setConversionData] = useState<ConversionStats>({
    totalVisits: 0,
    qualifiedLeads: 0,
    closedDeals: 0,
    conversionRate: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topAgents, setTopAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Format KPI metrics from dashboard data
   */
  const formatKPIMetrics = useCallback((summary: Record<string, any> | undefined): KPIMetric[] => {
    if (!summary) return [];

    const metrics: KPIMetric[] = [
      {
        label: 'Total Leads',
        value: formatNumber(summary.totalLeads || 0),
        iconColor: 'cyan',
      },
      {
        label: 'Properties Listed',
        value: formatNumber(summary.totalProperties || 0),
        iconColor: 'blue',
      },
      {
        label: 'Scheduled Visits',
        value: formatNumber(summary.totalVisits || 0),
        iconColor: 'purple',
      },
      {
        label: 'Conversations',
        value: formatNumber(summary.totalChats || 0),
        iconColor: 'green',
      },
      {
        label: 'Conversion Rate',
        value: `${Number(summary.conversionRate || 0).toFixed(1)}%`,
        iconColor: 'emerald',
      },
    ];

    return metrics;
  }, []);

  /**
   * Fetch all dashboard data efficiently.
   * Uses a single call for the main dashboard data and parallel calls for ancillary data.
   */
  const fetchDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Use allSettled so one failing endpoint does not blank the whole dashboard.
      const [dashboardResult, leadsResult, agentsResult] = await Promise.allSettled([
        dashboardService.getDashboardData(),
        dashboardService.getLeadsTrend(30),
        dashboardService.getTopAgents(5),
      ]);

      const dashboardData =
        dashboardResult.status === 'fulfilled' ? dashboardResult.value : null;
      const leads =
        leadsResult.status === 'fulfilled' ? leadsResult.value : [];
      const agents =
        agentsResult.status === 'fulfilled' ? agentsResult.value : [];

      // Update state with fetched data from the main dashboard call.
      if (dashboardData) {
        // Set Header Info
        if (dashboardData.userInfo) {
            const firstName = dashboardData.userInfo.name?.split(' ')[0] || 'User';
            setHeaderInfo({
              userName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
              greeting: "Here's your real estate performance overview",
              currentDate: new Date().toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              }),
              updatedStatus: 'Updated just now',
            });
        }

        // Format and set KPI metrics
        if (dashboardData.summary) {
            const formattedMetrics = formatKPIMetrics(dashboardData.summary);
            setKpiMetrics(formattedMetrics);
        } else {
            setKpiMetrics([]);
        }
        
        // Set conversion data from summary
        const summary = dashboardData.summary;
        if (summary) {
            setConversionData({
                totalVisits: summary.totalVisits || 0,
                qualifiedLeads: summary.totalLeads || 0,
                closedDeals: summary.closedLeads || 0,
                conversionRate: Number(summary.conversionRate || 0),
            });
        } else {
            setConversionData({
              totalVisits: 0,
              qualifiedLeads: 0,
              closedDeals: 0,
              conversionRate: 0,
            });
        }

        // Set recent activities, applying the transformation logic that was previously in the service
        if (Array.isArray(dashboardData.recentActivities)) {
            setRecentActivities(dashboardData.recentActivities.map((activity: RecentActivity) => ({
              ...activity,
              time: calculateTimeAgo(activity.createdAt || new Date().toISOString()),
              icon: getActivityIcon(activity.type),
              color: getActivityColor(activity.type),
            })));
        } else {
            setRecentActivities([]);
        }
      } else {
        setKpiMetrics([]);
        setLeadsData([]);
        setTopAgents([]);
        setRecentActivities([]);
      }

      // Set leads data from its specific call
      if (Array.isArray(leads)) {
        setLeadsData(leads);
      } else {
        setLeadsData([]);
      }

      // Set top agents from its specific call
      if (Array.isArray(agents) && agents.length > 0) {
        setTopAgents(agents);
      } else if (Array.isArray(dashboardData?.myAgents)) {
        setTopAgents(dashboardData.myAgents);
      } else {
        setTopAgents([]);
      }

      if (
        dashboardResult.status === 'rejected' &&
        leadsResult.status === 'rejected' &&
        agentsResult.status === 'rejected'
      ) {
        throw new Error('All dashboard data requests failed');
      }

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(getFriendlyErrorMessage(err, 'Failed to fetch dashboard data'));
      setLoading(false);
    }
  }, [formatKPIMetrics]);



  /**
   * Fetch dashboard data on mount
   */
  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  /**
   * Memoize return object to prevent unnecessary re-renders
   */
  return useMemo(
    () => ({
      headerInfo,
      kpiMetrics,
      leadsData,
      conversionData,
      recentActivities,
      topAgents,
      loading,
      error,
      refreshDashboard: fetchDashboard,
    }),
    [headerInfo, kpiMetrics, leadsData, conversionData, recentActivities, topAgents, loading, error, fetchDashboard]
  );
};


