/**
 * PaymentsDisabledModal — shown when the user clicks "Get Started" while
 * online payments are switched off on the backend (PAYMENTS_ENABLED=false
 * in tech_trekkers_real_estate_backend/.env). The backend returns 503
 * PAYMENTS_DISABLED on create-order; UpgradeButton's catch handler detects
 * that and opens this modal. Backend env is the single source of truth —
 * no frontend env.
 *
 * Visual language matches the existing NexEstate billing surface: shadcn
 * Dialog primitive, slate-900 background with cyan accents (same palette as
 * PlanCard / CurrentPlanCard), blue→cyan gradient on the primary CTA.
 */

import React from 'react';
import { Mail, Sparkles, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { SUPPORT_CONTACT_EMAIL } from '@/config/paymentToggle';

interface PaymentsDisabledModalProps {
  open: boolean;
  onClose: () => void;
  planName?: string;
}

export const PaymentsDisabledModal: React.FC<PaymentsDisabledModalProps> = ({
  open,
  onClose,
  planName,
}) => {
  const { toast } = useToast();

  const subject = encodeURIComponent(
    planName
      ? `Upgrade to ${planName} on NexEstate`
      : 'Plan upgrade enquiry — NexEstate',
  );
  const body = encodeURIComponent(
    `Hi NexEstate team,\n\nI'd like to upgrade to the ${planName || 'paid'} plan. Please share the next steps.\n\nThanks!`,
  );
  const mailto = `mailto:${SUPPORT_CONTACT_EMAIL}?subject=${subject}&body=${body}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SUPPORT_CONTACT_EMAIL);
      toast({
        title: 'Email copied',
        description: SUPPORT_CONTACT_EMAIL,
      });
    } catch {
      toast({
        title: 'Could not copy',
        description: 'Please copy the email manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md bg-slate-900 border-cyan-500/30 text-slate-100">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/30">
            <Sparkles className="h-6 w-6 text-cyan-300" />
          </div>
          <DialogTitle className="text-center text-xl text-white">
            {planName ? `Ready to unlock ${planName}?` : 'Ready to unlock more?'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Online checkout is paused while we're rolling out something new. Drop
            our team a line and we'll get you set up — usually within 24 hours.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-slate-300 mb-1">
            <Mail className="h-4 w-4 text-cyan-300" />
            <span className="font-medium">Contact us</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <code className="text-cyan-200 text-[13px] break-all">{SUPPORT_CONTACT_EMAIL}</code>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="Copy email"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <p className="mt-3 text-slate-400 text-[13px]">
            We'll match your plan, activate it manually, and confirm by email.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Back to plans
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <a href={mailto}>
              <Mail className="mr-2 h-4 w-4" />
              Email our team
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentsDisabledModal;
