// // src/hooks/useSettingsLogic.ts
// import { useState, useEffect, useCallback } from 'react';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import { 
//   apiService, 
//   Organization, 
//   TeamMember, 
//   PendingInvite, 
//   BillingInfo, 
//   Integration, 
//   NotificationSettings,
//   LeaveRequest
// } from '@/services/settings.api';

// export const useSettingsLogic = () => {
//   const { toast } = useToast();
//   const { user } = useAuth();

//   // ==========================================
//   // STATE
//   // ==========================================
//   const [organization, setOrganization] = useState<Organization | null>(null);
//   const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
//   const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
//   const [myInvites, setMyInvites] = useState<PendingInvite[]>([]);
//   const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
//   const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
//   const [integrations, setIntegrations] = useState<Integration[]>([]);
//   const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Form states
//   const [inviteAccountId, setInviteAccountId] = useState('');
//   const [inviteEmail, setInviteEmail] = useState('');
//   const [orgForm, setOrgForm] = useState<any>({
//     name: '',
//     billing: {
//       companyName: '',
//       address: '',
//       phone: '',
//       realEstateLicense: '',
//     },
//   });

//   // Modal states
//   const [zillowDialogOpen, setZillowDialogOpen] = useState(false);
//   const [realtorDialogOpen, setRealtorDialogOpen] = useState(false);
//   const [zillowCredentials, setZillowCredentials] = useState<any>({
//     zwsId: '',
//     apiKey: '',
//     settings: { syncProperties: true, syncLeads: true },
//   });
//   const [realtorCredentials, setRealtorCredentials] = useState<any>({
//     apiKey: '',
//     secret: '',
//     settings: { syncProperties: true, autoImport: false },
//   });

//   // ==========================================
//   // PERMISSIONS
//   // ==========================================
//   const isOwner = user?.role === 'owner' && user?.accountType === 'organization';
//   const isAdmin = user?.role === 'admin' && user?.accountType === 'organization';
//   const isOrganizationUser = user?.accountType === 'organization';
//   const isIndividualUser = user?.accountType === 'individual';
//   const canManageTeam = isOwner || isAdmin;
//   const canManageBilling = isOwner;
//   const canManageIntegrations = isOwner || isAdmin;

//   // ==========================================
//   // DATA LOADING
//   // ==========================================
//   const loadAllData = useCallback(async () => {
//     setIsLoading(true);
//     setError(null);

//     try {
//       const promises: Promise<any>[] = [];

//       // Organization users data
//       if (isOrganizationUser) {
//         promises.push(
//           apiService.getOrganization().then((data) => {
//             setOrganization(data.organization);
//             setOrgForm({
//               name: data.organization.name,
//               billing: data.organization.billing,
//             });
//           })
//         );

//         promises.push(apiService.getTeamMembers().then(setTeamMembers));

//         if (canManageTeam) {
//           promises.push(apiService.getPendingInvites().then(setPendingInvites));
//           promises.push(
//             apiService.getPendingLeaveRequests().then((data) => setLeaveRequests(data.requests))
//           );
//         }

//         promises.push(apiService.getBillingInfo().then(setBillingInfo));

//         if (canManageIntegrations) {
//           promises.push(apiService.getIntegrations().then(setIntegrations));
//         }
//       }

//       // Individual users can see their invites
//       if (isIndividualUser) {
//         promises.push(
//           apiService.getMyInvites().then((data) => setMyInvites(data.invites))
//         );
//       }

//       // All users can manage notifications
//       promises.push(apiService.getNotificationSettings().then(setNotificationSettings));

//       await Promise.all(promises);
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.error || err.message || 'Failed to load settings';
//       setError(errorMessage);
//       toast({
//         title: 'Error',
//         description: errorMessage,
//         variant: 'destructive',
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [isOrganizationUser, isIndividualUser, canManageTeam, canManageIntegrations, toast]);

//   useEffect(() => {
//     loadAllData();
//   }, [loadAllData]);

