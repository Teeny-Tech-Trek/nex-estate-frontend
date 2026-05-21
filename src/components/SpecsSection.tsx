import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Calendar, Zap, Users } from "lucide-react";

// ── Replace with your image ──
import SpecsImg from "/Website-Images/SpecsSection-Image.png";

const SpecsSection = () => {

  const features = [
    {
      icon: <MessageSquare size={30} strokeWidth={1.8} />,
      title: "Lead Qualification",
      description: "Intelligent conversations that identify high-value prospects",
      color:    "#3B82F6",
      colorMid: "#6366F1",
      colorLt:  "#BAE6FD",
      glow:     "rgba(59,130,246,0.5)",
      // partial arc — blue on right side, ~60% filled, matches reference item 1
      arcGradient: "conic-gradient(from 120deg, transparent 0%, #3B82F6 18%, #818CF8 55%, transparent 60%)",
    },
    {
      icon: <Calendar size={30} strokeWidth={1.8} />,
      title: "Smart Scheduling",
      description: "Automated booking synced with your calendar",
      color:    "#8B5CF6",
      colorMid: "#A855F7",
      colorLt:  "#DDD6FE",
      glow:     "rgba(139,92,246,0.5)",
      // heavier fill, purple — matches reference item 2 (more filled)
      arcGradient: "conic-gradient(from 100deg, transparent 0%, #7C3AED 12%, #A855F7 65%, transparent 70%)",
    },
    {
      icon: <Zap size={30} strokeWidth={1.8} />,
      title: "Instant Follow-ups",
      description: "Never miss an opportunity with timely responses",
      color:    "#14B8A6",
      colorMid: "#06B6D4",
      colorLt:  "#99F6E4",
      glow:     "rgba(20,184,166,0.6)",
      // teal — brightest, most filled, matches reference item 3
      arcGradient: "conic-gradient(from 90deg, transparent 0%, #0D9488 10%, #14B8A6 50%, #06B6D4 72%, transparent 76%)",
    },
    {
      icon: <Users size={30} strokeWidth={1.8} />,
      title: "Relationship Building",
      description: "Free your team to focus on personal connections",
      color:    "#6366F1",
      colorMid: "#818CF8",
      colorLt:  "#C7D2FE",
      glow:     "rgba(99,102,241,0.5)",
      // indigo/purple — matches reference item 4 (top-right arc)
      arcGradient: "conic-gradient(from 300deg, transparent 0%, #6366F1 15%, #818CF8 55%, transparent 60%)",
    },
  ];

  return (
    <section
      id="specifications"
      className="overflow-hidden relative w-full flex items-center justify-center py-8 md:py-10"
      style={{ minHeight: "100vh", background: "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)" }}
    >
      <style>{`
        @keyframes hero-pulse { 0%,100%{opacity:.8;transform:scale(1)} 50%{opacity:.3;transform:scale(1.4)} }
      `}</style>

      {/* ── Radial glows — Hero identical ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 55% 55% at 15% 50%,rgba(59,130,246,0.22) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 55% at 20% 55%,rgba(99,102,241,0.28) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 55% at 15% 50%,rgba(59,130,246,0.22) 0%,transparent 65%)",
          ]}}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 50% 60% at 85% 40%,rgba(108,63,197,0.25) 0%,transparent 65%)",
            "radial-gradient(ellipse 50% 60% at 80% 45%,rgba(139,92,246,0.30) 0%,transparent 65%)",
            "radial-gradient(ellipse 50% 60% at 85% 40%,rgba(108,63,197,0.25) 0%,transparent 65%)",
          ]}}
          transition={{ duration: 8, repeat: Infinity, delay: 2 }}
        />
      </div>

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.045] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 2 + 1}px`, height: `${Math.random() * 2 + 1}px`,
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.55 + 0.08,
              animation: `hero-pulse ${2 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="container px-6 lg:px-12 mx-auto relative z-10">

        {/* ══════════ TOP: TWO COLUMN ══════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center mb-8 lg:mb-10">

          {/* ── LEFT TEXT ── */}
          <div className="flex flex-col gap-3">

            {/* Badge pill */}
            <motion.div
              initial={{ opacity: 0, y: -40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full w-fit"
              style={{
                border: "1.5px solid rgba(99,102,241,0.5)",
                background: "rgba(99,102,241,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Users size={14} style={{ color: "#818CF8" }} />
              <span className="landing-eyebrow font-bold tracking-[0.22em] uppercase"
                style={{ color:"#818CF8" }}>
                Built for Modern Teams
              </span>
            </motion.div>

            {/* Main heading — single line */}
            <motion.div
              initial={{ opacity: 0, x: 60, filter: "blur(10px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.0, ease: "easeOut", delay: 0.15 }}
            >
              <h2 className="landing-title"
                style={{ textShadow:"0 8px 40px rgba(0,0,0,0.5)" }}>
                <span className="font-heading text-white font-syne-bold">Built to </span>
                <br />
                <span className="font-heading font-syne-bold"
                 style={{
                  background: "linear-gradient(90deg,#818CF8 0%,#60A5FA 50%,#a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Empower Teams</span>
              </h2>
            </motion.div>

            {/* Hero statement */}
            <motion.div
              initial={{ opacity: 0, y: 50, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
            >
              <h3 className="landing-subtitle">
                <span className="text-white">Your virtual agents work alongside your team,{" "}</span>
                <span style={{ color:"#60A5FA" }}>not</span>
                <span className="text-white"> instead of it.</span>
              </h3>
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.85, ease: "easeOut", delay: 0.45 }}
              className="landing-description"
              style={{ color:"rgba(255,255,255,0.75)" }}>
              By handling lead qualification, scheduling, and follow-ups, they help agents focus on what they do best:{" "}
              <span style={{ color:"#60A5FA", fontWeight:700 }}>build relationships and close deals.</span>
            </motion.p>
          </div>

          {/* ── RIGHT: IMAGE ── */}
          <motion.div
            initial={{ opacity: 0, x: -80, scale: 0.92, filter: "blur(12px)" }}
            whileInView={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
            className="relative w-full flex items-center justify-center"
          >
            {/* glow behind */}
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{
                width:"80%", height:"80%", top:"10%", left:"10%",
                background:"radial-gradient(circle,rgba(99,102,241,0.35) 0%,rgba(59,130,246,0.2) 45%,transparent 70%)",
                filter:"blur(50px)",
              }}
              animate={{ scale:[1,1.1,1], opacity:[0.55,0.9,0.55] }}
              transition={{ duration:6, repeat:Infinity }}
            />

            {/* ════════════════════════════════════
                IMAGE — replace src with your file:
                  import SpecsImg from "/path/to/img.png";
                  src={SpecsImg}
                ════════════════════════════════════ */}
            <img
              src={SpecsImg}
              alt="AI Agent Dashboard"
              loading="lazy"
              decoding="async"
              draggable={false}
              onContextMenu={e => e.preventDefault()}
              className="w-full h-auto relative z-10 select-none"
              style={{
                maxWidth: 460,
                filter: "drop-shadow(0 30px 70px rgba(99,102,241,0.5))",
                pointerEvents: "none",
                userSelect: "none",
              } as React.CSSProperties}
            />
          </motion.div>
        </div>

        {/* ══════════ BOTTOM: 4 FEATURE ICONS ══════════ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 relative">

          {/* subtle vertical separators */}
          {[1,2,3].map(i => (
            <div key={i} className="absolute hidden md:block top-0 bottom-0 w-px"
              style={{
                left:`${i * 25}%`,
                background:"linear-gradient(180deg,transparent,rgba(255,255,255,0.07) 30%,rgba(255,255,255,0.07) 70%,transparent)",
              }}
            />
          ))}

          {features.map((f, index) => (
            <motion.div
              key={index}
              className="group flex flex-col items-center text-center px-4 py-4"
              initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: index * 0.12 }}
              whileHover={{ y: -6 }}
            >
              {/* ── Static arc ring icon — matches reference image ── */}
              <div className="relative mb-3" style={{ width: 78, height: 78 }}>

                {/* Outer glow layer */}
                <div className="absolute inset-0 rounded-full"
                  style={{
                    boxShadow: `0 0 22px ${f.glow}, 0 0 44px ${f.glow.replace("0.55","0.2")}`,
                  }}
                />

                {/* Arc ring — conic gradient partial arc, static */}
                <div className="absolute inset-0 rounded-full"
                  style={{
                    background: f.arcGradient,
                    padding: 0,
                  }}
                />

                {/* Inner dark disc — creates the "ring" cutout */}
                <div className="absolute rounded-full flex items-center justify-center"
                  style={{
                    inset: 7,
                    background: "radial-gradient(circle at 40% 35%, #0e1545, #060b24)",
                    boxShadow: `inset 0 0 14px ${f.glow.replace("0.55","0.35")}`,
                  }}
                >
                  {/* Icon */}
                  <span style={{ color: f.colorLt, display:"flex", transform:"scale(0.72)" }}>
                    {f.icon}
                  </span>
                </div>
              </div>

              {/* Title */}
              <h3 className="landing-card-title text-white mb-1.5">
                {f.title}
              </h3>

              {/* Description */}
              <p className="landing-card-description"
                style={{ color:"rgba(255,255,255,0.65)", maxWidth:220 }}>
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SpecsSection;
