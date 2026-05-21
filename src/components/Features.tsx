import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from "framer-motion";

// ─────────────────────────────────────────────
// Feature data
// ─────────────────────────────────────────────
const FEATURES = [
  {
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/avatar-management.png",
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
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/lead-capture.png",
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
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/property-management.png",
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
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/smart-scheduling.png",
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
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/crm-integration.png",
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
    imgSrc:      "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Features-Section-Images/analytics-commission.png",
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

const PARTICLES = Array.from({ length: 55 }, (_, i) => ({
  id: i,
  w:     Math.random() * 2.2 + 0.8,
  left:  Math.random() * 100,
  top:   Math.random() * 100,
  op:    Math.random() * 0.45 + 0.06,
  dur:   2 + Math.random() * 4,
  delay: Math.random() * 5,
}));

// ─────────────────────────────────────────────
// 3-D tilt hook (only active center card uses it)
// ─────────────────────────────────────────────
function use3DTilt(deg = 7) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 160, damping: 20 });
  const sy = useSpring(my, { stiffness: 160, damping: 20 });
  const rotX = useTransform(sy, [-0.5, 0.5], [ deg, -deg]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-deg,  deg]);
  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };
  return { ref, rotX, rotY, onMove, onLeave };
}

// ─────────────────────────────────────────────
// Card visual
// ─────────────────────────────────────────────
interface CardProps { feature: typeof FEATURES[0]; isActive: boolean; }

