import {
  LayoutDashboard,
  Users,
  Building,
  CalendarCheck2,
  MessageSquare,
  BarChart3,
  TrendingUp,
  Target,
  Activity,
  Bell,
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
  /** Spotlight padding override in pixels */
  spotlightPadding?: number;
  /** Condition to determine if the step should be shown */
  condition?: () => boolean;
  /** Custom button text overrides */
  customButtonText?: {
    next?: string;
    prev?: string;
  };
}

export interface TourConfig {
  /** Unique tour identifier for storage */
  tourId: string;
  /** List of steps in the tour */
  steps: TourStep[];
  /** Auto start delay in milliseconds */
  autoStartDelay?: number;
}

// ─────────────────────────────────────────────
// Dashboard Tour Steps
// ─────────────────────────────────────────────

export const DASHBOARD_TOUR_STEPS: TourStep[] = [
  {
    id: 'nav-dashboard',
    target: '#tour-nav-dashboard',
    title: 'Your Command Center',
    description:
      'This is your control center. Here, you get a bird\'s-eye view of your business, live stats, trends, and recent user activity.',
    placement: 'bottom',
    icon: LayoutDashboard,
    spotlightPadding: 6,
    customButtonText: { next: "Let's go! →" },
  },
  {
    id: 'nav-avatars',
    target: '#tour-nav-avatars',
    title: 'AI Agent Avatars',
    description:
      'Create, configure, and train your specialized AI avatars. These avatars handle customer queries, schedule visits, and nurture your leads 24/7.',
    placement: 'bottom',
    icon: Users,
    spotlightPadding: 6,
  },
  {
    id: 'nav-properties',
    target: '#tour-nav-properties',
    title: 'Manage Properties',
    description:
      'Upload and organize your real estate listings. Input key parameters, media, and features for your AI agents to showcase to potential clients.',
    placement: 'bottom',
    icon: Building,
    spotlightPadding: 6,
  },
  {
    id: 'nav-visits',
    target: '#tour-nav-visits',
    title: 'Scheduled Visits',
    description:
      'Track in-person, video, and virtual tours scheduled by your AI avatars. View upcoming showings, status, and client details.',
    placement: 'bottom',
    icon: CalendarCheck2,
    spotlightPadding: 6,
  },
  {
    id: 'nav-leads',
    target: '#tour-nav-leads',
    title: 'Leads Pipeline',
    description:
      'View and manage all incoming leads captured by your avatars. Check client profiles, conversation history, interest levels, and deal status.',
    placement: 'bottom',
    icon: MessageSquare,
    spotlightPadding: 6,
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
    customButtonText: { next: 'Finish 🎉' },
  },
];

export const DASHBOARD_TOUR_CONFIG: TourConfig = {
  tourId: 'nex_dashboard_tour_v1',
  steps: DASHBOARD_TOUR_STEPS,
  autoStartDelay: 1500,
};
