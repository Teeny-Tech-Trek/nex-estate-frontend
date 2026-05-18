import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { setCookie } from '../lib/utils';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  phoneNumber: string;
  accountType: 'individual' | 'organization' | '';
  password: string;
}

export const useSignupForm = (initial?: Partial<SignupFormData>, onboardingToken?: string) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: initial?.firstName || '',
    lastName: initial?.lastName || '',
    email: initial?.email || '',
    companyName: initial?.companyName || '',
    phoneNumber: initial?.phoneNumber || '',
    accountType: (initial?.accountType as any) || '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signup, refresh: refreshAuth } = useAuth();

  const features = [
    { 
      icon: "🎭",
      label: "Avatar Creation", 
      value: "Unlimited",
      description: "Create as many AI agents as you need"
    },
    { 
      icon: "🎯",
      label: "Lead Capture", 
      value: "24/7",
      description: "Never miss a potential client"
    },
    { 
      icon: "🔗",
      label: "CRM Integration", 
      value: "All Major",
      description: "Seamless connection to your tools"
    },
    { 
      icon: "📊",
      label: "Analytics", 
      value: "Real-time",
      description: "Track performance instantly"
    },
    { 
      icon: "💰",
      label: "Commission", 
      value: "1% Auto-calc",
      description: "Automatic commission tracking"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const accountType = (formData.accountType === 'individual' || formData.accountType === 'organization') 
        ? formData.accountType 
        : 'individual';

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        accountType: accountType,
        company: formData.accountType === 'organization' ? formData.companyName : undefined,
      };

      if (onboardingToken) {
        const { completeGoogleOnboarding } = await import('../services/api');
        const response = await completeGoogleOnboarding({
          onboardingToken,
          firstName: payload.firstName,
          lastName: payload.lastName,
          phoneNumber: payload.phoneNumber || '',
          accountType: payload.accountType as 'individual' | 'organization',
          organizationName: payload.company,
        });
        if (response?.accessToken) {
          setCookie('accessToken', response.accessToken, 7);
        }
        await refreshAuth();
        navigate('/dashboard', { replace: true });
        return;
      }

      // Use AuthContext signup method for manual signup
      await signup(payload);

      // If signup successful, navigate to dashboard
      // The auth context will handle state updates
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: unknown) {
      console.error('Signup error:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Signup failed. Please try again.');
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToLogin = () => {
    navigate('/login');
  };

  return {
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
    navigateToLogin,
    isLoading,
    error,
    features
  };
};
