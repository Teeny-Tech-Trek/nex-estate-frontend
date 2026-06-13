import React, { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const navBackground = isAuthPage
    // ? "#0B4897"
    ? "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)"
    : "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const { hash } = window.location;
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const currentPath = window.location.pathname;
    if (href === "/") {
      e.preventDefault();
      if (currentPath === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.href = "/";
      }
      return;
    }
    if (href.startsWith("#")) {
      e.preventDefault();
      const id = href.slice(1);
      if (currentPath === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.href = `/${href}`;
      }
    }
  };

  const navLinks: { label: string; href: string; active?: boolean; dropdown?: boolean }[] = [
    { label: "Home", href: "/", active: true },
    { label: "Features", href: "#features" },
    // { label: "Pricing", href: "#pricing" },
    { label: "Contact Us", href: "#contactUs" },
    // { label: "Resources", href: "#resources", dropdown: true },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full sticky top-0 z-50 transition-all duration-300"
      style={{
        background: navBackground,
        backdropFilter: isScrolled ? "blur(20px)" : "none",
        boxShadow: isScrolled ? "0 1px 0 rgba(255,255,255,0.08)" : "none",
      }}
    >
      {/* bottom border gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)" }}
      />

      <div className="mx-auto w-full" style={{ maxWidth: "1600px", padding: "0 clamp(14px, 3vw, 56px)" }}>
        <div className="flex items-center justify-between" style={{ height: "clamp(60px, 6.5vh, 80px)" }}>

          {/* ── Logo ── */}
          <motion.a
            href="/"
            className="flex items-center flex-shrink-0"
            style={{ gap: "clamp(8px, 1vw, 14px)" }}
            onClick={(e) => handleNavClick(e, "/")}
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                width: "clamp(36px, 3vw, 48px)",
                height: "clamp(36px, 3vw, 48px)",
                background: "linear-gradient(135deg,rgba(108,63,197,0.5),rgba(59,130,246,0.5))",
                border: "1.5px solid rgba(255,255,255,0.18)",
              }}
            >
              <img src="https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Logo.png" alt="logo" className="object-contain" style={{ width: "70%", height: "70%" }} />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="font-black text-white tracking-tight"
                style={{ fontSize: "clamp(15px, 1.25vw, 20px)" }}
              >
                Nex<span style={{ color: "#818CF8" }}>Estate</span>
              </span>
              <span
                className="tracking-widest uppercase mt-0.5"
                style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.2, fontSize: "clamp(8px, 0.65vw, 10px)" }}
              >
                AI Real Estate Agent
              </span>
            </div>
          </motion.a>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center" style={{ gap: "clamp(18px, 2vw, 36px)" }}>
            {navLinks.map((link) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="relative flex items-center gap-1 font-semibold transition-colors duration-200"
                style={{ color: link.active ? "#fff" : "rgba(255,255,255,0.72)", fontSize: "clamp(13px, 1vw, 15px)" }}
                onClick={(e) => handleNavClick(e, link.href)}
                whileHover={{ color: "#fff" }}
              >
                {link.label}
                {link.dropdown && <ChevronDown className="w-3.5 h-3.5 opacity-55" />}
                {/* underline */}
                <motion.span
                  className="absolute -bottom-[6px] left-0 h-[2px] rounded-full"
                  style={{
                    background: "linear-gradient(90deg,#818CF8,#38BDF8)",
                    width: link.active ? "100%" : "0%",
                  }}
                  initial={{ width: link.active ? "100%" : "0%" }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.25 }}
                />
              </motion.a>
            ))}
          </div>

          {/* ── Desktop auth ── */}
          <div className="hidden md:flex items-center" style={{ gap: "clamp(8px, 0.8vw, 14px)" }}>
            <a href="/login">
              <motion.button
                className="rounded-xl font-bold text-white"
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.16)",
                  padding: "clamp(7px, 0.7vw, 10px) clamp(14px, 1.4vw, 22px)",
                  fontSize: "clamp(12.5px, 0.95vw, 14.5px)",
                }}
                whileHover={{ background: "rgba(255,255,255,0.08)", scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Login
              </motion.button>
            </a>
            <a href="/signup">
              <motion.button
                className="rounded-xl font-bold text-white flex items-center gap-2"
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.16)",
                  padding: "clamp(7px, 0.7vw, 10px) clamp(14px, 1.4vw, 22px)",
                  fontSize: "clamp(12.5px, 0.95vw, 14.5px)",
                }}
                whileHover={{ scale: 1.04, background: "rgba(255,255,255,0.08)" }}
                whileTap={{ scale: 0.97 }}
              >
                Sign Up
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            </a>
          </div>

          {/* ── Mobile toggle ── */}
          <motion.button
            onClick={() => setIsOpen((v) => !v)}
            className="md:hidden rounded-xl text-white"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1.5px solid rgba(255,255,255,0.15)",
              padding: "clamp(8px, 2vw, 10px)",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>

        {/* ── Mobile menu ── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-5 space-y-2">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    className="flex items-center justify-between text-[14px] font-semibold text-white/85 py-3 px-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                    onClick={(e) => { handleNavClick(e, link.href); setIsOpen(false); }}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    whileHover={{ background: "rgba(255,255,255,0.09)", x: 4 }}
                  >
                    {link.label}
                    {link.dropdown && <ChevronDown className="w-4 h-4 opacity-50" />}
                  </motion.a>
                ))}
                <div className="flex gap-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.09)" }}>
                  <a href="/login" className="flex-1">
                    <motion.button
                      className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
                      style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.16)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Login
                    </motion.button>
                  </a>
                  <a href="/signup" className="flex-1">
                    <motion.button
                      className="w-full py-3 rounded-xl text-[14px] font-bold text-white"
                      style={{ background: "transparent", border: "1.5px solid rgba(255,255,255,0.16)" }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Sign Up →
                    </motion.button>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
