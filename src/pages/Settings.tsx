
import React, { useEffect, useState } from "react";
import {
  User, Bell, CreditCard, Shield, Zap, Users, Mail, Plus, MoreVertical,
  X, Check, ArrowUpRight, RefreshCw, Edit, Trash2, Crown, Download,
  FileText, Phone, UserMinus, LogOut, UserCheck, UserX, Camera,
  Building2, Hash,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useSettingsLogic } from "@/Logics/useSettingsLogic";
import DeleteAccountModal from '@/components/DeleteAccountModal';
import { useToast } from "@/hooks/use-toast";
import { BillingTabContent } from "@/features/billing/components/BillingTabContent";



type TabId = 'account' | 'team' | 'billing' | 'notifications' | 'integrations' | 'security' | 'invites' | 'leave-requests';
type ConfirmTone = 'danger' | 'warning' | 'success';
type ConfirmAction = {
  title: string;
  description: string;
  impacts: string[];
  confirmLabel: string;
  loadingLabel: string;
  confirmTone?: ConfirmTone;
  allowReason?: boolean;
  reasonLabel?: string;
  reasonPlaceholder?: string;
  successTitle?: string;
  successDescription?: string;
  onConfirm: (reason?: string) => Promise<void> | void;
};

const Settings: React.FC = () => {
  const { toast } = useToast();
  const logic = useSettingsLogic();
  const [activeTab, setActiveTab] = useState<TabId>('account');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMenuFor, setShowMenuFor] = useState<string | null>(null);
  const [notificationTab, setNotificationTab] = useState<'email' | 'push' | 'sms'>('email');
  const [isEditMode, setIsEditMode] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmReason, setConfirmReason] = useState("");

  useEffect(() => {
    setConfirmReason("");
  }, [confirmAction]);

  const runConfirmedAction = async () => {
    if (!confirmAction || confirmLoading) return;
    setConfirmLoading(true);
    try {
      const reason = confirmReason.trim();
      await Promise.resolve(confirmAction.onConfirm(reason || undefined));
      if (confirmAction.successTitle || confirmAction.successDescription) {
        toast({
          title: confirmAction.successTitle || "Completed",
          description: confirmAction.successDescription,
        });
      }
      setConfirmReason("");
      setConfirmAction(null);
    } catch {
      // Action handlers already show destructive toast
    } finally {
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "security" && logic.isOwner) {
      logic.handleGetPendingDeletionRequests();
    }
  }, [activeTab, logic.isOwner, logic.handleGetPendingDeletionRequests]);

  if (logic.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <div className="text-slate-300 text-lg">Loading settings...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'account' as TabId,        label: 'Account',        icon: User,      visible: true },
    { id: 'invites' as TabId,        label: 'My Invites',     icon: Mail,      visible: logic.isIndividualUser && logic.myInvites.length > 0 },
    { id: 'team' as TabId,           label: 'Team',           icon: Users,     visible: logic.isOrganizationUser },
    { id: 'leave-requests' as TabId, label: 'Leave Requests', icon: UserMinus, visible: logic.canManageTeam && (logic.leaveRequests.length > 0 || (logic.isOwner && logic.pendingDeletionRequests.length > 0)) },
    { id: 'billing' as TabId,        label: 'Billing',        icon: CreditCard,visible: logic.isOrganizationUser },
    { id: 'notifications' as TabId,  label: 'Notifications',  icon: Bell,      visible: true },
    { id: 'integrations' as TabId,   label: 'Integrations',   icon: Zap,       visible: logic.canManageIntegrations },
    { id: 'security' as TabId,       label: 'Security',       icon: Shield,    visible: true },
  ].filter((t) => t.visible);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1600px] mx-auto" style={{ padding: "clamp(16px, 3vw, 48px) clamp(12px, 2vw, 32px)" }}>
        {/* Header */}
        <div className="mb-6 lg:mb-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-6 lg:mb-10">
            <div className="space-y-1.5 min-w-0">
              <h1 className="font-bold font-syne-bold text-white  tracking-tight" style={{ fontSize: "clamp(1.6rem, 3.2vw, 2.8rem)" }}>Settings</h1>
              <p className="text-slate-400" style={{ fontSize: "clamp(0.85rem, 1.1vw, 1rem)" }}>
                {logic.isOrganizationUser
                  ? 'Manage your organization, team, and preferences'
                  : 'Manage your account and preferences'}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {logic.isOrganizationUser && logic.billingInfo && (
                <div className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 bg-slate-900/40 border border-slate-800/50 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                  <span className="text-sm text-white font-bold">{logic.teamMembers.length}</span>
                  <span className="text-slate-500 text-sm">/</span>
                  <span className="text-slate-400 text-sm">{logic.billingInfo.plan.seats} seats</span>
                </div>
              )}
              <button
                onClick={logic.loadAllData}
                className="p-2.5 bg-slate-900/40 border border-slate-800/50 rounded-full hover:bg-slate-800/50 transition-all group"
              >
                <RefreshCw className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:rotate-180 transition-all duration-500" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-white text-slate-900'
                    : 'bg-slate-900/30 border border-slate-800/50 text-slate-400 hover:bg-slate-900/50 hover:text-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
                {id === 'notifications' && logic.unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── ACCOUNT TAB ─────────────────────────────────────────────── */}
        {activeTab === 'account' && (
          <div className="space-y-8">

            {/* Profile Section — shown for ALL users */}
            <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <SectionHeader color="from-blue-500 to-cyan-500" title="My Profile" />
                {!isEditMode && (
                  <button
                    onClick={() => setIsEditMode(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-8 mt-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Avatar className="w-24 h-24 border-2 border-slate-700/50">
                      <AvatarImage src={logic.profileForm.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white text-2xl font-bold">
                        {logic.getInitials(logic.profileForm.firstName, logic.profileForm.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditMode && (
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center hover:bg-blue-400 transition-all shadow-lg">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-white font-semibold">{logic.profileForm.firstName} {logic.profileForm.lastName}</p>
                    <RoleBadge role={logic.user?.role as any || 'individual'} />
                  </div>
                </div>

                {/* Profile Fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldGroup label="First Name">
                    <input
                      type="text"
                      value={logic.profileForm.firstName}
                      onChange={(e) => logic.setProfileForm((p: any) => ({ ...p, firstName: e.target.value }))}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-3 rounded-xl placeholder-slate-400 focus:outline-none transition-all ${
                        isEditMode
                          ? 'bg-slate-800/60 border border-slate-700/60 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-800/30 border border-slate-700/40 text-slate-400 cursor-not-allowed'
                      }`}
                      placeholder="First name"
                    />
                  </FieldGroup>
                  <FieldGroup label="Last Name">
                    <input
                      type="text"
                      value={logic.profileForm.lastName}
                      onChange={(e) => logic.setProfileForm((p: any) => ({ ...p, lastName: e.target.value }))}
                      disabled={!isEditMode}
                      className={`w-full px-4 py-3 rounded-xl placeholder-slate-400 focus:outline-none transition-all ${
                        isEditMode
                          ? 'bg-slate-800/60 border border-slate-700/60 text-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20'
                          : 'bg-slate-800/30 border border-slate-700/40 text-slate-400 cursor-not-allowed'
                      }`}
                      placeholder="Last name"
                    />
                  </FieldGroup>
                   <FieldGroup label="Email Address">
                    <input
                      type="email"
                      value={logic.profileForm.email}
                      disabled
                      className="w-full px-4 py-3 bg-slate-800/30 border border-slate-700/40 rounded-xl text-slate-400 cursor-not-allowed"
                    />
                  </FieldGroup>
                  <FieldGroup label="Account ID">
                    <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/30 border border-slate-700/40 rounded-xl">
                      <Hash className="w-4 h-4 text-slate-500" />
                      <span className="text-slate-400 font-mono">{logic.profileForm.accountId || '—'}</span>
                    </div>
                  </FieldGroup>

                  {isEditMode && (
                    <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 justify-end">
                      <button
                        onClick={() => setIsEditMode(false)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-all font-semibold border border-slate-700"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          logic.handleUpdateProfile();
                          setIsEditMode(false);
                        }}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all font-semibold"
                      >
                        <Check className="w-4 h-4" />
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {logic.isIndividualUser && (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2">
                    <SectionHeader color="from-emerald-500 to-cyan-500" title="Organization Upgrade" />
                    <p className="text-sm text-slate-300 max-w-2xl">
                      Upgrade your individual account to create and own an organization workspace.
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setConfirmAction({
                        title: "Upgrade to Organization",
                        description:
                          "Are you sure you want to upgrade your account to an organization account? This action cannot currently be reversed.",
                        impacts: [
                          "A new organization workspace will be created for your account.",
                          "Your role will change from individual to owner.",
                          "Your existing account, authentication, and settings will be preserved.",
                        ],
                        confirmLabel: "Yes, Upgrade",
                        loadingLabel: "Upgrading account...",
                        confirmTone: "success",
                        onConfirm: () => logic.handleUpgradeToOrganization(),
                      })
                    }
                    className="w-full lg:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all font-semibold"
                  >
                    <Building2 className="w-4 h-4" />
                    Upgrade to Organization
                  </button>
                </div>
              </div>
            )}

            {/* Organization Info — for org users and members */}
            {(logic.isOrganizationUser || logic.user?.workingUnderOrganization) && (
              <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 sm:p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                  <SectionHeader color="from-purple-500 to-pink-500" title="Organization Information" />
                  {!logic.isOwner && (
                    <span className="text-xs text-slate-500 italic">View only — contact your owner to make changes</span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <FieldGroup label="Organization Name">
                    <input
                      type="text"
                      value={logic.orgForm.name}
                      onChange={(e) => logic.setOrgForm((p: any) => ({ ...p, name: e.target.value }))}
                      disabled={!logic.isOwner}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Organization name"
                    />
                  </FieldGroup>
                  <FieldGroup label="Company Legal Name">
                    <input
                      type="text"
                      value={logic.orgForm.billing.companyName}
                      onChange={(e) => logic.setOrgForm((p: any) => ({ ...p, billing: { ...p.billing, companyName: e.target.value } }))}
                      disabled={!logic.isOwner}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Legal entity name"
                    />
                  </FieldGroup>
                  <FieldGroup label="Business Address">
                    <input
                      type="text"
                      value={logic.orgForm.billing.address}
                      onChange={(e) => logic.setOrgForm((p: any) => ({ ...p, billing: { ...p.billing, address: e.target.value } }))}
                      disabled={!logic.isOwner}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="Street address"
                    />
                  </FieldGroup>
                  <FieldGroup label="Business Phone">
                    <input
                      type="text"
                      value={logic.orgForm.billing.phone}
                      onChange={(e) => logic.setOrgForm((p: any) => ({ ...p, billing: { ...p.billing, phone: e.target.value } }))}
                      disabled={!logic.isOwner}
                      className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="+1 (555) 000-0000"
                    />
                  </FieldGroup>
                  <div className="md:col-span-2">
                    <FieldGroup label="Real Estate License">
                      <input
                        type="text"
                        value={logic.orgForm.billing.realEstateLicense}
                        onChange={(e) => logic.setOrgForm((p: any) => ({ ...p, billing: { ...p.billing, realEstateLicense: e.target.value } }))}
                        disabled={!logic.isOwner}
                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder="License number"
                      />
                    </FieldGroup>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-end mt-6">
                  {logic.isOwner && (
                    <SaveButton onClick={logic.handleUpdateOrganization} label="Save Organization" />
                  )}
                  {!logic.isOwner && logic.user?.workingUnderOrganization && (
                    <button
                      onClick={() =>
                        setConfirmAction({
                          title: "Request to Leave Organization",
                          description: "Your leave request will be sent to the organization owner for review.",
                          impacts: [
                            "Owner will approve or reject your request.",
                            "You remain a member until approval.",
                            "You will get email + in-app notification on decision.",
                          ],
                          confirmLabel: "Submit Leave Request",
                          loadingLabel: "Submitting request...",
                          confirmTone: "danger",
                          onConfirm: () => logic.handleRequestLeave(),
                        })
                      }
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-all font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      Leave Organization
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MY INVITES TAB ──────────────────────────────────────────── */}
        {activeTab === 'invites' && logic.isIndividualUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <SectionHeader color="from-purple-500 to-pink-500" title="Organization Invitations" />
              <span className="text-slate-500">({logic.myInvites.length})</span>
            </div>
            {logic.myInvites.map((invite) => (
              <div key={invite._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/20 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Join Organization</h3>
                    <p className="text-sm text-slate-400">Invited by {invite.invitedBy.firstName} {invite.invitedBy.lastName}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{invite.email}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={() =>
                    setConfirmAction({
                      title: "Accept Organization Invite",
                      description: "You are about to join this organization as a member.",
                      impacts: [
                        "Your account type changes to organization member.",
                        "Organization owner gets email and notification.",
                        "Your invite status will become accepted.",
                      ],
                      confirmLabel: "Accept Invite",
                      loadingLabel: "Accepting invite...",
                      confirmTone: "success",
                      onConfirm: () => logic.handleAcceptInvite(invite._id),
                    })
                  } className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-medium">
                    <UserCheck className="w-4 h-4" /> Accept
                  </button>
                  <button onClick={() =>
                    setConfirmAction({
                      title: "Decline Organization Invite",
                      description: "This invite will be rejected and removed from your pending list.",
                      impacts: [
                        "You will not join this organization.",
                        "Invite status will become rejected.",
                        "Organization owner can re-invite you later.",
                      ],
                      confirmLabel: "Decline Invite",
                      loadingLabel: "Declining invite...",
                      confirmTone: "danger",
                      onConfirm: () => logic.handleRejectInvite(invite._id),
                    })
                  } className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all text-sm font-medium">
                    <UserX className="w-4 h-4" /> Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TEAM TAB ────────────────────────────────────────────────── */}
        {activeTab === 'team' && logic.isOrganizationUser && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                <SectionHeader color="from-purple-500 to-pink-500" title="Team Members" />
                <span className="text-slate-500">({logic.teamMembers.length})</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                {!logic.isOwner && (
                  <button onClick={() =>
                    setConfirmAction({
                      title: "Request to Leave Organization",
                      description: "Your leave request will be sent to the owner for approval.",
                      impacts: [
                        "Owner must approve or reject.",
                        "You stay in organization until approval.",
                        "You will be notified by email and in-app.",
                      ],
                      confirmLabel: "Submit Leave Request",
                      loadingLabel: "Submitting request...",
                      confirmTone: "danger",
                      onConfirm: () => logic.handleRequestLeave(),
                    })
                  } className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-full font-semibold hover:bg-red-500/20 transition-all text-sm">
                    <LogOut className="w-4 h-4" /> Request to Leave
                  </button>
                )}
                {logic.canManageTeam && (
                  <button onClick={() => setShowInviteModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-full font-semibold hover:bg-slate-100 hover:scale-105 transition-all text-sm">
                    <Plus className="w-4 h-4" /> Invite Member
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {logic.teamMembers.map((member) => (
                <TeamMemberCard
                  key={member._id}
                  member={member}
                  onRemove={(memberId: string) =>
                    setConfirmAction({
                      title: "Remove Team Member",
                      description: "This member will be removed from your organization immediately.",
                      impacts: [
                        "Member loses access to organization resources.",
                        "Role and org link will be removed.",
                        "Action can be reversed only by re-inviting.",
                      ],
                      confirmLabel: "Remove Member",
                      loadingLabel: "Removing member...",
                      confirmTone: "danger",
                      onConfirm: () => logic.handleRemoveMember(memberId),
                    })
                  }
                  onUpdateRole={logic.handleUpdateRole}
                  getInitials={logic.getInitials}
                  showMenu={showMenuFor === member._id}
                  onToggleMenu={() => setShowMenuFor(showMenuFor === member._id ? null : member._id)}
                  canManage={logic.canManageTeam}
                />
              ))}
            </div>

            {logic.canManageTeam && logic.pendingInvites.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <SectionHeader color="from-amber-500 to-orange-500" title="Pending Invitations" />
                  <span className="text-slate-500">({logic.pendingInvites.length})</span>
                </div>
                <div className="space-y-3">
                  {logic.pendingInvites.map((invite) => (
                    <PendingInviteCard
                      key={invite._id}
                      invite={invite}
                      onRevoke={(inviteId: string) =>
                        setConfirmAction({
                          title: "Revoke Pending Invite",
                          description: "This invitation will no longer be usable by the invited user.",
                          impacts: [
                            "Invite status is removed from pending list.",
                            "User cannot accept this invite anymore.",
                            "You can create a new invite later.",
                          ],
                          confirmLabel: "Revoke Invite",
                          loadingLabel: "Revoking invite...",
                          confirmTone: "danger",
                          onConfirm: () => logic.handleRevokeInvite(inviteId),
                        })
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── LEAVE REQUESTS TAB ──────────────────────────────────────── */}
        {activeTab === 'leave-requests' && logic.canManageTeam && (
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <SectionHeader color="from-orange-500 to-red-500" title="Leave Requests" />
              <span className="text-slate-500">({logic.leaveRequests.length})</span>
            </div>
            {logic.leaveRequests.map((request) => (
              <div key={request._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500/10 border border-orange-500/20 rounded-xl flex items-center justify-center">
                    <UserMinus className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{request.user.firstName} {request.user.lastName}</h3>
                    <p className="text-sm text-slate-400">{request.user.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Requested {new Date(request.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button onClick={() =>
                    setConfirmAction({
                      title: "Approve Leave Request",
                      description: "The member will be removed from your organization.",
                      impacts: [
                        "Member becomes individual user.",
                        "Member's avatars, leads, and properties remain unchanged.",
                        "Member gets approval email + notification.",
                        "Pending invites for that member are cleaned up.",
                      ],
                      confirmLabel: "Approve Request",
                      loadingLabel: "Approving request...",
                      confirmTone: "success",
                      onConfirm: () => logic.handleApproveLeaveRequest(request._id),
                    })
                  } className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-all text-sm font-medium">
                    <Check className="w-4 h-4" /> Approve
                  </button>
                  <button onClick={() =>
                    setConfirmAction({
                      title: "Reject Leave Request",
                      description: "The member will remain part of your organization.",
                      impacts: [
                        "Leave request status becomes rejected.",
                        "Member gets rejection email + notification.",
                        "Member keeps all current access.",
                      ],
                      confirmLabel: "Reject Request",
                      loadingLabel: "Rejecting request...",
                      confirmTone: "danger",
                      allowReason: true,
                      reasonLabel: "Reject reason (optional)",
                      reasonPlaceholder: "Why are you rejecting this leave request?",
                      onConfirm: (reason) => logic.handleRejectLeaveRequest(request._id, reason),
                    })
                  } className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all text-sm font-medium">
                    <X className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}

            {logic.isOwner && (
              <div className="pt-4">
                <div className="flex items-center gap-3 mb-3">
                  <SectionHeader color="from-amber-500 to-orange-600" title="Account Deletion Requests" />
                  <span className="text-slate-500">({logic.pendingDeletionRequests.length})</span>
                </div>
                {logic.pendingDeletionRequests.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 text-sm text-slate-400">
                    No pending account deletion requests.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {logic.pendingDeletionRequests.map((request: any) => {
                      const memberName = `${request?.requestedBy?.firstName || request?.user?.firstName || "Member"} ${request?.requestedBy?.lastName || request?.user?.lastName || ""}`.trim();
                      const memberEmail = request?.requestedBy?.email || request?.user?.email || "N/A";
                      return (
                        <div key={request._id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                              <p className="text-white font-semibold">{memberName}</p>
                              <p className="text-slate-400 text-sm">{memberEmail}</p>
                              {request?.reason && <p className="text-slate-500 text-xs mt-1">Reason: {request.reason}</p>}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    title: "Approve Account Deletion",
                                    description: `Approving will permanently delete ${memberName}'s account and data.`,
                                    impacts: [
                                      "User account will be permanently deleted.",
                                      "All user avatars/agents, leads, and properties will be removed.",
                                      "This action cannot be undone.",
                                    ],
                                    confirmLabel: "Approve Deletion",
                                    loadingLabel: "Approving deletion...",
                                    confirmTone: "danger",
                                    onConfirm: () => logic.handleApproveDeletion(request._id),
                                  })
                                }
                                className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-sm font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  setConfirmAction({
                                    title: "Reject Account Deletion",
                                    description: `Rejecting keeps ${memberName} in organization with all data intact.`,
                                    impacts: [
                                      "User account remains active.",
                                      "Avatars, leads, and properties remain unchanged.",
                                      "User will be notified that request was rejected.",
                                    ],
                                    confirmLabel: "Reject Request",
                                    loadingLabel: "Rejecting request...",
                                    confirmTone: "warning",
                                    allowReason: true,
                                    reasonLabel: "Reject reason (optional)",
                                    reasonPlaceholder: "Why is this deletion request rejected?",
                                    onConfirm: (reason) => logic.handleRejectDeletion(request._id, reason),
                                  })
                                }
                                className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-sm font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── BILLING TAB ─────────────────────────────────────────────── */}
        {activeTab === 'billing' && logic.isOrganizationUser && logic.billingInfo && (
          <BillingTabContent
            billingStatus={logic.billingInfo}
            canManageBilling={logic.canManageBilling}
            onUpgradeSuccess={() => logic.loadAllData()}
          />
        )}

        {/* ── NOTIFICATIONS TAB ───────────────────────────────────────── */}
        {activeTab === 'notifications' && logic.notificationSettings && (
          <div className="space-y-8">
            {/* Notification History Section */}
            <div>
              <SectionHeader color="from-blue-500 to-indigo-500" title="Notification History" />
              
              {logic.notifications.length > 0 ? (
                <div className="mt-5 space-y-3 max-h-96 overflow-y-auto">
                  {logic.notifications.map((notification) => (
                    <NotificationHistoryCard
                      key={notification._id}
                      notification={notification}
                      onMarkAsRead={() => logic.handleMarkNotificationAsRead(notification._id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-5 bg-slate-900/30 border border-slate-800/50 rounded-2xl p-6 sm:p-10 lg:p-12 text-center">
                  <Bell className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-lg font-medium">No notifications yet</p>
                  <p className="text-slate-500 text-sm mt-2">Your notifications will appear here</p>
                </div>
              )}

              {logic.notifications.length > 0 && logic.unreadCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={logic.handleMarkAllNotificationsAsRead}
                    className="px-4 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-all"
                  >
                    Mark all as read
                  </button>
                </div>
              )}
            </div>

            {/* Notification Preferences Section */}
            <div>
              <SectionHeader color="from-amber-500 to-orange-500" title="Notification Preferences" />
              <div className="flex flex-wrap gap-2 mt-5">
                {([['email', 'Email', Mail], ['push', 'Push', Bell], ['sms', 'SMS', Phone]] as any[]).map(([id, label, Icon]) => (
                  <button
                    key={id}
                    onClick={() => setNotificationTab(id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      notificationTab === id
                        ? 'bg-slate-800/60 border border-slate-700/50 text-white'
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />{label}
                  </button>
                ))}
              </div>
              <div className="space-y-3 mt-5">
                {notificationTab === 'email' && Object.entries(logic.notificationSettings.emailNotifications).map(([key, val]) => (
                  <NotificationRow key={key} settingKey={key} value={val as boolean}
                    onToggle={(checked) => logic.handleUpdateNotificationSettings('emailNotifications', { ...logic.notificationSettings!.emailNotifications, [key]: checked })} />
                ))}
                {notificationTab === 'push' && Object.entries(logic.notificationSettings.pushNotifications).map(([key, val]) => (
                  <NotificationRow key={key} settingKey={key} value={val as boolean}
                    onToggle={(checked) => logic.handleUpdateNotificationSettings('pushNotifications', { ...logic.notificationSettings!.pushNotifications, [key]: checked })} />
                ))}
                {notificationTab === 'sms' && Object.entries(logic.notificationSettings.smsNotifications).map(([key, val]) => (
                  <NotificationRow key={key} settingKey={key} value={val as boolean}
                    onToggle={(checked) => logic.handleUpdateNotificationSettings('smsNotifications', { ...logic.notificationSettings!.smsNotifications, [key]: checked })} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── INTEGRATIONS TAB ────────────────────────────────────────── */}
        {activeTab === 'integrations' && logic.canManageIntegrations && (
          <div className="space-y-6">
            <SectionHeader color="from-cyan-500 to-blue-500" title="CRM & Platform Integrations" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {logic.integrations.map((integration, i) => (
                <IntegrationCard
                  key={i}
                  integration={integration}
                  onConnect={() => {
                    if (integration.type === 'zillow') logic.setZillowDialogOpen(true);
                    if (integration.type === 'realtor') logic.setRealtorDialogOpen(true);
                  }}
                  onDisconnect={() => logic.handleDisconnectIntegration(integration.type)}
                  onSync={() => logic.handleSyncIntegration(integration.type)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── SECURITY TAB ────────────────────────────────────────────── */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SectionHeader color="from-red-500 to-pink-500" title="Privacy & Security" />
            <div className="space-y-3">
              <SecurityRow title="Call Recording" description="Record avatar voice conversations for quality assurance" defaultChecked />
              <SecurityRow title="Data Retention" description="Keep lead data for 2 years (GDPR compliant)" defaultChecked />
              <SecurityRow title="Two-Factor Authentication" description="Add an extra layer of security to your account" />
            </div>

            {logic.isOwner && (
              <div className="pt-4">
                <SectionHeader color="from-amber-500 to-orange-600" title="Account Deletion Requests" />
                <div className="mt-4 space-y-3">
                  {logic.pendingDeletionRequests.length === 0 && (
                    <div className="p-4 rounded-xl bg-slate-900/30 border border-slate-800/50 text-sm text-slate-400">
                      No pending member deletion requests.
                    </div>
                  )}

                  {logic.pendingDeletionRequests.map((request: any) => {
                    const memberName = `${request?.requestedBy?.firstName || request?.user?.firstName || "Member"} ${request?.requestedBy?.lastName || request?.user?.lastName || ""}`.trim();
                    const memberEmail = request?.requestedBy?.email || request?.user?.email || "N/A";
                    return (
                      <div key={request._id} className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/50">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <p className="text-white font-semibold">{memberName}</p>
                            <p className="text-slate-400 text-sm">{memberEmail}</p>
                            {request?.reason && (
                              <p className="text-slate-500 text-xs mt-1">Reason: {request.reason}</p>
                            )}
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  title: "Approve Account Deletion",
                                  description: `Approving will permanently delete ${memberName}'s account and data.`,
                                  impacts: [
                                    "User account will be permanently deleted.",
                                    "All user avatars/agents, leads, and properties will be removed.",
                                    "This action cannot be undone.",
                                  ],
                                  confirmLabel: "Approve Deletion",
                                  loadingLabel: "Approving deletion...",
                                  confirmTone: "danger",
                                  onConfirm: () => logic.handleApproveDeletion(request._id),
                                })
                              }
                              className="px-3 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-300 hover:bg-red-500/30 text-sm font-semibold"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                setConfirmAction({
                                  title: "Reject Account Deletion",
                                  description: `Rejecting keeps ${memberName} in organization with all data intact.`,
                                  impacts: [
                                    "User account remains active.",
                                    "Avatars, leads, and properties remain unchanged.",
                                    "User will be notified that request was rejected.",
                                  ],
                                  confirmLabel: "Reject Request",
                                  loadingLabel: "Rejecting request...",
                                  confirmTone: "warning",
                                  allowReason: true,
                                  reasonLabel: "Reject reason (optional)",
                                  reasonPlaceholder: "Why is this deletion request rejected?",
                                  onConfirm: (reason) => logic.handleRejectDeletion(request._id, reason),
                                })
                              }
                              className="px-3 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:bg-amber-500/30 text-sm font-semibold"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-8">
              <SectionHeader color="from-red-600 to-red-800" title="Danger Zone" />
              <div className="mt-5 space-y-3">
                <button className="w-full sm:w-auto flex items-center gap-2 px-5 py-2.5 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 transition-all text-sm font-medium">
                  <Download className="w-4 h-4" /> Export All Data
                </button>
                <button className="w-full sm:w-auto flex items-center gap-2 px-5 py-2.5 bg-slate-900/30 border border-slate-800/50 text-slate-300 rounded-xl hover:bg-slate-900/50 transition-all text-sm font-medium">
                  <FileText className="w-4 h-4" /> Download Compliance Report
                </button>
                {logic.isOwner && (
                  <button
                    onClick={() =>
                      setConfirmAction({
                        title: "Delete Organization Permanently",
                        description: "This action is irreversible and affects your full team.",
                        impacts: [
                          "Organization record will be permanently deleted.",
                          "All members will be detached from organization.",
                          "All pending invites and leave requests will be removed.",
                        ],
                        confirmLabel: "Delete Organization",
                        loadingLabel: "Deleting organization...",
                        confirmTone: "danger",
                        onConfirm: () => logic.handleDeleteOrganization(),
                      })
                    }
                    className="w-full sm:w-auto flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                  >
                    <Trash2 className="w-4 h-4" /> Delete Organization Permanently
                  </button>
                )}
                <button
                  onClick={() =>
                    setConfirmAction({
                      title: "Start Account Deletion Flow",
                      description: "You will proceed to account deletion steps with request/approval logic.",
                      impacts: [
                        "You will review what happens before final submit.",
                        "For members, owner approval may be required.",
                        "You will receive status by email and notification.",
                      ],
                      confirmLabel: "Continue",
                      loadingLabel: "Opening deletion flow...",
                      confirmTone: "warning",
                      onConfirm: async () => {
                        setShowDeleteModal(true);
                      },
                    })
                  }
                  className="w-full sm:w-auto flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all text-sm font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Click-away for menus */}
      {showMenuFor && <div className="fixed inset-0 z-10" onClick={() => setShowMenuFor(null)} />}

      {/* Modals */}
      <InviteModal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        inviteAccountId={logic.inviteAccountId}
        setInviteAccountId={logic.setInviteAccountId}
        inviteEmail={logic.inviteEmail}
        setInviteEmail={logic.setInviteEmail}
        onInvite={() => { logic.handleInviteMember(); setShowInviteModal(false); }}
      />
      <ZillowModal isOpen={logic.zillowDialogOpen} onClose={() => logic.setZillowDialogOpen(false)}
        credentials={logic.zillowCredentials} setCredentials={logic.setZillowCredentials} onConnect={logic.handleConnectZillow} />
      <RealtorModal isOpen={logic.realtorDialogOpen} onClose={() => logic.setRealtorDialogOpen(false)}
        credentials={logic.realtorCredentials} setCredentials={logic.setRealtorCredentials} onConnect={logic.handleConnectRealtor} />

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal
          user={logic.user}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={() => { /* modal handles redirect */ }}
        />
      )}

      <ActionConfirmCard
        action={confirmAction}
        reason={confirmReason}
        onReasonChange={setConfirmReason}
        isLoading={confirmLoading}
        onCancel={() => {
          if (!confirmLoading) {
            setConfirmReason("");
            setConfirmAction(null);
          }
        }}
        onConfirm={runConfirmedAction}
      />
    </div>
  );
};

// ─── Shared UI Components ─────────────────────────────────────────────────────

function ActionConfirmCard({
  action,
  reason,
  onReasonChange,
  isLoading,
  onCancel,
  onConfirm,
}: {
  action: ConfirmAction | null;
  reason: string;
  onReasonChange: (value: string) => void;
  isLoading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!action) return null;

  const tone = action.confirmTone || "warning";
  const toneStyles: Record<ConfirmTone, string> = {
    danger: "bg-red-500 hover:bg-red-600 text-white",
    warning: "bg-amber-500 hover:bg-amber-600 text-slate-950",
    success: "bg-emerald-500 hover:bg-emerald-600 text-white",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-700/60 bg-gradient-to-br from-slate-900 to-[#0d1b34] shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <h3 className="text-xl font-bold text-white">{action.title}</h3>
          <p className="text-sm text-slate-300 mt-2 leading-relaxed">{action.description}</p>
        </div>
        <div className="p-6">
          <p className="text-sm text-slate-200 font-semibold mb-3">What will happen:</p>
          <ul className="space-y-2 mb-6">
            {action.impacts.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {action.allowReason && (
            <div className="mb-6">
              <label className="block text-sm text-slate-200 font-semibold mb-2">
                {action.reasonLabel || "Reason (optional)"}
              </label>
              <textarea
                value={reason}
                onChange={(e) => onReasonChange(e.target.value)}
                rows={3}
                disabled={isLoading}
                placeholder={action.reasonPlaceholder || "Add reason"}
                className="w-full rounded-lg border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40"
              />
            </div>
          )}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-lg border border-slate-600/70 text-slate-200 hover:bg-slate-800/80 transition-all disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-4 py-2.5 rounded-lg font-semibold transition-all disabled:opacity-60 flex items-center gap-2 ${toneStyles[tone]}`}
            >
              {isLoading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {action.loadingLabel}
                </>
              ) : (
                action.confirmLabel
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`w-1 h-6 bg-gradient-to-b ${color} rounded-full`} />
      <h2 className="text-lg sm:text-xl font-bold text-white">{title}</h2>
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-200 mb-2">{label}</label>
      {children}
    </div>
  );
}

function SaveButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className="w-full sm:w-auto group flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-full font-semibold transition-all hover:scale-105 text-sm">
      <Check className="w-4 h-4" />
      {label}
      <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = {
    owner: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    admin: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    member: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
    agent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    individual: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  };
  return (
    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors[role] || colors.member}`}>
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

function UsageBar({ label, used, limit, percent, gradient }: any) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-slate-400 text-sm font-medium">{label}</span>
        <span className="text-white font-semibold text-sm">{used}/{limit}</span>
      </div>
      <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-500`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}

function TeamMemberCard({ member, onRemove, onUpdateRole, getInitials, showMenu, onToggleMenu, canManage }: any) {
  const roleColors: Record<string, string> = {
    owner: 'text-purple-400 bg-purple-500/10',
    admin: 'text-blue-400 bg-blue-500/10',
    agent: 'text-emerald-400 bg-emerald-500/10',
    member: 'text-slate-400 bg-slate-500/10',
  };
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-4 sm:p-6 hover:border-slate-700/50 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-11 h-11 border-2 border-slate-700/50">
            <AvatarImage src={member.user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-slate-700 to-slate-800 text-white font-bold text-sm">
              {getInitials(member.user.firstName, member.user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-white font-semibold text-sm">{member.user.firstName} {member.user.lastName}</h3>
            <p className="text-slate-500 text-xs">{member.user.email}</p>
          </div>
        </div>
        {canManage && member.role !== 'owner' && (
          <div className="relative">
            <button onClick={onToggleMenu} className="p-1.5 hover:bg-slate-800/50 rounded-lg transition-all">
              <MoreVertical className="w-4 h-4 text-slate-500" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl z-20 py-1.5">
                {['admin', 'member', 'agent'].map((r) => (
                  <button key={r} onClick={() => onUpdateRole(member.user._id, r)}
                    className={`w-full px-3.5 py-2 text-left text-sm hover:bg-slate-700/50 flex items-center gap-2 transition-colors ${member.role === r ? 'text-blue-400' : 'text-slate-300'}`}>
                    <Edit className="w-3.5 h-3.5" /> Set as {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
                <div className="h-px bg-slate-700/50 my-1.5" />
                <button onClick={() => onRemove(member.user._id)}
                  className="w-full px-3.5 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Remove Member
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className="space-y-2 pt-3 border-t border-slate-800/50">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Role</span>
          <span className={`px-2.5 py-0.5 rounded-lg font-semibold ${roleColors[member.role] || roleColors.member}`}>
            {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Joined</span>
          <span className="text-slate-300">{new Date(member.joinedAt).toLocaleDateString()}</span>
        </div>
        {member.user.accountId && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Account ID</span>
            <span className="text-slate-300 font-mono">#{member.user.accountId}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function PendingInviteCard({ invite, onRevoke }: any) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all">
      <div className="flex items-start sm:items-center gap-3">
        <div className="w-9 h-9 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center">
          <Mail className="w-4 h-4 text-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-white text-sm">{invite.email}</p>
          <p className="text-xs text-slate-500">
            Invited by {invite.invitedBy?.firstName} {invite.invitedBy?.lastName} · #{invite.accountId}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-lg text-xs font-semibold text-amber-400">Pending</span>
        <button onClick={() => onRevoke(invite._id)} className="ml-auto sm:ml-0 px-3 py-1.5 text-xs text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all font-medium">Revoke</button>
      </div>
    </div>
  );
}

function PricingCard({ planKey, plan, isCurrentPlan, isEnterprise, onUpgrade }: any) {
  return (
    <div className={`relative bg-slate-900/30 border rounded-2xl p-6 transition-all ${isCurrentPlan ? 'border-white/20 bg-slate-900/50' : 'border-slate-800/50 hover:border-slate-700/50'}`}>
      {isCurrentPlan && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <div className="px-3 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full text-xs font-bold text-white flex items-center gap-1">
            <Check className="w-3 h-3" /> Current Plan
          </div>
        </div>
      )}
      <div className="text-center mb-5">
        <h3 className="text-xl font-bold text-white mb-1 capitalize">{plan.name}</h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-3xl font-bold text-white">${plan.price}</span>
          <span className="text-slate-400 text-sm">/mo</span>
        </div>
      </div>
      <div className="space-y-2 mb-5 text-sm text-slate-300">
        {[`${plan.agentsLimit >= 1000 ? 'Unlimited' : plan.agentsLimit} AI Agents`,
          `${plan.propertiesLimit >= 1000 ? 'Unlimited' : plan.propertiesLimit} Properties`,
          `${plan.seats >= 1000 ? 'Unlimited' : plan.seats} Team Members`].map((f) => (
          <div key={f} className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />{f}</div>
        ))}
      </div>
      <button onClick={onUpgrade} disabled={isCurrentPlan}
        className={`w-full py-2.5 rounded-xl font-semibold transition-all text-sm ${
          isCurrentPlan ? 'bg-slate-800/50 text-slate-500 cursor-not-allowed'
          : isEnterprise ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 hover:scale-105'
          : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-105'}`}>
        {isCurrentPlan ? 'Current Plan' : 'Upgrade Now'}
      </button>
    </div>
  );
}

function NotificationRow({ settingKey, value, onToggle }: { settingKey: string; value: boolean; onToggle: (v: boolean) => void }) {
  const descriptions: Record<string, string> = {
    newLeads: 'Get notified when AI agents capture new leads',
    propertyShowings: 'Notifications for scheduled property viewings',
    offerUpdates: 'Get alerts for new offers and negotiations',
    dailyPerformance: 'Receive daily analytics summaries',
    marketTrends: 'Weekly real estate market updates',
    systemUpdates: 'Important system and feature updates',
    urgentAlerts: 'Critical alerts requiring immediate attention',
    bookingReminders: 'Reminders for upcoming appointments',
    showingReminders: 'Reminders for property showings',
    offerDeadlines: 'Alerts for offer expirations',
  };
  const title = settingKey.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase());
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all">
      <div>
        <h4 className="text-white font-semibold text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{descriptions[settingKey]}</p>
      </div>
      <Switch checked={value} onCheckedChange={onToggle} />
    </div>
  );
}

function SecurityRow({ title, description, defaultChecked = false }: { title: string; description: string; defaultChecked?: boolean }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl hover:border-slate-700/50 transition-all">
      <div>
        <h4 className="text-white font-semibold text-sm">{title}</h4>
        <p className="text-xs text-slate-500 mt-0.5">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function IntegrationCard({ integration, onConnect, onDisconnect, onSync }: any) {
  const isConnected = integration.status === 'connected';
  return (
    <div className="bg-slate-900/30 border border-slate-800/50 rounded-2xl p-5 hover:border-slate-700/50 transition-all">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-slate-800/50 border border-slate-700/50 rounded-xl flex items-center justify-center text-xl">{integration.icon}</div>
        <div className="flex-1">
          <h3 className="text-white font-semibold text-sm">{integration.name}</h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-slate-500'}`} />
            <span className={`text-xs font-medium ${isConnected ? 'text-emerald-400' : 'text-slate-500'}`}>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          {integration.lastSync && <p className="text-xs text-slate-500 mt-0.5">Last sync: {new Date(integration.lastSync).toLocaleDateString()}</p>}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        {isConnected ? (
          <>
            <button onClick={onSync} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-800 transition-all text-xs font-medium">
              <RefreshCw className="w-3.5 h-3.5" /> Sync
            </button>
            <button onClick={onDisconnect} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all text-xs font-medium">
              <X className="w-3.5 h-3.5" /> Disconnect
            </button>
          </>
        ) : (
          <button onClick={onConnect} className="w-full flex items-center justify-center gap-1.5 py-2 bg-white/10 text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all text-xs font-medium">
            <Zap className="w-3.5 h-3.5" /> Connect
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Modals ───────────────────────────────────────────────────────────────────

function InviteModal({ isOpen, onClose, inviteAccountId, setInviteAccountId, inviteEmail, setInviteEmail, onInvite }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-4">
          <DialogTitle className="text-xl font-bold text-white">Invite Team Member</DialogTitle>
          <p className="text-slate-400 text-sm mt-1">Send an invitation to join your team</p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FieldGroup label="Account ID">
            <input type="text" value={inviteAccountId} onChange={(e) => setInviteAccountId(e.target.value)} placeholder="12345"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
            <p className="text-xs text-slate-500 mt-1">5-digit account ID</p>
          </FieldGroup>
          <FieldGroup label="Email Address">
            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="colleague@example.com"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
          </FieldGroup>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-800/50 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all font-semibold text-sm">Cancel</button>
          <button onClick={onInvite} className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all text-sm">Send Invitation</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ZillowModal({ isOpen, onClose, credentials, setCredentials, onConnect }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-4">
          <DialogTitle className="text-xl font-bold text-white">Connect Zillow</DialogTitle>
          <p className="text-slate-400 text-sm mt-1">Enter your Zillow API credentials</p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FieldGroup label="ZWS ID">
            <input type="text" value={credentials.zwsId} onChange={(e) => setCredentials((p: any) => ({ ...p, zwsId: e.target.value }))} placeholder="Enter ZWS ID"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
          </FieldGroup>
          <FieldGroup label="API Key">
            <input type="password" value={credentials.apiKey} onChange={(e) => setCredentials((p: any) => ({ ...p, apiKey: e.target.value }))} placeholder="Enter API key"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
          </FieldGroup>
          <div className="pt-2 border-t border-slate-800/50 space-y-3">
            <p className="text-sm font-semibold text-slate-200">Sync Settings</p>
            {[['syncProperties', 'Sync Properties'], ['syncLeads', 'Sync Leads']].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <span className="text-sm text-slate-200">{label}</span>
                <Switch checked={credentials.settings?.[key]} onCheckedChange={(v) => setCredentials((p: any) => ({ ...p, settings: { ...p.settings, [key]: v } }))} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-800/50 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all font-semibold text-sm">Cancel</button>
          <button onClick={onConnect} className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all text-sm">Connect Zillow</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RealtorModal({ isOpen, onClose, credentials, setCredentials, onConnect }: any) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800/50 max-w-md">
        <DialogHeader className="border-b border-slate-800/50 pb-4">
          <DialogTitle className="text-xl font-bold text-white">Connect Realtor.com</DialogTitle>
          <p className="text-slate-400 text-sm mt-1">Enter your Realtor.com API credentials</p>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <FieldGroup label="API Key">
            <input type="text" value={credentials.apiKey} onChange={(e) => setCredentials((p: any) => ({ ...p, apiKey: e.target.value }))} placeholder="Enter API key"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
          </FieldGroup>
          <FieldGroup label="API Secret">
            <input type="password" value={credentials.secret} onChange={(e) => setCredentials((p: any) => ({ ...p, secret: e.target.value }))} placeholder="Enter API secret"
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all" />
          </FieldGroup>
          <div className="pt-2 border-t border-slate-800/50 space-y-3">
            <p className="text-sm font-semibold text-slate-200">Sync Settings</p>
            {[['syncProperties', 'Sync Listings'], ['autoImport', 'Auto Import']].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-slate-800/30 border border-slate-700/50 rounded-xl">
                <span className="text-sm text-slate-200">{label}</span>
                <Switch checked={credentials.settings?.[key]} onCheckedChange={(v) => setCredentials((p: any) => ({ ...p, settings: { ...p.settings, [key]: v } }))} />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 border-t border-slate-800/50 pt-4">
          <button onClick={onClose} className="flex-1 py-2.5 border border-slate-700/50 text-slate-300 rounded-xl hover:bg-slate-700/30 transition-all font-semibold text-sm">Cancel</button>
          <button onClick={onConnect} className="flex-1 py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-semibold transition-all text-sm">Connect Realtor.com</button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NotificationHistoryCard({ notification, onMarkAsRead }: any) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'leave_requested':
        return { icon: LogOut, color: 'text-orange-400', bg: 'bg-orange-500/10' };
      case 'leave_approved':
        return { icon: Check, color: 'text-green-400', bg: 'bg-green-500/10' };
      case 'leave_rejected':
        return { icon: X, color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'invite_accepted':
        return { icon: UserCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
      case 'invite_sent':
        return { icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10' };
      default:
        return { icon: Bell, color: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
  };

  const { icon: Icon, color, bg } = getNotificationIcon(notification.type);
  const timeAgo = getTimeAgo(notification.createdAt);

  return (
    <div
      onClick={() => !notification.read && onMarkAsRead()}
      className={`p-4 rounded-xl border transition-all cursor-pointer ${
        notification.read
          ? 'bg-slate-900/20 border-slate-800/30'
          : 'bg-slate-900/40 border-slate-700/50 hover:border-slate-600/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${bg} border ${color.replace('text-', 'border-')}/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm leading-tight">{notification.title}</p>
          <p className="text-slate-400 text-sm mt-1">{notification.message}</p>
          <p className="text-slate-500 text-xs mt-2">{timeAgo}</p>
        </div>
        {!notification.read && (
          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
        )}
      </div>
    </div>
  );
}

function getTimeAgo(date: string) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  
  return then.toLocaleDateString();
}

export default Settings;


