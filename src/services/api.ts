import { AuthResponse, SignupData } from "../types/auth";
import api, { getRefreshPromise } from "../config/apiConfig";
import { eraseCookie, getCookie } from "../lib/utils";

export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/signup", data);
  return response.data;
};

export const login = async (data: {
  email: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
  } finally {
    eraseCookie("accessToken");
    eraseCookie("refreshToken");
  }
};

export const refresh = async (refreshToken?: string): Promise<AuthResponse> => {
  if (!refreshToken) {
    const response = await getRefreshPromise();
    return response.data;
  }
  const payload = { refreshToken };
  const response = await api.post<AuthResponse>("/auth/refresh", payload);
  return response.data;
};

export const isAuthenticated = (): boolean => Boolean(getCookie("accessToken"));

export const getAccessToken = (): string | null => getCookie("accessToken");

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (
  token: string,
  password: string,
  confirmPassword: string
): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>(`/auth/reset-password/${token}`, {
    password,
    confirmPassword,
  });
  return response.data;
};

export default api;

export const exchangeGoogleCode = async (code: string, redirectUri?: string): Promise<any> => {
  const payload = redirectUri ? { code, redirectUri } : { code };
  const response = await api.post('/auth/google/exchange-code', payload);
  return response.data;
};

export const completeGoogleOnboarding = async (data: {
  onboardingToken: string;
  firstName: string;
  lastName?: string;
  phoneNumber: string;
  accountType: 'individual' | 'organization';
  organizationName?: string;
}) => {
  const response = await api.post('/auth/google/complete-onboarding', data);
  return response.data;
};

export const linkGoogleAccount = async (data: { linkToken: string; password: string }) => {
  const response = await api.post('/auth/google/link', data);
  return response.data;
};
