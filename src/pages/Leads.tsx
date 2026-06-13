import React from "react";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  RefreshCw,
  Users,
  Flame,
  CircleDot,
  CheckCircle2,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ArrowUpRight,
  MessageSquare,
} from "lucide-react";
import { useLeadsLogic } from "@/Logics/useLeadsLogic";
import { LeadQuality, LeadStatus, LeadWithOwner } from "@/types/lead";
import { AgentLite, PropertyLite } from "@/services/leads.api";

const statusOptions: Array<{ value: LeadStatus | "all"; label: string }> = [
  { value: "all", label: "All Status" },
  { value: "new", label: "New" },
  { value: "qualifying", label: "Qualifying" },
  { value: "interested", label: "Interested" },
  { value: "viewing_scheduled", label: "Viewing Scheduled" },
  { value: "negotiating", label: "Negotiating" },
  { value: "booked", label: "Booked" },
  { value: "closed", label: "Closed" },
  { value: "nurture", label: "Nurture" },
  { value: "lost", label: "Lost" },
];

const qualityOptions: Array<{ value: "all" | "cold" | "warm" | "hot" | "very_hot"; label: string }> = [
  { value: "all", label: "All Quality" },
  { value: "cold", label: "Cold" },
  { value: "warm", label: "Warm" },
  { value: "hot", label: "Hot" },
  { value: "very_hot", label: "Very Hot" },
];

