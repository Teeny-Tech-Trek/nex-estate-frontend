// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { authAtom, setAuthAtom, setAuthLoadingAtom } from '../atoms/authAtom';
import { AuthContextType, User } from '../types/auth';
import { signup, login, logout, refresh } from '../services/api';
import { useToast } from '../hooks/use-toast';
import { getCookie, eraseCookie, setCookie } from '../lib/utils'; // Import cookie utilities
import { getFriendlyErrorMessage } from '../lib/errorMapper';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const normalizeOrganizationRef = (
  value: string | { id?: string; _id?: string; name?: string } | null | undefined
): string | { id: string; _id: string; name?: string } | null => {
  if (!value) return null;
  if (typeof value === 'string') return value;
  const orgId = value.id || value._id;
  if (!orgId) return null;
  return {
    id: orgId,
    _id: orgId,
    name: value.name,
  };
};

const normalizeUser = (rawUser: User): User => {
  const normalizedId = rawUser.id || rawUser._id || rawUser.accountId;
  return {
    ...rawUser,
    id: normalizedId,
    _id: normalizedId,
    workingUnderOrganization: normalizeOrganizationRef(rawUser.workingUnderOrganization),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const setAuth = useSetAtom(setAuthAtom);
  const setLoading = useSetAtom(setAuthLoadingAtom);
  const state = useAtomValue(authAtom);
  const { toast } = useToast();

  const handleRefreshAuth = useCallback(async () => {
    try {
      // Call refresh so server can use HttpOnly cookie if present
      const data = await refresh();
      const normalizedUser = normalizeUser(data.user);
      // Update auth state with returned user and tokens (if provided)
      setAuth({ user: normalizedUser, tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken || getCookie('refreshToken') || null } });
      setCookie('accessToken', data.accessToken, 7); // Update accessToken cookie if refreshed
      if (data.refreshToken) setCookie('refreshToken', data.refreshToken, 30);
      return true;
    } catch (error) {
      eraseCookie('accessToken');
      eraseCookie('refreshToken');
      setAuth({ user: null, tokens: null });
      return false;
    }
  }, [setAuth]);


  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      const accessToken = getCookie('accessToken');

      if (accessToken) {
        // Try to refresh session by calling refresh endpoint which can read HttpOnly cookie
        const refreshed = await handleRefreshAuth();
        if (refreshed) {
          setLoading(false);
          return;
        }
        // If refresh failed, clear any local tokens
        eraseCookie('accessToken');
        eraseCookie('refreshToken');
        setAuth({ user: null, tokens: null });
      } else {
        // Prevent stale localStorage auth state from keeping user "logged in"
        setAuth({ user: null, tokens: null });
      }
      setLoading(false);
    };
    initAuth();
  }, [setAuth, setLoading, handleRefreshAuth]); // Add handleRefreshAuth to dependency array

  // This handleLogin is for external components that might directly call useAuth().login
  // However, useLoginForm is now handling the login API call and cookie setting.
  // The AuthContext should ideally react to cookies being set.
  // For now, we'll keep it, but it needs to update state based on *external* cookie presence or be removed.
  const handleLogin = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await login({ email, password }); // This call also sets HttpOnly cookies
      const normalizedUser = normalizeUser(data.user);
      setCookie('accessToken', data.accessToken, 7); // Set client-side accessToken cookie
      // refreshToken is expected to be set as HttpOnly cookie by backend.
      setAuth({ user: normalizedUser, tokens: { accessToken: data.accessToken, refreshToken: data.refreshToken || getCookie('refreshToken') || null } });
      toast({ title: 'Welcome back!', description: 'You have successfully signed in.' });
    } catch (error: unknown) {
      const description = getFriendlyErrorMessage(error, 'Invalid email or password');
      toast({
        title: 'Login failed',
        description,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
    password: string;
    phoneNumber?: string;
    accountType?: 'individual' | 'organization';
  }) => {
    setLoading(true);
    try {
      const signupPayload: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        phoneNumber: string;
        accountType: 'individual' | 'organization';
        company?: string;
      } = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber || '',
        accountType: data.accountType || 'individual',
      };
      
      if (data.company) {
        signupPayload.company = data.company;
      }

      const response = await signup(signupPayload);
      const normalizedUser = normalizeUser(response.user);
      setCookie('accessToken', response.accessToken, 7); // Set client-side accessToken cookie
      // refreshToken is expected to be set as HttpOnly cookie by backend.
      setAuth({ user: normalizedUser, tokens: { accessToken: response.accessToken, refreshToken: response.refreshToken || getCookie('refreshToken') || null } });
      toast({ title: 'Account created!', description: 'Welcome to Virtual Sales Platform.' });
    } catch (error: unknown) {
      const description = getFriendlyErrorMessage(error, 'Please check your information and try again.');
      toast({
        title: 'Signup failed',
        description,
        variant: 'destructive',
      });
      throw new Error(description);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      eraseCookie('accessToken');
      eraseCookie('refreshToken');
      setAuth({ user: null, tokens: null });
      toast({ title: 'Logged out', description: 'You have been successfully logged out.' });
    } catch (error: unknown) {
      toast({
        title: 'Logout failed',
        description: getFriendlyErrorMessage(error, 'An error occurred while logging out.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // This handleRefresh is mostly for manual refresh calls, interceptor handles automatic ones.
  const handleRefresh = useCallback(async () => {
    setLoading(true);
    // Attempt refresh via server-side cookie regardless of client-readable refresh token
    const refreshed = await handleRefreshAuth();
    if (!refreshed) {
      eraseCookie('accessToken');
      eraseCookie('refreshToken');
      setAuth({ user: null, tokens: null });
    }
    setLoading(false);
  }, [setLoading, setAuth, handleRefreshAuth]);

  const handleUpdateUser = useCallback((newUser: User) => {
    const normalizedUser = normalizeUser(newUser);
    setAuth({
      user: normalizedUser,
      tokens: state.tokens,
    });
  }, [setAuth, state.tokens]);

  return (
    <AuthContext.Provider value={{ user: state.user, login: handleLogin, signup: handleSignup, logout: handleLogout, refresh: handleRefresh, updateUser: handleUpdateUser, isLoading: state.isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
