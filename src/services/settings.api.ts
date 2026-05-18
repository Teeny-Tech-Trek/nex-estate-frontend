// // src/services/settings.api.ts
// import api from './api';

// // ==========================================
// // TYPES
// // ==========================================

// export interface User {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   avatar?: string;
//   role: 'owner' | 'admin' | 'member' | 'agent' | 'individual';
//   accountType: 'individual' | 'organization';
//   accountId: string;
//   createdAt: string;
// }

// export interface Organization {
//   _id: string;
//   name: string;
//   owner: User;
//   members: TeamMember[];
//   plan: {
//     name: 'free' | 'pro' | 'enterprise';
//     seats: number;
//     agentsLimit: number;
//     propertiesLimit: number;
//     price: number;
//     status: 'active' | 'canceled' | 'past_due';
//   };
//   billing: {
//     companyName?: string;
//     address?: string;
//     phone?: string;
//     realEstateLicense?: string;
//   };
//   isActive: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface TeamMember {
//   _id: string;
//   user: User;
//   role: 'owner' | 'admin' | 'member' | 'agent';
//   joinedAt: string;
// }

// export interface PendingInvite {
//   _id: string;
//   organization: string;
//   invitedBy: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//   };
//   invitedUser: string;
//   email: string;
//   accountId: string;
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: string;
//   expiresAt?: string;
// }

// export interface BillingInfo {
//   plan: {
//     name: 'free' | 'pro' | 'enterprise';
//     seats: number;
//     agentsLimit: number;
//     propertiesLimit: number;
//     price: number;
//   };
//   usage: {
//     agents: {
//       used: number;
//       limit: number;
//       percent: number;
//     };
//     members: {
//       used: number;
//       limit: number;
//       percent: number;
//     };
//   };
//   pricingTiers: {
//     free: PricingTier;
//     pro: PricingTier;
//     enterprise: PricingTier;
//   };
// }

// export interface PricingTier {
//   name: string;
//   seats: number;
//   agentsLimit: number;
//   propertiesLimit: number;
//   price: number;
// }

// export interface Integration {
//   type: string;
//   name: string;
//   icon: string;
//   status: 'connected' | 'disconnected';
//   lastSync?: string;
//   config?: any;
// }

// export interface NotificationSettings {
//   emailNotifications: {
//     newLeads: boolean;
//     propertyShowings: boolean;
//     offerUpdates: boolean;
//     dailyPerformance: boolean;
//     marketTrends: boolean;
//     systemUpdates: boolean;
//   };
//   pushNotifications: {
//     urgentAlerts: boolean;
//     newLeads: boolean;
//     bookingReminders: boolean;
//   };
//   smsNotifications: {
//     urgentAlerts: boolean;
//     showingReminders: boolean;
//     offerDeadlines: boolean;
//   };
// }

// export interface LeaveRequest {
//   _id: string;
//   organization: string;
//   user: {
//     _id: string;
//     firstName: string;
//     lastName: string;
//     email: string;
//     accountId: string;
//     role: string;
//   };
//   status: 'pending' | 'approved' | 'rejected';
//   reviewedBy?: string;
//   reviewedAt?: string;
//   createdAt: string;
// }

// // ==========================================
// // API SERVICE
// // ==========================================

// class SettingsApiService {
//   // ========================================
//   // PROFILE ENDPOINTS
//   // ========================================
//   async getMyProfile(): Promise<User> {
//     const response = await api.get('/settings/profile');
//     return response.data;
//   }

//   async updateMyProfile(data: {
//     firstName: string;
//     lastName: string;
//     avatar?: string;
//   }): Promise<User> {
//     const response = await api.put('/settings/profile', data);
//     return response.data;
//   }

//   // ========================================
//   // ORGANIZATION ENDPOINTS
//   // ========================================
//   async getOrganization(): Promise<{ organization: Organization; usage: any }> {
//     const response = await api.get('/settings/organization');
//     return response.data;
//   }