//   // ==========================================
//   // ORGANIZATION ACTIONS
//   // ==========================================
//   const handleUpdateOrganization = useCallback(async () => {
//     if (!isOwner) {
//       toast({
//         title: 'Permission Denied',
//         description: 'Only organization owners can update organization details',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       const updated = await apiService.updateOrganization(orgForm);
//       setOrganization(updated);
//       toast({
//         title: 'Success',
//         description: 'Organization details updated successfully',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [isOwner, orgForm, toast]);

//   const handleDeleteOrganization = useCallback(async () => {
//     if (!isOwner) {
//       toast({
//         title: 'Permission Denied',
//         description: 'Only organization owners can delete the organization',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.deleteOrganization();
//       toast({
//         title: 'Success',
//         description: 'Organization deleted successfully',
//       });
//       // Reload page or redirect to login
//       window.location.href = '/login';
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [isOwner, toast]);

//   // ==========================================
//   // TEAM ACTIONS
//   // ==========================================
//   const handleInviteMember = useCallback(async () => {
//     if (!canManageTeam) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to invite team members',
//         variant: 'destructive',
//       });
//       return;
//     }

//     if (!inviteAccountId || !inviteEmail) {
//       toast({
//         title: 'Validation Error',
//         description: 'Please provide both Account ID and Email',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.inviteMember({
//         accountId: inviteAccountId,
//         email: inviteEmail.toLowerCase().trim(),
//       });

//       toast({
//         title: 'Success',
//         description: `Invitation sent to ${inviteEmail}`,
//       });

//       setInviteAccountId('');
//       setInviteEmail('');

//       // Refresh pending invites
//       const invites = await apiService.getPendingInvites();
//       setPendingInvites(invites);
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageTeam, inviteAccountId, inviteEmail, toast]);

//   const handleRevokeInvite = useCallback(async (inviteId: string) => {
//     if (!canManageTeam) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to revoke invites',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.revokeInvite(inviteId);
//       setPendingInvites((prev) => prev.filter((inv) => inv._id !== inviteId));
//       toast({
//         title: 'Success',
//         description: 'Invitation revoked successfully',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageTeam, toast]);

//   const handleRemoveMember = useCallback(async (memberId: string) => {
//     if (!canManageTeam) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to remove team members',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.removeTeamMember(memberId);
//       setTeamMembers((prev) => prev.filter((member) => member.user._id !== memberId));
//       toast({
//         title: 'Success',
//         description: 'Team member removed successfully',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageTeam, toast]);

//   const handleUpdateRole = useCallback(
//     async (memberId: string, newRole: 'admin' | 'member' | 'agent') => {
//       if (!canManageTeam) {
//         toast({
//           title: 'Permission Denied',
//           description: 'You do not have permission to update roles',
//           variant: 'destructive',
//         });
//         return;
//       }

//       try {
//         await apiService.updateTeamMemberRole(memberId, newRole);
//         setTeamMembers((prev) =>
//           prev.map((member) =>
//             member.user._id === memberId ? { ...member, role: newRole } : member
//           )
//         );
//         toast({
//           title: 'Success',
//           description: 'Team member role updated successfully',
//         });
//       } catch (err: any) {
//         toast({
//           title: 'Error',
//           description: err.response?.data?.error || err.message,
//           variant: 'destructive',
//         });
//       }
//     },
//     [canManageTeam, toast]
//   );

//   // ==========================================
//   // INVITE ACTIONS (Individual Users)
//   // ==========================================
//   const handleAcceptInvite = useCallback(async (inviteId: string) => {
//     try {
//       await apiService.acceptInvite(inviteId);
//       toast({
//         title: 'Success',
//         description: 'Invitation accepted successfully',
//       });
//       // Reload to update user context
//       window.location.reload();
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [toast]);

//   const handleRejectInvite = useCallback(async (inviteId: string) => {
//     try {
//       await apiService.rejectInvite(inviteId);
//       setMyInvites((prev) => prev.filter((inv) => inv._id !== inviteId));
//       toast({
//         title: 'Success',
//         description: 'Invitation rejected',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [toast]);

//   // ==========================================
//   // LEAVE REQUEST ACTIONS
//   // ==========================================
//   const handleRequestLeave = useCallback(async () => {
//     try {
//       await apiService.requestLeave();
//       toast({
//         title: 'Success',
//         description: 'Leave request submitted successfully',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [toast]);

