import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { exchangeGoogleCode } from '../services/api';
import { setCookie } from '../lib/utils';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [processing, setProcessing] = useState(true);
  const { toast } = useToast();
  const { refresh } = useAuth();

  useEffect(() => {
    const run = async () => {
      try {
        const params = new URLSearchParams(search);
        const code = params.get('code');
        if (!code) {
          toast({ title: 'Google sign-in failed', description: 'No code returned from Google', variant: 'destructive' });
          navigate('/login');
          return;
        }

        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
        const res = await exchangeGoogleCode(code, redirectUri);

        if (!res) {
          toast({ title: 'Google sign-in failed', description: 'Unexpected server response', variant: 'destructive' });
          navigate('/login');
          return;
        }

        if (res.status === 'authenticated') {
          if (res.accessToken) setCookie('accessToken', res.accessToken, 7);
          await refresh();
          navigate('/dashboard', { replace: true });
          return;
        }

        if (res.status === 'onboarding_required') {
          const url = new URL('/signup', window.location.origin);
          if (res.onboardingToken) url.searchParams.set('onboardingToken', res.onboardingToken);
          if (res.profile?.email) url.searchParams.set('email', res.profile.email);
          if (res.profile?.firstName) url.searchParams.set('firstName', res.profile.firstName);
          if (res.profile?.lastName) url.searchParams.set('lastName', res.profile.lastName || '');
          navigate(url.pathname + url.search);
          return;
        }

        if (res.status === 'link_required') {
          const url = new URL('/auth/google/link', window.location.origin);
          if (res.linkToken) url.searchParams.set('linkToken', res.linkToken);
          if (res.email) url.searchParams.set('email', res.email);
          if (typeof res.hasPassword !== 'undefined') url.searchParams.set('hasPassword', String(res.hasPassword));
          navigate(url.pathname + url.search);
          return;
        }

        toast({ title: 'Google sign-in', description: 'Unhandled response from server', variant: 'destructive' });
        navigate('/login');
      } catch (err: unknown) {
        console.error('Google callback error', err);
        toast({ title: 'Google sign-in failed', description: err instanceof Error ? err.message : 'Unknown error', variant: 'destructive' });
        navigate('/login');
      } finally {
        setProcessing(false);
      }
    };
    run();
  }, [search, navigate, refresh, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="loader mb-4" />
        <div className="text-lg font-medium">Completing sign in with Google...</div>
      </div>
    </div>
  );
};

export default GoogleCallback;
