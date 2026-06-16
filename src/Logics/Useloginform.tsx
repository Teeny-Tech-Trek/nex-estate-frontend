import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const useLoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      // Use AuthContext login method
      await login(formData.email, formData.password);
      
      // If login successful, navigate to dashboard
      // The auth context will handle state updates
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const axiosErr = err as {
        response?: { status?: number; data?: { message?: string; error?: string } };
      };
      const status = axiosErr?.response?.status;
      const serverMessage =
        axiosErr?.response?.data?.message || axiosErr?.response?.data?.error;

      if (status === 401 || status === 400) {
        // Wrong email/password — show a clear, friendly message instead of a
        // raw "Request failed…" / "Network Error" string.
        setError('Invalid email or password');
      } else if (serverMessage) {
        setError(serverMessage);
      } else {
        // No usable response (the failed /auth/login most commonly means bad
        // credentials in this app) — surface the same friendly message.
        setError('Invalid email or password');
      }
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  const navigateToForgotPassword = () => {
    navigate('/forgot-password');
  };

  return {
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
    navigateToSignup,
    navigateToForgotPassword,
    isLoading,
    error,
    features
  };
};
