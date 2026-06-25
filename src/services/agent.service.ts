// src/services/agent.service.ts
import api, { API_BASE_URL } from '@/config/apiConfig';
import {
  Agent,
  AgentChatMessage,
  AgentChatResponse,
  CreateAgentPayload,
} from '@/types/agent';
import { getCookie } from '@/lib/utils'; // same util your AuthContext uses
import { createAgentRobotAvatar } from '@/lib/agentAvatar';
import { toCdnUrl } from '@/lib/cdn';

// ─── Helpers ───────────────────────────────────────────────────────────────

const isFullUrl = (url: string): boolean =>
  url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:');

const API_SERVER_URL = API_BASE_URL.replace(/\/api\/?$/, '');

const resolveAvatarUrl = (avatarUrl?: string): string | undefined => {
  if (!avatarUrl) return undefined;
  if (isFullUrl(avatarUrl)) return avatarUrl;
  return toCdnUrl(`${API_SERVER_URL}${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`);
};

const normaliseAgent = (agent: Agent): Agent => ({
  ...agent,
  tone: agent.tone || 'professional',
  avatarUrl: toCdnUrl(resolveAvatarUrl(agent.avatarUrl)) || createAgentRobotAvatar(agent),
});

const normaliseHistory = (messages: AgentChatMessage[] = []): AgentChatMessage[] =>
  messages.map((message) => ({
    sender: message.sender,
    text: message.text || '',
    timestamp: message.timestamp,
    propertyCards: Array.isArray(message.propertyCards) ? message.propertyCards : [],
  }));

type StreamEvent =
  | { type: 'start'; sessionId?: string }
  | { type: 'chunk'; content: string }
  | ({ type: 'done' } & AgentChatResponse)
  | { type: 'error'; message?: string };

/**
 * Fetches a binary resource as a base64 data URL using the native Fetch API.
 *
 * WHY NOT AXIOS?
 * Axios is built on XMLHttpRequest. React DevTools patches every XHR via
 * installHook.js / inspector.js and reads xhr.responseText after each
 * response. The browser throws InvalidStateError when responseType is
 * 'blob' or 'arraybuffer' because responseText is only readable for
 * '' / 'text' responses. This affects both responseType values — it is
 * an XHR-level restriction, not an Axios one.
 *
 * Native fetch() uses the Streams API and is completely separate from XHR,
 * so React DevTools never intercepts it and the error disappears entirely.
 *
 * Auth token is read from the 'accessToken' cookie, matching AuthContext.
 */
const fetchBinaryAsDataUrl = async (endpoint: string): Promise<string> => {
  const url = `${API_BASE_URL}${endpoint}`;

  // Read token from cookie — same source AuthContext uses (getCookie('accessToken'))
  const token = getCookie('accessToken') ?? '';

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'image/png',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include', // sends HttpOnly cookies (refreshToken) alongside
  });

  if (!res.ok) {
    throw new Error(`QR fetch failed: ${res.status} ${res.statusText}`);
  }

  const blob = await res.blob();

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('FileReader failed reading QR blob'));
    reader.readAsDataURL(blob);
  });
};

// ─── Service ───────────────────────────────────────────────────────────────

