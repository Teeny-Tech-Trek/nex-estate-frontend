// src/hooks/usePlanLimits.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/apiConfig';

export interface PlanLimits {
  canCreateAgent: boolean;
  canCreateProperty: boolean;
  canAddTeamMember: boolean;
  agents: {
    used: number;
    limit: number;
    remaining: number;
  };
  properties: {
    used: number;
    limit: number;
    remaining: number;
  };
  teamMembers: {
    used: number;
    limit: number;
    remaining: number;
  };
  isAtLimit: {
    agents: boolean;
    properties: boolean;
    teamMembers: boolean;
  };
  planName: string;
  isLoading: boolean;
  refreshLimits: () => Promise<void>;
}

export const usePlanLimits = (): PlanLimits => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [limits, setLimits] = useState<Omit<PlanLimits, 'isLoading' | 'refreshLimits'>>({
    canCreateAgent: true,
    canCreateProperty: true,
    canAddTeamMember: true,
    agents: {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
    },
    properties: {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
    },
    teamMembers: {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
    },
    isAtLimit: {
      agents: false,
      properties: false,
      teamMembers: false,
    },
    planName: 'free',
  });

  const loadBillingInfo = async (showError = false) => {
    setIsLoading(true);
    try {
      const response = await api.get('/billing/status');
      const billing = response.data;

      const agentsUsed = billing?.usage?.agents?.used || 0;
      const agentsLimit = billing?.usage?.agents?.limit || Infinity;
      const propertiesUsed = billing?.usage?.properties?.used || 0;
      const propertiesLimit = billing?.usage?.properties?.limit || Infinity;
      const membersUsage = billing?.usage?.members || billing?.usage?.seats || {};
      const teamUsed = membersUsage.used || 0;
      const teamLimit = membersUsage.limit || Infinity;

      setLimits({
        canCreateAgent: agentsUsed < agentsLimit,
        canCreateProperty: propertiesUsed < propertiesLimit,
        canAddTeamMember: teamUsed < teamLimit,
        agents: {
          used: agentsUsed,
          limit: agentsLimit,
          remaining: Math.max(0, agentsLimit - agentsUsed),
        },
        properties: {
          used: propertiesUsed,
          limit: propertiesLimit,
          remaining: Math.max(0, propertiesLimit - propertiesUsed),
        },
        teamMembers: {
          used: teamUsed,
          limit: teamLimit,
          remaining: Math.max(0, teamLimit - teamUsed),
        },
        isAtLimit: {
          agents: agentsUsed >= agentsLimit,
          properties: propertiesUsed >= propertiesLimit,
          teamMembers: teamUsed >= teamLimit,
        },
        planName: billing?.plan?.name || 'free',
      });
    } catch (error) {
      setLimits({
        canCreateAgent: true,
        canCreateProperty: true,
        canAddTeamMember: true,
        agents: {
          used: 0,
          limit: Infinity,
          remaining: Infinity,
        },
        properties: {
          used: 0,
          limit: Infinity,
          remaining: Infinity,
        },
        teamMembers: {
          used: 0,
          limit: Infinity,
          remaining: Infinity,
        },
        isAtLimit: {
          agents: false,
          properties: false,
          teamMembers: false,
        },
        planName: 'free',
      });

      if (showError) {
        toast({
          title: 'Billing Sync Error',
          description: 'Could not refresh plan limits right now.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBillingInfo(false);
  }, []);

  return {
    ...limits,
    isLoading,
    refreshLimits: async () => loadBillingInfo(true),
  };
};
