import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Home,
  Users,
  BarChart3,
  Calendar,
  MessageCircle,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Shield,
  Star,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

// TrendingUp inline since it might not exist in all lucide versions
const TrendingUpIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

interface OnboardingStep {
  id: string;
  icon: React.ReactNode;
  accentColor: string;
  gradientFrom: string;
  gradientTo: string;
  tag: string;
  title: string;
  description: string;
  bullets: { icon: React.ReactNode; text: string }[];
  visual: React.ReactNode;
}

// ─────────────────────────────────────────────
// Visuals
// ─────────────────────────────────────────────
const AvatarVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div
      className="relative w-36 h-36 rounded-3xl flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg, rgba(124,92,191,0.25) 0%, rgba(124,92,191,0.08) 100%)",
        border: "1.5px solid rgba(124,92,191,0.4)",
        boxShadow: "0 0 60px 10px rgba(124,92,191,0.2)",
      }}
    >
      <Bot size={64} className="text-[#9b6dff]" />
    </div>
    <motion.div
      className="absolute top-2 right-4 px-3 py-1.5 rounded-xl text-xs font-semibold"
      style={{ background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.4)", color: "#c4a3ff" }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      AI Powered
    </motion.div>
    <motion.div
      className="absolute bottom-4 left-2 px-3 py-1.5 rounded-xl text-xs font-semibold"
      style={{ background: "rgba(124,92,191,0.2)", border: "1px solid rgba(124,92,191,0.4)", color: "#c4a3ff" }}
      animate={{ y: [0, 4, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
    >
      24/7 Active
    </motion.div>
  </div>
);

const LeadsVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="space-y-2.5 w-full max-w-[200px]">
      {[
        { name: "Sarah Johnson", time: "2m ago", status: "New Lead" },
        { name: "Mike Peterson", time: "15m ago", status: "Viewing" },
        { name: "Emma Wilson", time: "1h ago", status: "Interested" },
      ].map((lead, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.25)" }}
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "rgba(59,130,246,0.3)", color: "#60a5fa" }}>
            {lead.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{lead.name}</p>
            <p className="text-white/40 text-[10px]">{lead.time}</p>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(59,130,246,0.2)", color: "#93c5fd" }}>{lead.status}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

const PropertiesVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="grid grid-cols-2 gap-2 w-full max-w-[200px]">
      {[
        { label: "Studio", beds: "1 bed", price: "$1,200/mo", color: "#06b6d4", rgb: "6,182,212" },
        { label: "Family", beds: "3 beds", price: "$2,800/mo", color: "#10b981", rgb: "16,185,129" },
        { label: "Luxury", beds: "4 beds", price: "$5,500/mo", color: "#f59e0b", rgb: "245,158,11" },
        { label: "Condo", beds: "2 beds", price: "$1,900/mo", color: "#ec4899", rgb: "236,72,153" },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="p-2.5 rounded-xl"
          style={{ background: `rgba(${p.rgb},0.1)`, border: `1px solid ${p.color}40` }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <Home size={18} style={{ color: p.color }} className="mb-1.5" />
          <p className="text-white text-[11px] font-semibold">{p.label}</p>
          <p className="text-white/50 text-[10px]">{p.beds}</p>
          <p className="text-[10px] font-medium mt-1" style={{ color: p.color }}>{p.price}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

const AnalyticsVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-full max-w-[200px]">
      <div className="flex items-end gap-2 h-24 mb-3">
        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
          <motion.div
            key={i}
            className="flex-1 rounded-t-md"
            style={{ background: "linear-gradient(to top, rgba(16,185,129,0.8), rgba(16,185,129,0.3))", minHeight: 4 }}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[{ label: "Leads", val: "248" }, { label: "Views", val: "3.2K" }, { label: "Conv.", val: "18%" }].map((s, i) => (
          <div key={i} className="text-center p-1.5 rounded-lg" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}>
            <p className="text-[#34d399] text-sm font-bold">{s.val}</p>
            <p className="text-white/40 text-[10px]">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const VisitsVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="w-full max-w-[200px] space-y-2">
      <div className="flex items-center justify-between px-1 mb-1">
        <span className="text-white/60 text-[11px]">June 2025</span>
        <Calendar size={14} className="text-[#f59e0b]" />
      </div>
      {[
        { time: "9:00 AM", name: "John D.", type: "Video Tour" },
        { time: "11:30 AM", name: "Lisa M.", type: "In-Person" },
        { time: "2:00 PM", name: "Tom B.", type: "Virtual" },
      ].map((v, i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 p-2 rounded-xl"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.25)" }}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: i * 0.15 }}
        >
          <div className="text-[#fbbf24] text-[10px] font-bold w-14 shrink-0">{v.time}</div>
          <div className="flex-1">
            <p className="text-white text-[11px] font-medium">{v.name}</p>
            <p className="text-white/40 text-[10px]">{v.type}</p>
          </div>
          <CheckCircle2 size={14} className="text-[#fbbf24]" />
        </motion.div>
      ))}
    </div>
  </div>
);

const WelcomeVisual = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <motion.div className="relative" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}>
      <div
        className="w-32 h-32 rounded-[2rem] flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)", boxShadow: "0 0 80px 20px rgba(14,165,233,0.3)" }}
      >
        <Home size={56} className="text-white" />
      </div>
      {[
        { style: { top: "-12px", left: "50%" }, delay: 0 },
        { style: { top: "20%", right: "-16px" }, delay: 0.5 },
        { style: { bottom: "10%", left: "-14px" }, delay: 1 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={s.style as React.CSSProperties}
          animate={{ y: [0, -8, 0], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
        >
          <Star size={18} className="text-[#fbbf24] fill-[#fbbf24]" />
        </motion.div>
      ))}
    </motion.div>
    <motion.div
      className="absolute bottom-0 px-4 py-2 rounded-xl text-sm font-semibold text-white"
      style={{ background: "rgba(14,165,233,0.25)", border: "1px solid rgba(14,165,233,0.4)" }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, delay: 1 }}
    >
      ✨ Smart Real Estate
    </motion.div>
  </div>
);