//   async updateOrganization(data: {
//     name: string;
//     billing: {
//       companyName?: string;
//       address?: string;
//       phone?: string;
//       realEstateLicense?: string;
//     };
//   }): Promise<Organization> {
//     const response = await api.put('/settings/organization', data);
//     return response.data;
//   }

//   async deleteOrganization(): Promise<{ message: string }> {
//     const response = await api.delete('/organizations/delete');
//     return response.data;
//   }

//   // ========================================
//   // TEAM MANAGEMENT ENDPOINTS
//   // ========================================
//   async getTeamMembers(): Promise<TeamMember[]> {
//     const response = await api.get('/settings/organization/team');
//     return response.data;
//   }

//   async removeTeamMember(memberId: string): Promise<{ message: string }> {
//     const response = await api.delete(`/settings/organization/team/${memberId}`);
//     return response.data;
//   }

//   async updateTeamMemberRole(
//     memberId: string,
//     role: 'admin' | 'member' | 'agent'
//   ): Promise<{ message: string }> {
//     const response = await api.patch(`/settings/organization/team/${memberId}`, { role });
//     return response.data;
//   }

//   // ========================================
//   // INVITE ENDPOINTS
//   // ========================================
//   async getPendingInvites(): Promise<PendingInvite[]> {
//     const response = await api.get('/settings/organization/invites');
//     return response.data;
//   }

//   async inviteMember(data: {
//     accountId: string;
//     email: string;
//   }): Promise<{ message: string; inviteId: string }> {
//     const response = await api.post('/invites/create', data);
//     return response.data;
//   }

//   async revokeInvite(inviteId: string): Promise<{ message: string }> {
//     const response = await api.delete(`/settings/organization/invites/${inviteId}`);
//     return response.data;
//   }

//   async getMyInvites(): Promise<{ invites: PendingInvite[] }> {
//     const response = await api.get('/invites/my');
//     return response.data;
//   }

//   async acceptInvite(inviteId: string): Promise<{ message: string }> {
//     const response = await api.post(`/invites/${inviteId}/accept`);
//     return response.data;
//   }

//   async rejectInvite(inviteId: string): Promise<{ message: string }> {
//     const response = await api.post(`/invites/${inviteId}/reject`);
//     return response.data;
//   }

//   // ========================================
//   // LEAVE REQUEST ENDPOINTS
//   // ========================================
//   async requestLeave(): Promise<{ message: string }> {
//     const response = await api.post('/leaves/request');
//     return response.data;
//   }

//   async getPendingLeaveRequests(): Promise<{ requests: LeaveRequest[] }> {
//     const response = await api.get('/organizations/leave-requests');
//     return response.data;
//   }

//   async approveLeaveRequest(requestId: string): Promise<{ message: string }> {
//     const response = await api.post(`/leaves/${requestId}/approve`);
//     return response.data;
//   }

//   async rejectLeaveRequest(requestId: string): Promise<{ message: string }> {
//     const response = await api.post(`/leaves/${requestId}/reject`);
//     return response.data;
//   }

//   // ========================================
//   // BILLING ENDPOINTS
//   // ========================================
//   async getBillingInfo(): Promise<BillingInfo> {
//     const response = await api.get('/settings/billing');
//     return response.data;
//   }

//   async updateSubscription(planKey: string): Promise<{
//     message: string;
//     paymentUrl?: string;
//   }> {
//     const response = await api.post('/settings/billing/subscribe', { plan: planKey });
//     return response.data;
//   }

//   async getInvoices(): Promise<any[]> {
//     const response = await api.get('/settings/billing/invoices');
//     return response.data;
//   }

//   // ========================================
//   // INTEGRATION ENDPOINTS
//   // ========================================
//   async getIntegrations(): Promise<Integration[]> {
//     const response = await api.get('/settings/integrations');
//     return response.data;
//   }

//   async connectZillow(credentials: {
//     zwsId: string;
//     apiKey: string;
//     settings: { syncProperties: boolean; syncLeads: boolean };
//   }): Promise<{ message: string }> {
//     const response = await api.post('/settings/integrations/zillow', credentials);
//     return response.data;
//   }

