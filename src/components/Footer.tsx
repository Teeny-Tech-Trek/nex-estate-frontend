import React from "react";
import { motion } from "framer-motion";
import { Building2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";


const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Features", href: "#features" },
  // { label: "Pricing", href: "#pricing" },
  { label: "Dashboard", href: "#dashboard" },
];

const SOLUTIONS = ["Lead capture", "AI avatar agents", "Property support", "CRM integrations"];

const Footer: React.FC = () => {
  return (
    <footer
      className="relative w-full overflow-hidden"
      style={{
        background: "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)",
      }}
    >

      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)" }}
      />
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(99,102,241,0.13)" }}
      />
      <div
        className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full blur-3xl"
        style={{ background: "rgba(59,130,246,0.10)" }}
      />

      <div className="relative z-10 mx-auto w-full" style={{ maxWidth: "1600px", padding: "clamp(28px, 4vw, 56px) clamp(16px, 4vw, 56px)" }}>
        <motion.div
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5"
          style={{ gap: "clamp(24px, 3vw, 48px)" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
        >
          <div className="lg:col-span-2">
            <a href="/" className="inline-flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{
                  background: "linear-gradient(135deg,rgba(108,63,197,0.58),rgba(59,130,246,0.56))",
                  border: "1.5px solid rgba(255,255,255,0.18)",
                }}
              >
                <img src="https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Logo.png" alt="NexEstate logo" className="h-7 w-7 object-contain" />
              </div>
              <div className="leading-none">
                <div className="font-black tracking-tight text-white" style={{ fontSize: "clamp(1.1rem,1.8vw,1.25rem)" }}>
                  Nex<span style={{ color: "#818CF8" }}>Estate</span>
                </div>
                <div className="mt-1 uppercase tracking-[0.22em]" style={{ color: "rgba(255,255,255,0.48)", fontSize: "clamp(0.55rem,0.85vw,0.625rem)" }}>
                  AI Real Estate Agent
                </div>
              </div>
            </a>

            <p className="mt-5 max-w-md text-sm leading-7" style={{ color: "rgba(255,255,255,0.64)" }}>
              A practical AI layer for real estate teams: capture leads, respond instantly, qualify intent, and support buyer journeys.
            </p>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {["No-code setup", "24/7 support", "Real estate trained"].map((item) => (
                <span
                  key={item}
                className="rounded-full border px-3 py-1.5 text-xs font-bold"
                  style={{
                    color: "rgba(255,255,255,0.76)",
                    borderColor: "rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.045)",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.46)" }}>
              Menu
            </h3>
            <ul className="mt-5 space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-sm font-semibold transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.70)" }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.46)" }}>
              Solutions
            </h3>
            <ul className="mt-5 space-y-3">
              {SOLUTIONS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#818CF8", boxShadow: "0 0 12px rgba(129,140,248,0.85)" }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.46)" }}>
              Contact
            </h3>
            <div className="mt-5 space-y-3">
              <a href="mailto:hello@nexestate.ai" className="flex items-center gap-3 text-sm font-semibold transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.72)" }}>
                <Mail className="h-4 w-4 text-indigo-300" />
                hello@nexestate.ai
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.72)" }}>
                <Phone className="h-4 w-4 text-indigo-300" />
                Sales support
              </div>
              <div className="flex items-center gap-3 text-sm font-semibold" style={{ color: "rgba(255,255,255,0.72)" }}>
                <MapPin className="h-4 w-4 text-indigo-300" />
                Built for global agencies
              </div>
              <div className="mt-5 rounded-2xl border px-4 py-3" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <Building2 className="h-4 w-4 text-sky-300" />
                  Real estate focused
                </div>
                <p className="mt-1 text-xs leading-5" style={{ color: "rgba(255,255,255,0.56)" }}>
                  Designed for listings, buyer queries, lead scoring, and sales handoff.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-xs sm:text-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2" style={{ color: "rgba(255,255,255,0.58)" }}>
            <ShieldCheck className="h-4 w-4 text-indigo-300" />
            <span>(c) 2026 NexEstate. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.58)" }}>
              Privacy
            </a>
            <a href="#" className="font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.58)" }}>
              Terms
            </a>
            <a href="#newsletter" className="font-medium transition-colors hover:text-white" style={{ color: "rgba(255,255,255,0.58)" }}>
              Newsletter
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
