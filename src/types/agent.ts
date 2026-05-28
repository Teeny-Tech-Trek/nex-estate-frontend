export interface Agent {
  _id: string;
  name: string;
  personality: string;
  voice: string;
  tone?: "professional" | "friendly" | "consultative" | "energetic" | "luxury";
  avatar: string; // Could be a character or identifier
  description: string;
  avatarUrl?: string; // Relative path, e.g., "/uploads/avatars/123.png"
  organization: string; // ObjectId
  createdBy: string; // ObjectId
  status: 'draft' | 'active' | 'paused';
  conversations: number;
  conversions: number;
  revenue: string;
  conversionRate: string;
  createdAt?: string; // Assuming Mongoose adds these
  updatedAt?: string; // Assuming Mongoose adds these
  // Add other fields if needed for the UI
}

export interface CreateAgentPayload {
  name: string;
  personality: string;
  voice?: string;
  tone?: "professional" | "friendly" | "consultative" | "energetic" | "luxury";
  avatar?: string;
  description: string;
  avatarFile?: File; // For form data upload
}

export interface AgentPropertyCard {
  id: string;
  title?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  areaUnit?: string;
  propertyType?: string;
  status?: string;
  location?: string;
  image?: string | null;
  highlights?: string;
  matchScore?: number;
}

export interface AgentChatMessage {
  sender: "user" | "agent" | "system";
  text: string;
  timestamp?: string;
  propertyCards?: AgentPropertyCard[];
}

export interface AgentChatResponse {
  reply: string;
  history: AgentChatMessage[];
  properties?: AgentPropertyCard[];
  lead?: {
    score?: number;
    quality?: string;
    status?: string;
  };
}