//   async connectRealtor(credentials: {
//     apiKey: string;
//     secret: string;
//     settings: { syncProperties: boolean; autoImport: boolean };
//   }): Promise<{ message: string }> {
//     const response = await api.post('/settings/integrations/realtor', credentials);
//     return response.data;
//   }

//   async disconnectIntegration(type: string): Promise<{ message: string }> {
//     const response = await api.delete(`/settings/integrations/${type}`);
//     return response.data;
//   }

//   async syncIntegration(type: string): Promise<{ message: string }> {
//     const response = await api.post(`/settings/integrations/${type}/sync`);
//     return response.data;
//   }

//   // ========================================
//   // NOTIFICATION ENDPOINTS
//   // ========================================
//   async getNotificationSettings(): Promise<NotificationSettings> {
//     const response = await api.get('/settings/user/notifications');
//     return response.data;
//   }

//   async updateNotificationSettings(
//     settings: Partial<NotificationSettings>
//   ): Promise<NotificationSettings> {
//     const response = await api.put('/settings/user/notifications', settings);
//     return response.data;
//   }
// }

// export const apiService = new SettingsApiService();
// src/services/settings.api.ts
import api from './api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'member' | 'agent' | 'individual';
  accountType: 'individual' | 'organization';
  accountId: string;
  createdAt: string;
}

export interface Organization {
  _id: string;
  name: string;
  owner: User;
  members: TeamMember[];
  plan: {
    name: 'free' | 'pro' | 'enterprise';
    seats: number;
    agentsLimit: number;
    propertiesLimit: number;
    price: number;
    status: 'active' | 'canceled' | 'past_due';
  };
  billing: {
    companyName?: string;
    address?: string;
    phone?: string;
    realEstateLicense?: string;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
  user: User;
  role: 'owner' | 'admin' | 'member' | 'agent';
  joinedAt: string;
}

export interface PendingInvite {
  _id: string;
  organization: string;
  invitedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  invitedUser: string;
  email: string;
  accountId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  expiresAt?: string;
}

export interface BillingInfo {
  plan: {
    name: 'free' | 'pro' | 'enterprise';
    seats: number;
    agentsLimit: number;
    propertiesLimit: number;
    price: number;
  };
  usage: {
    agents: { used: number; limit: number; percent: number };
    members: { used: number; limit: number; percent: number };
  };
  pricingTiers: {
    free: PricingTier;
    pro: PricingTier;
    enterprise: PricingTier;
  };
}

export interface PricingTier {
  name: string;
  seats: number;
  agentsLimit: number;
  propertiesLimit: number;
  price: number;
}

export interface Integration {
  type: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected';
  lastSync?: string;
  config?: any;
}

export interface NotificationSettings {
  emailNotifications: {
    newLeads: boolean;
    propertyShowings: boolean;
    offerUpdates: boolean;
    dailyPerformance: boolean;
    marketTrends: boolean;
    systemUpdates: boolean;
  };
  pushNotifications: {
    urgentAlerts: boolean;
    newLeads: boolean;
    bookingReminders: boolean;
  };
  smsNotifications: {
    urgentAlerts: boolean;
    showingReminders: boolean;
    offerDeadlines: boolean;
  };
}

export interface Notification {
  _id: string;
  user: User;
  organization?: Organization;
  type:
    | 'invite_sent'
    | 'invite_accepted'
    | 'leave_requested'
    | 'leave_approved'
    | 'leave_rejected'
    | 'account_deletion_requested'
    | 'account_deletion_approved'
    | 'account_deletion_rejected'
    | 'account_deletion_cancelled';
  title: string;
  message: string;
  relatedId?: string;
  relatedModel?: 'Invite' | 'LeaveRequest' | 'User' | 'Organization';
  read: boolean;
  createdAt: string;
}

export interface LeaveRequest {
  _id: string;
  organization: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accountId: string;
    role: string;
  };
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
}

