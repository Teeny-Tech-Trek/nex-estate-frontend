/**
 * ContactSalesModal — professional "Contact Sales" dialog shown when a user
 * clicks the Enterprise tier's "Contact sales" CTA on the Billing page.
 *
 * Visual language matches the existing NexEstate billing surface (same shadcn
 * Dialog primitive and slate-900 / cyan palette as PaymentsDisabledModal and
 * PlanCard). The Dialog primitive gives us Escape-to-close, click-outside-to-
 * close, focus trapping, and an always-visible top-right close button for free.
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

// Sales contact details (per product spec). The subject is pre-filled so the
// inbound email is easy to triage.
const SALES_EMAIL = 'ttt@teenytechtrek.com';
const MAILTO = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent('NexEstate Enterprise Inquiry')}`;

interface ContactSalesModalProps {
  open: boolean;
  onClose: () => void;
}

export const ContactSalesModal: React.FC<ContactSalesModalProps> = ({ open, onClose }) => {
  const { toast } = useToast();

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SALES_EMAIL);
      toast({ title: 'Email copied', description: SALES_EMAIL });
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
            Contact Our Sales Team
          </DialogTitle>
          <DialogDescription className="text-center text-slate-300">
            Need a custom plan, enterprise pricing, additional seats, or advanced features? Our team
            is here to help.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 p-4 text-sm">
          <div className="flex items-center gap-2 text-slate-300 mb-1">
            <Mail className="h-4 w-4 text-cyan-300" />
            <span className="font-medium">Email</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <a
              href={MAILTO}
              className="text-cyan-200 text-[13px] break-all hover:text-cyan-100 hover:underline"
            >
              {SALES_EMAIL}
            </a>
            <button
              type="button"
              onClick={copyEmail}
              className="shrink-0 inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              aria-label="Copy email address"
            >
              <Copy className="h-3.5 w-3.5" />
              Copy
            </button>
          </div>
          <p className="mt-3 text-slate-400 text-[13px] leading-relaxed">
            For pricing inquiries, enterprise solutions, partnerships, and custom requirements,
            please reach out to our team and we will get back to you as soon as possible.
          </p>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
          >
            Close
          </Button>
          <Button
            asChild
            className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-cyan-500/30"
          >
            <a href={MAILTO}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </a>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSalesModal;
