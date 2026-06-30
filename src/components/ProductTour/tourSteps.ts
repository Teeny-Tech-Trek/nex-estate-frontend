import {
  LayoutDashboard,
  Navigation,
  BarChart3,
  TrendingUp,
  Activity,
  Users,
  Bell,
  Settings,
  Target,
} from 'lucide-react';

import { LucideIcon } from 'lucide-react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface TourStep {
  /** Unique identifier for the step */
  id: string;
  /** CSS selector of the target element to highlight */
  target: string;
  /** Step title displayed in the tooltip */
  title: string;
  /** Step description displayed in the tooltip */
  description: string;
  /** Preferred placement of the tooltip relative to the target */
  placement: 'top' | 'right' | 'bottom' | 'left' | 'auto';
  /** Optional Lucide icon component */
  icon?: LucideIcon;
  /** Callback fired before this step is shown */
  onBeforeStep?: () => void | Promise<void>;
  /** Callback fired after this step is completed (user clicks Next) */
  onAfterStep?: () => void | Promise<void>;
  /** If provided, step is only shown when this returns true */
  condition?: () => boolean;
  /** Extra padding around the spotlight cutout (default: 8) */
  spotlightPadding?: number;
  /** Custom button text overrides */
  customButtonText?: { next?: string; prev?: string };
}

export interface TourConfig {
  /** Unique tour identifier (for localStorage keying) */
  tourId: string;
  /** Array of steps */
  steps: TourStep[];
  /** Delay in ms before auto-starting (default: 1500) */
  autoStartDelay?: number;
}

// ─────────────────────────────────────────────
// Dashboard Tour Steps
// ─────────────────────────────────────────────

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome-header',
    target: '#tour-welcome-header',
    title: 'Your Command Center',
    description:
      'Welcome to your dashboard! This is your central hub where you can monitor all your real estate operations at a glance.',
    placement: 'bottom',
    icon: LayoutDashboard,
    spotlightPadding: 12,
    customButtonText: { next: "Let's go! →" },
  },
  {
    id: 'navigation',
    target: '#tour-navbar',
    title: 'Quick Navigation',
    description:
      'Use the navigation bar to quickly switch between Avatars, Properties, Visits, Leads, and Settings — everything is just one click away.',
    placement: 'bottom',
    icon: Navigation,
    spotlightPadding: 4,
  },
  {
    id: 'kpi-metrics',
    target: '#tour-kpi-metrics',
    title: 'Key Performance Indicators',
    description:
      'Track your most important metrics here — total leads, active properties, conversion rates, revenue, and more. All updated in real-time.',
    placement: 'bottom',
    icon: BarChart3,
    spotlightPadding: 10,
  },
  {
    id: 'leads-chart',
    target: '#tour-leads-chart',
    title: 'Leads Trend Analysis',
    description:
      'Visualize your leads pipeline over the last 30 days. Compare new leads vs closed deals to understand your growth trajectory.',
    placement: 'right',
    icon: TrendingUp,
    spotlightPadding: 8,
  },
  {
    id: 'conversion',
    target: '#tour-conversion',
    title: 'Visit-to-Conversion Rate',
    description:
      'See how effectively your visits convert into closed deals. This donut chart breaks down your total visits, qualified leads, and successful conversions.',
    placement: 'left',
    icon: Target,
    spotlightPadding: 8,
  },
  {
    id: 'activity',
    target: '#tour-activity',
    title: 'Recent Activity Feed',
    description:
      'Stay updated with the latest actions — new leads captured, visits scheduled, chat conversations, and more. Never miss a beat.',
    placement: 'top',
    icon: Activity,
    spotlightPadding: 8,
  },
  {
    id: 'top-agents',
    target: '#tour-top-agents',
    title: 'Top Performing Agents',
    description:
      'See which AI agents are driving the most conversions and revenue. Use these insights to optimize your avatar strategies.',
    placement: 'top',
    icon: Users,
    spotlightPadding: 8,
  },
  {
    id: 'notifications',
    target: '#tour-notifications',
    title: 'Notifications Center',
    description:
      'Important updates and alerts appear here. Click the bell icon to view new leads, visit confirmations, and system notifications.',
    placement: 'bottom',
    icon: Bell,
    spotlightPadding: 12,
  },
  {
    id: 'settings',
    target: '#tour-nav-settings',
    title: 'Customize Your Experience',
    description:
      'Head to Settings to manage your profile, team, billing, integrations, and security preferences. You can also restart this tour anytime from there!',
    placement: 'bottom',
    icon: Settings,
    spotlightPadding: 10,
    customButtonText: { next: 'Finish 🎉' },
  },
];

export const DASHBOARD_TOUR_CONFIG: TourConfig = {
  tourId: 'nex_dashboard_tour_v1',
  steps: DASHBOARD_TOUR_STEPS,
  autoStartDelay: 1500,
};