//   const handleApproveLeaveRequest = useCallback(async (requestId: string) => {
//     if (!canManageTeam) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to approve leave requests',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.approveLeaveRequest(requestId);
//       setLeaveRequests((prev) => prev.filter((req) => req._id !== requestId));
//       // Refresh team members
//       const members = await apiService.getTeamMembers();
//       setTeamMembers(members);
//       toast({
//         title: 'Success',
//         description: 'Leave request approved',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageTeam, toast]);

//   const handleRejectLeaveRequest = useCallback(async (requestId: string) => {
//     if (!canManageTeam) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to reject leave requests',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.rejectLeaveRequest(requestId);
//       setLeaveRequests((prev) => prev.filter((req) => req._id !== requestId));
//       toast({
//         title: 'Success',
//         description: 'Leave request rejected',
//       });
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageTeam, toast]);

//   // ==========================================
//   // BILLING ACTIONS
//   // ==========================================
//   const handleUpdateSubscription = useCallback(
//     async (planKey: string) => {
//       if (!canManageBilling) {
//         toast({
//           title: 'Permission Denied',
//           description: 'You do not have permission to manage billing',
//           variant: 'destructive',
//         });
//         return;
//       }

//       try {
//         const result = await apiService.updateSubscription(planKey);

//         if (result.paymentUrl) {
//           window.location.href = result.paymentUrl;
//         } else {
//           toast({
//             title: 'Success',
//             description: 'Subscription updated successfully',
//           });
//           const updatedBilling = await apiService.getBillingInfo();
//           setBillingInfo(updatedBilling);
//         }
//       } catch (err: any) {
//         toast({
//           title: 'Error',
//           description: err.response?.data?.error || err.message,
//           variant: 'destructive',
//         });
//       }
//     },
//     [canManageBilling, toast]
//   );

//   // ==========================================
//   // INTEGRATION ACTIONS
//   // ==========================================
//   const handleConnectZillow = useCallback(async () => {
//     if (!canManageIntegrations) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to manage integrations',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.connectZillow(zillowCredentials);
//       toast({
//         title: 'Success',
//         description: 'Zillow connected successfully',
//       });
//       const updatedIntegrations = await apiService.getIntegrations();
//       setIntegrations(updatedIntegrations);
//       setZillowDialogOpen(false);
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageIntegrations, zillowCredentials, toast]);

//   const handleConnectRealtor = useCallback(async () => {
//     if (!canManageIntegrations) {
//       toast({
//         title: 'Permission Denied',
//         description: 'You do not have permission to manage integrations',
//         variant: 'destructive',
//       });
//       return;
//     }

//     try {
//       await apiService.connectRealtor(realtorCredentials);
//       toast({
//         title: 'Success',
//         description: 'Realtor.com connected successfully',
//       });
//       const updatedIntegrations = await apiService.getIntegrations();
//       setIntegrations(updatedIntegrations);
//       setRealtorDialogOpen(false);
//     } catch (err: any) {
//       toast({
//         title: 'Error',
//         description: err.response?.data?.error || err.message,
//         variant: 'destructive',
//       });
//     }
//   }, [canManageIntegrations, realtorCredentials, toast]);

//   const handleDisconnectIntegration = useCallback(
//     async (type: string) => {
//       if (!canManageIntegrations) {
//         toast({
//           title: 'Permission Denied',
//           description: 'You do not have permission to manage integrations',
//           variant: 'destructive',
//         });
//         return;
//       }

//       try {
//         await apiService.disconnectIntegration(type);
//         toast({
//           title: 'Success',
//           description: 'Integration disconnected successfully',
//         });
//         const updatedIntegrations = await apiService.getIntegrations();
//         setIntegrations(updatedIntegrations);
//       } catch (err: any) {
//         toast({
//           title: 'Error',
//           description: err.response?.data?.error || err.message,
//           variant: 'destructive',
//         });
//       }
//     },
//     [canManageIntegrations, toast]
//   );

//   const handleSyncIntegration = useCallback(
//     async (type: string) => {
//       if (!canManageIntegrations) {
//         toast({
//           title: 'Permission Denied',
//           description: 'You do not have permission to sync integrations',
//           variant: 'destructive',
//         });
//         return;
//       }

