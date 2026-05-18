import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { linkGoogleAccount } from '../services/api';
import { setCookie } from '../lib/utils';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';

const LinkGoogle: React.FC = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const linkToken = params.get('linkToken') || '';
  const email = params.get('email') || '';
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkToken) return toast({ title: 'Missing token', variant: 'destructive' });
    setLoading(true);
    try {
      const res = await linkGoogleAccount({ linkToken, password });
      if (res?.accessToken) setCookie('accessToken', res.accessToken, 7);
      await refresh();
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      console.error(err);
      toast({ title: 'Link failed', description: err instanceof Error ? err.message : 'Unable to link account', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white rounded-2xl shadow">
        <h2 className="text-lg font-bold mb-2">Link Google account</h2>
        <p className="text-sm text-gray-600 mb-4">Email: {email}</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full border rounded-md p-2" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2 px-4 bg-violet-600 text-white rounded-md">
            {loading ? 'Linking...' : 'Link account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LinkGoogle;
