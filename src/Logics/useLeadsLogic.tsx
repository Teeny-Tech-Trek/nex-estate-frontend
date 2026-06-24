import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  AgentLite,
  PropertyLite,
  TeamMemberLite,
  leadsApiService,
} from "@/services/leads.api";
import { User } from "@/types/auth";
import { getFriendlyErrorMessage } from '../lib/errorMapper';
import {
  CreateLeadPayload,
  Lead,
  LeadQuality,
  LeadStatus,
  LeadWithOwner,
  UpdateLeadPayload,
} from "@/types/lead";

type LeadFormState = {
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

const emptyForm: LeadFormState = {
  agent: "",
  sessionId: "",
  property: "",
  status: "new",
  leadQuality: "auto",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  budgetMin: "",
  budgetMax: "",
  notes: "",
};

function getLeadOwnerId(createdBy: Lead["createdBy"]): string | null {
  if (!createdBy) return null;
  if (typeof createdBy === "string") return createdBy;
  return createdBy._id || null;
}

function getUserId(user: User | null): string | null {
  if (!user) return null;
  return user.id || user._id || null;
}

function isValidObjectId(value: string): boolean {
  return /^[a-fA-F0-9]{24}$/.test(value);
}

export function useLeadsLogic(scope?: { agentId?: string; propertyId?: string }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const [leads, setLeads] = useState<Lead[]>([]);
  const [availableAgents, setAvailableAgents] = useState<AgentLite[]>([]);
  const [availableProperties, setAvailableProperties] = useState<PropertyLite[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingLeadId, setDeletingLeadId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [qualityFilter, setQualityFilter] = useState<"all" | "cold" | "warm" | "hot" | "very_hot">("all");

  const [selectedLead, setSelectedLead] = useState<LeadWithOwner | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [form, setForm] = useState<LeadFormState>(emptyForm);

  const isOwnerOrAdmin = useMemo(
    () =>
      !!user &&
      (user.role === "owner" || user.role === "admin") &&
      (user.accountType === "organization" || !!user.workingUnderOrganization),
    [user]
  );
  const currentUserId = useMemo(() => getUserId(user), [user]);
  const scopedAgentId = scope?.agentId?.trim() || "";
  const scopedPropertyId = scope?.propertyId?.trim() || "";

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const [leadResult, teamResult, agentResult, propertyResult] = await Promise.allSettled([
        leadsApiService.getLeads(),
        isOwnerOrAdmin ? leadsApiService.getOrganizationTeamMembers() : Promise.resolve([] as TeamMemberLite[]),
        leadsApiService.getAvailableAgents(),
        leadsApiService.getAvailableProperties(),
      ]);

      if (leadResult.status === "rejected") {
        throw leadResult.reason;
      }

      const leadData = leadResult.value;
      const teamMembers = teamResult.status === "fulfilled" ? teamResult.value : [];
      const agents = agentResult.status === "fulfilled" ? agentResult.value : [];
      const properties = propertyResult.status === "fulfilled" ? propertyResult.value : [];

      setAvailableAgents(agents);
      setAvailableProperties(properties);

      const ownerMap = new Map<string, { name: string; email: string }>();
      if (currentUserId) {
        ownerMap.set(currentUserId, {
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "You",
          email: user.email,
        });
      }
      teamMembers.forEach((member) => {
        ownerMap.set(member.user._id, {
          name: `${member.user.firstName} ${member.user.lastName}`.trim() || "Team Member",
          email: member.user.email,
        });
      });

      const normalized = leadData.map((lead) => {
        const ownerId = getLeadOwnerId(lead.createdBy);
        const owner = ownerId ? ownerMap.get(ownerId) : undefined;
        const createdByFromApi = typeof lead.createdBy === "object" ? lead.createdBy : undefined;
        const fallbackName =
          `${createdByFromApi?.firstName || ""} ${createdByFromApi?.lastName || ""}`.trim() || "Unknown";
        const fallbackEmail = createdByFromApi?.email;
        return {
          ...lead,
          ownerName: owner?.name || fallbackName,
          ownerEmail: owner?.email || fallbackEmail,
          isMine: !!ownerId && !!currentUserId && ownerId === currentUserId,
        } satisfies LeadWithOwner;
      });

      setLeads(normalized);
    } catch (err: unknown) {
      const message = getFriendlyErrorMessage(err, "Failed to load leads");
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [currentUserId, isOwnerOrAdmin, toast, user]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return (leads as LeadWithOwner[]).filter((lead) => {
      const name = lead.qualification?.contactInfo?.name?.toLowerCase() || "";
      const email = lead.qualification?.contactInfo?.email?.toLowerCase() || "";
      const phone = lead.qualification?.contactInfo?.phone?.toLowerCase() || "";
      const sessionId = lead.sessionId?.toLowerCase() || "";
      const ownerName = lead.ownerName.toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        sessionId.includes(query) ||
        ownerName.includes(query);
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesQuality = qualityFilter === "all" || lead.leadQuality === qualityFilter;
      const matchesScopedAgent = !scopedAgentId || lead.agent === scopedAgentId;
      const matchesScopedProperty = !scopedPropertyId || lead.property === scopedPropertyId;

      return matchesSearch && matchesStatus && matchesQuality && matchesScopedAgent && matchesScopedProperty;
    });
  }, [leads, qualityFilter, scopedAgentId, scopedPropertyId, search, statusFilter]);

  const stats = useMemo(() => {
    const total = filteredLeads.length;
    const hot = filteredLeads.filter((l) => l.leadQuality === "hot" || l.leadQuality === "very_hot").length;
    const newLeads = filteredLeads.filter((l) => l.status === "new").length;
    const closed = filteredLeads.filter((l) => l.status === "closed").length;
    const mine = (filteredLeads as LeadWithOwner[]).filter((l) => l.isMine).length;
    return { total, hot, newLeads, closed, mine };
  }, [filteredLeads]);

  const canManageLead = useCallback(
    (lead: LeadWithOwner) => {
      if (isOwnerOrAdmin) return true;
      return lead.isMine;
    },
    [isOwnerOrAdmin]
  );

  const canDeleteLead = canManageLead;

  const openCreateModal = useCallback(() => {
    setFormMode("create");
    setEditingLeadId(null);
    setForm({ ...emptyForm, agent: availableAgents[0]?._id || "" });
    setIsFormOpen(true);
  }, [availableAgents]);

  const openEditModal = useCallback((lead: LeadWithOwner) => {
    setFormMode("edit");
    setEditingLeadId(lead._id);
    setForm({
      agent: lead.agent || "",
      sessionId: lead.sessionId || "",
      property: lead.property || "",
      status: lead.status,
      leadQuality: lead.leadQuality || "auto",
      contactName: lead.qualification?.contactInfo?.name || "",
      contactEmail: lead.qualification?.contactInfo?.email || "",
      contactPhone: lead.qualification?.contactInfo?.phone || "",
      budgetMin: lead.qualification?.budget?.min ? String(lead.qualification.budget.min) : "",
      budgetMax: lead.qualification?.budget?.max ? String(lead.qualification.budget.max) : "",
      notes: lead.qualification?.notes || "",
    });
    setIsFormOpen(true);
  }, []);

  const buildPayload = useCallback((): CreateLeadPayload => {
    const payload: CreateLeadPayload = {
      agent: form.agent.trim(),
      sessionId: form.sessionId.trim(),
      status: form.status,
    };

    if (form.property.trim()) payload.property = form.property.trim();
    if (form.leadQuality !== "auto") payload.leadQuality = form.leadQuality;

    const qualification: NonNullable<CreateLeadPayload["qualification"]> = {};
    if (form.contactName.trim() || form.contactEmail.trim() || form.contactPhone.trim()) {
      qualification.contactInfo = {};
      if (form.contactName.trim()) qualification.contactInfo.name = form.contactName.trim();
      if (form.contactEmail.trim()) qualification.contactInfo.email = form.contactEmail.trim();
      if (form.contactPhone.trim()) qualification.contactInfo.phone = form.contactPhone.trim();
    }

    if (form.budgetMin.trim() || form.budgetMax.trim()) {
      qualification.budget = {};
      if (form.budgetMin.trim()) qualification.budget.min = Number(form.budgetMin);
      if (form.budgetMax.trim()) qualification.budget.max = Number(form.budgetMax);
    }

    if (form.notes.trim()) qualification.notes = form.notes.trim();
    if (Object.keys(qualification).length > 0) payload.qualification = qualification;

    return payload;
  }, [form]);

  const submitForm = useCallback(async () => {
    const payload = buildPayload();

    if (!payload.agent || !payload.sessionId) {
      toast({
        title: "Missing required fields",
        description: "Agent ID and Session ID are required.",
        variant: "destructive",
      });
      return;
    }

    if (availableAgents.length === 0) {
      toast({
        title: "No agents available",
        description: "Create an agent first, then create a lead.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidObjectId(payload.agent)) {
      toast({
        title: "Invalid Agent ID",
        description: "Please select a valid agent.",
        variant: "destructive",
      });
      return;
    }

    if (payload.property && !isValidObjectId(payload.property)) {
      toast({
        title: "Invalid Property ID",
        description: "Please select a valid property or leave property empty.",
        variant: "destructive",
      });
      return;
    }

    if (
      payload.qualification?.budget?.min !== undefined &&
      payload.qualification?.budget?.max !== undefined &&
      payload.qualification.budget.min > payload.qualification.budget.max
    ) {
      toast({
        title: "Invalid budget",
        description: "Budget minimum cannot be greater than budget maximum.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      if (formMode === "create") {
        await leadsApiService.createLead(payload);
        toast({ title: "Lead created", description: "New lead added successfully." });
      } else if (editingLeadId) {
        const updatePayload: UpdateLeadPayload = payload;
        await leadsApiService.updateLead(editingLeadId, updatePayload);
        toast({ title: "Lead updated", description: "Lead updated successfully." });
      }

      setIsFormOpen(false);
      setForm(emptyForm);
      setEditingLeadId(null);
      await loadLeads();
    } catch (err: unknown) {
      const message = getFriendlyErrorMessage(err, "Failed to save lead");
      toast({ title: "Error", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  }, [availableAgents.length, buildPayload, editingLeadId, formMode, loadLeads, toast]);

  const updateLeadStatus = useCallback(
    async (leadId: string, status: LeadStatus) => {
      const lead = (leads as LeadWithOwner[]).find((item) => item._id === leadId);
      if (!lead || !canManageLead(lead)) {
        toast({
          title: "Access denied",
          description: "You do not have permission to update this lead.",
          variant: "destructive",
        });
        return;
      }

      const previousStatus = lead.status;
      setLeads((prev) => prev.map((item) => (item._id === leadId ? { ...item, status } : item)));
      try {
        await leadsApiService.updateLead(leadId, { status });
        toast({ title: "Status updated", description: `Lead moved to ${status}.` });
      } catch (err: unknown) {
        setLeads((prev) => prev.map((item) => (item._id === leadId ? { ...item, status: previousStatus } : item)));
        const message = getFriendlyErrorMessage(err, "Failed to update status");
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    },
    [canManageLead, leads, toast]
  );

  const deleteLead = useCallback(
    async (leadId: string) => {
      const lead = (leads as LeadWithOwner[]).find((item) => item._id === leadId);
      if (!lead || !canDeleteLead(lead)) {
        toast({
          title: "Access denied",
          description: "You do not have permission to delete this lead.",
          variant: "destructive",
        });
        return;
      }

      const confirmed = window.confirm("Delete this lead permanently?");
      if (!confirmed) return;

      setDeletingLeadId(leadId);
      try {
        await leadsApiService.deleteLead(leadId);
        setLeads((prev) => prev.filter((lead) => lead._id !== leadId));
        toast({ title: "Lead deleted", description: "Lead removed successfully." });
        if (selectedLead?._id === leadId) {
          setSelectedLead(null);
        }
      } catch (err: unknown) {
        const message = getFriendlyErrorMessage(err, "Failed to delete lead");
        toast({ title: "Error", description: message, variant: "destructive" });
      } finally {
        setDeletingLeadId(null);
      }
    },
    [canDeleteLead, leads, selectedLead, toast]
  );

  return {
    user,
    loading,
    submitting,
    deletingLeadId,
    isOwnerOrAdmin,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    qualityFilter,
    setQualityFilter,
    leads: filteredLeads as LeadWithOwner[],
    totalLeads: filteredLeads.length,
    stats,
    selectedLead,
    setSelectedLead,
    isFormOpen,
    setIsFormOpen,
    formMode,
    form,
    setForm,
    availableAgents,
    availableProperties,
    loadLeads,
    openCreateModal,
    openEditModal,
    submitForm,
    updateLeadStatus,
    deleteLead,
    canManageLead,
    canDeleteLead,
  };
}