const statusClass: Record<LeadStatus, string> = {
  new: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  qualifying: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
  interested: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  viewing_scheduled: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  negotiating: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  booked: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  closed: "bg-green-600/20 text-green-300 border-green-500/40",
  nurture: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  lost: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

const qualityClass: Record<string, string> = {
  cold: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  warm: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  hot: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  very_hot: "bg-red-500/15 text-red-300 border-red-500/30",
};

function formatDate(value?: string): string {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function leadDisplayName(lead: LeadWithOwner): string {
  return lead.qualification?.contactInfo?.name || "Unnamed Lead";
}

function leadDisplayEmail(lead: LeadWithOwner): string {
  return lead.qualification?.contactInfo?.email || "-";
}

function leadDisplayPhone(lead: LeadWithOwner): string {
  return lead.qualification?.contactInfo?.phone || "-";
}

export default function Leads() {
  const location = useLocation();
  const navigate = useNavigate();
  const scope = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const agentId = params.get("agentId") || "";
    const propertyId = params.get("propertyId") || "";
    const agentName = params.get("agentName") || "";
    const propertyName = params.get("propertyName") || "";
    return { agentId, propertyId, agentName, propertyName };
  }, [location.search]);

  const logic = useLeadsLogic({ agentId: scope.agentId, propertyId: scope.propertyId });
  const agentMap = useMemo(
    () => new Map(logic.availableAgents.map((agent) => [agent._id, agent.name])),
    [logic.availableAgents]
  );
  const propertyMap = useMemo(
    () => new Map(logic.availableProperties.map((property) => [property._id, property.title])),
    [logic.availableProperties]
  );

  const scopeLabel = scope.agentId
    ? `Showing leads for avatar: ${scope.agentName || scope.agentId}`
    : scope.propertyId
    ? `Showing leads for property: ${scope.propertyName || scope.propertyId}`
    : "Showing leads for all avatars and properties";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto" style={{ padding: "clamp(16px, 3vw, 48px) clamp(12px, 2vw, 32px)" }}>
        <div className="mb-6 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-5 lg:mb-7">
            <div className="min-w-0">
              <h1 className="font-bold font-syne-bold text-white tracking-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 3.2rem)" }}>Leads</h1>
              <p className="text-cyan-300 mt-1.5 font-medium" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
                {scopeLabel}
              </p>
              <p className="text-slate-400 mt-1" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
                {logic.isOwnerOrAdmin
                  ? "You can review all organization leads and member ownership."
                  : "You can review and manage your own leads."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(scope.agentId || scope.propertyId) && (
                <button
                  onClick={() => navigate("/leads")}
                  className="px-4 py-2 rounded-full border border-slate-700 text-slate-200 hover:bg-slate-800/50 text-sm"
                >
                  Show All Leads
                </button>
              )}
              <button
                onClick={logic.loadLeads}
                className="p-2.5 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 transition-all group"
                aria-label="Refresh leads"
              >
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
              </button>
              <button
                onClick={logic.openCreateModal}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                New Lead
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 lg:gap-3">
            <StatCard icon={<Users className="w-4 h-4 text-blue-300" />} label="Total" value={logic.stats.total} />
            <StatCard icon={<Flame className="w-4 h-4 text-orange-300" />} label="Hot" value={logic.stats.hot} />
            <StatCard icon={<CircleDot className="w-4 h-4 text-cyan-300" />} label="New" value={logic.stats.newLeads} />
            <StatCard icon={<CheckCircle2 className="w-4 h-4 text-emerald-300" />} label="Closed" value={logic.stats.closed} />
            <StatCard icon={<Users className="w-4 h-4 text-purple-300" />} label="My Leads" value={logic.stats.mine} />
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 md:p-5 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={logic.search}
                onChange={(e) => logic.setSearch(e.target.value)}
                placeholder="Search name, email, phone, session, owner"
                className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
              />
            </div>

            <select
              value={logic.statusFilter}
              onChange={(e) => logic.setStatusFilter(e.target.value as LeadStatus | "all")}
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              value={logic.qualityFilter}
              onChange={(e) => logic.setQualityFilter(e.target.value as "all" | "cold" | "warm" | "hot" | "very_hot")}
              className="rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              {qualityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl overflow-hidden">
          {logic.loading ? (
            <div className="p-10 text-center text-slate-300">Loading leads...</div>
          ) : logic.leads.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-white font-semibold">{logic.totalLeads === 0 ? "No leads found" : "No matching leads"}</p>
              <p className="text-slate-400 text-sm mt-1">
                {logic.totalLeads === 0
                  ? "Create your first lead to get started."
                  : "Try adjusting your search and filters."}
              </p>
            </div>
          ) : (
            <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800/70">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Lead</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Score</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Quality</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Owner</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Agent / Property</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Updated</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {logic.leads.map((lead) => (
                    <tr key={lead._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3">
                        <div className="text-sm text-white font-semibold">{leadDisplayName(lead)}</div>
                        <div className="text-xs text-slate-400 mt-1">Session: {lead.sessionId}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-200">{leadDisplayEmail(lead)}</div>
                        <div className="text-xs text-slate-400 mt-1">{leadDisplayPhone(lead)}</div>
                      </td>
                      <td className="px-4 py-3">
                        {(() => {
                          const canManage = logic.canManageLead(lead);
                          return (
                        <select
                          value={lead.status}
                          onChange={(e) => logic.updateLeadStatus(lead._id, e.target.value as LeadStatus)}
                          disabled={!canManage}
                          title={canManage ? "Update lead status" : "Only lead owner or organization admin/owner can update"}
                          className={`text-xs border rounded-full px-2.5 py-1.5 bg-transparent ${statusClass[lead.status]}`}
                        >
                          {statusOptions
                            .filter((option) => option.value !== "all")
                            .map((option) => (
                              <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                                {option.label}
                              </option>
                            ))}
                        </select>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-200">{lead.leadScore ?? 0}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs border rounded-full px-2.5 py-1.5 ${qualityClass[lead.leadQuality || "cold"]}`}
                        >
                          {(lead.leadQuality || "cold").replace("_", " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm text-slate-200">{lead.ownerName}</div>
                        {logic.isOwnerOrAdmin && <div className="text-xs text-slate-400 mt-1">{lead.ownerEmail || "-"}</div>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          <div className="text-xs text-slate-300">
                            Agent: {agentMap.get(lead.agent) || lead.agent || "-"}
                          </div>
                          <div className="text-xs text-slate-400">
                            Property: {lead.property ? propertyMap.get(lead.property) || lead.property : "-"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {lead.agent ? (
                              <button
                                onClick={() =>
                                  navigate(`/avatars?focusAgentId=${encodeURIComponent(lead.agent)}`)
                                }
                                className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                              >
                                View Agent <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ) : null}
                            {lead.property ? (
                              <button
                                onClick={() =>
                                  navigate(`/properties?focusPropertyId=${encodeURIComponent(lead.property || "")}`)
                                }
                                className="inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-blue-200"
                              >
                                View Property <ArrowUpRight className="w-3 h-3" />
                              </button>
                            ) : null}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">{formatDate(lead.updatedAt || lead.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end items-center gap-1">
                          <button
                            onClick={() => logic.setSelectedLead(lead)}
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                            aria-label="View lead details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => logic.openEditModal(lead)}
                            disabled={!logic.canManageLead(lead)}
                            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-60"
                            aria-label="Edit lead"
                            title={logic.canManageLead(lead) ? "Edit lead" : "Only lead owner or organization admin/owner can edit"}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => logic.deleteLead(lead._id)}
                            disabled={logic.deletingLeadId === lead._id || !logic.canDeleteLead(lead)}
                            className="p-2 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-colors disabled:opacity-60"
                            aria-label="Delete lead"
                            title={logic.canDeleteLead(lead) ? "Delete lead" : "Only lead owner or organization admin/owner can delete"}
                          >
                            {logic.deletingLeadId === lead._id ? (
                              <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list — stacked records (table is unusable on phones) */}
            <div className="md:hidden divide-y divide-slate-800/40">
              {logic.leads.map((lead) => {
                const canManage = logic.canManageLead(lead);
                return (
                  <div key={lead._id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm text-white font-semibold break-words">{leadDisplayName(lead)}</div>
                        <div className="text-xs text-slate-400 mt-0.5 break-all">{leadDisplayEmail(lead)}</div>
                        <div className="text-xs text-slate-400 break-all">{leadDisplayPhone(lead)}</div>
                      </div>
                      <span className={`shrink-0 text-[11px] border rounded-full px-2 py-1 ${qualityClass[lead.leadQuality || "cold"]}`}>
                        {(lead.leadQuality || "cold").replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
                      <div className="min-w-0"><span className="text-slate-500">Score:</span> <span className="text-slate-200">{lead.leadScore ?? 0}</span></div>
                      <div className="min-w-0 truncate"><span className="text-slate-500">Owner:</span> <span className="text-slate-200">{lead.ownerName}</span></div>
                      <div className="min-w-0 truncate"><span className="text-slate-500">Agent:</span> <span className="text-slate-300">{agentMap.get(lead.agent) || lead.agent || "-"}</span></div>
                      <div className="min-w-0 truncate"><span className="text-slate-500">Property:</span> <span className="text-slate-300">{lead.property ? propertyMap.get(lead.property) || lead.property : "-"}</span></div>
                      <div className="col-span-2 min-w-0 truncate"><span className="text-slate-500">Updated:</span> <span className="text-slate-300">{formatDate(lead.updatedAt || lead.createdAt)}</span></div>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <select
                        value={lead.status}
                        onChange={(e) => logic.updateLeadStatus(lead._id, e.target.value as LeadStatus)}
                        disabled={!canManage}
                        title={canManage ? "Update lead status" : "Only lead owner or organization admin/owner can update"}
                        className={`flex-1 min-w-0 text-xs border rounded-lg px-2 py-1.5 bg-transparent ${statusClass[lead.status]}`}
                      >
                        {statusOptions
                          .filter((option) => option.value !== "all")
                          .map((option) => (
                            <option key={option.value} value={option.value} className="bg-slate-900 text-slate-100">
                              {option.label}
                            </option>
                          ))}
                      </select>
                      <button
                        onClick={() => logic.setSelectedLead(lead)}
                        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors"
                        aria-label="View lead details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => logic.openEditModal(lead)}
                        disabled={!canManage}
                        className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 transition-colors disabled:opacity-60"
                        aria-label="Edit lead"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => logic.deleteLead(lead._id)}
                        disabled={logic.deletingLeadId === lead._id || !logic.canDeleteLead(lead)}
                        className="p-2 rounded-lg text-rose-300 hover:text-rose-200 hover:bg-rose-500/15 transition-colors disabled:opacity-60"
                        aria-label="Delete lead"
                      >
                        {logic.deletingLeadId === lead._id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>

                    {(lead.agent || lead.property) && (
                      <div className="mt-2 flex flex-wrap items-center gap-3">
                        {lead.agent ? (
                          <button
                            onClick={() => navigate(`/avatars?focusAgentId=${encodeURIComponent(lead.agent)}`)}
                            className="inline-flex items-center gap-1 text-[11px] text-cyan-300 hover:text-cyan-200"
                          >
                            View Agent <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : null}
                        {lead.property ? (
                          <button
                            onClick={() => navigate(`/properties?focusPropertyId=${encodeURIComponent(lead.property || "")}`)}
                            className="inline-flex items-center gap-1 text-[11px] text-blue-300 hover:text-blue-200"
                          >
                            View Property <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            </>
          )}
        </div>
      </div>

      {logic.selectedLead && (
        <LeadDetailsModal
          lead={logic.selectedLead}
          onClose={() => logic.setSelectedLead(null)}
          agentName={agentMap.get(logic.selectedLead.agent)}
          propertyName={logic.selectedLead.property ? propertyMap.get(logic.selectedLead.property) : undefined}
          onViewAgent={() =>
            navigate(`/avatars?focusAgentId=${encodeURIComponent(logic.selectedLead?.agent || "")}`)
          }
          onViewProperty={() => {
            if (!logic.selectedLead?.property) return;
            navigate(`/properties?focusPropertyId=${encodeURIComponent(logic.selectedLead.property)}`);
          }}
        />
      )}

      {logic.isFormOpen && (
        <LeadFormModal
          mode={logic.formMode}
          submitting={logic.submitting}
          form={logic.form}
          setForm={logic.setForm}
          agents={logic.availableAgents}
          properties={logic.availableProperties}
          onClose={() => logic.setIsFormOpen(false)}
          onSubmit={logic.submitForm}
        />
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="min-w-0 rounded-full border border-slate-700/40 bg-slate-900/20 px-3 py-2 sm:rounded-xl sm:border-slate-800/50 sm:bg-slate-900/30 sm:px-4 sm:py-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] sm:text-xs text-slate-400 uppercase tracking-wide">{label}</span>
      </div>
      <div className="text-xl sm:text-2xl font-bold text-white mt-0.5 sm:mt-1">{value}</div>
    </div>
  );
}

function LeadDetailsModal({
  lead,
  onClose,
  agentName,
  propertyName,
  onViewAgent,
  onViewProperty,
}: {
  lead: LeadWithOwner;
  onClose: () => void;
  agentName?: string;
  propertyName?: string;
  onViewAgent: () => void;
  onViewProperty: () => void;
}) {
  const sortedInquiries = [...(lead.inquiries || [])].sort((a, b) => {
    const aTime = new Date(a.timestamp || 0).getTime();
    const bTime = new Date(b.timestamp || 0).getTime();
    return aTime - bTime;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-3xl rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 to-[#0d1b34] shadow-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-slate-900/95 border-b border-slate-700/50 p-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{leadDisplayName(lead)}</h3>
            <p className="text-sm text-slate-400">Lead ID: {lead._id}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          <Section title="Contact">
            <InfoRow label="Name" value={leadDisplayName(lead)} />
            <InfoRow label="Email" value={leadDisplayEmail(lead)} />
            <InfoRow label="Phone" value={leadDisplayPhone(lead)} />
            <InfoRow label="Preferred Contact" value={lead.qualification?.contactInfo?.preferredContact || "-"} />
          </Section>

          <Section title="Lead Meta">
            <InfoRow label="Status" value={lead.status} />
            <InfoRow label="Lead Score" value={String(lead.leadScore ?? 0)} />
            <InfoRow label="Lead Quality" value={lead.leadQuality || "cold"} />
            <InfoRow label="Conversion Probability" value={`${lead.conversionProbability ?? 0}%`} />
            <InfoRow label="Owner" value={lead.ownerName} />
            <InfoRow label="Session ID" value={lead.sessionId} />
            <InfoRow label="Agent" value={agentName || lead.agent} />
            <InfoRow label="Property" value={propertyName || lead.property || "-"} />
            <div className="md:col-span-2 flex items-center gap-3">
              <button
                onClick={onViewAgent}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs text-cyan-200 hover:bg-cyan-500/20"
              >
                View Agent <ArrowUpRight className="w-3 h-3" />
              </button>
              {lead.property ? (
                <button
                  onClick={onViewProperty}
                  className="inline-flex items-center gap-1 rounded-lg border border-blue-500/40 bg-blue-500/10 px-3 py-2 text-xs text-blue-200 hover:bg-blue-500/20"
                >
                  View Property <ArrowUpRight className="w-3 h-3" />
                </button>
              ) : null}
            </div>
          </Section>

          <Section title="Qualification">
            <InfoRow label="Budget Min" value={lead.qualification?.budget?.min ? String(lead.qualification.budget.min) : "-"} />
            <InfoRow label="Budget Max" value={lead.qualification?.budget?.max ? String(lead.qualification.budget.max) : "-"} />
            <InfoRow label="Timeline" value={lead.qualification?.timeline || "-"} />
            <InfoRow label="Property Type" value={lead.qualification?.propertyType || "-"} />
            <InfoRow label="Purpose" value={lead.qualification?.purpose || "-"} />
            <InfoRow
              label="Locations"
              value={lead.qualification?.locationPreference?.length ? lead.qualification.locationPreference.join(", ") : "-"}
            />
            <InfoRow label="Bedrooms" value={lead.qualification?.bedrooms ? String(lead.qualification.bedrooms) : "-"} />
            <InfoRow label="Bathrooms" value={lead.qualification?.bathrooms ? String(lead.qualification.bathrooms) : "-"} />
          </Section>

          <Section title="Notes">
            <p className="text-sm text-slate-200 whitespace-pre-wrap">{lead.qualification?.notes || "No notes"}</p>
          </Section>

          <Section title="Chat History">
            <div className="md:col-span-2 space-y-2">
              {sortedInquiries.length === 0 ? (
                <div className="rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-3 text-sm text-slate-400">
                  No chat history found for this lead.
                </div>
              ) : (
                sortedInquiries.map((entry, index) => (
                  <div key={`${entry.timestamp || index}-${index}`} className="rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-3">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-flex items-center gap-1 text-xs text-cyan-300">
                        <MessageSquare className="w-3 h-3" />
                        {entry.extractedIntent || "conversation"}
                      </span>
                      <span className="text-[11px] text-slate-500">{formatDate(entry.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-200 whitespace-pre-wrap">{entry.text || "-"}</p>
                  </div>
                ))
              )}
            </div>
          </Section>

          <Section title="Timestamps">
            <InfoRow label="Created" value={formatDate(lead.createdAt)} />
            <InfoRow label="Updated" value={formatDate(lead.updatedAt)} />
            <InfoRow label="Last Active" value={formatDate(lead.lastActive)} />
          </Section>
        </div>
      </div>
    </div>
  );
}

function LeadFormModal({
  mode,
  submitting,
  form,
  setForm,
  agents,
  properties,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  submitting: boolean;
  form: {
    agent: string;
    sessionId: string;
    property: string;
    status: LeadStatus;
    leadQuality: LeadQuality | "auto";
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    budgetMin: string;
    budgetMax: string;
    notes: string;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
        agent: string;
        sessionId: string;
        property: string;
        status: LeadStatus;
        leadQuality: LeadQuality | "auto";
        contactName: string;
        contactEmail: string;
        contactPhone: string;
      budgetMin: string;
      budgetMax: string;
      notes: string;
    }>
  >;
  agents: AgentLite[];
  properties: PropertyLite[];
  onClose: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm p-4 flex items-center justify-center overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 to-[#0d1b34] shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)]">
        <div className="p-5 border-b border-slate-700/50 flex items-center justify-between flex-shrink-0">
          <h3 className="text-xl font-bold text-white">{mode === "create" ? "Create Lead" : "Edit Lead"}</h3>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/60 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-y-auto overscroll-contain min-h-0">
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide">Agent *</label>
            <select
              value={form.agent}
              onChange={(e) => setForm((p) => ({ ...p, agent: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              <option value="">Select Agent</option>
              {form.agent && !agents.some((agent) => agent._id === form.agent) && (
                <option value={form.agent}>Current Agent ({form.agent})</option>
              )}
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent._id})
                </option>
              ))}
            </select>
          </div>
          <InputField label="Session ID *" value={form.sessionId} onChange={(v) => setForm((p) => ({ ...p, sessionId: v }))} />
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide">Property</label>
            <select
              value={form.property}
              onChange={(e) => setForm((p) => ({ ...p, property: e.target.value }))}
              className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              <option value="">None</option>
              {form.property && !properties.some((property) => property._id === form.property) && (
                <option value={form.property}>Current Property ({form.property})</option>
              )}
              {properties.map((property) => (
                <option key={property._id} value={property._id}>
                  {property.title} {property.location ? `- ${property.location}` : ""} ({property._id})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as LeadStatus }))}
              className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              {statusOptions
                .filter((option) => option.value !== "all")
                .map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 uppercase tracking-wide">Lead Quality</label>
            <select
              value={form.leadQuality}
              onChange={(e) =>
                setForm((p) => ({ ...p, leadQuality: e.target.value as LeadQuality | "auto" }))
              }
              className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            >
              <option value="auto">Auto (recommended)</option>
              <option value="cold">Cold</option>
              <option value="warm">Warm</option>
              <option value="hot">Hot</option>
              <option value="very_hot">Very Hot</option>
            </select>
          </div>

          <InputField
            label="Contact Name"
            value={form.contactName}
            onChange={(v) => setForm((p) => ({ ...p, contactName: v }))}
          />
          <InputField
            label="Contact Email"
            value={form.contactEmail}
            onChange={(v) => setForm((p) => ({ ...p, contactEmail: v }))}
          />
          <InputField
            label="Contact Phone"
            value={form.contactPhone}
            onChange={(v) => setForm((p) => ({ ...p, contactPhone: v }))}
          />
          <InputField
            label="Budget Min"
            value={form.budgetMin}
            onChange={(v) => setForm((p) => ({ ...p, budgetMin: v }))}
            type="number"
          />
          <InputField
            label="Budget Max"
            value={form.budgetMax}
            onChange={(v) => setForm((p) => ({ ...p, budgetMax: v }))}
            type="number"
          />
          <div className="md:col-span-2">
            <label className="text-xs text-slate-400 uppercase tracking-wide">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              rows={3}
              className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
            />
          </div>
        </div>

        <div className="p-5 border-t border-slate-700/50 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={onClose}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg border border-slate-600/70 text-slate-200 hover:bg-slate-800/80 transition-all disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-all disabled:opacity-60 flex items-center gap-2"
          >
            {submitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
            {submitting ? "Saving..." : mode === "create" ? "Create Lead" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-sm uppercase tracking-wide text-slate-400 mb-3">{title}</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700/60 bg-slate-900/40 px-3 py-2.5">
      <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-sm text-slate-100 mt-1 break-all">{value}</div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number";
}) {
  return (
    <div>
      <label className="text-xs text-slate-400 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1 rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/35"
      />
    </div>
  );
}