const FeatureCard: React.FC<CardProps> = ({ feature: f, isActive }) => {
  const tilt = use3DTilt(7);
  const [canTilt, setCanTilt] = useState(false);

  useEffect(() => {
    const check = () =>
      setCanTilt(
        isActive &&
        window.innerWidth >= 1024 &&
        window.matchMedia("(pointer: fine)").matches
      );
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [isActive]);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={canTilt ? tilt.onMove : undefined}
      onMouseLeave={canTilt ? tilt.onLeave : undefined}
      style={{
        rotateX:        canTilt ? tilt.rotX : 0,
        rotateY:        canTilt ? tilt.rotY : 0,
        transformStyle: "preserve-3d",
        perspective:    "1000px",
      }}
      transition={{ duration: 0.25 }}
      className="feature-card-shell group h-full w-full rounded-2xl overflow-hidden cursor-default"
    >
      <div
        className="feature-card-inner h-full"
        style={{
          background:    "rgba(10, 8, 38, 0.92)",
          border:        `1.5px solid ${f.cardBorder}`,
          borderRadius:  "16px",
          overflow:      "hidden",
          boxShadow:     `${f.cardGlow}, 0 12px 56px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.055)`,
        }}
      >
        <div
          className="feature-image-wrap relative"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 60% 50%, ${f.imgGlow} 0%, rgba(5,4,20,0.95) 70%)`,
            overflow:   "hidden",
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 60% at 70% 40%, ${f.imgGlow} 0%, transparent 65%)` }} />

          <div
            className="absolute top-3 left-3 z-10 w-9 h-9 flex items-center justify-center rounded-lg"
            style={{
              background: "rgba(255,255,255,0.08)",
              border:     "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
              boxShadow:  `0 0 14px 3px ${f.accentColor}55`,
            }}
          >
            <span style={{ transform: "scale(0.85)", display: "flex" }}>{f.icon}</span>
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
              paddingTop:     "12px",
              filter:         `drop-shadow(0 8px 32px ${f.accentColor}60)`,
              userSelect:     "none",
            } as React.CSSProperties}
          />

          <div className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{ height: "80px", background: `linear-gradient(to bottom, transparent, rgba(10,8,38,0.92))` }} />
        </div>

        <div className="feature-copy">
          <h3 className="hf landing-card-title text-white"
            style={{ marginBottom: "8px", textShadow: "0 4px 20px rgba(0,0,0,0.40)" }}
          >
            {f.title}
          </h3>

          <div style={{
            height: "2.5px", width: "36px", borderRadius: "2px", marginBottom: "8px",
            background: f.accentColor, boxShadow: `0 0 10px 2px ${f.accentColor}90`,
          }} />

          <p className="bf landing-card-description"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {f.description}
          </p>
        </div>

        <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700 ease-out"
          style={{
            background: `linear-gradient(90deg, ${f.accentColor}, transparent)`,
            boxShadow:  `0 0 10px ${f.accentColor}`,
          }}
        />
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────────────
// Main carousel section
// ─────────────────────────────────────────────
const Features: React.FC = () => {
  const [isMobile, setIsMobile]       = useState(false);
  const [activeIndex, setActiveIndex] = useState(2);
  const [autoplay, setAutoplay]       = useState(true);

  const total = FEATURES.length;

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Autoplay — pauses on hover
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(() => setActiveIndex(prev => (prev + 1) % total), 4500);
    return () => clearInterval(id);
  }, [autoplay, total]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setActiveIndex(p => (p + 1) % total);
      if (e.key === "ArrowLeft")  setActiveIndex(p => (p - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // ─────────────────────────────────────────────
  // Per-card transform (fan layout, no blur, no hover spotlight)
  // ─────────────────────────────────────────────
  const getCardTransform = useCallback((index: number) => {
    // shortest signed offset (wrap-around)
    let offset = index - activeIndex;
    if (offset >  total / 2) offset -= total;
    if (offset < -total / 2) offset += total;

    const abs     = Math.abs(offset);
    const visible = abs <= 2;

    const xUnit   = isMobile ? 115 : 270;
    const rotUnit = isMobile ? 18  : 32;
    const zUnit   = isMobile ? 100 : 180;

    const x       = offset * xUnit;
    const rotateY = -offset * rotUnit;
    const scale   = abs === 0 ? 1 : abs === 1 ? 0.86 : 0.70;
    const opacity = abs === 0 ? 1 : abs === 1 ? 0.78 : abs === 2 ? 0.38 : 0;
    const z       = -abs * zUnit;

    return {
      x:             `calc(-50% + ${x}px)`,
      rotateY,
      scale,
      opacity,
      z,
      zIndex:        20 - abs,
      pointerEvents: (visible ? "auto" : "none") as "auto" | "none",
    };
  }, [activeIndex, total, isMobile]);

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 60;
    if (info.offset.x < -threshold)      setActiveIndex(p => (p + 1) % total);
    else if (info.offset.x >  threshold) setActiveIndex(p => (p - 1 + total) % total);
  };

  const next = () => setActiveIndex(p => (p + 1) % total);
  const prev = () => setActiveIndex(p => (p - 1 + total) % total);

  return (
    <section
      id="features"
      className="relative overflow-hidden w-full flex items-center justify-center"
      style={{
        background:    "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)",
        minHeight:     "100vh",
        paddingTop:    isMobile ? "40px" : "32px",
        paddingBottom: isMobile ? "40px" : "32px",
      }}
    >
      <style>{`
        @keyframes shimmer-f  { 0%,100%{background-position:0%} 50%{background-position:100%} }
        @keyframes star-blink { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.55} }

        .feature-card-inner { display:flex; flex-direction:column; min-height:100%; }
        .feature-image-wrap { height: clamp(130px, 16vw, 170px); flex-shrink:0; }
        .feature-copy       { display:flex; flex:1; flex-direction:column;
                              padding: clamp(12px, 1.4vw, 18px);
                              padding-bottom: clamp(14px, 1.8vw, 20px); }

        .feature-carousel {
          position: relative;
          width: 100%;
          height: clamp(420px, 46vw, 500px);
          perspective: 2200px;
          perspective-origin: center 45%;
          user-select: none;
        }
        .carousel-stage { position:absolute; inset:0; transform-style:preserve-3d; }
        .carousel-item  { will-change: transform, opacity; }

        .carousel-controls {
          display:flex; align-items:center; justify-content:center;
          gap:14px; margin-top: clamp(14px, 2vw, 22px);
        }
        .carousel-arrow {
          width:38px; height:38px;
          display:flex; align-items:center; justify-content:center;
          border-radius:999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.14);
          backdrop-filter: blur(8px);
          color: rgba(255,255,255,0.85);
          cursor: pointer; transition: all 0.25s ease;
        }
        .carousel-arrow:hover {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.28);
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(124,92,191,0.35);
        }
        .carousel-dots { display:flex; gap:7px; align-items:center; }
        .carousel-dot {
          width:7px; height:7px; border-radius:999px;
          background: rgba(255,255,255,0.22);
          border:none; cursor:pointer; padding:0;
          transition: all 0.3s ease;
        }
        .carousel-dot.active {
          width:24px;
          background: linear-gradient(90deg, #a78bfa, #60a5fa);
          box-shadow: 0 0 12px rgba(167,139,250,0.7);
        }

        @media (max-width: 640px) {
          .feature-card-shell { border-radius: 14px; }
          .feature-image-wrap { height: clamp(130px, 46vw, 180px); }
          .feature-copy       { padding: 14px 14px 18px; }
          .feature-carousel   { height: clamp(440px, 110vw, 540px); }
        }
      `}</style>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 55% 45% at 10% 18%,rgba(59,130,246,0.20) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 16% 24%,rgba(99,102,241,0.26) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 10% 18%,rgba(59,130,246,0.20) 0%,transparent 65%)",
          ]}} transition={{ duration: 9, repeat: Infinity }} />
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 50% 55% at 90% 78%,rgba(108,63,197,0.28) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 84% 82%,rgba(139,92,246,0.36) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 90% 78%,rgba(108,63,197,0.28) 0%,transparent 62%)",
          ]}} transition={{ duration: 9, repeat: Infinity, delay: 2.5 }} />
      </div>

      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)",
          backgroundSize:  "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map(p => (
          <div key={p.id} className="absolute rounded-full bg-white"
            style={{
              width: `${p.w}px`, height: `${p.w}px`,
              left: `${p.left}%`, top: `${p.top}%`,
              opacity: p.op,
              animation: `star-blink ${p.dur}s ease-in-out infinite`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto relative z-10 w-full" style={{ maxWidth: 1400, padding: "0 clamp(16px, 4vw, 48px)" }}>

        <div className="text-center mb-4" style={{ perspective: "1400px" }}>
          <motion.h2
            initial={{ opacity: 0, x: -60, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="hf landing-title mb-3"
            style={{ textShadow: "0 10px 40px rgba(0,0,0,0.50)" }}
          >
            <span className="text-white font-syne-bold">Everything You Need to</span>{" "}
            <span className="text-transparent font-syne-bold"
              style={{
                background:          "linear-gradient(90deg,#a78bfa 0%,#60a5fa 50%,#a78bfa 100%)",
                backgroundSize:      "200%",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor: "transparent",
                backgroundClip:      "text",
                animation:           "shimmer-f 4s ease infinite",
                filter:              "drop-shadow(0 0 24px rgba(167,139,250,0.60))",
              }}
            >
              <br />
              Close More Deals
            </span>
          </motion.h2>

          <div className="flex justify-center mb-2">
            <div style={{
              height:"2.5px", width:"90px", borderRadius:"2px",
              background:"linear-gradient(90deg,transparent,#7c3aed,#3b82f6,transparent)",
              boxShadow:"0 0 18px rgba(108,63,197,0.75)",
            }} />
          </div>

          <motion.p
            initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, ease: "easeOut", delay: 0.2 }}
            className="bf landing-description max-w-2xl mx-auto"
            style={{ color:"rgba(255,255,255,0.75)" }}
          >
            A complete platform for real estate agents and builders to deploy
            virtual sales agents and automate their sales process.
          </motion.p>
        </div>

        {/* ── Carousel ── */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.94, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.25 }}
          className="feature-carousel"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <motion.div
            className="carousel-stage"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={handleDragEnd}
          >
            {FEATURES.map((feature, i) => {
              const t        = getCardTransform(i);
              const isActive = i === activeIndex;
              return (
                <motion.div
                  key={feature.title}
                  className="carousel-item"
                  animate={t}
                  transition={{ type:"spring", stiffness:200, damping:28, mass:0.85 }}
                  onClick={() => !isActive && setActiveIndex(i)}   // ← click → bring to front
                  style={{
                    position:       "absolute",
                    left:           "50%",
                    top:            0,
                    width:          "clamp(280px, 30vw, 360px)",
                    height:         "100%",
                    cursor:         isActive ? "default" : "pointer",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <FeatureCard feature={feature} isActive={isActive} />
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        <div className="carousel-controls">
          <button className="carousel-arrow" onClick={prev} aria-label="Previous feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <div className="carousel-dots">
            {FEATURES.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot ${i === activeIndex ? "active" : ""}`}
                onClick={() => setActiveIndex(i)}
                aria-label={`Go to feature ${i + 1}`}
              />
            ))}
          </div>
          <button className="carousel-arrow" onClick={next} aria-label="Next feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Features;