export interface DeletionRequest {
  _id: string;
  user: User;
  status: 'pending' | 'approved' | 'rejected' | 'deleted';
  reason?: string;
  requestedAt: string;
  expiresAt?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface DeletionStatus {
  hasPendingRequest: boolean;
  requestId?: string;
  status?: string;
  createdAt?: string;
  expiresAt?: string;
}

// ─── API Service ──────────────────────────────────────────────────────────────

class SettingsApiService {

  // ── Profile ──────────────────────────────────────────────────────────────
  async getMyProfile(): Promise<User> {
    const res = await api.get('/settings/profile');
    return res.data;
  }

  async updateMyProfile(data: { firstName: string; lastName: string; avatar?: string }): Promise<User> {
    const res = await api.put('/settings/profile', data);
    return res.data;
  }

  async upgradeToOrganization(): Promise<{ message: string; organization: Organization }> {
    const res = await api.post('/account/upgrade-to-organization');
    return res.data;
  }

  // ── Organization ─────────────────────────────────────────────────────────
  async getOrganization(): Promise<{ organization: Organization; usage: any }> {
    const res = await api.get('/settings/organization');
    return res.data;
  }

  async updateOrganization(data: {
    name: string;
    billing: { companyName?: string; address?: string; phone?: string; realEstateLicense?: string };
  }): Promise<Organization> {
    const res = await api.put('/settings/organization', data);
    return res.data;
  }

  async deleteOrganization(): Promise<{ message: string }> {
    const res = await api.delete('/organizations/delete');
    return res.data;
  }

  // ── Team Management ───────────────────────────────────────────────────────
  async getTeamMembers(): Promise<TeamMember[]> {
    const res = await api.get('/settings/organization/team');
    return res.data;
  }

  async removeTeamMember(memberId: string): Promise<{ message: string }> {
    const res = await api.delete(`/settings/organization/team/${memberId}`);
    return res.data;
  }

  async updateTeamMemberRole(memberId: string, role: 'admin' | 'member' | 'agent'): Promise<{ message: string }> {
    const res = await api.patch(`/settings/organization/team/${memberId}`, { role });
    return res.data;
  }

  // ── Invites (Owner sends) ─────────────────────────────────────────────────
  async getPendingInvites(): Promise<PendingInvite[]> {
    const res = await api.get('/settings/organization/invites');
    return res.data;
  }

  async inviteMember(data: { accountId: string; email: string }): Promise<{ message: string; inviteId: string }> {
    const res = await api.post('/invites/create', data);
    return res.data;
  }

  async revokeInvite(inviteId: string): Promise<{ message: string }> {
    const res = await api.delete(`/settings/organization/invites/${inviteId}`);
    return res.data;
  }

  // ── Invites (Individual receives) ─────────────────────────────────────────
  async getMyInvites(): Promise<{ invites: PendingInvite[] }> {
    const res = await api.get('/invites/my');
    return res.data;
  }

  async acceptInvite(inviteId: string): Promise<{ message: string }> {
    const res = await api.post(`/invites/${inviteId}/accept`);
    return res.data;
  }

  async rejectInvite(inviteId: string): Promise<{ message: string }> {
    const res = await api.post(`/invites/${inviteId}/reject`);
    return res.data;
  }

  // ── Leave Requests ────────────────────────────────────────────────────────
  async requestLeave(): Promise<{ message: string }> {
    const res = await api.post('/leaves/request');
    return res.data;
  }

  async getPendingLeaveRequests(): Promise<{ requests: LeaveRequest[] }> {
    const res = await api.get('/organizations/leave-requests');
    return res.data;
  }

  async approveLeaveRequest(requestId: string): Promise<{ message: string }> {
    const res = await api.post(`/leaves/${requestId}/approve`);
    return res.data;
  }

  async rejectLeaveRequest(requestId: string, reason?: string): Promise<{ message: string }> {
    const payload = reason?.trim() ? { reason: reason.trim() } : {};
    const res = await api.post(`/leaves/${requestId}/reject`, payload);
    return res.data;
  }

