// tech_trekkers_real_estate/src/pages/Avatars.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  RefreshCw,
  MoreVertical,
  QrCode,
  Play,
  Pause,
  Edit,
  Trash2,
  X,
  Download,
  Sparkles,
  Bot,
  Search,
  ArrowUpRight,
  Zap,
  Eye,
  Copy,
  Share2,
  Settings,
  Users,
} from 'lucide-react';
import useAgentsLogic from '../Logics/useAgentsLogic';
import { Agent } from '@/types/agent';
import api from '@/config/apiConfig';
import { useAuth } from '@/contexts/AuthContext';

export default function Avatars() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    agents,
    loading,
    error,
    fetchAgents,
    createAgent,
    updateAgent,
    selectedAgent,
    selectAgent,
    qrCodeDataUrl,
    fetchAgentQrCode,
    deleteAgent,
    toggleAgentStatus,
  } = useAgentsLogic();

  // Local UI state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'draft'>('all');
  const [formError, setFormError] = useState<string | null>(null);
  const [agentActionError, setAgentActionError] = useState<string | null>(null);
  const [actionAgent, setActionAgent] = useState<Agent | null>(null);
  const fallbackMaxAgents = user?.accountType === 'organization' ? 2 : 1;
  const [maxAgents, setMaxAgents] = useState(fallbackMaxAgents);
  const [formData, setFormData] = useState({
    name: '',
    personality: '',
    voice: '',
    tone: 'professional' as 'professional' | 'friendly' | 'consultative' | 'energetic' | 'luxury',
    avatar: '',
    description: '',
    avatarFile: null as File | null,
  });
  const [editFormData, setEditFormData] = useState({
    name: '',
    personality: '',
    voice: '',
    tone: 'professional' as 'professional' | 'friendly' | 'consultative' | 'energetic' | 'luxury',
    avatar: '',
    description: '',
  });

  // Fetch on mount
  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  useEffect(() => {
    setMaxAgents(fallbackMaxAgents);
  }, [fallbackMaxAgents]);

  useEffect(() => {
    let isMounted = true;

    const fetchAgentLimit = async () => {
      try {
        const response = await api.get<{ plan?: { agentsLimit?: number } }>('/billing/status');
        const planLimit = response.data?.plan?.agentsLimit;

        if (isMounted && typeof planLimit === 'number' && planLimit > 0) {
          setMaxAgents(planLimit);
        }
      } catch {
        if (isMounted) {
          setMaxAgents(fallbackMaxAgents);
        }
      }
    };

    fetchAgentLimit();

    return () => {
      isMounted = false;
    };
  }, [fallbackMaxAgents]);

  // ─── Derived stats ────────────────────────────────────────────────────────
  const totalAgents = agents.length;
  const activeAgents = agents.filter((a) => a.status === 'active').length;
  const totalConversations = agents.reduce((sum, a) => sum + a.conversations, 0);
  const totalConversions = agents.reduce((sum, a) => sum + a.conversions, 0);
  const avgConversionRate =
    totalConversations > 0
      ? Math.round((totalConversions / totalConversations) * 100)
      : 0;
  const activeRate = totalAgents > 0 ? Math.round((activeAgents / totalAgents) * 100) : 0;
  const avgConversationsPerAgent = totalAgents > 0 ? Math.round(totalConversations / totalAgents) : 0;

  // ─── Filtered agents ──────────────────────────────────────────────────────
  const filteredAgents = agents.filter((agent) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      agent.name.toLowerCase().includes(q) ||
      agent.personality.toLowerCase().includes(q) ||
      agent.description.toLowerCase().includes(q);
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreateAgent = async () => {
    if (!formData.name || !formData.personality || !formData.description) {
      setFormError('Please fill in all required fields (Name, Personality, Description).');
      return;
    }
    setFormError(null);
    try {
      await createAgent({
        name: formData.name,
        personality: formData.personality,
        voice: formData.voice,
        tone: formData.tone,
        avatar: formData.avatar,
        description: formData.description,
        avatarFile: formData.avatarFile ?? undefined,
      });
      setShowCreateModal(false);
      setFormData({ name: '', personality: '', voice: '', tone: 'professional', avatar: '', description: '', avatarFile: null });
      setFormError(null);
    } catch {
      // Error is already stored in the hook's `error` state
    }
  };

  const handleShowQR = (agent: Agent) => {
    selectAgent(agent);
    fetchAgentQrCode(agent._id);
    setShowQRModal(true);
  };

  const handleCloseQR = () => {
    setShowQRModal(false);
    selectAgent(null);
  };

  const openAgentLeads = (agentId: string) => {
    const agent = agents.find((item) => item._id === agentId);
    const agentName = agent?.name || 'Agent';
    navigate(`/leads?agentId=${encodeURIComponent(agentId)}&agentName=${encodeURIComponent(agentName)}`);
  };

  const openAgentVisits = (agentId: string) => {
    const agent = agents.find((item) => item._id === agentId);
    const agentName = agent?.name || 'Agent';
    navigate(`/visits?agentId=${encodeURIComponent(agentId)}&agentName=${encodeURIComponent(agentName)}`);
  };

  const openViewAgent = (agent: Agent) => {
    setAgentActionError(null);
    setActionAgent(agent);
    setShowViewModal(true);
  };

  const openEditAgent = (agent: Agent) => {
    setAgentActionError(null);
    setActionAgent(agent);
    setEditFormData({
      name: agent.name || '',
      personality: agent.personality || '',
      voice: agent.voice || '',
      tone: agent.tone || 'professional',
      avatar: agent.avatar || '',
      description: agent.description || '',
    });
    setShowEditModal(true);
  };

  const openAgentSettings = (agent: Agent) => {
    setAgentActionError(null);
    setActionAgent(agent);
    setEditFormData({
      name: agent.name || '',
      personality: agent.personality || '',
      voice: agent.voice || '',
      tone: agent.tone || 'professional',
      avatar: agent.avatar || '',
      description: agent.description || '',
    });
    setShowSettingsModal(true);
  };

  const handleSaveEditedAgent = async () => {
    if (!actionAgent) return;
    if (!editFormData.name || !editFormData.personality || !editFormData.description) {
      setAgentActionError('Name, personality and description are required.');
      return;
    }
    setAgentActionError(null);
    try {
      await updateAgent(actionAgent._id, {
        name: editFormData.name,
        personality: editFormData.personality,
        voice: editFormData.voice,
        tone: editFormData.tone,
        avatar: editFormData.avatar,
        description: editFormData.description,
      });
      setShowEditModal(false);
      setActionAgent(null);
    } catch (err) {
      setAgentActionError(err instanceof Error ? err.message : 'Failed to update agent');
    }
  };

  const handleSaveAgentSettings = async () => {
    if (!actionAgent) return;
    setAgentActionError(null);
    try {
      await updateAgent(actionAgent._id, {
        voice: editFormData.voice,
        tone: editFormData.tone,
        status: actionAgent.status,
      });
      setShowSettingsModal(false);
      setActionAgent(null);
    } catch (err) {
      setAgentActionError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  // ─── Download QR ──────────────────────────────────────────────────────────
  const handleDownloadQR = () => {
    if (!qrCodeDataUrl || !selectedAgent) return;
    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `${selectedAgent.name.replace(/\s+/g, '_')}_qr.png`;
    link.click();
  };

  // ─── Loading / Error states ───────────────────────────────────────────────
  if (loading && agents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center">
        <p className="text-white text-lg animate-pulse">Loading agents...</p>
      </div>
    );
  }

  if (error && agents.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-400 text-lg">{error}</p>
          <button
            onClick={fetchAgents}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]" style={{ padding: "clamp(12px, 2vw, 32px)" }}>
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto" style={{ padding: "clamp(12px, 2vw, 32px) clamp(6px, 1.2vw, 20px)" }}>
        {/* ── Header ── */}
        <div className="mb-6 sm:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="space-y-2 min-w-0">
              <h1 className="font-bold font-syne-bold text-white tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3.4rem)" }}>AI Agents</h1>
              <p className="text-slate-400" style={{ fontSize: "clamp(0.85rem, 1.2vw, 1.1rem)" }}>Intelligent automation for your sales team</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Plan usage pill */}
              <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 px-4 sm:px-5 py-2.5 sm:py-3 bg-slate-900/40 border border-slate-800/50 rounded-full backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                  <div className="text-sm">
                    <span className="text-white font-bold">{totalAgents}</span>
                    <span className="text-slate-500 mx-1.5">/</span>
                    <span className="text-slate-500">{maxAgents}</span>
                  </div>
                </div>
                <span className="text-xs text-slate-500 font-medium">Agents Used</span>
              </div>

              <button
                onClick={fetchAgents}
                disabled={loading}
                className="p-2.5 sm:p-3 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 hover:border-slate-700/50 transition-all duration-200 backdrop-blur-sm group disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-slate-300 transition-all duration-500 ${loading ? 'animate-spin' : 'group-hover:rotate-180'}`} />
              </button>

              <button
                onClick={() => setShowCreateModal(true)}
                disabled={totalAgents >= maxAgents}
                className="w-full sm:w-auto group flex items-center justify-center gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-white hover:bg-slate-100 disabled:bg-slate-800 disabled:text-slate-500 text-slate-900 rounded-full font-semibold transition-all duration-200 hover:scale-105 disabled:hover:scale-100 disabled:border disabled:border-slate-700"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                Create Agent
              </button>
            </div>
          </div>

          {/* ── KPI Stats ───────────────────────────────────────────────── */}
          <div className="relative mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
              value={totalAgents.toLocaleString()}
              label="Total Agents"
              sub={`${Math.max(0, maxAgents - totalAgents)} slots available`}
            />
            <StatCard
              value={activeAgents.toLocaleString()}
              label="Active Now"
              sub={`${activeRate}% active rate`}
            />
            <StatCard
              value={totalConversations.toLocaleString()}
              label="Conversations"
              sub={`Avg ${avgConversationsPerAgent.toLocaleString()} per agent`}
            />
            <StatCard
              value={`${avgConversionRate}%`}
              label="Conversion Rate"
              sub={`${totalConversions.toLocaleString()} total conversions`}
            />
          </div>

          {/* ── Search + Filter ──────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search agents..."
                className="w-full pl-11 pr-4 py-3.5 bg-slate-900/30 border border-gray-400 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:bg-slate-900/50 focus:border-slate-700/50 transition-all"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'paused' | 'draft')}
              className="w-full sm:w-48 px-4 py-3.5 bg-slate-900/30 border border-slate-800/50 rounded-xl text-slate-300 text-sm hover:bg-slate-900/50 transition-all focus:outline-none appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="draft">Draft</option>
            </select>
          </div>
        </div>

        {/* ── Agents Grid ─────────────────────────────────────────────────── */}
        {filteredAgents.length === 0 ? (
          searchQuery || filterStatus !== 'all' ? (
            <NoResultsState />
          ) : (
            <EmptyState onCreateClick={() => setShowCreateModal(true)} />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
            {filteredAgents.map((agent) => (
              <EnhancedAgentCard
                key={agent._id}
                agent={agent}
                onToggleStatus={() => toggleAgentStatus(agent._id)}
                onShowQR={() => handleShowQR(agent)}
                onLeads={() => openAgentLeads(agent._id)}
                onVisits={() => openAgentVisits(agent._id)}
                onView={() => openViewAgent(agent)}
                onEdit={() => openEditAgent(agent)}
                onSettings={() => openAgentSettings(agent)}
                onDelete={() => deleteAgent(agent._id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Create Agent Modal ─────────────────────────────────────────────── */}
      {showCreateModal && (
        <Modal onClose={() => setShowCreateModal(false)}>
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 max-w-md w-full max-h-[calc(100dvh-2rem)] flex flex-col overflow-hidden shadow-2xl mx-auto">
            {/* Modal Header */}
            <div className="relative flex items-center justify-between gap-3 p-5 sm:p-8 border-b border-slate-700/50 flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-t-2xl" />
              <div className="relative min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white truncate">Create AI Agent</h2>
                </div>
                <p className="text-slate-400 text-sm">Configure your intelligent sales assistant</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="relative p-2.5 hover:bg-slate-700/50 rounded-xl transition-all duration-200 group flex-shrink-0"
              >
                <X className="w-6 h-6 text-slate-400 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden overscroll-contain min-h-0">
            {/* Plan usage info */}
            <div className="mx-5 mt-5 sm:mx-8 sm:mt-8">
              <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-5">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent" />
                <div className="relative flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-blue-100 font-semibold text-lg mb-1">
                      {Math.max(0, maxAgents - totalAgents)} Agent Slots Available
                    </h4>
                    <p className="text-blue-300/70 text-sm leading-relaxed">
                      You're currently using{' '}
                      <span className="text-blue-200 font-medium">{totalAgents} of {maxAgents}</span> AI agents.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
              <div className="p-5 sm:p-8 space-y-6 sm:space-y-8">
                {formError && (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                    {formError}
                  </div>
                )}
                <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                  <h3 className="text-lg font-bold text-white">Basic Information</h3>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Agent Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Sarah - Sales Expert"
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                      Personality <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.personality}
                      onChange={(e) => setFormData({ ...formData, personality: e.target.value })}
                      placeholder="e.g., Professional & Friendly"
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                    <p className="text-xs text-slate-500 mt-2">This defines how your agent communicates with clients</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">Voice</label>
                    <select
                      value={formData.voice}
                      onChange={(e) => setFormData({ ...formData, voice: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50 appearance-none cursor-pointer"
                    >
                      <option value="">Default (Male 1)</option>
                      <option value="male-1">Male 1</option>
                      <option value="female-1">Female 1</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">Agent Tone</label>
                    <select
                      value={formData.tone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tone: e.target.value as
                            | 'professional'
                            | 'friendly'
                            | 'consultative'
                            | 'energetic'
                            | 'luxury',
                        })
                      }
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50 appearance-none cursor-pointer"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="consultative">Consultative</option>
                      <option value="energetic">Energetic</option>
                      <option value="luxury">Luxury</option>
                    </select>
                    <p className="text-xs text-slate-500 mt-2">Future voice-agent style preset for conversation tone</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">Avatar Text (Fallback)</label>
                    <input
                      type="text"
                      value={formData.avatar}
                      onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                      placeholder="e.g., S (for Sarah)"
                      maxLength={1}
                      className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600/50"
                    />
                    <p className="text-xs text-slate-500 mt-2">Single character to display if no image is uploaded</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2.5">Avatar Image (Optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFormData({ ...formData, avatarFile: e.target.files?.[0] ?? null })}
                      className="w-full text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer transition-all duration-200"
                    />
                    {formData.avatarFile && (
                      <p className="text-xs text-slate-400 mt-2">Selected: {formData.avatarFile.name}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                  <h3 className="text-lg font-bold text-white">Role & Expertise</h3>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2.5">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the agent's expertise, communication style, and ideal use cases..."
                    rows={4}
                    className="w-full px-5 py-3.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all resize-none hover:border-slate-600/50"
                  />
                  <p className="text-xs text-slate-500 mt-2">Provide context to help the AI understand its role better</p>
                </div>
              </div>
            </div>

            </div>
            {/* Modal Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 p-5 sm:p-8 border-t border-slate-700/50 bg-slate-900/30 flex-shrink-0">
              <p className="text-sm text-slate-400 hidden sm:block">
                <span className="text-slate-300 font-medium">Tip:</span> Clear descriptions lead to better agent performance
              </p>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 sm:flex-none justify-center px-6 py-3 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-200 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateAgent}
                  disabled={!formData.name || !formData.personality || !formData.description || loading}
                  className="group flex-1 sm:flex-none px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 disabled:hover:scale-100 disabled:shadow-none flex items-center justify-center gap-2"
                >
                  {loading ? 'Creating...' : 'Create Agent'}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── QR Code Modal — CENTERED ──────────────────────────────────────── */}
      {showViewModal && actionAgent && (
        <CenteredModal onClose={() => { setShowViewModal(false); setActionAgent(null); }}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Agent Details</h3>
            <div className="space-y-2 text-sm">
              <p className="text-slate-300"><span className="text-slate-500">Name:</span> {actionAgent.name}</p>
              <p className="text-slate-300"><span className="text-slate-500">Personality:</span> {actionAgent.personality}</p>
              <p className="text-slate-300"><span className="text-slate-500">Voice:</span> {actionAgent.voice || 'Default'}</p>
              <p className="text-slate-300"><span className="text-slate-500">Tone:</span> {actionAgent.tone || 'professional'}</p>
              <p className="text-slate-300"><span className="text-slate-500">Status:</span> {actionAgent.status}</p>
              <p className="text-slate-300"><span className="text-slate-500">Description:</span> {actionAgent.description}</p>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => openAgentLeads(actionAgent._id)} className="rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-sm text-blue-200 hover:bg-blue-500/20">View Leads</button>
              <button type="button" onClick={() => openAgentVisits(actionAgent._id)} className="rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-200 hover:bg-cyan-500/20">View Visits</button>
              <button type="button" onClick={() => { setShowViewModal(false); setActionAgent(null); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Close</button>
            </div>
          </div>
        </CenteredModal>
      )}

      {showEditModal && actionAgent && (
        <CenteredModal onClose={() => { setShowEditModal(false); setActionAgent(null); }}>
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Edit Agent</h3>
            {agentActionError && <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{agentActionError}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input value={editFormData.name} onChange={(e) => setEditFormData((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100" />
              <input value={editFormData.personality} onChange={(e) => setEditFormData((prev) => ({ ...prev, personality: e.target.value }))} placeholder="Personality" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100" />
              <select value={editFormData.voice} onChange={(e) => setEditFormData((prev) => ({ ...prev, voice: e.target.value }))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100">
                <option value="">Default (Male 1)</option>
                <option value="male-1">Male 1</option>
                <option value="female-1">Female 1</option>
              </select>
              <select value={editFormData.tone} onChange={(e) => setEditFormData((prev) => ({ ...prev, tone: e.target.value as 'professional' | 'friendly' | 'consultative' | 'energetic' | 'luxury' }))} className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="consultative">Consultative</option>
                <option value="energetic">Energetic</option>
                <option value="luxury">Luxury</option>
              </select>
              <input value={editFormData.avatar} onChange={(e) => setEditFormData((prev) => ({ ...prev, avatar: e.target.value }))} maxLength={1} placeholder="Avatar fallback letter" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 md:col-span-2" />
              <textarea value={editFormData.description} onChange={(e) => setEditFormData((prev) => ({ ...prev, description: e.target.value }))} rows={4} placeholder="Description" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 md:col-span-2 resize-none" />
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => { setShowEditModal(false); setActionAgent(null); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
              <button type="button" onClick={handleSaveEditedAgent} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Changes</button>
            </div>
          </div>
        </CenteredModal>
      )}

      {showSettingsModal && actionAgent && (
        <CenteredModal onClose={() => { setShowSettingsModal(false); setActionAgent(null); }}>
          <div className="w-full max-w-lg rounded-2xl border border-slate-700/70 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold text-white mb-4">Agent Settings</h3>
            {agentActionError && <div className="mb-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{agentActionError}</div>}
            <div className="space-y-3">
              <label className="block text-xs text-slate-400">Status</label>
              <button type="button" onClick={() => toggleAgentStatus(actionAgent._id)} className="w-full rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-left text-sm text-slate-100 hover:bg-slate-800">
                {actionAgent.status === 'active' ? 'Set to Paused' : 'Set to Active'}
              </button>
              <label className="block text-xs text-slate-400">Voice</label>
              <select value={editFormData.voice} onChange={(e) => setEditFormData((prev) => ({ ...prev, voice: e.target.value }))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100">
                <option value="">Default (Male 1)</option>
                <option value="male-1">Male 1</option>
                <option value="female-1">Female 1</option>
              </select>
              <label className="block text-xs text-slate-400">Tone</label>
              <select value={editFormData.tone} onChange={(e) => setEditFormData((prev) => ({ ...prev, tone: e.target.value as 'professional' | 'friendly' | 'consultative' | 'energetic' | 'luxury' }))} className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100">
                <option value="professional">Professional</option>
                <option value="friendly">Friendly</option>
                <option value="consultative">Consultative</option>
                <option value="energetic">Energetic</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => { setShowSettingsModal(false); setActionAgent(null); }} className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">Cancel</button>
              <button type="button" onClick={handleSaveAgentSettings} className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500">Save Settings</button>
            </div>
          </div>
        </CenteredModal>
      )}

      {showQRModal && selectedAgent && (
        <CenteredModal onClose={handleCloseQR}>
          <div className="bg-slate-900 rounded-2xl border border-slate-800/50 w-full max-w-sm shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-800/50">
              <div>
                <h2 className="text-xl font-bold text-white">Share Agent</h2>
                <p className="text-slate-500 text-sm mt-0.5">{selectedAgent.name}</p>
              </div>
              <button
                onClick={handleCloseQR}
                className="p-2 hover:bg-slate-800/50 rounded-lg transition-all duration-200 group"
              >
                <X className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* QR Code */}
            <div className="p-6">
              <div className="bg-white rounded-xl p-5 mb-5">
                <div className="w-full aspect-square flex items-center justify-center overflow-hidden">
                  {qrCodeDataUrl ? (
                    <img
                      src={qrCodeDataUrl}
                      alt={`QR Code for ${selectedAgent.name}`}
                      loading="eager"
                      decoding="sync"
                      fetchPriority="high"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <QrCode className="w-20 h-20 text-slate-300 animate-pulse" />
                      <p className="text-slate-400 text-xs">Generating QR code…</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mb-5">
                <p className="text-slate-300 font-medium text-sm mb-1">Scan to start conversation</p>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Share this QR code with clients to instantly connect
                </p>
              </div>

              {/* Share options */}
              <div className="grid grid-cols-2 gap-2.5 mb-4">
                <button
                  onClick={() => {
                    const url = `${window.location.origin}/agent/${selectedAgent._id}`;
                    navigator.clipboard.writeText(url);
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600/50 transition-all text-sm font-medium"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Copy Link
                </button>
                <button
                  onClick={async () => {
                    const url = `${window.location.origin}/agent/${selectedAgent._id}`;
                    if (navigator.share) {
                      await navigator.share({ title: selectedAgent.name, url });
                    } else {
                      navigator.clipboard.writeText(url);
                    }
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 hover:border-slate-600/50 transition-all text-sm font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
              </div>

              {/* Download */}
              <button
                onClick={() => openAgentLeads(selectedAgent._id)}
                className="w-full mb-2.5 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-200 rounded-lg font-semibold transition-all duration-200 text-sm"
              >
                <Users className="w-4 h-4" />
                View Agent Leads
              </button>
              <button
                onClick={handleDownloadQR}
                disabled={!qrCodeDataUrl}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 disabled:bg-slate-200 disabled:text-slate-400 text-slate-900 rounded-lg font-semibold transition-all duration-200 text-sm"
              >
                <Download className="w-4 h-4" />
                Download QR Code
              </button>
            </div>
          </div>
        </CenteredModal>
      )}
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────

function EnhancedAgentCard({
  agent,
  onToggleStatus,
  onShowQR,
  onLeads,
  onVisits,
  onView,
  onEdit,
  onSettings,
  onDelete,
}: {
  agent: Agent;
  onToggleStatus: () => void;
  onShowQR: () => void;
  onLeads: () => void;
  onVisits: () => void;
  onView: () => void;
  onEdit: () => void;
  onSettings: () => void;
  onDelete: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    active: { label: 'Active', color: 'text-emerald-400', dot: 'bg-emerald-400' },
    paused: { label: 'Paused', color: 'text-amber-400', dot: 'bg-amber-400' },
    draft: { label: 'Draft', color: 'text-slate-500', dot: 'bg-slate-500' },
  };

  const status = statusConfig[agent.status] ?? statusConfig.draft;
  const conversionRate =
    agent.conversations > 0
      ? Math.round((agent.conversions / agent.conversations) * 100)
      : 0;

  return (
    <div className="group relative bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 sm:p-6 hover:bg-slate-900/50 hover:border-slate-700/50 transition-all duration-300">
      <div className="relative">
        {/* Top */}
        <div className="flex items-start justify-between mb-5 sm:mb-6">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              {agent.avatarUrl ? (
                <img
                  src={agent.avatarUrl}
                  alt={`${agent.name}'s avatar`}
                  loading="lazy"
                  decoding="async"
                  fetchPriority="low"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700/50"
                />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700/50 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {agent.avatar || agent.name.charAt(0).toUpperCase()}
                </div>
              )}
              {agent.status === 'active' && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-900 rounded-full" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm sm:text-base mb-1 truncate">{agent.name}</h3>
              <p className="text-slate-500 text-sm font-medium">{agent.personality}</p>
              <p className="text-slate-400 text-xs mt-1">Tone: {agent.tone || 'professional'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 ml-2">
            <div className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${status.color}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
              {status.label}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all duration-200"
              >
                <MoreVertical className="w-4 h-4 text-slate-500" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-20 py-1.5 overflow-hidden">
                    <button
                      onClick={() => { setShowMenu(false); onView(); }}
                      className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Details
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onEdit(); }}
                      className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Agent
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); onSettings(); }}
                      className="w-full px-3.5 py-2 text-left text-sm text-slate-300 hover:bg-slate-700/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" /> Settings
                    </button>
                    <div className="h-px bg-slate-700/50 my-1.5" />
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm(`Are you sure you want to delete agent "${agent.name}"?`)) {
                          onDelete();
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2.5 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">{agent.description}</p>

        {/* Metrics */}
        <div className="space-y-3.5 mb-5 sm:mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Conversations</span>
            <span className="text-white font-semibold">{agent.conversations.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Conversions</span>
            <div className="flex items-center gap-3">
              <span className="text-white font-semibold">{agent.conversions}</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${conversionRate}%` }}
                  />
                </div>
                <span className="text-emerald-400 text-xs font-semibold w-9 text-right">{conversionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <button
            onClick={onShowQR}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-800 hover:border-slate-600/50 hover:text-white transition-all duration-200 text-sm font-medium"
          >
            <QrCode className="w-4 h-4" /> <span className="hidden sm:inline">Share</span>
          </button>
          <button
            onClick={onLeads}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600/15 border border-blue-500/30 text-blue-200 rounded-xl hover:bg-blue-600/25 transition-all duration-200 text-sm font-medium"
          >
            <Users className="w-4 h-4" /> <span className="hidden sm:inline">Leads</span>
          </button>
          <button
            onClick={onVisits}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-cyan-600/15 border border-cyan-500/30 text-cyan-200 rounded-xl hover:bg-cyan-600/25 transition-all duration-200 text-sm font-medium"
          >
            <Users className="w-4 h-4" /> <span className="hidden sm:inline">Visits</span>
          </button>
          <button
            onClick={onToggleStatus}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
              agent.status === 'active'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
            }`}
          >
            {agent.status === 'active' ? (
              <><Pause className="w-4 h-4" /> <span className="hidden sm:inline">Pause</span></>
            ) : (
              <><Play className="w-4 h-4" /> <span className="hidden sm:inline">Activate</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-slate-800/50 bg-slate-900/25 p-4">
      <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-slate-400 font-medium text-sm mt-1">{label}</div>
      <div className="text-slate-600 text-xs sm:text-sm mt-0.5 break-words">{sub}</div>
    </div>
  );
}

function EmptyState({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 sm:py-24 px-4">
      <div className="relative mb-6 sm:mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-3xl rounded-full" />
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 rounded-3xl flex items-center justify-center shadow-2xl">
          <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-slate-400" />
        </div>
      </div>
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">No AI Agents Yet</h3>
      <p className="text-slate-400 text-center max-w-md mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
        Create your first AI agent to automate conversations, qualify leads, and boost conversions 24/7.
      </p>
      <button
        onClick={onCreateClick}
        className="w-full sm:w-auto group flex items-center justify-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl font-bold transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
      >
        <Plus className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-300" />
        Create Your First Agent
      </button>
    </div>
  );
}

function NoResultsState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-20 h-20 bg-slate-800/50 border border-slate-700/50 rounded-2xl flex items-center justify-center mb-6">
        <Search className="w-10 h-10 text-slate-500" />
      </div>
      <h3 className="text-2xl font-bold text-white mb-2">No Agents Found</h3>
      <p className="text-slate-400 text-center max-w-md">Try adjusting your search or filter criteria</p>
    </div>
  );
}

/** Generic full-screen overlay modal — children rendered via flex for natural scroll */
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}

/**
 * CenteredModal — always renders its child dead-center on screen.
 * Used for QR modal so it never appears off to the side.
 */
function CenteredModal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      {/* Content — always centred, never wider than its max-w, scrolls if tall */}
      <div className="relative z-10 w-full max-h-[calc(100dvh-2rem)] overflow-y-auto flex justify-center">{children}</div>
    </div>
  );
}
