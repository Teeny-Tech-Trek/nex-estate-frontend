// // src/types/auth.ts
// export interface User {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   organization?: {
//     id: string;
//     name: string;
//   };
//   role: 'owner' | 'admin' | 'member';
// }
// export interface Organization {
//   id: string; // Use 'id' to match the console log and backend response
//   name: string;
//   plan?: {
//     name: string;
//     seats: number;
//   };
//   members?: string[];
//   createdAt?: string;
//   owner?: string;
// }

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
// }

// export interface AuthState {
//   user: User | null;
//   tokens: AuthTokens | null;
//   isLoading: boolean;
// }

// export interface AuthContextType {
//   user: User | null;
//   login: (email: string, password: string) => Promise<void>;
//   signup: (data: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     company?: string;
//     password: string;
//   }) => Promise<void>;
//   logout: () => Promise<void>;
//   refresh: () => Promise<void>;
//   isLoading: boolean;
// }

// src/types/auth.ts - COMPLETE VERSION matching your backend

// ==========================================
// USER TYPE - Matches your MongoDB User Schema
// ==========================================
export interface User {
  id: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  accountType: 'individual' | 'organization'; // ✅ Backend enum
  role: 'owner' | 'admin' | 'member' | 'agent' | 'individual'; // ✅ Backend enum
  workingUnderOrganization?: string | { id?: string; _id?: string; name?: string } | null;
  accountId: string; // ✅ Unique 5-digit public ID
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
  avatar?: string; // Optional - add if you implement it
}

// ==========================================
// AUTH TOKENS
// ==========================================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string | null;
}

// ==========================================
// AUTH STATE (for Jotai atom)
// ==========================================
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isLoading: boolean;
}

// ==========================================
// AUTH CONTEXT TYPE
// ==========================================
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  updateUser: (user: User) => void;
}

// ==========================================
// API REQUEST/RESPONSE TYPES
// ==========================================

// Signup Request
export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  password: string;
  accountType: 'individual' | 'organization';
  company?: string; // Required only when accountType is 'organization'
}

// Login Request
export interface LoginData {
  email: string;
  password: string;
}

// Backend Response Types (matching your auth.service.js returns)
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export type LoginResponse = AuthResponse;
export type SignupResponse = AuthResponse;

export interface RefreshResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}
