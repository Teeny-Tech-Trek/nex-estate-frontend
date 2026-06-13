import React, { useState, useRef, useEffect } from "react";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Building2,
  User, Phone, ChevronDown, Check, Loader2, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSignupForm } from "../Logics/Usesignform";
import { useToast } from "../hooks/use-toast";

// ─────────────────────────────────────────────
// Feature showcase data (mirrors Features.tsx)
// ─────────────────────────────────────────────
const SIGNUP_FEATURES = [
  {
    imgSrc:      "/Website-Images/Features-Section-Images/avatar-management.png",
    imgAlt:      "Avatar Management 3D",
    accentColor: "#7c5cbf",
    cardBorder:  "rgba(124,92,191,0.30)",
    cardGlow:    "0 0 55px 8px rgba(124,92,191,0.18)",
    imgGlow:     "rgba(124,92,191,0.22)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      </svg>
    ),
    title:       "Avatar Management",
    description: "Create and customize AI avatars with unique appearances, voices, scripts, and availability. Preview and deploy in minutes.",
  },
  {
    imgSrc:      "/Website-Images/Features-Section-Images/lead-capture.png",
    imgAlt:      "Lead Capture 3D",
    accentColor: "#3b82f6",
    cardBorder:  "rgba(59,130,246,0.28)",
    cardGlow:    "0 0 55px 8px rgba(59,130,246,0.16)",
    imgGlow:     "rgba(59,130,246,0.20)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    title:       "Lead Capture",
    description: "Web chat widget with voice/video calling via WebRTC. Your avatars engage visitors 24/7 with agent takeover when needed.",
  },
  {
    imgSrc:      "/Website-Images/Features-Section-Images/property-management.png",
    imgAlt:      "Property Management 3D",
    accentColor: "#06b6d4",
    cardBorder:  "rgba(6,182,212,0.28)",
    cardGlow:    "0 0 55px 8px rgba(6,182,212,0.16)",
    imgGlow:     "rgba(6,182,212,0.20)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/>
      </svg>
    ),
    title:       "Property Management",
    description: "Add properties with images, specs, prices, floor plans, and 3D/AR assets. Create stunning property pages with lead attribution.",
  },
  {
    imgSrc:      "/Website-Images/Features-Section-Images/smart-scheduling.png",
    imgAlt:      "Smart Scheduling 3D",
    accentColor: "#7c3aed",
    cardBorder:  "rgba(124,58,237,0.30)",
    cardGlow:    "0 0 55px 8px rgba(124,58,237,0.18)",
    imgGlow:     "rgba(124,58,237,0.22)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="18" height="18" x="3" y="4" rx="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title:       "Smart Scheduling",
    description: "Integrated calendar booking with Google/iCal sync. Automated reminders via email, SMS, and WhatsApp keep prospects engaged.",
  },
  {
    imgSrc:      "/Website-Images/Features-Section-Images/crm-integration.png",
    imgAlt:      "CRM Integration 3D",
    accentColor: "#6366f1",
    cardBorder:  "rgba(99,102,241,0.30)",
    cardGlow:    "0 0 55px 8px rgba(99,102,241,0.18)",
    imgGlow:     "rgba(99,102,241,0.22)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
      </svg>
    ),
    title:       "CRM Integration",
    description: "Two-way sync with HubSpot, Salesforce, Zoho, and proptech APIs. OAuth authentication with webhook-based lead attribution.",
  },
  {
    imgSrc:      "/Website-Images/Features-Section-Images/analytics-commission.png",
    imgAlt:      "Analytics & Commission 3D",
    accentColor: "#10b981",
    cardBorder:  "rgba(16,185,129,0.28)",
    cardGlow:    "0 0 55px 8px rgba(16,185,129,0.16)",
    imgGlow:     "rgba(16,185,129,0.20)",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M3 3v18h18"/>
        <path d="M7 16l4-4 4 4 4-6"/>
      </svg>
    ),
    title:       "Analytics & Commission",
    description: "Real-time dashboards track leads, conversions, and revenue. Automatic 1% commission calculation with detailed payout history.",
  },
];

// ─────────────────────────────────────────────
// Brand icons (lucide doesn't ship these)
// ─────────────────────────────────────────────
const GoogleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 48 48" className={className} aria-hidden>
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
  </svg>
);

const AppleIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

// ─────────────────────────────────────────────
// Account-type options
// ─────────────────────────────────────────────
const ACCOUNT_TYPES = [
  { value: "individual",   label: "Individual",   icon: User },
  { value: "organization", label: "Organization", icon: Building2 },
];