const agentService = {
  /**
   * GET /agents/agents
   * Returns all agents visible to the authenticated user.
   */
  getAgents: async (): Promise<Agent[]> => {
    const response = await api.get<Agent[]>('/agents/agents');
    return response.data.map(normaliseAgent);
  },

  /**
   * POST /agents/createagent  (multipart/form-data)
   * Backend expects: name, personality, description, voice?, avatar?, avatarFile?
   */
  createAgent: async (payload: CreateAgentPayload): Promise<Agent> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('personality', payload.personality);
    formData.append('description', payload.description);
    if (payload.voice) formData.append('voice', payload.voice);
    if (payload.tone) formData.append('tone', payload.tone);
    if (payload.avatar) formData.append('avatar', payload.avatar);
    if (payload.avatarFile) {
      formData.append('avatarFile', payload.avatarFile, payload.avatarFile.name || 'avatar.png');
    }
    const response = await api.post<Agent>('/agents/createagent', formData, {
      headers: {
        'Content-Type': undefined
      }
    });
    return normaliseAgent(response.data);
  },

  /**
   * DELETE /agents/:id
   */
  deleteAgent: async (agentId: string): Promise<void> => {
    await api.delete(`/agents/${agentId}`);
  },

  /**
   * PATCH /agents/:id/toggle
   * Toggles agent status between 'active' and 'paused'.
   */
  toggleAgentStatus: async (agentId: string): Promise<Agent> => {
    const response = await api.patch<Agent>(`/agents/${agentId}/toggle`);
    return normaliseAgent(response.data);
  },

  /**
   * GET /agents/:id/qr
   *
   * Uses native fetch() instead of Axios to avoid the React DevTools
   * InvalidStateError (see fetchBinaryAsDataUrl above).
   * Returns a data:image/png;base64,... string for <img src>.
   */
  getAgentQrCode: async (agentId: string): Promise<string> => {
    return fetchBinaryAsDataUrl(`/agents/${agentId}/qr`);
  },

  /**
   * GET /agents/public/:id
   * Public-facing agent — no auth required, only returns active agents.
   */
  getPublicAgent: async (agentId: string): Promise<Agent> => {
    const response = await api.get<Agent>(`/agents/${agentId}/public`);
    return normaliseAgent(response.data);
  },

  /**
   * PATCH /agents/:id
   * Updates mutable agent fields.
   */
  updateAgent: async (agentId: string, data: Partial<Agent>): Promise<Agent> => {
    const response = await api.put<Agent>(`/agents/${agentId}`, data);
    return normaliseAgent(response.data);
  },

  /**
   * POST /agents/:id/chat
   * Public endpoint used by QR landing page chat.
   */
  chatWithAgent: async (
    agentId: string,
    message: string,
    sessionId?: string
  ): Promise<AgentChatResponse> => {
    const response = await api.post<AgentChatResponse>(`/agents/${agentId}/chat`, {
      message,
      sessionId,
    });
    return {
      ...response.data,
      history: normaliseHistory(response.data?.history || []),
    };
  },

  /**
   * POST /agents/:id/chat/stream
   * SSE streaming events: start/chunk/done/error
   */
  streamChatWithAgent: async (
    agentId: string,
    message: string,
    onEvent: (event: StreamEvent) => void,
    sessionId?: string
  ): Promise<AgentChatResponse> => {
    const token = getCookie('accessToken') ?? '';
    const response = await fetch(`${API_BASE_URL}/agents/${agentId}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ message, sessionId }),
    });

    if (!response.ok || !response.body) {
      throw new Error(`Stream failed: ${response.status} ${response.statusText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let donePayload: AgentChatResponse | null = null;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split('\n\n');
      buffer = events.pop() ?? '';

      for (const eventBlock of events) {
        const lines = eventBlock
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.startsWith('data:'));

        for (const line of lines) {
          const jsonText = line.slice(5).trim();
          if (!jsonText) continue;

          try {
            const event = JSON.parse(jsonText) as StreamEvent;
            onEvent(event);

            if (event.type === 'done') {
              donePayload = {
                reply: event.reply,
                history: normaliseHistory(event.history || []),
                properties: event.properties,
                lead: event.lead,
              };
            }
            if (event.type === 'error') {
              throw new Error(event.message || 'Streaming error');
            }
          } catch (error) {
            if (error instanceof Error) throw error;
          }
        }
      }
    }

    if (!donePayload) {
      throw new Error('Stream ended without final payload');
    }
    return donePayload;
  },

  /**
   * GET /agents/:id/history
   */
  getAgentChatHistory: async (agentId: string, sessionId?: string): Promise<AgentChatMessage[]> => {
    const response = await api.get<{ history: AgentChatMessage[] }>(`/agents/${agentId}/history`, {
      params: sessionId ? { sessionId } : undefined,
    });
    return normaliseHistory(response.data?.history || []);
  },

  /**
   * POST /agents/:id/book
   */
  bookAppointment: async (
    agentId: string,
    payload: {
      sessionId?: string;
      buyerName: string;
      buyerEmail?: string;
      buyerPhone?: string;
      dateTime: string;
      propertyId?: string;
      notes?: string;
    }
  ) => {
    const response = await api.post(`/agents/${agentId}/book`, payload);
    return response.data;
  },

  /**
   * POST /agents/:id/qualify
   */
  qualifyLead: async (
    agentId: string,
    payload: {
      sessionId: string;
      budget?: { min?: number; max?: number; flexible?: boolean };
      locationPreference?: string[];
      propertyType?: string;
      bedrooms?: number;
      bathrooms?: number;
      purpose?: string;
      timeline?: string;
      contactInfo?: { name?: string; email?: string; phone?: string };
    }
  ) => {
    const response = await api.post(`/agents/${agentId}/qualify`, payload);
    return response.data;
  },
};

export default agentService;