//       try {
//         await apiService.syncIntegration(type);
//         toast({
//           title: 'Success',
//           description: 'Integration synced successfully',
//         });
//         const updatedIntegrations = await apiService.getIntegrations();
//         setIntegrations(updatedIntegrations);
//       } catch (err: any) {
//         toast({
//           title: 'Error',
//           description: err.response?.data?.error || err.message,
//           variant: 'destructive',
//         });
//       }
//     },
//     [canManageIntegrations, toast]
//   );

//   // ==========================================
//   // NOTIFICATION ACTIONS
//   // ==========================================
//   const handleUpdateNotificationSettings = useCallback(
//     async (category: string, settings: Record<string, boolean>) => {
//       try {
//         const updated = await apiService.updateNotificationSettings({
//           [category]: settings,
//         });
//         setNotificationSettings(updated);
//         toast({
//           title: 'Success',
//           description: 'Notification preferences updated',
//         });
//       } catch (err: any) {
//         toast({
//           title: 'Error',
//           description: err.response?.data?.error || err.message,
//           variant: 'destructive',
//         });
//       }
//     },
//     [toast]
//   );

//   // ==========================================
//   // UTILITY FUNCTIONS
//   // ==========================================
//   const getInitials = useCallback((firstName: string, lastName: string) => {
//     return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
//   }, []);

//   // ==========================================
//   // RETURN
//   // ==========================================
//   return {
//     // Data
//     organization,
//     teamMembers,
//     pendingInvites,
//     myInvites,
//     leaveRequests,
//     billingInfo,
//     integrations,
//     notificationSettings,
//     isLoading,
//     error,

//     // Permissions
//     isOwner,
//     isAdmin,
//     isOrganizationUser,
//     isIndividualUser,
//     canManageTeam,
//     canManageBilling,
//     canManageIntegrations,

//     // Form states
//     inviteAccountId,
//     setInviteAccountId,
//     inviteEmail,
//     setInviteEmail,
//     orgForm,
//     setOrgForm,
//     zillowDialogOpen,
//     setZillowDialogOpen,
//     realtorDialogOpen,
//     setRealtorDialogOpen,
//     zillowCredentials,
//     setZillowCredentials,
//     realtorCredentials,
//     setRealtorCredentials,

//     // Actions
//     loadAllData,
//     handleUpdateOrganization,
//     handleDeleteOrganization,
//     handleInviteMember,
//     handleRevokeInvite,
//     handleRemoveMember,
//     handleUpdateRole,
//     handleAcceptInvite,
//     handleRejectInvite,
//     handleRequestLeave,
//     handleApproveLeaveRequest,
//     handleRejectLeaveRequest,
//     handleUpdateSubscription,
//     handleConnectZillow,
//     handleConnectRealtor,
//     handleDisconnectIntegration,
//     handleSyncIntegration,
//     handleUpdateNotificationSettings,
//     getInitials,
//   };
// };
// src/Logics/useSettingsLogic.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  apiService,
  Organization,
  TeamMember,
  PendingInvite,
  BillingInfo,
  Integration,
  NotificationSettings,
  LeaveRequest,
  Notification,
  DeletionRequest,
  DeletionStatus,
} from '@/services/settings.api';