// ─────────────────────────────────────────────
// SignUp page
// ─────────────────────────────────────────────
const Signup: React.FC = () => {
  // Prefill from query params (Google onboarding)
  const urlParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const onboardingToken = urlParams.get('onboardingToken') || undefined;
  const initialData = {
    email: urlParams.get('email') || undefined,
    firstName: urlParams.get('firstName') || undefined,
    lastName: urlParams.get('lastName') || undefined,
    companyName: urlParams.get('companyName') || undefined,
    accountType: (urlParams.get('accountType') as 'individual' | 'organization' | undefined) || undefined,
  };

  const {
    formData,
    showPassword,
    handleSubmit,
    handleChange,
    togglePasswordVisibility,
    navigateToLogin,
  } = useSignupForm(initialData, onboardingToken);

  // ── UI-only state (visual feedback + dropdown) ──
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [accTypeOpen, setAccTypeOpen]   = useState(false);
  const accDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Google OAuth redirect — mirrors Login.tsx
  const handleGoogleSignIn = () => {
    const clientId    = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    if (!clientId || !redirectUri) {
      toast({
        title: "Google sign-in unavailable",
        description: "Google OAuth isn't configured. Set VITE_GOOGLE_CLIENT_ID and VITE_GOOGLE_REDIRECT_URI in the frontend .env.",
        variant: "destructive",
      });
      return;
    }
    const params = new URLSearchParams({
      client_id:     clientId,
      redirect_uri:  redirectUri,
      response_type: "code",
      scope:         "openid profile email",
      access_type:   "offline",
      prompt:        "consent",
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accDropdownRef.current && !accDropdownRef.current.contains(e.target as Node)) {
        setAccTypeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectAccountType = (value: string) => {
    handleChange({ target: { name: "accountType", value } } as any);
    setAccTypeOpen(false);
  };

  const selectedAcc = ACCOUNT_TYPES.find(t => t.value === formData.accountType);

  // Wrap the hook's submit to show visual feedback
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await handleSubmit(e);
      setSubmitStatus("success");
      setTimeout(() => setSubmitStatus("idle"), 3500);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    /* ════════════════════════════════════════════════════════════════
       OUTER WRAPPER — full-page atmosphere (covers BOTH halves)
       Page-wide background + nebula glows + grid overlay sit here so
       there's no visible seam between the features panel and the form.
    ════════════════════════════════════════════════════════════════ */
    <div
      className="min-h-screen relative overflow-hidden"
      style={{ background: "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)" }}
    >
      {/* Animated nebula glow — top-left area */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 55% 45% at 15% 20%,rgba(59,130,246,0.22) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 22% 28%,rgba(99,102,241,0.28) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 15% 20%,rgba(59,130,246,0.22) 0%,transparent 65%)",
          ],
        }}
        transition={{ duration: 9, repeat: Infinity }}
      />

      {/* Animated nebula glow — bottom-right area */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: [
            "radial-gradient(ellipse 50% 55% at 85% 80%,rgba(108,63,197,0.30) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 78% 84%,rgba(139,92,246,0.38) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 85% 80%,rgba(108,63,197,0.30) 0%,transparent 62%)",
          ],
        }}
        transition={{ duration: 9, repeat: Infinity, delay: 2.5 }}
      />

      {/* Faint grid overlay (whole page) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ════════════════════════════════════════════════════════════════
         CONTENT LAYOUT (z-10 so it sits above the atmosphere layers)
      ════════════════════════════════════════════════════════════════ */}
      <div className="min-h-screen flex relative z-10">

        {/* ═════════════ LEFT — feature showcase ═════════════ */}
        <div className="hidden lg:flex relative w-1/2 overflow-hidden">
          <div className="relative z-10 flex flex-col w-full h-full p-8 xl:p-10 text-white overflow-y-auto">

            {/* Heading */}
            <div className="max-w-md flex-shrink-0">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 text-[11px] font-semibold tracking-wider uppercase"
                style={{
                  background: "rgba(167,139,250,0.12)",
                  border:     "1px solid rgba(167,139,250,0.30)",
                  color:      "#c4b5fd",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                Powerful Features
              </div>
              <h1 className="text-3xl xl:text-[38px] font-extrabold leading-[1.1] tracking-tight font-syne-bold">
                Everything you need
              </h1>
              <h2
                className="text-3xl xl:text-[38px] font-extrabold leading-[1.15] tracking-tight font-syne-bold"
                style={{
                  background:           "linear-gradient(90deg,#a78bfa 0%,#60a5fa 50%,#a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor:  "transparent",
                  backgroundClip:       "text",
                  filter:               "drop-shadow(0 0 24px rgba(167,139,250,0.45))",
                }}
              >
                to close more deals
              </h2>
            </div>

            {/* 4 features grid — 2 columns × 2 rows */}
            <div className="grid grid-cols-2 gap-3 my-5 flex-shrink-0">
              {SIGNUP_FEATURES.slice(0, 4).map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -3, scale: 1.02 }}
                  className="rounded-xl overflow-hidden cursor-default"
                  style={{
                    background: "rgba(10, 8, 38, 0.92)",
                    boxShadow:  `${f.cardGlow}, 0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  }}
                >
                  {/* Image area */}
                  <div
                    className="relative"
                    style={{
                      height:     "100px",
                      background: `radial-gradient(ellipse 80% 80% at 60% 50%, ${f.imgGlow} 0%, rgba(5,4,20,0.95) 70%)`,
                      overflow:   "hidden",
                    }}
                  >
                    <div
                      className="absolute top-2 left-2 z-10 w-7 h-7 flex items-center justify-center rounded-md"
                      style={{
                        background:     "rgba(255,255,255,0.08)",
                        border:         "1px solid rgba(255,255,255,0.16)",
                        backdropFilter: "blur(8px)",
                        boxShadow:      `0 0 10px 2px ${f.accentColor}55`,
                      }}
                    >
                      <span style={{ transform: "scale(0.70)", display: "flex" }}>{f.icon}</span>
                    </div>

                    <img
                      src={f.imgSrc}
                      alt={f.imgAlt}
                      draggable={false}
                      onContextMenu={(e) => e.preventDefault()}
                      className="absolute inset-0 w-full h-full select-none"
                      style={{
                        objectFit:      "contain",
                        objectPosition: "center bottom",
                        paddingTop:     "8px",
                        filter:         `drop-shadow(0 6px 18px ${f.accentColor}55)`,
                      }}
                    />

                    <div
                      className="absolute bottom-0 left-0 right-0 pointer-events-none"
                      style={{
                        height:     "50px",
                        background: "linear-gradient(to bottom, transparent, rgba(10,8,38,0.92))",
                      }}
                    />
                  </div>

                  {/* Copy */}
                  <div className="px-3 pb-3 pt-2">
                    <h3
                      className="text-white text-[13.5px] font-bold tracking-tight leading-tight"
                      style={{ textShadow: "0 2px 12px rgba(0,0,0,0.40)" }}
                    >
                      {f.title}
                    </h3>
                    <div
                      style={{
                        height:       "2px",
                        width:        "24px",
                        borderRadius: "2px",
                        margin:       "5px 0 6px",
                        background:   f.accentColor,
                        boxShadow:    `0 0 8px 1px ${f.accentColor}90`,
                      }}
                    />
                    <p className="text-[11.5px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {f.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ═════════════ RIGHT — signup form ═════════════ */}
        <div className="w-full lg:w-1/2 relative flex items-center justify-center p-4 sm:p-6 lg:p-12">

          {/* Top-right: sign-in link */}
          <div className="absolute flex items-center gap-2" style={{ top: "clamp(14px, 2vw, 24px)", right: "clamp(14px, 2vw, 32px)", fontSize: "clamp(12px, 0.95vw, 14px)" }}>
            <span className="text-white/60 hidden xs:inline">Already have an account?</span>
            <button
              type="button"
              onClick={navigateToLogin}
              className="font-bold text-violet-200 hover:text-white transition-colors"
            >
              Sign in
            </button>
          </div>

          {/* Form card */}
          <div
            className="w-full rounded-3xl mt-6 lg:mt-0 backdrop-blur-xl"
            style={{
              maxWidth: "min(520px, 100%)",
              padding: "clamp(18px, 2.6vw, 36px) clamp(20px, 3vw, 40px)",
              background: "rgba(10, 8, 38, 0.78)",
              boxShadow:
                "0 0 60px 8px rgba(124,92,191,0.18), 0 24px 64px -12px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Heading */}
            <h1 className="font-extrabold text-white leading-none tracking-tight" style={{ fontSize: "clamp(24px, 3vw, 34px)" }}>
              {onboardingToken ? "Complete your account" : "Create Account"}
            </h1>
            <p className="mt-3 text-[15px] text-white/60">
              {onboardingToken
                ? "Just a few more details and you're in."
                : "Fill in your details to get started."}
            </p>

            {/* Google onboarding banner — explains why password field is hidden */}
            {onboardingToken && (
              <div
                className="mt-4 flex items-start gap-3 rounded-xl px-3.5 py-3 border"
                style={{
                  background: "rgba(124,92,191,0.10)",
                  borderColor: "rgba(167,139,250,0.30)",
                }}
              >
                <GoogleIcon className="w-[18px] h-[18px] flex-shrink-0 mt-0.5" />
                <div className="text-[12.5px] text-violet-100 leading-snug">
                  <span className="font-semibold">Continuing with Google</span>
                  {formData.email ? <> as <span className="text-white">{formData.email}</span></> : null}
                  {" — "}no password needed.
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={onSubmit} className="mt-6 space-y-4">

              {/* Row 1: First Name + Last Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "firstName", label: "First Name", placeholder: "John" },
                  { name: "lastName",  label: "Last Name",  placeholder: "Doe"  },
                ].map((f) => (
                  <div key={f.name}>
                    <label htmlFor={f.name} className="block text-[13px] font-bold text-white/90 mb-1.5">
                      {f.label}
                    </label>
                    <div className="relative">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40 pointer-events-none"
                        strokeWidth={2}
                      />
                      <input
                        id={f.name}
                        name={f.name}
                        type="text"
                        required
                        value={(formData as any)[f.name] || ""}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className="w-full h-[44px] pl-11 pr-4 rounded-xl text-[13.5px] text-white placeholder:text-white/35 border outline-none transition-all bg-white/5 border-white/10 hover:border-violet-400/40 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-[13px] font-bold text-white/90 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40 pointer-events-none"
                    strokeWidth={2}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email || ""}
                    onChange={handleChange}
                    placeholder="john.doe@example.com"
                    autoComplete="email"
                    className="w-full h-[44px] pl-11 pr-4 rounded-xl text-[13.5px] text-white placeholder:text-white/35 border outline-none transition-all bg-white/5 border-white/10 hover:border-violet-400/40 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* ════════════════════════════════════════════════════════
                  Row: Account Type + Phone Number (same row)
              ════════════════════════════════════════════════════════ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Account Type — custom dropdown */}
                <div>
                  <label className="block text-[13px] font-bold text-white/90 mb-1.5">
                    Account Type
                  </label>
                  <div ref={accDropdownRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setAccTypeOpen((o) => !o)}
                      className={`w-full h-[44px] pl-11 pr-11 rounded-xl border text-left text-[13.5px] transition-all flex items-center ${
                        accTypeOpen
                          ? "border-violet-400 ring-4 ring-violet-500/20 bg-white/[0.07]"
                          : "border-white/10 hover:border-violet-400/40 bg-white/5"
                      } ${selectedAcc ? "text-white" : "text-white/40"}`}
                    >
                      {selectedAcc ? (
                        <selectedAcc.icon
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-violet-300"
                          strokeWidth={2}
                        />
                      ) : (
                        <User
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40"
                          strokeWidth={2}
                        />
                      )}
                      <span className="truncate">{selectedAcc ? selectedAcc.label : "Select account type"}</span>
                      <ChevronDown
                        className={`absolute right-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/50 transition-transform ${accTypeOpen ? "rotate-180" : ""}`}
                        strokeWidth={2}
                      />
                    </button>

                    <AnimatePresence>
                      {accTypeOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0,  scale: 1    }}
                          exit={{    opacity: 0, y: -6, scale: 0.98 }}
                          transition={{ duration: 0.16, ease: "easeOut" }}
                          className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 rounded-xl overflow-hidden backdrop-blur-xl"
                          style={{
                            background: "rgba(15, 12, 55, 0.96)",
                            border:     "1px solid rgba(139, 92, 246, 0.30)",
                            boxShadow:  "0 16px 40px -8px rgba(0,0,0,0.55), 0 0 24px rgba(139,92,246,0.22)",
                          }}
                        >
                          {ACCOUNT_TYPES.map((opt) => {
                            const isSelected = formData.accountType === opt.value;
                            const Icon = opt.icon;
                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => selectAccountType(opt.value)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-[14px] transition-colors ${
                                  isSelected
                                    ? "bg-violet-500/20 text-violet-100 font-semibold"
                                    : "text-white/75 hover:bg-white/[0.06]"
                                }`}
                              >
                                <Icon
                                  className={`w-[18px] h-[18px] ${isSelected ? "text-violet-300" : "text-white/50"}`}
                                  strokeWidth={2}
                                />
                                <span className="flex-1">{opt.label}</span>
                                {isSelected && <Check className="w-4 h-4 text-violet-300" strokeWidth={2.6} />}
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Phone Number — same row as Account Type */}
                <div>
                  <label htmlFor="phoneNumber" className="block text-[13px] font-bold text-white/90 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40 pointer-events-none"
                      strokeWidth={2}
                    />
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber || ""}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      autoComplete="tel"
                      className="w-full h-[44px] pl-11 pr-4 rounded-xl text-[13.5px] text-white placeholder:text-white/35 border outline-none transition-all bg-white/5 border-white/10 hover:border-violet-400/40 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Company Name — conditional, full-width below the row */}
              <AnimatePresence initial={false}>
                {formData.accountType === "organization" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{    opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div className="pt-1">
                      <label htmlFor="companyName" className="block text-[13px] font-bold text-white/90 mb-1.5">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40 pointer-events-none"
                          strokeWidth={2}
                        />
                        <input
                          id="companyName"
                          name="companyName"
                          type="text"
                          required
                          value={formData.companyName || ""}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="w-full h-[44px] pl-11 pr-4 rounded-xl text-[13.5px] text-white placeholder:text-white/35 border outline-none transition-all bg-white/5 border-white/10 hover:border-violet-400/40 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password — hidden during Google onboarding (backend ignores it). */}
              {!onboardingToken && (
                <div>
                  <label htmlFor="password" className="block text-[13px] font-bold text-white/90 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/40 pointer-events-none"
                      strokeWidth={2}
                    />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password || ""}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      autoComplete="new-password"
                      className="w-full h-[44px] pl-11 pr-11 rounded-xl text-[13.5px] text-white placeholder:text-white/35 border outline-none transition-all bg-white/5 border-white/10 hover:border-violet-400/40 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/45 hover:text-white transition-colors"
                    >
                      {showPassword
                        ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                        : <Eye    className="w-[18px] h-[18px]" strokeWidth={2} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit button — multi-state with smooth transitions */}
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                whileHover={!isSubmitting && submitStatus !== "success" ? { y: -2 } : undefined}
                whileTap={!isSubmitting && submitStatus !== "success" ? { y: 0 } : undefined}
                className="w-full h-[48px] mt-2 rounded-xl text-white font-bold text-[14px] flex items-center justify-center gap-2 transition-shadow disabled:cursor-default"
                style={{
                  background:
                    submitStatus === "success"
                      ? "linear-gradient(90deg, #059669 0%, #10b981 50%, #34d399 100%)"
                      : "linear-gradient(90deg, #6d28d9 0%, #7c3aed 50%, #8b5cf6 100%)",
                  boxShadow:
                    submitStatus === "success"
                      ? "0 8px 24px -4px rgba(16,185,129,0.45)"
                      : "0 4px 16px -2px rgba(124,58,237,0.40)",
                  opacity: isSubmitting ? 0.85 : 1,
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSubmitting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.4} />
                      Creating account...
                    </motion.span>
                  ) : submitStatus === "success" ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{    opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" strokeWidth={2.4} />
                      Account created!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{    opacity: 0, y: -6 }}
                      className="flex items-center gap-2"
                    >
                      {onboardingToken ? "Finish & continue" : "Start Free Trial"}
                      <ArrowRight className="w-5 h-5" strokeWidth={2.4} />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Error banner */}
              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: "auto" }}
                    exit={{    opacity: 0, y: -8, height: 0 }}
                    className="text-sm rounded-xl px-4 py-3 bg-red-500/10 border border-red-400/30 text-red-200"
                  >
                    Something went wrong. Please check your details and try again.
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OR + Google — hidden during Google onboarding (user already came from Google). */}
              {!onboardingToken && (
                <>
                  <div className="flex items-center gap-4 py-1 pt-2">
                    <div className="flex-1 h-px bg-white/10" />
                    <span className="text-[12px] font-medium text-white/45 tracking-wider">OR</span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full h-[44px] rounded-xl bg-white/5 border border-white/10 hover:border-white/25 hover:bg-white/[0.09] flex items-center justify-center gap-3 text-[13.5px] font-semibold text-white transition-all"
                  >
                    <GoogleIcon className="w-[18px] h-[18px]" />
                    Continue with Google
                  </button>
                </>
              )}

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 pt-2 text-[12.5px] text-white/50">
                <ShieldCheck className="w-4 h-4" strokeWidth={2} />
                <span>Secure &amp; private. We&apos;ll never share your information.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;