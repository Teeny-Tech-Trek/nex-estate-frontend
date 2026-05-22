// src/components/PlanLimitGuard.tsx
import { ReactNode } from 'react';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { PlanLimitAlert } from './PlanLimitAlert';
import { Loader2 } from 'lucide-react';

interface PlanLimitGuardProps {
  type: 'agent' | 'property' | 'team' | 'message';
  children: ReactNode;
  fallback?: ReactNode;
}

export const PlanLimitGuard: React.FC<PlanLimitGuardProps> = ({
  type,
  children,
  fallback
}) => {
  const limits = usePlanLimits();
  const limitKey =
    type === 'team' ? 'teamMembers'
    : type === 'agent' ? 'agents'
    : type === 'message' ? 'messages'
    : 'properties';

  if (limits.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  const isAtLimit = limits.isAtLimit[limitKey];

  if (isAtLimit) {
    if (fallback) {
      return <>{fallback}</>;
    }

    const current = limits[limitKey].used;
    const limit = limits[limitKey].limit;

    return (
      <PlanLimitAlert
        type={type}
        current={current}
        limit={limit}
        planName={limits.planName}
      />
    );
  }

  return <>{children}</>;
};
