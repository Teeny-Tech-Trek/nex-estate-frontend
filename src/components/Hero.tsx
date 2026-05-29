import { motion } from "framer-motion";
import {
  ArrowRight, MessageCircle, Calendar, UserCheck, TrendingUp,
  Lock, Users, Zap, Home as HomeIcon, Send, Bot,
} from "lucide-react";
import { useEffect, useState } from "react";
import React from "react";


// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const CHAT_MESSAGES: { role: "ai" | "user"; text: string }[] = [
  { role: "ai",   text: "Hi 👋 I'm your AI real estate agent." },
  { role: "ai",   text: "How can I help you today?" },
  { role: "user", text: "Sure! I can help you find the perfect property." },
];

const QUICK_CHIPS = [
  { icon: HomeIcon,      label: "View Properties"  },
  { icon: Calendar,      label: "Schedule a Visit" },
  { icon: MessageCircle, label: "Ask a Question"   },
];

// ─────────────────────────────────────────────
// Hook: typing chat with looping cycle
// ─────────────────────────────────────────────
const useTypingChat = () => {
  const [completed, setCompleted] = useState<typeof CHAT_MESSAGES>([]);
  const [msgIdx, setMsgIdx]       = useState(0);
  const [charIdx, setCharIdx]     = useState(0);
  const [phase, setPhase]         = useState<"dots" | "typing">("dots");

  useEffect(() => {
    if (msgIdx >= CHAT_MESSAGES.length) {
      const t = setTimeout(() => {
        setCompleted([]); setMsgIdx(0); setCharIdx(0); setPhase("dots");
      }, 3500);
      return () => clearTimeout(t);
    }
    if (phase === "dots") {
      const t = setTimeout(() => setPhase("typing"), 750);
      return () => clearTimeout(t);
    }
    const target = CHAT_MESSAGES[msgIdx].text;
    const chars  = Array.from(target);
    if (charIdx < chars.length) {
      const t = setTimeout(() => setCharIdx(p => p + 1), 38);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCompleted(prev => [...prev, CHAT_MESSAGES[msgIdx]]);
        setCharIdx(0);
        setMsgIdx(p => p + 1);
        setPhase("dots");
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [msgIdx, charIdx, phase]);

  const target = CHAT_MESSAGES[msgIdx]?.text || "";
  const currentText = Array.from(target).slice(0, charIdx).join("");
  return { completed, msgIdx, currentText, phase };
};

// ─────────────────────────────────────────────
// Hook: looping counter
// ─────────────────────────────────────────────
const useLoopingCounter = (target: number, runMs = 1500, holdMs = 5000) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame = 0;
    let timeout = 0;
    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      setValue(0);
      const start = performance.now();
      const tick = (now: number) => {
        if (cancelled) return;
        const t = Math.min((now - start) / runMs, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(Math.round(target * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
        else timeout = window.setTimeout(loop, holdMs);
      };
      frame = requestAnimationFrame(tick);
    };
    loop();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timeout);
    };
  }, [target, runMs, holdMs]);
  return value;
};

// ─────────────────────────────────────────────
// FloatingBadge — top-arc feature badges
// ─────────────────────────────────────────────
interface BadgeProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  style?: React.CSSProperties;
  delay: number;
  floatDir?: 1 | -1;
  mobile?: boolean;
}
const FloatingBadge: React.FC<BadgeProps> = ({ icon: Icon, title, subtitle, style, delay, floatDir = 1, mobile = false }) => (
  <motion.div
    initial={{ opacity: 0, y: mobile ? 10 : -20, scale: mobile ? 1 : 0.85 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, duration: 0.7, ease: "easeOut" }}
    style={mobile ? undefined : style}
    className={
      mobile
        ? "relative w-full h-full"
        : "hidden lg:block absolute z-20 w-[clamp(140px,14vw,170px)]"
    }
  >
    <motion.div
      animate={mobile ? undefined : { y: [0, -6 * floatDir, 0] }}
      transition={mobile ? undefined : { duration: 3.2 + delay, repeat: Infinity, ease: "easeInOut" }}
      className="flex items-start gap-[9px] px-3 py-2.5 rounded-xl backdrop-blur-md border border-[rgba(196,181,253,0.75)] bg-[rgba(15,10,40,0.85)] h-full"
      style={{
        boxShadow:
          "0 0 22px rgba(124,58,237,0.25), 0 8px 24px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex-shrink-0 w-[26px] h-[26px] rounded-[7px] flex items-center justify-center border border-[rgba(196,181,253,0.85)] text-[#d8b4fe]"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.30), rgba(124,58,237,0.15))",
          boxShadow:  "0 0 10px rgba(167,139,250,0.35)",
        }}
      >
        <Icon size={16} strokeWidth={2.2} />
      </div>
      <div className="min-w-0">
        <div className="font-bold text-xs text-white leading-tight mb-0.5">{title}</div>
        <div className="text-[10.5px] leading-[1.35] text-white/[0.58]">{subtitle}</div>
      </div>
    </motion.div>
  </motion.div>
);

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
const MetricTile: React.FC<{
  icon: React.ElementType; value: string | number; label: string;
}> = ({ icon: Icon, value, label }) => (
  <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] flex flex-col gap-[3px]">
    <div className="w-5 h-5 rounded-md flex items-center justify-center bg-[rgba(167,139,250,0.18)] text-[#d8b4fe] mb-0.5">
      <Icon size={14} strokeWidth={2.4} />
    </div>
    <div className="font-extrabold text-base text-white leading-none">{value}</div>
    <div className="text-[8.5px] text-white/50 leading-tight">{label}</div>
  </div>
);

