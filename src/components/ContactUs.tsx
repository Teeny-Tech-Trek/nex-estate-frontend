import React, { useState } from "react";
import {
  Mail, User, Phone, Tag, Edit3, Send, ShieldCheck,
  Loader2, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ─────────────────────────────────────────────
// Background particles (subtle stars)
// ─────────────────────────────────────────────
const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id:    i,
  w:     Math.random() * 2 + 0.6,
  left:  Math.random() * 100,
  top:   Math.random() * 100,
  op:    Math.random() * 0.35 + 0.06,
  dur:   2.5 + Math.random() * 4,
  delay: Math.random() * 5,
}));

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", subject: "", message: "",
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      // 🛜 Replace with your API call
      await new Promise(r => setTimeout(r, 1400));
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
      setTimeout(() => setSubmitStatus("idle"), 3500);
    } catch {
      setSubmitStatus("error");
      setTimeout(() => setSubmitStatus("idle"), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFocused = (n: string) => focusedField === n;

  return (
    <section
      id="contactUs"
      className="cu-section relative overflow-hidden w-full"
    >
      <style>{`

        @keyframes star-blink { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.4);opacity:.55} }
        @keyframes arch-pulse { 0%,100%{opacity:0.55;transform:translateX(-50%) scale(1)} 50%{opacity:0.85;transform:translateX(-50%) scale(1.04)} }
        @keyframes gradient-shift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

        .cu-section {
          background: linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%);
          padding: clamp(32px, 6vw, 64px) 0;
          color: white;
          font-size: 16px;
          min-height: 100svh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cu-wrap {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 clamp(16px, 4vw, 56px);
        }

        .cu-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: clamp(24px, 3vw, 40px);
          align-items: center;
        }
        @media (min-width: 1024px) {
          .cu-grid { grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: clamp(28px, 3vw, 44px); }
        }

        /* ── Left column ── */
        .cu-badge {
          display: inline-flex;
          align-items: center;
          padding: 7px 16px;
          border-radius: 999px;

          font-size: clamp(0.85rem, 1vw, 1rem);
          font-weight: 600;
          color: #c4b5fd;
          background: rgba(167,139,250,0.10);
          border: 1px solid rgba(167,139,250,0.30);
          margin-bottom: 20px;
        }
        .cu-h1 {
          font-weight: 600;
          font-size: clamp(2.4rem, 4vw, 3.1rem);
          line-height: 1.08;
          color: white;
          margin-bottom: 18px;
          letter-spacing: -0.015em;
          max-width: 14ch;
        }
        .cu-h1 .grad {
          background: linear-gradient(90deg,#22d3ee 0%,#7dd3fc 25%,#a78bfa 70%,#c084fc 100%);
          background-size: 100% 80%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradient-shift 6s ease infinite;
        }
        .cu-lede {
          color: rgba(255,255,255,0.75);
          font-size: clamp(1.05rem, 1.25vw, 1.25rem);
          line-height: 1.6;
          max-width: 38ch;
          margin-bottom: clamp(24px, 3vw, 36px);
        }

        /* ── Illustration with arched glow ── */
        .cu-illust {
          position: relative;
          width: 100%;
          max-width: 460px;
          aspect-ratio: 5 / 4;
        }
        .cu-arch {
          position: absolute;
          left: 50%; bottom: 4%;
          transform: translateX(-50%);
          width: 88%;
          height: 86%;
          border-radius: 999px 999px 0 0;
          background: radial-gradient(ellipse at center bottom,
            rgba(167,139,250,0.45) 0%,
            rgba(124,58,237,0.18) 38%,
            transparent 68%);
          filter: blur(8px);
          animation: arch-pulse 6s ease-in-out infinite;
          pointer-events: none;
        }
        .cu-arch::before {
          content:"";
          position: absolute; inset: 0;
          border-radius: inherit;
          border: 1.5px solid transparent;
          background: linear-gradient(180deg, rgba(167,139,250,0.55), transparent 70%) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          opacity: 0.7;
        }
        .cu-illust-img {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          object-fit: contain;
          filter: drop-shadow(0 12px 36px rgba(124,58,237,0.55));
          user-select: none;
        }
        @media (max-width: 640px) {
          .cu-illust { display: none; }
        }

        /* ── Form card ── */
        .cu-card {
          position: relative;
          width: 100%;
          min-width: 0;
          background: rgba(10, 10, 32, 0.88);
          border: 1.5px solid rgba(147,51,234,0.32);
          border-radius: 20px;
          padding: clamp(18px, 2vw, 28px);
          box-shadow:
            0 0 60px 4px rgba(147,51,234,0.18),
            0 24px 70px rgba(0,0,0,0.50),
            inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(18px);
        }

        .cu-card-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding-bottom: 14px;
          margin-bottom: 14px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cu-header-icon {
          flex-shrink: 0;
          width: 44px; height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, rgba(167,139,250,0.18), rgba(99,102,241,0.10));
          border: 1px solid rgba(167,139,250,0.30);
          box-shadow: 0 0 18px rgba(147,51,234,0.20);
          color: #c4b5fd;
        }
        .cu-card-title {
          font-weight: 800;
          font-size: clamp(1.3rem, 1.9vw, 1.9rem);
          color: white;
          letter-spacing: -0.015em;
          line-height: 1.25;
          margin-bottom: 6px;
        }
        .cu-card-sub {
          font-size: clamp(0.95rem, 1.1vw, 1.1rem);
          color: rgba(255,255,255,0.65);
          line-height: 1.5;
        }

        /* ── Form grid ── */
        .cu-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        @media (min-width: 600px) {
          .cu-form-grid { grid-template-columns: 1fr 1fr; }
        }

        /* ── Fields ── */
        .cu-field-label {
          display: block;
          font-size: clamp(0.9rem, 1.05vw, 1.05rem);
          font-weight: 600;
          color: rgba(255,255,255,0.85);
          margin-bottom: 8px;
          letter-spacing: 0.01em;
        }
        .cu-input-wrap { position: relative; }
        .cu-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(167,139,250,0.65);
          pointer-events: none;
          transition: color 0.25s ease;
        }
        .cu-textarea-icon {
          top: 16px;
          transform: none;
        }
        .cu-input, .cu-textarea {
          width: 100%;
          background: rgba(6, 6, 25, 0.65);
          border: 1.5px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px 12px 40px;
          font-size: clamp(0.95rem, 1.1vw, 1.05rem);
          color: white;
          outline: none;
          transition: all 0.25s ease;
        }
        .cu-input::placeholder, .cu-textarea::placeholder {
          color: rgba(255,255,255,0.32);
          font-weight: 400;
        }
        .cu-input:hover, .cu-textarea:hover {
          border-color: rgba(255,255,255,0.16);
        }
        .cu-input:focus, .cu-textarea:focus {
          border-color: rgba(167,139,250,0.65);
          box-shadow: 0 0 0 4px rgba(167,139,250,0.10), 0 0 24px rgba(167,139,250,0.15);
          background: rgba(6, 6, 25, 0.85);
        }
        .cu-input-wrap:focus-within .cu-input-icon { color: #c4b5fd; }
        .cu-textarea {
          padding-top: 12px;
          resize: vertical;
          min-height: 90px;
          line-height: 1.5;
        }
        .cu-char-count {
          position: absolute;
          right: 14px;
          bottom: 10px;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          pointer-events: none;
        }

        /* ── Submit button ── */
        .cu-submit {
          width: 100%;
          margin-top: 18px;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: clamp(1rem, 1.15vw, 1.15rem);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 50%, #a855f7 100%);
          background-size: 200% 100%;
          background-position: 0% 50%;
          box-shadow:
            0 10px 28px rgba(124,58,237,0.40),
            0 0 0 1px rgba(255,255,255,0.06) inset,
            0 1px 0 rgba(255,255,255,0.20) inset;
          transition: all 0.35s ease;
        }
        .cu-submit:hover:not(:disabled) {
          background-position: 100% 50%;
          transform: translateY(-2px);
          box-shadow:
            0 16px 38px rgba(124,58,237,0.55),
            0 0 0 1px rgba(255,255,255,0.10) inset,
            0 1px 0 rgba(255,255,255,0.25) inset;
        }
        .cu-submit:active:not(:disabled) { transform: translateY(0); }
        .cu-submit:disabled { cursor: default; opacity: 0.85; }
        .cu-submit.success {
          background: linear-gradient(90deg, #059669, #10b981, #34d399);
          background-size: 200% 100%;
        }

        /* ── Privacy note ── */
        .cu-privacy {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 18px;
          font-size: clamp(0.85rem, 1vw, 1rem);
          color: rgba(255,255,255,0.6);
        }
        .cu-privacy svg { color: rgba(34,211,238,0.7); flex-shrink: 0; }

        /* ── Error banner ── */
        .cu-error {
          margin-top: 14px;
          padding: 10px 14px;
          border-radius: 10px;
          background: rgba(239,68,68,0.10);
          border: 1px solid rgba(239,68,68,0.30);
          color: #fca5a5;
          font-size: 13px;
        }

        @media (max-width: 767px) {
          .cu-section {
            min-height: auto;
            align-items: flex-start;
            padding: 30px 0;
          }
          .cu-grid {
            gap: 18px;
          }
          .cu-h1 {
            max-width: 100%;
            font-size: clamp(2rem, 7vw, 2.6rem);
            margin-bottom: 0;
          }
          .cu-badge {
            margin-bottom: 12px;
          }
          .cu-card {
            border-radius: 16px;
            padding: 16px;
          }
          .cu-card-header {
            gap: 10px;
            padding-bottom: 12px;
            margin-bottom: 12px;
          }
          .cu-header-icon {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }
          .cu-card-sub {
            font-size: 14px;
          }
          .cu-field-label {
            margin-bottom: 6px;
            font-size: 14px;
          }
          .cu-input, .cu-textarea {
            font-size: 15px;
            border-radius: 9px;
          }
          .cu-textarea {
            min-height: 112px;
          }
          .cu-privacy {
            align-items: flex-start;
            font-size: 13.5px;
            line-height: 1.45;
          }
        }

        @media (max-width: 380px) {
          .cu-wrap {
            padding: 0 12px;
          }
          .cu-card {
            padding: 14px;
          }
          .cu-card-header {
            flex-direction: column;
          }
          .cu-submit {
            font-size: 14.5px;
          }
        }
      `}</style>

      {/* ── Background atmosphere ── */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 55% 45% at 12% 25%,rgba(99,102,241,0.18) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 18% 30%,rgba(124,92,191,0.24) 0%,transparent 65%)",
            "radial-gradient(ellipse 55% 45% at 12% 25%,rgba(99,102,241,0.18) 0%,transparent 65%)",
          ]}} transition={{ duration: 10, repeat: Infinity }} />
        <motion.div className="absolute inset-0"
          animate={{ background: [
            "radial-gradient(ellipse 50% 55% at 88% 75%,rgba(124,58,237,0.22) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 82% 80%,rgba(168,85,247,0.30) 0%,transparent 62%)",
            "radial-gradient(ellipse 50% 55% at 88% 75%,rgba(124,58,237,0.22) 0%,transparent 62%)",
          ]}} transition={{ duration: 11, repeat: Infinity, delay: 3 }} />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,.14) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.14) 1px,transparent 1px)",
          backgroundSize:  "70px 70px",
        }}
      />

      {/* Stars */}
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

      <div className="cu-wrap ">
        <div className="cu-grid">

          {/* ═══════════ LEFT ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: -60, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <span className="cu-badge">Get in Touch</span>

            <h2 className="cu-h1 font-syne ">
              We&apos;re Here to Help You Find Your {" "} <br />
              <span className="grad font-syne "> Next Estate.</span>
            </h2>

            {/* <p className="cu-lede">
              Have questions about a property, need expert advice,
              or want to schedule a visit? Our team is just a message
              away. Let&apos;s talk!
            </p> */}

            {/* Illustration — REPLACE THIS PATH with your own */}
            <div className="cu-illust">
              <div className="cu-arch" />
              <img
                src="https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/ContactUsImage.png"
                alt="Contact illustration"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="cu-illust-img"
                onError={(e) => {
                  // graceful fallback if image is missing — soft placeholder block
                  const img = e.currentTarget;
                  img.style.background = "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(34,211,238,0.18))";
                  img.style.border = "1px dashed rgba(167,139,250,0.4)";
                  img.style.borderRadius = "16px";
                  img.removeAttribute("src");
                }}
              />
            </div>
          </motion.div>

          {/* ═══════════ RIGHT — FORM CARD ═══════════ */}
          <motion.div
            initial={{ opacity: 0, x: 60, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="cu-card"
          >

            {/* Header */}
            <div className="cu-card-header">
              <div className="cu-header-icon">
                <Mail className="h-5 w-5" strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="cu-card-title">Send Us a Message</h3>
                <p className="cu-card-sub">
                  Fill out the form below and our team will get back to you shortly.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>

              {/* 2×2 grid */}
              <div className="cu-form-grid">

                {/* Full Name */}
                <div>
                  <label htmlFor="cu-name" className="cu-field-label">Full Name</label>
                  <div className="cu-input-wrap">
                    <User className="cu-input-icon h-[18px] w-[18px]" strokeWidth={2} />
                    <input
                      id="cu-name" name="name" type="text" required
                      value={formData.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your full name"
                      className="cu-input"
                      autoComplete="name"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="cu-email" className="cu-field-label">Email Address</label>
                  <div className="cu-input-wrap">
                    <Mail className="cu-input-icon h-[18px] w-[18px]" strokeWidth={2} />
                    <input
                      id="cu-email" name="email" type="email" required
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your email"
                      className="cu-input"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="cu-phone" className="cu-field-label">Phone Number</label>
                  <div className="cu-input-wrap">
                    <Phone className="cu-input-icon h-[18px] w-[18px]" strokeWidth={2} />
                    <input
                      id="cu-phone" name="phone" type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your phone number"
                      className="cu-input"
                      autoComplete="tel"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="cu-subject" className="cu-field-label">Subject</label>
                  <div className="cu-input-wrap">
                    <Tag className="cu-input-icon h-[18px] w-[18px]" strokeWidth={2} />
                    <input
                      id="cu-subject" name="subject" type="text" required
                      value={formData.subject}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("subject")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="What is this regarding?"
                      className="cu-input"
                    />
                  </div>
                </div>
              </div>

              {/* Message — full width */}
              <div>
                <label htmlFor="cu-message" className="cu-field-label">Message</label>
                <div className="cu-input-wrap">
                  <Edit3 className="cu-input-icon cu-textarea-icon h-[18px] w-[18px]" strokeWidth={2} />
                  <textarea
                    id="cu-message" name="message" required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Write your message here..."
                    className="cu-textarea"
                    maxLength={500}
                  />
                  <span className="cu-char-count">
                    {formData.message.length} / 500
                  </span>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isSubmitting || submitStatus === "success"}
                whileHover={!isSubmitting && submitStatus !== "success" ? { scale: 1.005 } : undefined}
                whileTap={!isSubmitting && submitStatus !== "success" ? { scale: 0.99 } : undefined}
                className={`cu-submit ${submitStatus === "success" ? "success" : ""}`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSubmitting ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-[18px] w-[18px] animate-spin" strokeWidth={2.4} />
                      Sending...
                    </motion.span>
                  ) : submitStatus === "success" ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-[18px] w-[18px]" strokeWidth={2.4} />
                      Message Sent!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <Send className="h-[18px] w-[18px]" strokeWidth={2.4} />
                      Send Message
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Privacy note */}
              <div className="cu-privacy">
                <ShieldCheck className="h-4 w-4" strokeWidth={2.2} />
                <span>Your information is safe with us. We&apos;ll never share your details.</span>
              </div>

              {/* Error feedback */}
              <AnimatePresence>
                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0,  height: "auto" }}
                    exit={{    opacity: 0, y: -8, height: 0 }}
                    className="cu-error"
                  >
                    Something went wrong. Please try again or email us directly.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