export const useSettingsLogic = () => {
  const { toast } = useToast();
  const { user, refresh: refreshAuth } = useAuth();

  // ── Data State ───────────────────────────────────────────────────────────
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [myInvites, setMyInvites] = useState<PendingInvite[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [billingInfo, setBillingInfo] = useState<BillingInfo | null>(null);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [deletionStatus, setDeletionStatus] = useState<DeletionStatus | null>(null);
  const [pendingDeletionRequests, setPendingDeletionRequests] = useState<DeletionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Form State ───────────────────────────────────────────────────────────
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: (user as any)?.email || '',
    phone: (user as any)?.phone || '',
    accountId: (user as any)?.accountId || '',
    avatar: (user as any)?.avatar || '',
  });
  const [inviteAccountId, setInviteAccountId] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [orgForm, setOrgForm] = useState<any>({
    name: '',
    billing: { companyName: '', address: '', phone: '', realEstateLicense: '' },
  });

  // ── Modal State ──────────────────────────────────────────────────────────
  const [zillowDialogOpen, setZillowDialogOpen] = useState(false);
  const [realtorDialogOpen, setRealtorDialogOpen] = useState(false);
  const [zillowCredentials, setZillowCredentials] = useState<any>({
    zwsId: '', apiKey: '',
    settings: { syncProperties: true, syncLeads: true },
  });
  const [realtorCredentials, setRealtorCredentials] = useState<any>({
    apiKey: '', secret: '',
    settings: { syncProperties: true, autoImport: false },
  });

  // ── Permissions ──────────────────────────────────────────────────────────
  const isOwner = user?.role === 'owner' && user?.accountType === 'organization';
  const isAdmin = user?.role === 'admin' && user?.accountType === 'organization';
  const isOrganizationUser = user?.accountType === 'organization';
  const isIndividualUser = user?.accountType === 'individual';
  const canManageTeam = isOwner || isAdmin;
  const canManageBilling = isOwner;
  const canManageIntegrations = isOwner || isAdmin;

  // Sync profile form when user changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: (user as any).email || '',
        phone: (user as any).phone || '',
        accountId: (user as any).accountId || '',
        avatar: (user as any).avatar || '',
      });
    }
  }, [user]);

  // ── Load All Data ────────────────────────────────────────────────────────
  const loadAllData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);

    try {
      const promises: Promise<any>[] = [];

      // Load profile (all users)
      promises.push(
        apiService.getMyProfile()
          .then((profile) => {
            setProfileForm({
              firstName: profile.firstName || '',
              lastName: profile.lastName || '',
              email: profile.email || '',
              phone: (profile as any).phone || '',
              accountId: profile.accountId || '',
              avatar: profile.avatar || '',
            });
          })
          .catch(() => {}) // non-fatal if profile not available
      );

      if (isOrganizationUser || user?.workingUnderOrganization) {
        // Load org info for owners/admins or members of an org
        promises.push(
          apiService.getOrganization().then((data) => {
            setOrganization(data.organization);
            setOrgForm({
              name: data.organization.name || '',
              billing: {
                companyName: data.organization.billing?.companyName || '',
                address: data.organization.billing?.address || '',
                phone: data.organization.billing?.phone || '',
                realEstateLicense: data.organization.billing?.realEstateLicense || '',
              },
            });
          }).catch(() => {}) // non-fatal if billing not configured
        );

        promises.push(apiService.getTeamMembers().then(setTeamMembers).catch(() => {}));

        if (canManageTeam) {
          promises.push(apiService.getPendingInvites().then(setPendingInvites).catch(() => {}));
          promises.push(
            apiService.getPendingLeaveRequests()
              .then((data) => setLeaveRequests(data.requests || []))
              .catch(() => {})
          );
          if (isOwner) {
            promises.push(
              apiService.getPendingDeletionRequests()
                .then((requests) => setPendingDeletionRequests(requests || []))
                .catch(() => {})
            );
          }
        }

        if (isOrganizationUser) {
          promises.push(apiService.getBillingInfo().then(setBillingInfo).catch(() => {}));

          if (canManageIntegrations) {
            promises.push(apiService.getIntegrations().then(setIntegrations).catch(() => {}));
          }
        }
      }

      if (isIndividualUser) {
        promises.push(
          apiService.getMyInvites()
            .then((data) => setMyInvites(data.invites || []))
            .catch(() => {})
        );
      }

      // All users get notifications (settings) and notification history
      promises.push(
        apiService.getNotificationSettings().then(setNotificationSettings).catch(() => {})
      );

      // Load notification history for all authenticated users
      promises.push(
        apiService.getNotifications()
          .then((data) => {
            setNotifications(data.notifications || []);
            setUnreadCount(data.unreadCount || 0);
          })
          .catch(() => {})
      );

      await Promise.allSettled(promises);
    } catch (err: any) {
      const msg = err?.response?.data?.error || err?.message || 'Failed to load settings';
      setError(msg);
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [user, isOrganizationUser, isIndividualUser, canManageTeam, canManageIntegrations, toast]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  // ── Profile Actions ──────────────────────────────────────────────────────
  const handleUpdateProfile = useCallback(async () => {
    try {
      await apiService.updateMyProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        avatar: profileForm.avatar,
      });
      toast({ title: 'Success', description: 'Profile updated successfully' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [profileForm, toast]);

  // ── Organization Actions ─────────────────────────────────────────────────
  const handleUpdateOrganization = useCallback(async () => {
    if (!isOwner) {
      toast({ title: 'Permission Denied', description: 'Only owners can update organization', variant: 'destructive' });
      return;
    }
    try {
      const updated = await apiService.updateOrganization(orgForm);
      setOrganization(updated);
      toast({ title: 'Success', description: 'Organization updated successfully' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [isOwner, orgForm, toast]);

  const handleDeleteOrganization = useCallback(async () => {
    if (!isOwner) return;
    try {
      await apiService.deleteOrganization();
      toast({ title: 'Success', description: 'Organization deleted' });
      window.location.href = '/login';
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [isOwner, toast]);

  const handleUpgradeToOrganization = useCallback(async () => {
    if (!isIndividualUser) {
      toast({
        title: 'Permission Denied',
        description: 'Only individual accounts can upgrade to an organization.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await apiService.upgradeToOrganization();
      await refreshAuth();
      toast({
        title: 'Success',
        description: 'Your account has been upgraded to an organization.',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err?.response?.data?.error || err?.message || 'Failed to upgrade account',
        variant: 'destructive',
      });
      throw err;
    }
  }, [isIndividualUser, refreshAuth, toast]);

  // ── Team Actions ─────────────────────────────────────────────────────────
  const handleInviteMember = useCallback(async () => {
    if (!canManageTeam) {
      toast({ title: 'Permission Denied', description: 'You cannot invite members', variant: 'destructive' });
      return;
    }
    if (!inviteAccountId || !inviteEmail) {
      toast({ title: 'Validation Error', description: 'Account ID and email are required', variant: 'destructive' });
      return;
    }
    try {
      await apiService.inviteMember({ accountId: inviteAccountId, email: inviteEmail.toLowerCase().trim() });
      toast({ title: 'Success', description: `Invitation sent to ${inviteEmail}` });
      setInviteAccountId('');
      setInviteEmail('');
      const invites = await apiService.getPendingInvites();
      setPendingInvites(invites);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [canManageTeam, inviteAccountId, inviteEmail, toast]);

  const handleRevokeInvite = useCallback(async (inviteId: string) => {
    try {
      await apiService.revokeInvite(inviteId);
      setPendingInvites((prev) => prev.filter((inv) => inv._id !== inviteId));
      toast({ title: 'Success', description: 'Invitation revoked' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    try {
      await apiService.removeTeamMember(memberId);
      setTeamMembers((prev) => prev.filter((m) => m.user._id !== memberId));
      toast({ title: 'Success', description: 'Member removed' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleUpdateRole = useCallback(async (memberId: string, newRole: 'admin' | 'member' | 'agent') => {
    try {
      await apiService.updateTeamMemberRole(memberId, newRole);
      setTeamMembers((prev) =>
        prev.map((m) => (m.user._id === memberId ? { ...m, role: newRole } : m))
      );
      toast({ title: 'Success', description: 'Role updated' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  // ── Invite Actions (Individual) ──────────────────────────────────────────
  const handleAcceptInvite = useCallback(async (inviteId: string) => {
    try {
      await apiService.acceptInvite(inviteId);
      toast({ title: 'Success', description: 'Invitation accepted! Refreshing...' });
      setTimeout(() => window.location.reload(), 1200);
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleRejectInvite = useCallback(async (inviteId: string) => {
    try {
      await apiService.rejectInvite(inviteId);
      setMyInvites((prev) => prev.filter((inv) => inv._id !== inviteId));
      toast({ title: 'Success', description: 'Invitation declined' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  // ── Leave Request Actions ────────────────────────────────────────────────
  const handleRequestLeave = useCallback(async () => {
    try {
      await apiService.requestLeave();
      toast({ title: 'Success', description: 'Leave request submitted. Waiting for approval.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleApproveLeaveRequest = useCallback(async (requestId: string) => {
    try {
      await apiService.approveLeaveRequest(requestId);
      setLeaveRequests((prev) => prev.filter((r) => r._id !== requestId));
      const members = await apiService.getTeamMembers();
      setTeamMembers(members);
      toast({ title: 'Success', description: 'Leave request approved' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleRejectLeaveRequest = useCallback(async (requestId: string, reason?: string) => {
    try {
      await apiService.rejectLeaveRequest(requestId, reason);
      setLeaveRequests((prev) => prev.filter((r) => r._id !== requestId));
      toast({ title: 'Success', description: 'Leave request rejected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  // ── Billing Actions ──────────────────────────────────────────────────────
  const handleUpdateSubscription = useCallback(async (planKey: string) => {
    if (!canManageBilling) {
      toast({ title: 'Permission Denied', description: 'Only owners can manage billing', variant: 'destructive' });
      return;
    }
    try {
      const result = await apiService.updateSubscription(planKey);
      if (result.paymentUrl) {
        window.location.href = result.paymentUrl;
      } else {
        const updated = await apiService.getBillingInfo();
        setBillingInfo(updated);
        toast({ title: 'Success', description: 'Subscription updated' });
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [canManageBilling, toast]);

  // ── Integration Actions ──────────────────────────────────────────────────
  const handleConnectZillow = useCallback(async () => {
    try {
      await apiService.connectZillow(zillowCredentials);
      const updated = await apiService.getIntegrations();
      setIntegrations(updated);
      setZillowDialogOpen(false);
      toast({ title: 'Success', description: 'Zillow connected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [zillowCredentials, toast]);

  const handleConnectRealtor = useCallback(async () => {
    try {
      await apiService.connectRealtor(realtorCredentials);
      const updated = await apiService.getIntegrations();
      setIntegrations(updated);
      setRealtorDialogOpen(false);
      toast({ title: 'Success', description: 'Realtor.com connected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [realtorCredentials, toast]);

  const handleDisconnectIntegration = useCallback(async (type: string) => {
    try {
      await apiService.disconnectIntegration(type);
      const updated = await apiService.getIntegrations();
      setIntegrations(updated);
      toast({ title: 'Success', description: 'Integration disconnected' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  const handleSyncIntegration = useCallback(async (type: string) => {
    try {
      await apiService.syncIntegration(type);
      const updated = await apiService.getIntegrations();
      setIntegrations(updated);
      toast({ title: 'Success', description: 'Sync complete' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
    }
  }, [toast]);

  // ── Notification Actions ─────────────────────────────────────────────────
  const handleUpdateNotificationSettings = useCallback(
    async (category: string, settings: Record<string, boolean>) => {
      try {
        const updated = await apiService.updateNotificationSettings({ [category]: settings });
        setNotificationSettings(updated);
        toast({ title: 'Success', description: 'Notification preferences saved' });
      } catch (err: any) {
        toast({ title: 'Error', description: err?.response?.data?.error || err?.message, variant: 'destructive' });
      }
    },
    [toast]
  );

  const handleMarkNotificationAsRead = useCallback(async (notificationId: string) => {
    try {
      await apiService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err: any) {
      console.error('Failed to mark notification as read:', err);
    }
  }, []);

  const handleMarkAllNotificationsAsRead = useCallback(async () => {
    try {
      await apiService.markAllNotificationsAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Failed to mark all notifications as read:', err);
    }
  }, []);

  // ── Account Deletion ──────────────────────────────────────────────────────
  const handleRequestAccountDeletion = useCallback(async (reason?: string) => {
    try {
      const response = await apiService.requestAccountDeletion({ reason });
      toast({
        title: 'Success',
        description:
          response.type === 'individual'
            ? 'Your account is being deleted. Redirecting...'
            : 'Deletion request sent to organization owner for approval',
      });
      if (response.type === 'individual') {
        setTimeout(() => (window.location.href = '/login'), 2000);
      } else {
        // Refresh deletion status
        await handleCheckDeletionStatus();
      }
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to request account deletion',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleCheckDeletionStatus = useCallback(async () => {
    try {
      const status = await apiService.getAccountDeletionStatus();
      setDeletionStatus(status);
    } catch (err: any) {
      console.error('Failed to check deletion status:', err);
    }
  }, []);

  const handleCancelAccountDeletion = useCallback(async (requestId: string) => {
    try {
      await apiService.cancelAccountDeletionRequest(requestId);
      toast({
        title: 'Success',
        description: 'Account deletion request cancelled',
      });
      setDeletionStatus(null);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to cancel deletion request',
        variant: 'destructive',
      });
    }
  }, [toast]);

  const handleGetPendingDeletionRequests = useCallback(async () => {
    if (!isOwner) {
      toast({
        title: 'Permission Denied',
        description: 'Only organization owners can view deletion requests',
        variant: 'destructive',
      });
      return;
    }

    try {
      const requests = await apiService.getPendingDeletionRequests();
      setPendingDeletionRequests(requests);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Failed to load deletion requests',
        variant: 'destructive',
      });
    }
  }, [isOwner, toast]);

  const handleApproveDeletion = useCallback(
    async (requestId: string) => {
      if (!isOwner) {
        toast({
          title: 'Permission Denied',
          description: 'Only organization owners can approve deletions',
          variant: 'destructive',
        });
        return;
      }

      try {
        await apiService.approveDeletionRequest(requestId);
        toast({
          title: 'Success',
          description: 'Account deletion request approved',
        });
        setPendingDeletionRequests((prev) => prev.filter((r) => r._id !== requestId));
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Failed to approve deletion',
          variant: 'destructive',
        });
      }
    },
    [isOwner, toast]
  );

  const handleRejectDeletion = useCallback(
    async (requestId: string, reason?: string) => {
      if (!isOwner) {
        toast({
          title: 'Permission Denied',
          description: 'Only organization owners can reject deletions',
          variant: 'destructive',
        });
        return;
      }

      try {
        await apiService.rejectDeletionRequest(requestId, reason);
        toast({
          title: 'Success',
          description: 'Account deletion request rejected',
        });
        setPendingDeletionRequests((prev) => prev.filter((r) => r._id !== requestId));
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.response?.data?.message || 'Failed to reject deletion',
          variant: 'destructive',
        });
      }
    },
    [isOwner, toast]
  );

  // ── Utility ──────────────────────────────────────────────────────────────
  const getInitials = useCallback((firstName: string, lastName: string) =>
    `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase(), []);

  return {
    // User Data
    user,
    
    // Data
    organization, teamMembers, pendingInvites, myInvites, leaveRequests,
    billingInfo, integrations, notificationSettings, notifications, unreadCount, isLoading, error,

    // Permissions
    isOwner, isAdmin, isOrganizationUser, isIndividualUser,
    canManageTeam, canManageBilling, canManageIntegrations,

    // Forms
    profileForm, setProfileForm,
    inviteAccountId, setInviteAccountId,
    inviteEmail, setInviteEmail,
    orgForm, setOrgForm,
    zillowDialogOpen, setZillowDialogOpen,
    realtorDialogOpen, setRealtorDialogOpen,
    zillowCredentials, setZillowCredentials,
    realtorCredentials, setRealtorCredentials,

    // Actions
    loadAllData,
    handleUpdateProfile,
    handleUpdateOrganization,
    handleDeleteOrganization,
    handleUpgradeToOrganization,
    handleInviteMember,
    handleRevokeInvite,
    handleRemoveMember,
    handleUpdateRole,
    handleAcceptInvite,
    handleRejectInvite,
    handleRequestLeave,
    handleApproveLeaveRequest,
    handleRejectLeaveRequest,
    handleUpdateSubscription,
    handleConnectZillow,
    handleConnectRealtor,
    handleDisconnectIntegration,
    handleSyncIntegration,
    handleUpdateNotificationSettings,
    handleMarkNotificationAsRead,
    handleMarkAllNotificationsAsRead,
    getInitials,
    // Account deletion
    deletionStatus,
    pendingDeletionRequests,
    handleRequestAccountDeletion,
    handleCheckDeletionStatus,
    handleCancelAccountDeletion,
    handleGetPendingDeletionRequests,
    handleApproveDeletion,
    handleRejectDeletion,
  };
};