  // ── Billing ───────────────────────────────────────────────────────────────
  async getBillingInfo(): Promise<BillingInfo> {
    const res = await api.get('/settings/billing');
    return res.data;
  }

  async updateSubscription(planKey: string): Promise<{ message: string; paymentUrl?: string }> {
    const res = await api.post('/settings/billing/subscribe', { plan: planKey });
    return res.data;
  }

  async getInvoices(): Promise<any[]> {
    const res = await api.get('/settings/billing/invoices');
    return res.data;
  }

  // ── Integrations ──────────────────────────────────────────────────────────
  async getIntegrations(): Promise<Integration[]> {
    const res = await api.get('/settings/integrations');
    return res.data;
  }

  async connectZillow(credentials: {
    zwsId: string;
    apiKey: string;
    settings: { syncProperties: boolean; syncLeads: boolean };
  }): Promise<{ message: string }> {
    const res = await api.post('/settings/integrations/zillow', credentials);
    return res.data;
  }

  async connectRealtor(credentials: {
    apiKey: string;
    secret: string;
    settings: { syncProperties: boolean; autoImport: boolean };
  }): Promise<{ message: string }> {
    const res = await api.post('/settings/integrations/realtor', credentials);
    return res.data;
  }

  async disconnectIntegration(type: string): Promise<{ message: string }> {
    const res = await api.delete(`/settings/integrations/${type}`);
    return res.data;
  }

  async syncIntegration(type: string): Promise<{ message: string }> {
    const res = await api.post(`/settings/integrations/${type}/sync`);
    return res.data;
  }

  // ── Notifications ─────────────────────────────────────────────────────────
  async getNotificationSettings(): Promise<NotificationSettings> {
    const res = await api.get('/settings/user/notifications');
    return res.data;
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    const res = await api.put('/settings/user/notifications', settings);
    return res.data;
  }

  // ── Notification History ──────────────────────────────────────────────────
  async getNotifications(): Promise<{ notifications: Notification[]; unreadCount: number; total: number }> {
    const res = await api.get('/settings/notifications');
    return res.data;
  }

  async markNotificationAsRead(notificationId: string): Promise<Notification> {
    const res = await api.put(`/settings/notifications/${notificationId}/read`);
    return res.data;
  }

  async markAllNotificationsAsRead(): Promise<{ message: string }> {
    const res = await api.put('/settings/notifications/read-all');
    return res.data;
  }

  // ── Account Deletion ───────────────────────────────────────────────────────
  async requestAccountDeletion(data?: {
    reason?: string;
  }): Promise<{ type: string; requestId?: string; message: string }> {
    const res = await api.post('/account/delete/request', data || {});
    return res.data;
  }

  async getAccountDeletionStatus(): Promise<DeletionStatus> {
    const res = await api.get('/account/delete/status');
    return res.data;
  }

  async getAccountDeleteDetails(): Promise<{ user: { name: string; email: string }; stats: any }> {
    const res = await api.get('/account/delete/details');
    return res.data;
  }

  async cancelAccountDeletionRequest(requestId: string): Promise<{ message: string }> {
    const res = await api.post(`/account/delete/request/${requestId}/cancel`);
    return res.data;
  }

  async deleteAccount(data: { password: string }): Promise<{ message: string; email?: string }> {
    const res = await api.delete('/account/delete', { data });
    return res.data;
  }

  async getPendingDeletionRequests(): Promise<DeletionRequest[]> {
    const res = await api.get('/account/deletion-requests');
    return res.data?.requests || res.data || [];
  }

  async approveDeletionRequest(requestId: string): Promise<{ message: string }> {
    const res = await api.post(`/account/delete/request/${requestId}/approve`);
    return res.data;
  }

  async rejectDeletionRequest(requestId: string, reason?: string): Promise<{ message: string }> {
    const payload = reason?.trim() ? { reason: reason.trim() } : {};
    const res = await api.post(`/account/delete/request/${requestId}/reject`, payload);
    return res.data;
  }
}

export const apiService = new SettingsApiService();
