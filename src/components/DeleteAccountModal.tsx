import React, { useState, useEffect } from 'react';
import { apiService } from '@/services/settings.api';
import { useToast } from '@/hooks/use-toast';
import { getFriendlyErrorMessage } from '@/lib/errorMapper';

interface Props {
  user?: any;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteAccountModal: React.FC<Props> = ({ user, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'confirm' | 'reason' | 'pending' | 'deleting' | 'password' | 'success'>('confirm');
  const [reason, setReason] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [deleteStatus, setDeleteStatus] = useState<any | null>(null);

  useEffect(() => {
    checkDeleteStatus();
  }, []);

  const checkDeleteStatus = async () => {
    try {
      const response = await apiService.getAccountDeletionStatus();
      if (response.hasPendingRequest) {
        setDeleteStatus(response);
        setStep('pending');
      }
    } catch (err) {
      console.error('Error checking deletion status:', err);
    }
  };

  const handleRequestDeletion = async () => {
    setLoading(true);
    setError('');

    try {
      // For members: send deletion request to owner
      if (user?.accountType === 'organization' && user?.role !== 'owner') {
        const response = await apiService.requestAccountDeletion({ reason: reason || undefined });
        setDeleteStatus({ status: 'pending', requestId: response.requestId, createdAt: new Date().toISOString() });
        setStep('pending');
        toast({
          title: 'Request Sent',
          description: 'Your account deletion request was sent to the organization owner.',
        });
        return;
      }

      // For individual users or owners with no members: require password check via delete endpoint
      setStep('deleting');
      const res = await apiService.deleteAccount({ password });
      setStep('success');
      toast({
        title: 'Deletion Initiated',
        description: 'Your account deletion has started successfully.',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
    } catch (err: any) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Failed to request account deletion');
      setError(friendlyMsg);
      toast({
        title: 'Action Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    if (!deleteStatus?.requestId) return;

    setLoading(true);
    setError('');

    try {
      await apiService.cancelAccountDeletionRequest(deleteStatus.requestId);
      setStep('confirm');
      setReason('');
      setDeleteStatus(null);
      toast({
        title: 'Request Cancelled',
        description: 'Your pending deletion request was cancelled.',
      });
    } catch (err: any) {
      const friendlyMsg = getFriendlyErrorMessage(err, 'Failed to cancel deletion request');
      setError(friendlyMsg);
      toast({
        title: 'Action Failed',
        description: friendlyMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = async () => {
    setError('');
    try {
      const details = await apiService.getAccountDeleteDetails();
      const stats = details.stats || {};

      if (stats.isOwner && stats.membersCount > 1) {
        setError('As organization owner, remove all members or transfer ownership before deleting account.');
        return;
      }

      if (user?.accountType === 'organization' && user?.role !== 'owner') {
        setStep('reason');
        return;
      }

      setStep('password');
    } catch (err) {
      setError('Failed to load account details. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" style={{ padding: "clamp(12px, 3vw, 32px)" }}>
      <div className="bg-gradient-to-br from-slate-900 to-[#0d1b34] border border-slate-700/60 rounded-xl shadow-2xl w-full text-slate-100" style={{ maxWidth: "min(440px, 100%)", maxHeight: "min(90vh, calc(100vh - 24px))", overflow: "auto" }}>
        {step === 'confirm' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Delete Account</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-gray-700 font-medium mb-2">Are you sure you want to delete your account?</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4 list-disc">
                <li>All your data will be permanently deleted</li>
                <li>Pending invites will be removed</li>
                <li>You will be removed from organizations</li>
                <li>This action cannot be undone</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-700">
              ℹ️ If you are an organization member, your deletion request will be sent to
              the organization owner for approval.
            </div>

            <p className="text-gray-600 mb-4">User: <span className="font-semibold">{user?.email}</span></p>

            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition">Cancel</button>
              <button onClick={handleContinue} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">Continue</button>
            </div>
          </div>
        )}

        {step === 'reason' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Why are you leaving?</h2>
            <p className="text-gray-600 mb-4">Help us improve by telling us why you're deleting your account (optional)</p>

            <textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Tell us your feedback..." disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none" rows={4} />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep('confirm'); setReason(''); setError(''); }} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50">Back</button>
              <button onClick={handleRequestDeletion} disabled={loading} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{loading ? (<><span className="inline-block animate-spin mr-2">⌛</span>Requesting...</>) : ('Request Deletion')}</button>
            </div>
          </div>
        )}

        {step === 'password' && (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Confirm Password</h2>
            <p className="text-gray-600 mb-4">Enter your password to permanently delete your account.</p>

            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent" />

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => { setStep('confirm'); setPassword(''); setError(''); }} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50">Back</button>
              <button onClick={handleRequestDeletion} disabled={loading || !password} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Deleting...' : 'Delete Account'}</button>
            </div>
          </div>
        )}

        {step === 'pending' && (
          <div className="p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">⏳</div>
              <h2 className="text-2xl font-bold text-amber-600 mb-2">Awaiting Approval</h2>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-900 text-sm mb-2">Your account deletion request has been sent to your organization owner.</p>
              <p className="text-blue-800 text-sm">You will receive an email once they approve or reject your request.</p>
            </div>

            {deleteStatus && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4 text-sm">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-semibold text-amber-600 capitalize">{deleteStatus.status}</span>
                </div>
                {deleteStatus.createdAt && (
                  <div className="flex justify-between text-xs text-gray-500"><span>Submitted:</span><span>{new Date(deleteStatus.createdAt).toLocaleDateString()}</span></div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={handleCancelRequest} disabled={loading} className="flex-1 px-4 py-2 border border-red-300 text-red-600 rounded-lg font-medium hover:bg-red-50 transition disabled:opacity-50">Cancel Request</button>
              <button onClick={onClose} disabled={loading} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50">Close</button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Account Deletion Initiated</h2>
            <p className="text-gray-600 mb-4">Your account will be deleted shortly. You will be redirected to the login page.</p>
            <button onClick={() => (window.location.href = '/login')} className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">Go to Login</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteAccountModal;
