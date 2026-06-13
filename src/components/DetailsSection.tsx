import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface Feature {
  icon: React.ReactNode;
  iconGradient: string;
  glowColor: string;
  title: string;
  desc: string;
  badge: string;
  badgeColor: string;
}

// ─────────────────────────────────────────────
// Feature data
// ─────────────────────────────────────────────
const FEATURES: Feature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    iconGradient: "linear-gradient(135deg,#6c3fc5,#3b82f6)",
    glowColor: "rgba(108,63,197,0.55)",
    title: "Avatar Creation",
    desc: "Create as many AI agents as you need",
    badge: "Unlimited",
    badgeColor: "#d946ef",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
        <path d="M12 7v5l3 3" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    iconGradient: "linear-gradient(135deg,#db2777,#f97316)",
    glowColor: "rgba(219,39,119,0.55)",
    title: "Lead Capture",
    desc: "Never miss a potential client",
    badge: "24/7",
    badgeColor: "#d946ef",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    iconGradient: "linear-gradient(135deg,#0891b2,#0284c7)",
    glowColor: "rgba(8,145,178,0.55)",
    title: "CRM Integration",
    desc: "Seamless connection to your tools",
    badge: "All Major",
    badgeColor: "#38bdf8",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <rect x="3" y="14" width="3" height="7" rx="1" fill="white" />
        <rect x="9" y="9" width="3" height="12" rx="1" fill="white" />
        <rect x="15" y="5" width="3" height="16" rx="1" fill="white" />
        <path d="M21 4l-7 7-4-4-6 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    iconGradient: "linear-gradient(135deg,#059669,#10b981)",
    glowColor: "rgba(5,150,105,0.55)",
    title: "Analytics",
    desc: "Track performance instantly",
    badge: "Real-time",
    badgeColor: "#34d399",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.8" />
        <path d="M12 7v1m0 8v1M9.5 9.5A2.5 2.5 0 0 1 12 8a2.5 2.5 0 0 1 0 5 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 2.5-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    iconGradient: "linear-gradient(135deg,#d97706,#f59e0b)",
    glowColor: "rgba(217,119,6,0.55)",
    title: "Commission",
    desc: "Automatic commission tracking",
    badge: "1% Auto-calc",
    badgeColor: "#d946ef",
  },
];

// ─────────────────────────────────────────────
// 3-D tilt card hook
// ─────────────────────────────────────────────
function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return { ref, rotateX, rotateY, onMove, onLeave };
}