const LineChart: React.FC<{ cycleKey: number }> = ({ cycleKey }) => {
  const points = [
    [0, 55], [28, 50], [54, 42], [80, 38], [108, 30],
    [136, 24], [162, 18], [190, 12], [220, 6],
  ];
  const path = points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");

  return (
    <svg viewBox="0 0 220 70" className="w-full h-[50px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <filter id="chartGlow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <line x1="0" y1="68" x2="220" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <motion.path
        key={cycleKey}
        d={path}
        fill="none"
        stroke="url(#chartGrad)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#chartGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
      />
      {points.map((p, i) => (
        <motion.circle
          key={`${cycleKey}-${i}`}
          cx={p[0]} cy={p[1]} r="2.4"
          fill="#c4b5fd"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.15 + i * 0.18 }}
        />
      ))}
    </svg>
  );
};

const Dashboard: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const leads    = useLoopingCounter(128, 1400, 5500);
  const appts    = useLoopingCounter(45,  1400, 5500);
  const response = useLoopingCounter(92,  1400, 5500);

  const [cycleKey, setCycleKey] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setCycleKey(k => k + 1), 6900);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7 }}
      className={
        mobile
          ? "relative w-full p-[10px_10px_9px] rounded-[12px] backdrop-blur-[12px] border border-[rgba(196,181,253,0.7)] bg-[rgba(10,8,38,0.88)]"
          : "hidden lg:block absolute bottom-[4%] -left-[2%] z-[25] w-[clamp(220px,22vw,260px)] p-[14px_14px_12px] rounded-[14px] backdrop-blur-[14px] border border-[rgba(196,181,253,0.7)] bg-[rgba(10,8,38,0.88)]"
      }
      style={{
        boxShadow:
          "0 0 30px rgba(124,58,237,0.28), 0 14px 38px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="font-bold text-[13px] text-white mb-3">Agent Dashboard</div>
      <div className="grid grid-cols-3 gap-2 mb-2.5">
        <MetricTile icon={Users}    value={leads}          label="Leads Qualified" />
        <MetricTile icon={Calendar} value={appts}          label="Appointments"    />
        <MetricTile icon={Zap}      value={`${response}%`} label="Response Rate"   />
      </div>
      <LineChart cycleKey={cycleKey} />
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Phone with chat
// ─────────────────────────────────────────────
const ChatBubble: React.FC<{ role: "ai" | "user"; children: React.ReactNode }> = ({ role, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.25 }}
    className={`flex items-end gap-1 ${role === "user" ? "justify-end" : ""}`}
  >
    {role === "ai" && (
      <div className="w-[18px] h-[18px] rounded-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-violet-700 text-white flex-shrink-0">
        <Bot size={11} strokeWidth={2.4} />
      </div>
    )}
    <div
      className={`text-[9.5px] font-normal text-white px-[9px] py-[6px] rounded-[10px] leading-[1.4] max-w-[80%] break-words ${
        role === "ai"
          ? "bg-white/[0.07] rounded-bl-[4px]"
          : "bg-gradient-to-br from-violet-600 to-indigo-500 rounded-br-[4px]"
      }`}
    >
      {children}
    </div>
  </motion.div>
);

const TypingDots: React.FC = () => (
  <div className="typing-dots flex gap-[3px] py-[2px]">
    <span /><span /><span />
  </div>
);

const Phone: React.FC<{ mobile?: boolean }> = ({ mobile = false }) => {
  const { completed, msgIdx, currentText, phase } = useTypingChat();
  const showingTypingBubble = msgIdx < CHAT_MESSAGES.length && phase === "dots";
  const showingPartial      = msgIdx < CHAT_MESSAGES.length && phase === "typing";
  const currentRole         = CHAT_MESSAGES[msgIdx]?.role || "ai";

  return (
    <motion.div
      initial={{ opacity: 0, x: mobile ? 0 : 40, y: 20 }}
      animate={{ opacity: 1, x: 0,  y: 0  }}
      transition={{ delay: 0.7, duration: 0.8 }}
      className={
        mobile
          ? "relative w-full aspect-[9/19] p-[5px] rounded-[24px] border-[1.5px] border-[rgba(196,181,253,0.75)]"
          : "hidden lg:block absolute -right-[4%] top-[14%] z-[30] w-[clamp(170px,17vw,195px)] aspect-[9/19] p-[6px] rounded-[30px] border-[1.5px] border-[rgba(196,181,253,0.75)]"
      }
      style={{
        background: "linear-gradient(180deg, #1a1530, #0b0820)",
        boxShadow: "0 0 30px rgba(124,58,237,0.30), 0 20px 50px rgba(0,0,0,0.6)",
      }}
    >
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-full h-full rounded-[24px] bg-[#0a0820] overflow-hidden flex flex-col"
      >
        {/* notch */}
        <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[38%] h-[12px] bg-black rounded-full z-[5]" />

        {/* status bar */}
        <div className="flex justify-between items-center pt-2 pb-1 px-[14px] text-[9px] font-semibold text-white">
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <span className="text-[7px] tracking-[-1px]">●●●●</span>
            <span className="relative inline-block w-[13px] h-[7px] border border-white rounded-[1.5px] before:content-[''] before:absolute before:inset-[1px_4px_1px_1px] before:bg-white after:content-[''] after:absolute after:-right-[2.5px] after:top-[1.5px] after:w-[1.5px] after:h-1 after:bg-white after:rounded-r-sm" />
          </span>
        </div>

        {/* chat header */}
        <div className="flex items-center gap-[7px] px-3 py-2 border-b border-white/[0.05]">
          <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-br from-violet-400 to-violet-700 text-white flex-shrink-0">
            <HomeIcon size={13} strokeWidth={2.4} />
          </div>
          <div>
            <div className="font-bold text-[11px] text-white">NexEstate Agent</div>
            <div className="font-normal text-[8.5px] text-green-400 flex items-center gap-[3px]">
              <span className="w-[5px] h-[5px] rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
              Online
            </div>
          </div>
        </div>

        {/* messages */}
        <div className="flex-1 overflow-hidden px-2 pt-2.5 pb-2 flex flex-col gap-1.5 min-h-0">
          {completed.map((m, i) => (
            <ChatBubble key={`done-${i}`} role={m.role}>{m.text}</ChatBubble>
          ))}
          {showingPartial && currentText && (
            <ChatBubble role={currentRole}>
              {currentText}<span className="caret inline-block w-px ml-px" />
            </ChatBubble>
          )}
          {showingTypingBubble && (
            <ChatBubble role={currentRole}><TypingDots /></ChatBubble>
          )}
        </div>

        {/* quick chips */}
        <div className="flex flex-col gap-1 px-2 py-1.5">
          {QUICK_CHIPS.map((c, i) => (
            <div key={i} className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] text-[9.5px] text-white/85">
              <c.icon size={11} strokeWidth={2.4} className="text-[#c4b5fd] flex-shrink-0" />
              <span>{c.label}</span>
            </div>
          ))}
        </div>

        {/* input bar */}
        <div className="flex items-center justify-between mx-2 mt-1 mb-2 pl-2.5 pr-1.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[9px] text-white/40">
          <span>Type your message...</span>
          <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-violet-700 text-white shadow-[0_0_10px_rgba(167,139,250,0.5)]">
            <Send size={12} strokeWidth={2.4} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Hero component
// ─────────────────────────────────────────────
const Hero = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const fadeUp = {
    initial: { opacity: 0, y: 80, filter: "blur(12px)", scale: 0.95 },
    animate: { opacity: 1, y: 0, filter: "blur(0px)", scale: 1 },
  };
  const fadeRightIn = {
    initial: { opacity: 0, x: 90, filter: "blur(14px)", scale: 0.9 },
    animate: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 },
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-start lg:items-center overflow-hidden"
      style={{
        background:    "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)",
        paddingTop:    isMobile ? "14px" : "clamp(8px, 4vh, 10px)",
        paddingBottom: isMobile ? "clamp(40px, 8vw, 60px)" : "clamp(28px, 4vh, 60px)",
      }}
    >
      {/* Only @keyframes + animation-bound classes stay in <style>.
          Everything else moved to Tailwind. */}
      <style>{`
        @keyframes shimmer     { 0%,100% { background-position: 0%; }   50% { background-position: 100%; } }
        @keyframes hero-pulse  { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.35); opacity: .7; } }
        @keyframes dash-flow   { to { stroke-dashoffset: -20; } }
        @keyframes caret-blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
        @keyframes dot-bounce  { 0%,80%,100% { transform: translateY(0); opacity: .4; } 40% { transform: translateY(-3px); opacity: 1; } }

        .hero-connectors path {
          stroke-dasharray: 4 4;
          animation: dash-flow 3s linear infinite;
          opacity: 0.85;
        }
        .caret {
          background: currentColor;
          height: 1em;
          vertical-align: middle;
          animation: caret-blink 1s steps(2) infinite;
        }
        .typing-dots span {
          width: 5px; height: 5px; border-radius: 999px;
          background: rgba(255,255,255,0.55);
          animation: dot-bounce 1.2s ease-in-out infinite;
        }
        .typing-dots span:nth-child(2) { animation-delay: 0.18s; }
        .typing-dots span:nth-child(3) { animation-delay: 0.36s; }
      `}</style>

      {/* ── Animated radial glows ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 55% 55% at 15% 50%,rgba(59,130,246,0.22) 0%,transparent 65%)",
              "radial-gradient(ellipse 55% 55% at 20% 55%,rgba(99,102,241,0.28) 0%,transparent 65%)",
              "radial-gradient(ellipse 55% 55% at 15% 50%,rgba(59,130,246,0.22) 0%,transparent 65%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 50% 60% at 85% 40%,rgba(108,63,197,0.25) 0%,transparent 65%)",
              "radial-gradient(ellipse 50% 60% at 80% 45%,rgba(139,92,246,0.30) 0%,transparent 65%)",
              "radial-gradient(ellipse 50% 60% at 85% 40%,rgba(108,63,197,0.25) 0%,transparent 65%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
          backgroundSize:  "60px 60px",
        }}
      />

      {/* ── Stars ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width:  `${Math.random() * 2 + 1}px`,
              height: `${Math.random() * 2 + 1}px`,
              left:   `${Math.random() * 100}%`,
              top:    `${Math.random() * 100}%`,
              opacity: Math.random() * 0.6 + 0.1,
              animation: `hero-pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto relative z-10 w-full" style={{ maxWidth: "1600px", padding: "0 clamp(16px, 4vw, 56px)" }}>
        <div className="flex flex-col lg:flex-row items-center" style={{ gap: "clamp(24px, 4vw, 40px)" }}>

          {/* ════════════ LEFT COLUMN ════════════ */}
          <div
            data-hero="left"
            className="w-full lg:w-1/2 flex flex-col"
            style={{ gap: "clamp(14px, 1.8vw, 28px)" }}
          >
            {/* <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full w-fit body-font bg-white/[0.07] border border-white/[0.18]"
              style={{ padding: "clamp(6px, 0.7vw, 10px) clamp(12px, 1.2vw, 18px)" }}
            >
              <div
                className="rounded-full flex items-center justify-center font-black text-white"
                style={{ background: "linear-gradient(135deg,#6c3fc5,#3b82f6)", width: "clamp(20px, 1.7vw, 24px)", height: "clamp(20px, 1.7vw, 24px)", fontSize: "clamp(8px, 0.6vw, 10px)" }}
              >
                AI
              </div>
              <span className="text-yellow-400" style={{ fontSize: "clamp(11px, 0.9vw, 14px)" }}>⚡</span>
              <span className="font-semibold text-white/90" style={{ fontSize: "clamp(11px, 0.95vw, 14px)" }}>Powered by Advanced AI</span>
            </motion.div> */}

            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
            >
              <h1 className="hero-font font-black leading-[1.06]" style={{ fontSize: "clamp(3.5rem, 5.4vw, 6.2rem)" }}>
                <span className="font-heading block font-bold text-white font-syne-bold">AI Agents for</span>
                <span
                  className="font-heading font-bold block mt-1 bg-clip-text text-transparent font-syne-bold"
                  style={{
                    background: "linear-gradient(90deg,#a78bfa,#60a5fa,#a78bfa)",
                    backgroundSize: "200%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "shimmer 4s ease infinite",
                  }}
                >
                  Real Estate
                </span>
              </h1>
              <motion.p
                initial={fadeUp.initial}
                animate={fadeUp.animate}
                transition={{ duration: 1.4, ease: "easeOut", delay: 0.35 }}
                className="font-bold mt-2 body-font text-white/75"
                style={{ fontSize: "clamp(1.3rem, 2vw, 1.95rem)" }}
              >
                That Work <span className="text-sky-400">24/7</span>
              </motion.p>
            </motion.div>

            <motion.p
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.5 }}
              className="leading-relaxed body-font text-white/60"
              style={{ fontSize: "clamp(1.1rem, 1.35vw, 1.35rem)", maxWidth: "min(580px, 100%)" }}
            >
              Transform your real estate business with intelligent AI agents that handle customer queries, schedule viewings, and close deals while you sleep.
            </motion.p>

            <motion.div
              initial={fadeUp.initial}
              animate={fadeUp.animate}
              transition={{ duration: 1.4, ease: "easeOut", delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.a
                href="/login"
                whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(108,63,197,0.5)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2 rounded-full font-black text-white body-font shadow-[0_4px_28px_rgba(108,63,197,0.45)]"
                style={{ background: "linear-gradient(135deg,#6c3fc5,#3b82f6)", padding: "clamp(13px, 1.35vw, 18px) clamp(22px, 2.4vw, 36px)", fontSize: "clamp(1rem, 1.2vw, 1.2rem)" }}
              >
                Get Started Free
                <ArrowRight style={{ width: "clamp(16px, 1.3vw, 22px)", height: "clamp(16px, 1.3vw, 22px)" }} />
              </motion.a>

              <motion.button
                onClick={() => {
                  const element = document.getElementById("showcase");
                  if (element) {
                    const elementTop = element.getBoundingClientRect().top + window.scrollY;
                    const elementHeight = element.getBoundingClientRect().height;
                    const viewportHeight = window.innerHeight;
                    const scrollTarget = elementTop - (viewportHeight - elementHeight) / 2 + 80;
                    
                    window.scrollTo({
                      top: scrollTarget,
                      behavior: "smooth"
                    });
                  }
                }}
                whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.10)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center justify-center gap-2.5 rounded-full font-semibold text-white body-font border-2 border-white/25 bg-white/[0.05] cursor-pointer"
                style={{ padding: "clamp(13px, 1.35vw, 18px) clamp(22px, 2.4vw, 36px)", fontSize: "clamp(1rem, 1.2vw, 1.2rem)" }}
              >
                <span
                  className="rounded-full bg-white flex items-center justify-center flex-shrink-0 pl-0.5"
                  style={{ width: "clamp(22px, 1.8vw, 30px)", height: "clamp(22px, 1.8vw, 30px)" }}
                >
                  <svg width="9" height="10" viewBox="0 0 9 10" fill="#0a0e2e">
                    <polygon points="1,0 9,5 1,10" />
                  </svg>
                </span>
                Watch Demo
              </motion.button>
            </motion.div>
          </div>

          {/* ════════════ RIGHT COLUMN — Hero stage ════════════ */}
          <motion.div
            data-hero="right"
            className="w-full lg:w-1/2 relative "
            style={{ perspective: "none" }}
            initial={fadeRightIn.initial}
            animate={fadeRightIn.animate}
            transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
          >
            {/* big radial glow behind */}
            <motion.div
              className="absolute rounded-full pointer-events-none w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ background: "radial-gradient(circle,rgba(108,63,197,0.38) 0%,transparent 70%)" }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div
              className="relative w-full max-w-[720px] mx-auto aspect-[1/0.82] max-lg:aspect-auto "
            >
              {/* ── Connector SVG arcs (behind house) ── */}
              <svg
                className="hero-connectors hidden lg:block absolute inset-0 z-[1] pointer-events-none overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path d="M 14 14 Q 30 25 50 45" stroke="rgba(167,139,250,0.55)" strokeWidth="0.35" fill="none" />
                <path d="M 50 4  Q 55 22 55 45" stroke="rgba(167,139,250,0.55)" strokeWidth="0.35" fill="none" />
                <path d="M 87 14 Q 72 25 60 45" stroke="rgba(167,139,250,0.55)" strokeWidth="0.35" fill="none" />
                {/* CHANGED: was M 92 40 ... (right-middle). Mirrored to left-middle to match Deal Automation's new position */}
                <path d="M 8 40 Q 20 45 35 50" stroke="rgba(167,139,250,0.55)" strokeWidth="0.35" fill="none" />
              </svg>

              {/* ── House image ── */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="lg:absolute lg:top-[18%]  lg:-translate-x-1/2 lg:w-[86%] w-full lg:z-[15] relative"
              >
                <img
                  src="https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/HeroPage-House.png"
                  alt="AI Real Estate Hero"
                  loading="eager"
                  decoding="sync"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto lg:scale-125 pointer-events-none select-none"
                  style={{
                    WebkitUserDrag: "none",
                    filter: "drop-shadow(0 0 60px rgba(108,63,197,0.35))",
                  } as React.CSSProperties}
                />
              </motion.div>

              {/* ── 4 Feature badges ── */}
              {/* CHANGED: AI Chat left -2% → 6% (closer to center per image 2) */}
              <FloatingBadge
                icon={MessageCircle}
                title="AI Chat Agent"
                subtitle="Instantly answers queries 24/7"
                style={{ top: "0%", left: "6%" }}
                delay={0.4}
                floatDir={1}
              />
              <FloatingBadge
                icon={Calendar}
                title="Smart Scheduling"
                subtitle="Books & confirms property viewings"
                style={{ top: "-6%", left: "38%" }}
                delay={0.55}
                floatDir={-1}
              />
              {/* CHANGED: Lead Intel right 0% → 6% (closer to center per image 2) */}
              <FloatingBadge
                icon={UserCheck}
                title="Lead Intelligence"
                subtitle="Qualifies & scores leads automatically"
                style={{ top: "0%", right: "6%" }}
                delay={0.7}
                floatDir={1}
              />
              {/* CHANGED: was right: -4% (hidden behind phone). Moved to left-middle so it's visible and balances the phone on the right */}
              <FloatingBadge
                icon={TrendingUp}
                title="Deal Automation"
                subtitle="Follows up & closes deals on autopilot"
                style={{ top: "38%", left: "-4%" }}
                delay={0.85}
                floatDir={-1}
              />

              {/* ── Dashboard ── */}
              <Dashboard />

              {/* ── Cancel Anytime pill ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                className="hidden lg:inline-flex absolute -bottom-[3%] left-[12%] z-[25] items-center gap-[9px] px-3.5 py-2 rounded-full backdrop-blur-[10px] border border-[rgba(196,181,253,0.7)] bg-[rgba(10,8,38,0.85)]"
                style={{
                  boxShadow: "0 0 18px rgba(124,58,237,0.22), 0 6px 18px rgba(0,0,0,0.4)",
                }}
              >
                <div className="w-[22px] h-[22px] rounded-md flex items-center justify-center bg-[rgba(167,139,250,0.18)] text-[#d8b4fe]">
                  <Lock size={11} strokeWidth={2.4} />
                </div>
                <div>
                  <div className="font-bold text-[11px] text-white leading-tight">Cancel Anytime</div>
                  <div className="font-normal text-[9.5px] text-white/55">No Lock-in</div>
                </div>
              </motion.div>

              {/* ── Phone (desktop only) ── */}
              <Phone />
            </div>

            {/* ════════════ MOBILE-ONLY LAYOUT ════════════ */}
            {/* CHANGED: column gap-4 → gap-3 (reduces phone↔dashboard gap) */}
            <div className="lg:hidden flex flex-col gap-3 mt-6 px-1">
              {/* Feature badges 2-col grid */}
              {/* CHANGED: gap-2.5 → gap-1.5 (badges closer left/right) */}
              <div className="hidden grid-cols-2 gap-1.5">
                <FloatingBadge mobile icon={MessageCircle} title="AI Chat Agent"     subtitle="Instantly answers queries 24/7"        delay={0.1} />
                <FloatingBadge mobile icon={Calendar}      title="Smart Scheduling"  subtitle="Books & confirms property viewings"    delay={0.2} />
                <FloatingBadge mobile icon={UserCheck}     title="Lead Intelligence" subtitle="Qualifies & scores leads automatically" delay={0.3} />
                <FloatingBadge mobile icon={TrendingUp}    title="Deal Automation"   subtitle="Follows up & closes deals on autopilot" delay={0.4} />
              </div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;