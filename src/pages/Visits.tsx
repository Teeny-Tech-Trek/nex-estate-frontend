import React, { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarCheck2, CheckCircle2, Plus, RefreshCw, Trash2, XCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import agentService from "@/services/agent.service";
import { propertyService } from "@/services/property.service";
import visitService from "@/services/visit.service";
import type { Agent } from "@/types/agent";
import type { Property } from "@/types/property";
import type { CreateVisitPayload, UpdateVisitPayload, Visit, VisitStatus } from "@/types/visit";

const visitStatuses: VisitStatus[] = ["scheduled", "completed", "cancelled", "no_show"];

const statusClass: Record<VisitStatus, string> = {
  scheduled: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  completed: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  no_show: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

const createSessionId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `session-${Date.now()}`;

const getAgentName = (visit: Visit) =>
  typeof visit.agent === "string" ? visit.agent : visit.agent?.name || "-";

const getPropertyName = (visit: Visit) => {
  if (!visit.property) return "-";
  return typeof visit.property === "string" ? visit.property : visit.property.title || "-";
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
};

const toLocalDateTimeInput = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const toIsoDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString();
};

const getCurrentLocalDateTimeInput = () => {
  const now = new Date();
  const tzOffset = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
};

type VisitFormState = {
  agent: string;
  property: string;
  sessionId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  dateTime: string;
  notes: string;
  status: VisitStatus;
};

const createDefaultFormState = (): VisitFormState => ({
  agent: "",
  property: "",
  sessionId: createSessionId(),
  buyerName: "",
  buyerEmail: "",
  buyerPhone: "",
  dateTime: getCurrentLocalDateTimeInput(),
  notes: "",
  status: "scheduled",
});

export default function Visits() {
  const location = useLocation();
  const navigate = useNavigate();
  const scope = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      agentId: params.get("agentId") || "",
      propertyId: params.get("propertyId") || "",
      agentName: params.get("agentName") || "",
      propertyName: params.get("propertyName") || "",
    };
  }, [location.search]);

  const [visits, setVisits] = useState<Visit[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<VisitStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<Visit | null>(null);
  const [formState, setFormState] = useState<VisitFormState>(createDefaultFormState());

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [visitList, availableAgents, availableProperties] = await Promise.all([
        visitService.getVisits({ limit: 200 }),
        agentService.getAgents(),
        propertyService.getProperties(),
      ]);
      setVisits(visitList.data);
      setAgents(availableAgents);
      setProperties(availableProperties);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load visits";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const filteredVisits = useMemo(() => {
    const query = search.trim().toLowerCase();
    return visits.filter((visit) => {
      if (scope.agentId) {
        const visitAgentId = typeof visit.agent === "string" ? visit.agent : visit.agent?._id || "";
        if (visitAgentId !== scope.agentId) return false;
      }
      if (scope.propertyId) {
        const visitPropertyId = !visit.property ? "" : typeof visit.property === "string" ? visit.property : visit.property?._id || "";
        if (visitPropertyId !== scope.propertyId) return false;
      }
      if (statusFilter !== "all" && visit.status !== statusFilter) {
        return false;
      }
      if (!query) return true;
      return (
        visit.buyerName.toLowerCase().includes(query) ||
        (visit.buyerEmail || "").toLowerCase().includes(query) ||
        (visit.buyerPhone || "").toLowerCase().includes(query) ||
        getAgentName(visit).toLowerCase().includes(query) ||
        getPropertyName(visit).toLowerCase().includes(query) ||
        visit.sessionId.toLowerCase().includes(query)
      );
    });
  }, [scope.agentId, scope.propertyId, search, statusFilter, visits]);

  const displayStats = useMemo(() => {
    const total = filteredVisits.length;
    const scheduled = filteredVisits.filter((item) => item.status === "scheduled").length;
    const completed = filteredVisits.filter((item) => item.status === "completed").length;
    const cancelled = filteredVisits.filter((item) => item.status === "cancelled").length;
    const no_show = filteredVisits.filter((item) => item.status === "no_show").length;
    return { total, scheduled, completed, cancelled, no_show };
  }, [filteredVisits]);

  const scopeLabel = scope.agentId
    ? `Showing visits for avatar: ${scope.agentName || scope.agentId}`
    : scope.propertyId
    ? `Showing visits for property: ${scope.propertyName || scope.propertyId}`
    : "Showing visits for all avatars and properties";

  const openCreateModal = () => {
    setEditingVisit(null);
    const base = createDefaultFormState();
    if (scope.agentId) base.agent = scope.agentId;
    if (scope.propertyId) base.property = scope.propertyId;
    setFormState(base);
    setShowModal(true);
  };

  const openEditModal = (visit: Visit) => {
    setEditingVisit(visit);
    setFormState({
      agent: typeof visit.agent === "string" ? visit.agent : visit.agent?._id || "",
      property: typeof visit.property === "string" ? visit.property : visit.property?._id || "",
      sessionId: visit.sessionId || createSessionId(),
      buyerName: visit.buyerName || "",
      buyerEmail: visit.buyerEmail || "",
      buyerPhone: visit.buyerPhone || "",
      dateTime: toLocalDateTimeInput(visit.dateTime),
      notes: visit.notes || "",
      status: visit.status || "scheduled",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingVisit(null);
  };

  const saveVisit = async () => {
    if (!formState.agent || !formState.buyerName || !formState.dateTime) {
      setError("Agent, buyer name and date/time are required.");
      return;
    }

    const isoDateTime = toIsoDate(formState.dateTime);
    if (!isoDateTime) {
      setError("Please choose a valid date and time.");
      return;
    }

    const payloadBase: CreateVisitPayload = {
      agent: formState.agent,
      property: formState.property || undefined,
      sessionId: formState.sessionId || createSessionId(),
      buyerName: formState.buyerName.trim(),
      buyerEmail: formState.buyerEmail.trim() || undefined,
      buyerPhone: formState.buyerPhone.trim() || undefined,
      notes: formState.notes.trim() || undefined,
      dateTime: isoDateTime,
      status: formState.status,
    };

    setSaving(true);
    setError(null);
    try {
      if (editingVisit) {
        const updatePayload: UpdateVisitPayload = payloadBase;
        const updated = await visitService.updateVisit(editingVisit._id, updatePayload);
        setVisits((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
      } else {
        const created = await visitService.createVisit(payloadBase);
        setVisits((prev) => [created, ...prev]);
      }
      closeModal();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to save visit";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateVisitStatus = async (visitId: string, status: VisitStatus) => {
    try {
      const updated = await visitService.updateVisit(visitId, { status });
      setVisits((prev) => prev.map((item) => (item._id === visitId ? updated : item)));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update visit status";
      setError(msg);
    }
  };

  const removeVisit = async (visitId: string) => {
    const confirmed = window.confirm("Delete this visit?");
    if (!confirmed) return;
    try {
      await visitService.deleteVisit(visitId);
      setVisits((prev) => prev.filter((item) => item._id !== visitId));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete visit";
      setError(msg);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
      <div className="relative max-w-[1600px] mx-auto" style={{ padding: "clamp(16px, 3vw, 48px) clamp(12px, 2vw, 32px)" }}>
        <div className="mb-6 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 lg:mb-7">
            <div className="min-w-0">
              <h1 className="font-bold font-syne-bold text-white tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>Visits</h1>
              <p className="text-cyan-300 mt-1.5 font-medium" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>{scopeLabel}</p>
              <p className="text-slate-400 mt-1" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>Manage scheduled, completed, cancelled and no-show visits.</p>
            </div>
            <div className="flex items-center gap-3">
              {(scope.agentId || scope.propertyId) && (
                <button
                  onClick={() => navigate("/visits")}
                  className="px-4 py-2 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800/50 text-sm"
                >
                  Show All Visits
                </button>
              )}
              <button
                onClick={() => void loadData()}
                className="p-2.5 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 transition-all group"
                aria-label="Refresh visits"
              >
                <RefreshCw className={`w-4 h-4 text-slate-400 group-hover:text-white transition-all ${loading ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={openCreateModal}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                New Visit
              </button>
            </div>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:grid-cols-5 lg:gap-3 lg:overflow-visible">
            <StatCard icon={<CalendarCheck2 className="w-4 h-4 text-cyan-300" />} label="Total" value={displayStats.total} />
            <StatCard icon={<CalendarCheck2 className="w-4 h-4 text-blue-300" />} label="Scheduled" value={displayStats.scheduled} />
            <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />} label="Completed" value={displayStats.completed} />
            <StatCard icon={<XCircle className="w-4 h-4 text-rose-300" />} label="Cancelled" value={displayStats.cancelled} />
            <StatCard icon={<XCircle className="w-4 h-4 text-amber-300" />} label="No Show" value={displayStats.no_show} />
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 md:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search buyer, email, phone, session, agent, property"
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as VisitStatus | "all")}
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              <option value="all">All Status</option>
              {visitStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && <div className="mb-4 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>}

        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-300">Loading visits...</div>
          ) : filteredVisits.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-white font-semibold">No visits found</p>
              <p className="text-slate-400 text-sm mt-1">Create a visit or adjust search/filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/70">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Buyer</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Agent</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Property</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Date & Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Session</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVisits.map((visit) => (
                    <tr key={visit._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-semibold">{visit.buyerName}</div>
                        <div className="text-xs text-slate-400 mt-1">{visit.buyerEmail || visit.buyerPhone || "-"}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">{getAgentName(visit)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{getPropertyName(visit)}</td>
                      <td className="px-4 py-3 text-sm text-slate-300">{formatDate(visit.dateTime)}</td>
                      <td className="px-4 py-3">
                        <select
                          value={visit.status}
                          onChange={(e) => void updateVisitStatus(visit._id, e.target.value as VisitStatus)}
                          className={`text-xs border rounded-full px-2.5 py-1.5 bg-transparent ${statusClass[visit.status]}`}
                        >
                          {visitStatuses.map((status) => (
                            <option key={status} value={status} className="bg-slate-900 text-slate-100">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono">{visit.sessionId}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(visit)}
                            className="px-3 py-1.5 rounded-lg text-xs border border-slate-700 text-slate-200 hover:bg-slate-800/60"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => void removeVisit(visit._id)}
                            className="px-3 py-1.5 rounded-lg text-xs border border-rose-500/40 text-rose-300 hover:bg-rose-500/10 inline-flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl rounded-2xl border border-slate-700/70 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
              <h2 className="text-white text-lg font-semibold">{editingVisit ? "Edit Visit" : "Create Visit"}</h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="space-y-1">
                <span className="text-xs text-slate-400">Agent *</span>
                <select
                  value={formState.agent}
                  onChange={(e) => setFormState((prev) => ({ ...prev, agent: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                >
                  <option value="">Select Agent</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Property</span>
                <select
                  value={formState.property}
                  onChange={(e) => setFormState((prev) => ({ ...prev, property: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                >
                  <option value="">No Property</option>
                  {properties.map((property) => (
                    <option key={property._id} value={property._id}>
                      {property.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Buyer Name *</span>
                <input
                  value={formState.buyerName}
                  onChange={(e) => setFormState((prev) => ({ ...prev, buyerName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Buyer Email</span>
                <input
                  value={formState.buyerEmail}
                  onChange={(e) => setFormState((prev) => ({ ...prev, buyerEmail: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Buyer Phone</span>
                <input
                  value={formState.buyerPhone}
                  onChange={(e) => setFormState((prev) => ({ ...prev, buyerPhone: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Date & Time *</span>
                <input
                  type="datetime-local"
                  value={formState.dateTime}
                  onChange={(e) => setFormState((prev) => ({ ...prev, dateTime: e.target.value }))}
                  onFocus={(e) => {
                    const pickerInput = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                    pickerInput.showPicker?.();
                  }}
                  onClick={(e) => {
                    const pickerInput = e.currentTarget as HTMLInputElement & { showPicker?: () => void };
                    pickerInput.showPicker?.();
                  }}
                  step={60}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                />
              </label>

              <label className="space-y-1">
                <span className="text-xs text-slate-400">Status</span>
                <select
                  value={formState.status}
                  onChange={(e) => setFormState((prev) => ({ ...prev, status: e.target.value as VisitStatus }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                >
                  {visitStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs text-slate-400">Session ID *</span>
                <input
                  value={formState.sessionId}
                  onChange={(e) => setFormState((prev) => ({ ...prev, sessionId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
                />
              </label>

              <label className="space-y-1 md:col-span-2">
                <span className="text-xs text-slate-400">Notes</span>
                <textarea
                  value={formState.notes}
                  onChange={(e) => setFormState((prev) => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35 resize-none"
                />
              </label>
            </div>

            <div className="border-t border-slate-800 px-5 py-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void saveVisit()}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-60"
              >
                {saving ? "Saving..." : editingVisit ? "Update Visit" : "Create Visit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="shrink-0 min-w-[128px] rounded-full border border-slate-700/40 bg-slate-900/20 px-3 py-2 sm:min-w-0 sm:rounded-xl sm:border-slate-800/60 sm:bg-slate-900/35 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2 sm:justify-between">
        <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wide">{label}</span>
        <span>{icon}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">{value}</div>
    </div>
  );
}