// ─────────────────────────────────────────────
// Floating particle (same DNA as Hero stars)
// ─────────────────────────────────────────────
const PARTICLES = Array.from({ length: 60 }, (_, i) => ({
  id: i,
  w: Math.random() * 2.5 + 1,
  left: Math.random() * 100,
  top: Math.random() * 100,
  opacity: Math.random() * 0.55 + 0.08,
  dur: 2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

// ─────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────
const DetailSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  const leftTilt = use3DTilt();
  const rightTilt = use3DTilt();

  const [form, setForm] = useState({ name: "", email: "", agency: "" });
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Carry whatever the visitor typed here into the Signup page (read there from
  // the query string) and redirect them to complete sign-up.
  const handleStartFreeTrial = () => {
    const trimmedName = form.name.trim();
    const [firstName, ...rest] = trimmedName.split(/\s+/);
    const lastName = rest.join(" ");

    const params = new URLSearchParams();
    if (firstName) params.set("firstName", firstName);
    if (lastName) params.set("lastName", lastName);
    if (form.email.trim()) params.set("email", form.email.trim());
    if (form.agency.trim()) {
      params.set("companyName", form.agency.trim());
      params.set("accountType", "organization");
    }

    const query = params.toString();
    navigate(query ? `/signup?${query}` : "/signup");
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)",
        minHeight: "100vh",
        paddingTop: isMobile ? "48px" : "40px",
        paddingBottom: isMobile ? "48px" : "40px",
      }}
    >
      <style>{`
        @keyframes shimmer-detail { 0%,100%{background-position:0%} 50%{background-position:100%} }
        @keyframes detail-pulse   { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.35);opacity:.65} }
        @keyframes timeline-flow  { 0%{background-position:0% 0%} 100%{background-position:0% 100%} }
        .feat-input { outline:none; transition:border-color .2s,box-shadow .2s; }
        .feat-input:focus {
          border-color: rgba(108,63,197,0.7) !important;
          box-shadow: 0 0 0 3px rgba(108,63,197,0.18), 0 0 18px rgba(108,63,197,0.22);
        }
        .feat-card-wrap:hover .feat-card-inner {
          border-color: rgba(108,63,197,0.38) !important;
          background: rgba(255,255,255,0.055) !important;
        }
        .feat-card-wrap:hover .feat-icon-glow {
          opacity: 1 !important;
        }
        .cta-btn:hover {
          box-shadow: 0 0 50px rgba(108,63,197,0.65) !important;
          transform: scale(1.03) translateY(-1px);
        }
        .cta-btn:active { transform: scale(0.97); }
        .cta-btn { transition: box-shadow .25s, transform .2s; }
        @media (max-width: 520px) {
          .platform-card { padding: 18px !important; }
          .platform-header { align-items: flex-start !important; }
          .platform-timeline-line { left: 6px !important; }
          .platform-feature-row {
            align-items: stretch !important;
            gap: 10px !important;
          }
          .platform-dot {
            margin-left: 0 !important;
            margin-top: 44px;
          }
          .platform-feature-card {
            display: grid !important;
            grid-template-columns: 40px minmax(0, 1fr);
            align-items: start !important;
            gap: 12px !important;
            padding: 14px !important;
          }
          .platform-feature-text { min-width: 0; }
          .platform-feature-title {
            font-size: 15px !important;
            line-height: 1.25 !important;
          }
          .platform-feature-desc {
            font-size: 13px !important;
            line-height: 1.4 !important;
            max-width: 100%;
          }
          .platform-feature-badge {
            grid-column: 2;
            justify-self: start;
            white-space: normal !important;
            font-size: 14px !important;
            line-height: 1.25 !important;
            margin-top: 2px;
          }
        }
      `}</style>

      {/* ── Same animated radial glows as Hero ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 55% 55% at 10% 60%,rgba(59,130,246,0.20) 0%,transparent 65%)",
              "radial-gradient(ellipse 55% 55% at 16% 65%,rgba(99,102,241,0.26) 0%,transparent 65%)",
              "radial-gradient(ellipse 55% 55% at 10% 60%,rgba(59,130,246,0.20) 0%,transparent 65%)",
            ],
          }}
          transition={{ duration: 9, repeat: Infinity }}
        />
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 50% 60% at 90% 35%,rgba(108,63,197,0.22) 0%,transparent 65%)",
              "radial-gradient(ellipse 50% 60% at 84% 42%,rgba(139,92,246,0.28) 0%,transparent 65%)",
              "radial-gradient(ellipse 50% 60% at 90% 35%,rgba(108,63,197,0.22) 0%,transparent 65%)",
            ],
          }}
          transition={{ duration: 9, repeat: Infinity, delay: 2.5 }}
        />
        {/* bottom-center accent */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(ellipse 40% 30% at 50% 95%,rgba(56,189,248,0.12) 0%,transparent 70%)",
              "radial-gradient(ellipse 40% 30% at 50% 95%,rgba(56,189,248,0.20) 0%,transparent 70%)",
              "radial-gradient(ellipse 40% 30% at 50% 95%,rgba(56,189,248,0.12) 0%,transparent 70%)",
            ],
          }}
          transition={{ duration: 6, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* ── Grid overlay ── */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* ── Stars ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${p.w}px`, height: `${p.w}px`,
              left: `${p.left}%`, top: `${p.top}%`,
              opacity: p.opacity,
              animation: `detail-pulse ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Section heading ── */}
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.75, ease: "easeOut" }}
        >
          {/* badge — same pill style as Hero */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full body-font mb-4"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.18)" }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center font-black text-white"
              style={{ background: "linear-gradient(135deg,#6c3fc5,#3b82f6)", fontSize: "0.7rem" }}
            >
              ✦
            </div>
            <span className="landing-eyebrow text-white/90">Your All-in-One Platform for Virtual Sales Success</span>
          </div>

          <h2 className="hero-font landing-title">
            <span className="font-heading text-white font-syne-bold ">Everything You Need to </span>
            <span
            className="font-heading font-syne-bold "
              style={{
                background: "linear-gradient(90deg,#a78bfa,#60a5fa,#a78bfa)",
                backgroundSize: "200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer-detail 4s ease infinite",
              }}
            >
              <br />
              Succeed
            </span>
          </h2>
        </motion.div>

        {/* ── Two-column card grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">

          {/* ════════════ LEFT — Platform Features ════════════ */}
          <motion.div
            className="w-full lg:w-1/2"
            style={{ perspective: "1200px" }}
            initial={{ opacity: 0, x: -48 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.1 }}
          >
            <motion.div
              ref={leftTilt.ref}
              onMouseMove={leftTilt.onMove}
              onMouseLeave={leftTilt.onLeave}
              style={{
                rotateX: leftTilt.rotateX,
                rotateY: leftTilt.rotateY,
                transformStyle: "preserve-3d",
              }}
              className="h-full rounded-2xl p-3"
              {...({} as object)}
            >
              {/* glass card */}
              <div
                className="platform-card h-full rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.028)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  backdropFilter: "blur(18px)",
                  boxShadow: "0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                  transform: "translateZ(0px)",
                }}
              >
                {/* header */}
                <div className="platform-header flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: "linear-gradient(135deg,#6c3fc5,#3b82f6)",
                      boxShadow: "0 0 22px rgba(108,63,197,0.55)",
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white landing-card-title hero-font">Platform Features</p>
                    <p className="landing-meta body-font" style={{ color: "rgba(255,255,255,0.55)" }}>
                      Everything you need to deploy virtual sales agents
                    </p>
                  </div>
                </div>

                {/* timeline feature list */}
                <div className="relative">
                  {/* animated vertical line */}
                  <div
                    className="platform-timeline-line absolute top-4 bottom-4 w-px"
                    style={{
                      left: "19px",
                      background:
                        "linear-gradient(to bottom,transparent,rgba(108,63,197,0.6) 15%,rgba(59,130,246,0.6) 50%,rgba(108,63,197,0.6) 85%,transparent)",
                      backgroundSize: "100% 200%",
                      animation: "timeline-flow 4s linear infinite",
                    }}
                  />

                  <div className="flex flex-col gap-1.5">
                    {FEATURES.map((f, i) => (
                      <motion.div
                        key={f.title}
                        className="platform-feature-row feat-card-wrap flex items-center gap-2.5 relative"
                        initial={{ opacity: 0, x: -24 }}
                        animate={inView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.35 + i * 0.08, ease: "easeOut" }}
                      >
                        {/* glowing dot */}
                        <div
                          className="platform-dot w-2.5 h-2.5 rounded-full flex-shrink-0 z-10"
                          style={{
                            background: f.iconGradient,
                            boxShadow: `0 0 10px 3px ${f.glowColor}`,
                            marginLeft: "14px",
                          }}
                        />

                        {/* card */}
                        <div
                          className="platform-feature-card feat-card-inner flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200"
                          style={{
                            background: "rgba(255,255,255,0.025)",
                            border: "1px solid rgba(255,255,255,0.07)",
                          }}
                        >
                          {/* icon */}
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 relative"
                            style={{ background: f.iconGradient }}
                          >
                            {/* inner glow */}
                            <div
                              className="feat-icon-glow absolute inset-0 rounded-lg opacity-0 transition-opacity duration-200"
                              style={{ boxShadow: `0 0 18px 4px ${f.glowColor}`, borderRadius: "inherit" }}
                            />
                            <span style={{ transform: "scale(0.8)" }}>{f.icon}</span>
                          </div>

                          <div className="platform-feature-text flex-1 min-w-0">
                            <p className="platform-feature-title text-white landing-card-title body-font" style={{ fontSize: "clamp(1rem, 1.1vw, 1.15rem)" }}>{f.title}</p>
                            <p className="platform-feature-desc landing-meta body-font mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                              {f.desc}
                            </p>
                          </div>

                          <span
                            className="platform-feature-badge font-black body-font whitespace-nowrap"
                            style={{ color: f.badgeColor, textShadow: `0 0 12px ${f.badgeColor}`, fontSize: "clamp(0.85rem, 1vw, 1rem)" }}
                          >
                            {f.badge}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* ════════════ RIGHT — Sign-up Form ════════════ */}
          <motion.div
            className="w-full lg:w-1/2"
            style={{ perspective: "1200px" }}
            initial={{ opacity: 0, x: 48 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: "easeOut", delay: 0.2 }}
          >
            <motion.div
              ref={rightTilt.ref}
              onMouseMove={rightTilt.onMove}
              onMouseLeave={rightTilt.onLeave}
              style={{
                rotateX: rightTilt.rotateX,
                rotateY: rightTilt.rotateY,
                transformStyle: "preserve-3d",
              }}
              className="h-full"
              {...({} as object)}
            >
              <div
                className="h-full rounded-2xl p-5 relative overflow-hidden"
                style={{
                  background: "rgba(10,6,30,0.72)",
                  border: "1px solid rgba(108,63,197,0.28)",
                  backdropFilter: "blur(22px)",
                  boxShadow: "0 8px 56px rgba(108,63,197,0.22), 0 0 0 1px rgba(108,63,197,0.10), inset 0 1px 0 rgba(255,255,255,0.07)",
                  transform: "translateZ(0px)",
                }}
              >
                {/* corner glow */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at top right,rgba(108,63,197,0.40),transparent 70%)",
                    borderRadius: "0 1rem 0 0",
                  }}
                />

                {/* bottom glow */}
                <div
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-24 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse,rgba(59,130,246,0.18),transparent 70%)" }}
                />

                {/* badge */}
                <div
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full body-font mb-3"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.14)" }}
                >
                  <span className="text-sm">🚀</span>
                  <span className="landing-eyebrow text-white/85">Start selling smarter</span>
                </div>

                <h3
                  className="hero-font landing-subtitle mb-1.5"
                  style={{ color: "#fff" }}
                >
                  Get Started{" "}
                  <span
                    style={{
                      background: "linear-gradient(90deg,#a78bfa,#60a5fa)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Today
                  </span>
                </h3>

                <p className="landing-card-description body-font mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                  Join{" "}
                  <span className="font-bold" style={{ color: "#a78bfa" }}>
                    2,000+
                  </span>{" "}
                  agents already using our platform
                </p>

                {/* form fields */}
                <div className="flex flex-col gap-2 relative z-10">
                  {[
                    { label: "Full Name", req: true, key: "name", placeholder: "John Doe", type: "text",
                      icon: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                    { label: "Email Address", req: true, key: "email", placeholder: "john@example.com", type: "email",
                      icon: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><rect x="2" y="4" width="20" height="16" rx="3" stroke="currentColor" strokeWidth="1.8"/><path d="M2 8l10 6 10-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg> },
                    { label: "Real Estate Agency", req: false, key: "agency", placeholder: "Your Agency Name", type: "text",
                      icon: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><rect x="3" y="10" width="18" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.8"/><path d="M9 22V16h6v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M3 10l9-7 9 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg> },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="landing-meta font-semibold body-font mb-1.5 block" style={{ color: "rgba(255,255,255,0.75)" }}>
                        {field.label}{" "}
                        {field.req && <span style={{ color: "#a78bfa" }}>*</span>}
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(255,255,255,0.30)" }}>
                          {field.icon}
                        </span>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={(form as Record<string, string>)[field.key]}
                          onChange={(e) => setForm((p) => ({ ...p, [field.key]: e.target.value }))}
                          className="feat-input w-full pl-10 pr-3 py-2.5 rounded-lg text-white body-font placeholder-white/30"
                          style={{
                            fontSize: "clamp(0.9rem, 1vw, 1rem)",
                            background: "rgba(255,255,255,0.048)",
                            border: "1px solid rgba(255,255,255,0.10)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <motion.button
                  type="button"
                  onClick={handleStartFreeTrial}
                  whileHover={{ scale: 1.03, boxShadow: "0 0 50px rgba(108,63,197,0.65)" }}
                  whileTap={{ scale: 0.97 }}
                  className="cta-btn w-full mt-4 py-3 rounded-lg text-white font-black body-font flex items-center justify-center gap-2 relative z-10"
                  style={{
                    fontSize: "clamp(0.95rem, 1.15vw, 1.1rem)",
                    background: "linear-gradient(135deg,#6c3fc5,#3b82f6)",
                    boxShadow: "0 4px 32px rgba(108,63,197,0.50)",
                  }}
                >
                  Start Free Trial
                  <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
                    <path d="M4 10h12M11 5l5 5-5 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>

                {/* trust row */}
                <div
                  className="flex items-center justify-center gap-4 mt-2.5 relative z-10 body-font"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "10px" }}
                >
                  {[
                    {
                      icon: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><path d="M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6l-8-4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
                      label: "No credit card",
                    },
                    {
                      icon: <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 10h18" stroke="currentColor" strokeWidth="1.8"/><path d="M8 2v3M16 2v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
                      label: "Start as free trial",
                    },
                  ].map((t) => (
                    <div key={t.label} className="flex items-center gap-1.5 landing-meta" style={{ color: "rgba(255,255,255,0.55)" }}>
                      <span style={{ transform: "scale(0.85)" }}>{t.icon}</span>
                      {t.label}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default DetailSection;