// ─────────────────────────────────────────────
// Steps
// ─────────────────────────────────────────────
const STEPS: OnboardingStep[] = [
  {
    id: "welcome",
    icon: <Sparkles size={22} />,
    accentColor: "#0ea5e9",
    gradientFrom: "rgba(14,165,233,0.15)",
    gradientTo: "rgba(14,165,233,0.03)",
    tag: "Welcome to",
    title: "Nex-Estate",
    description: "Your AI-powered virtual sales platform that transforms how real estate professionals connect with clients.",
    bullets: [
      { icon: <Bot size={14} />, text: "AI avatars available 24/7" },
      { icon: <Zap size={14} />, text: "Deploy in minutes, not days" },
      { icon: <Shield size={14} />, text: "Enterprise-grade security" },
    ],
    visual: <WelcomeVisual />,
  },
  {
    id: "avatars",
    icon: <Bot size={22} />,
    accentColor: "#9b6dff",
    gradientFrom: "rgba(155,109,255,0.15)",
    gradientTo: "rgba(155,109,255,0.03)",
    tag: "Feature 01",
    title: "AI Avatar Agents",
    description: "Deploy intelligent AI avatars that look, sound, and respond like real estate experts. Each avatar learns from your listings and engages buyers autonomously.",
    bullets: [
      { icon: <Bot size={14} />, text: "Custom voice & appearance" },
      { icon: <MessageCircle size={14} />, text: "Natural conversation AI" },
      { icon: <Zap size={14} />, text: "Instant property knowledge" },
    ],
    visual: <AvatarVisual />,
  },
  {
    id: "leads",
    icon: <Users size={22} />,
    accentColor: "#3b82f6",
    gradientFrom: "rgba(59,130,246,0.15)",
    gradientTo: "rgba(59,130,246,0.03)",
    tag: "Feature 02",
    title: "Smart Lead Capture",
    description: "Never miss a lead again. Your AI avatars engage every visitor 24/7 via chat, voice, and video — capturing and qualifying leads while you sleep.",
    bullets: [
      { icon: <MessageCircle size={14} />, text: "Live chat & WebRTC video" },
      { icon: <Users size={14} />, text: "Automatic lead scoring" },
      { icon: <Zap size={14} />, text: "Real-time agent takeover" },
    ],
    visual: <LeadsVisual />,
  },
  {
    id: "properties",
    icon: <Home size={22} />,
    accentColor: "#06b6d4",
    gradientFrom: "rgba(6,182,212,0.15)",
    gradientTo: "rgba(6,182,212,0.03)",
    tag: "Feature 03",
    title: "Property Management",
    description: "Organize your entire portfolio in one place. Add listings with rich media, link them to your avatars, and let AI match buyers to the perfect properties.",
    bullets: [
      { icon: <Home size={14} />, text: "Rich media listings" },
      { icon: <Star size={14} />, text: "AI-powered matching" },
      { icon: <BarChart3 size={14} />, text: "Performance insights" },
    ],
    visual: <PropertiesVisual />,
  },
  {
    id: "visits",
    icon: <Calendar size={22} />,
    accentColor: "#f59e0b",
    gradientFrom: "rgba(245,158,11,0.15)",
    gradientTo: "rgba(245,158,11,0.03)",
    tag: "Feature 04",
    title: "Visit Scheduling",
    description: "AI handles all scheduling automatically. Buyers book virtual or in-person visits directly with your avatars — no back-and-forth, no missed appointments.",
    bullets: [
      { icon: <Calendar size={14} />, text: "Virtual & in-person tours" },
      { icon: <Zap size={14} />, text: "Automated reminders" },
      { icon: <CheckCircle2 size={14} />, text: "Calendar sync" },
    ],
    visual: <VisitsVisual />,
  },
  {
    id: "analytics",
    icon: <BarChart3 size={22} />,
    accentColor: "#10b981",
    gradientFrom: "rgba(16,185,129,0.15)",
    gradientTo: "rgba(16,185,129,0.03)",
    tag: "Feature 05",
    title: "Powerful Analytics",
    description: "Deep insights into every interaction. Track lead sources, avatar performance, conversion rates, and property views — all in a beautiful real-time dashboard.",
    bullets: [
      { icon: <BarChart3 size={14} />, text: "Real-time dashboards" },
      { icon: <TrendingUpIcon size={14} />, text: "Conversion funnels" },
      { icon: <Star size={14} />, text: "Avatar performance scores" },
    ],
    visual: <AnalyticsVisual />,
  },
];

