// src/logics/useAgentsLogic.ts
import { useState, useCallback } from 'react';
import { Agent, CreateAgentPayload } from '@/types/agent';
import agentService from '@/services/agent.service';
import { getFriendlyErrorMessage } from '@/lib/errorMapper';

interface UseAgentsLogicReturn {
  // State
  agents: Agent[];
  loading: boolean;
  error: string | null;
  selectedAgent: Agent | null;
  qrCodeDataUrl: string | null;

  // Agent CRUD
  fetchAgents: () => Promise<void>;
  createAgent: (payload: CreateAgentPayload) => Promise<void>;
  updateAgent: (agentId: string, payload: Partial<Agent>) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
  toggleAgentStatus: (agentId: string) => Promise<void>;

  // QR
  fetchAgentQrCode: (agentId: string) => Promise<void>;

  // Selection
  selectAgent: (agent: Agent | null) => void;
}

const useAgentsLogic = (): UseAgentsLogicReturn => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  // ─── Fetch All Agents ──────────────────────────────────────────────────────
  const fetchAgents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, 'Failed to fetch agents');
      setError(msg);
      console.error('fetchAgents error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ─── Create Agent ──────────────────────────────────────────────────────────
  const createAgent = useCallback(async (payload: CreateAgentPayload): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newAgent = await agentService.createAgent(payload);
      // Optimistic: prepend so it appears immediately at top
      setAgents((prev) => [newAgent, ...prev]);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, 'Failed to create agent');
      setError(msg);
      console.error('createAgent error:', err);
      throw err; // Re-throw so the UI modal can catch and show feedback
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAgent = useCallback(async (agentId: string, payload: Partial<Agent>): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const updated = await agentService.updateAgent(agentId, payload);
      setAgents((prev) => prev.map((agent) => (agent._id === agentId ? { ...agent, ...updated } : agent)));
      if (selectedAgent?._id === agentId) {
        setSelectedAgent((prev) => (prev ? { ...prev, ...updated } : prev));
      }
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, 'Failed to update agent');
      setError(msg);
      console.error('updateAgent error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedAgent?._id]);

  // ─── Delete Agent ──────────────────────────────────────────────────────────
  const deleteAgent = useCallback(async (agentId: string): Promise<void> => {
    setError(null);
    // Optimistic removal
    setAgents((prev) => prev.filter((a) => a._id !== agentId));
    try {
      await agentService.deleteAgent(agentId);
    } catch (err: any) {
      // Rollback is complex without snapshot; just refetch
      const msg = getFriendlyErrorMessage(err, 'Failed to delete agent');
      setError(msg);
      console.error('deleteAgent error:', err);
      fetchAgents(); // Sync back to server state
      throw err;
    }
  }, [fetchAgents]);

  // ─── Toggle Agent Status ───────────────────────────────────────────────────
  const toggleAgentStatus = useCallback(async (agentId: string): Promise<void> => {
    setError(null);

    // Optimistic toggle: active ↔ paused (draft → active for first toggle)
    setAgents((prev) =>
      prev.map((a) => {
        if (a._id !== agentId) return a;
        const next = a.status === 'active' ? 'paused' : 'active';
        return { ...a, status: next };
      })
    );

    try {
      const updated = await agentService.toggleAgentStatus(agentId);
      // Sync exact server response
      setAgents((prev) =>
        prev.map((a) => (a._id === agentId ? { ...a, ...updated } : a))
      );
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, 'Failed to toggle agent status');
      setError(msg);
      console.error('toggleAgentStatus error:', err);
      fetchAgents(); // Rollback via refetch
      throw err;
    }
  }, [fetchAgents]);

  // ─── Fetch QR Code ─────────────────────────────────────────────────────────
  const fetchAgentQrCode = useCallback(async (agentId: string): Promise<void> => {
    setQrCodeDataUrl(null); // Reset while loading
    try {
      const dataUrl = await agentService.getAgentQrCode(agentId);
      setQrCodeDataUrl(dataUrl);
    } catch (err: any) {
      const msg = getFriendlyErrorMessage(err, 'Failed to fetch QR code');
      setError(msg);
      console.error('fetchAgentQrCode error:', err);
    }
  }, []);

  // ─── Select Agent ──────────────────────────────────────────────────────────
  const selectAgent = useCallback((agent: Agent | null) => {
    setSelectedAgent(agent);
    if (!agent) setQrCodeDataUrl(null); // Clear QR when deselecting
  }, []);

  return {
    agents,
    loading,
    error,
    selectedAgent,
    qrCodeDataUrl,
    fetchAgents,
    createAgent,
    updateAgent,
    deleteAgent,
    toggleAgentStatus,
    fetchAgentQrCode,
    selectAgent,
  };
};

export default useAgentsLogic;
