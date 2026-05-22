// src/hooks/usePlanLimits.ts
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import api from '@/config/apiConfig';

export interface PlanLimits {
  canCreateAgent: boolean;
  canCreateProperty: boolean;
  canAddTeamMember: boolean;
  canSendMessage: boolean;
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
  messages: {
    used: number;
    limit: number;
    remaining: number;
  };
  isAtLimit: {
    agents: boolean;
    properties: boolean;
    teamMembers: boolean;
    messages: boolean;
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
    canSendMessage: true,
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
    messages: {
      used: 0,
      limit: Infinity,
      remaining: Infinity,
    },
    isAtLimit: {
      agents: false,
      properties: false,
      teamMembers: false,
      messages: false,
    },
    planName: 'free',
  });

  const loadBillingInfo = async (showError = false) => {
    setIsLoading(true);
    try {
      const response = await api.get('/billing/status');
      const billing = response.data;

      // Backend sends -1 to mean "unlimited" — normalize that to Infinity
      // here so all downstream comparisons (used < limit) just work.
      const norm = (v: number | undefined) => (v === -1 ? Infinity : v ?? Infinity);

      const agentsUsed = billing?.usage?.agents?.used || 0;
      const agentsLimit = norm(billing?.usage?.agents?.limit);
      const propertiesUsed = billing?.usage?.properties?.used || 0;
      const propertiesLimit = norm(billing?.usage?.properties?.limit);
      const membersUsage = billing?.usage?.members || billing?.usage?.seats || {};
      const teamUsed = membersUsage.used || 0;
      const teamLimit = norm(membersUsage.limit);
      const messagesUsage = billing?.usage?.messages || {};
      const messagesUsed = messagesUsage.used || 0;
      const messagesLimit = norm(messagesUsage.limit);

      setLimits({
        canCreateAgent: agentsUsed < agentsLimit,
        canCreateProperty: propertiesUsed < propertiesLimit,
        canAddTeamMember: teamUsed < teamLimit,
        canSendMessage: messagesUsed < messagesLimit,
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
        messages: {
          used: messagesUsed,
          limit: messagesLimit,
          remaining: Math.max(0, messagesLimit - messagesUsed),
        },
        isAtLimit: {
          agents: agentsUsed >= agentsLimit,
          properties: propertiesUsed >= propertiesLimit,
          teamMembers: teamUsed >= teamLimit,
          messages: messagesUsed >= messagesLimit,
        },
        planName: billing?.plan?.name || 'free',
      });
    } catch (error) {
      setLimits({
        canCreateAgent: true,
        canCreateProperty: true,
        canAddTeamMember: true,
        canSendMessage: true,
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
        messages: {
          used: 0,
          limit: Infinity,
          remaining: Infinity,
        },
        isAtLimit: {
          agents: false,
          properties: false,
          teamMembers: false,
          messages: false,
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