// ─────────────────────────────────────────────
// Progress Dots
// ─────────────────────────────────────────────
const ProgressDots = ({ total, current, accentColor }: { total: number; current: number; accentColor: string }) => (
  <div className="flex items-center gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <motion.div
        key={i}
        className="rounded-full"
        style={{ background: i === current ? accentColor : "rgba(255,255,255,0.15)" }}
        animate={{ width: i === current ? 24 : 6, height: 6 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      />
    ))}
  </div>
);

const ONBOARDING_KEY = "nex_estate_onboarding_v1";

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
const OnboardingFlow: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(ONBOARDING_KEY);
    if (!seen) {
      const t = setTimeout(() => setVisible(true), 700);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      localStorage.setItem(ONBOARDING_KEY, "true");
    }, 350);
  }, []);

  const goNext = useCallback(() => {
    if (currentStep >= STEPS.length - 1) { dismiss(); return; }
    setDirection(1);
    setCurrentStep((s) => s + 1);
  }, [currentStep, dismiss]);

  const goPrev = useCallback(() => {
    if (currentStep <= 0) return;
    setDirection(-1);
    setCurrentStep((s) => s - 1);
  }, [currentStep]);

  useEffect(() => {
    if (!visible) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Enter") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [visible, goNext, goPrev, dismiss]);

  if (!visible) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -50, opacity: 0 }),
  };

  return (
    <AnimatePresence>
      {!closing && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            className="fixed inset-0 z-[999]"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
          />

          {/* Dialog */}
          <motion.div
            key="dialog"
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[760px] rounded-[2.5rem] overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #0c1228 0%, #07091e 100%)",
                border: `1px solid ${step.accentColor}28`,
                boxShadow: `0 50px 120px -20px rgba(0,0,0,0.85), 0 0 0 1px ${step.accentColor}12, inset 0 1px 0 rgba(255,255,255,0.04)`,
              }}
              initial={{ scale: 0.88, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.94, y: 20, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.175, 0.885, 0.32, 1.1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top accent line */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{ background: `linear-gradient(90deg, transparent 0%, ${step.accentColor} 50%, transparent 100%)` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />

              {/* Background radial glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 75% 10%, ${step.accentColor}12 0%, transparent 55%)` }}
              />

              {/* Close */}
              <button
                onClick={dismiss}
                className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full flex items-center justify-center group transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
                aria-label="Close"
              >
                <X size={16} className="text-white/50 group-hover:text-white/90 transition-colors" />
              </button>

              <div className="flex flex-col md:flex-row min-h-[480px]">
                {/* ─── Left ─── */}
                <div className="flex flex-col justify-between p-9 md:p-11 flex-1">
                  <div>
                    {/* Tag pill */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step.id + "-tag"}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-6"
                        style={{ background: `${step.accentColor}18`, border: `1px solid ${step.accentColor}40`, color: step.accentColor }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span style={{ color: step.accentColor }}>{step.icon}</span>
                        {step.tag}
                      </motion.div>
                    </AnimatePresence>

                    {/* Title */}
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.h2
                        key={step.id + "-title"}
                        className="text-4xl md:text-[2.6rem] font-black text-white leading-tight mb-4"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                      >
                        {step.title}
                      </motion.h2>
                    </AnimatePresence>

                    {/* Description */}
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.p
                        key={step.id + "-desc"}
                        className="text-white/55 text-[15px] leading-relaxed mb-7"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.28, delay: 0.05, ease: "easeInOut" }}
                      >
                        {step.description}
                      </motion.p>
                    </AnimatePresence>

                    {/* Bullets */}
                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={step.id + "-bullets"}
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        {step.bullets.map((b, i) => (
                          <motion.li
                            key={i}
                            className="flex items-center gap-3 text-sm"
                            initial={{ x: -16, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.08 + 0.1 }}
                          >
                            <span
                              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${step.accentColor}18`, color: step.accentColor }}
                            >
                              {b.icon}
                            </span>
                            <span className="text-white/75 font-medium">{b.text}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between mt-9">
                    <ProgressDots total={STEPS.length} current={currentStep} accentColor={step.accentColor} />
                    <div className="flex items-center gap-2">
                      {currentStep > 0 && (
                        <button
                          onClick={goPrev}
                          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
                          aria-label="Previous"
                        >
                          <ChevronLeft size={18} className="text-white/60" />
                        </button>
                      )}
                      <motion.button
                        onClick={goNext}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg"
                        style={{ background: `linear-gradient(135deg, ${step.accentColor} 0%, ${step.accentColor}bb 100%)`, boxShadow: `0 4px 24px ${step.accentColor}50` }}
                        whileHover={{ scale: 1.05, boxShadow: `0 6px 30px ${step.accentColor}70` }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {isLast ? (<>Get Started <ArrowRight size={15} /></>) : (<>Next <ChevronRight size={15} /></>)}
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* ─── Right Visual Panel ─── */}
                <div
                  className="relative md:w-[280px] h-[220px] md:h-auto flex items-center justify-center p-7 overflow-hidden shrink-0"
                  style={{
                    background: `linear-gradient(145deg, ${step.gradientFrom} 0%, ${step.gradientTo} 100%)`,
                    borderLeft: `1px solid ${step.accentColor}18`,
                  }}
                >
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                      backgroundImage: `linear-gradient(${step.accentColor} 1px, transparent 1px), linear-gradient(90deg, ${step.accentColor} 1px, transparent 1px)`,
                      backgroundSize: "28px 28px",
                    }}
                  />
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step.id + "-visual"}
                      className="relative z-10 w-full h-full"
                      custom={direction}
                      variants={{
                        enter: (dir: number) => ({ x: dir * 40, opacity: 0 }),
                        center: { x: 0, opacity: 1 },
                        exit: (dir: number) => ({ x: dir * -40, opacity: 0 }),
                      }}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.32, ease: "easeInOut" }}
                    >
                      {step.visual}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Skip */}
              <div className="px-10 pb-6 pt-0 flex justify-center">
                <button
                  onClick={dismiss}
                  className="text-xs text-white/25 hover:text-white/55 transition-colors"
                >
                  Skip introduction · Press Esc to close
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default OnboardingFlow;
