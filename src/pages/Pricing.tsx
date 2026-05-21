import React, { useRef, useMemo } from "react";
import { Check, Star } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import FAQ from "@/components/FAQ";
import { useBilling } from "@/features/billing";
import type { Plan } from "@/features/billing/types/billing.types";

// Fallback plans if API fails
const FALLBACK_PLANS = [
  {
    id: "starter",
    name: "Starter",
    imgSrc: "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Pricing-Images/starter.png",
    accentColor: "#2f80ff",
    borderColor: "rgba(47,128,255,0.74)",
    cardGlow: "0 0 42px rgba(47,128,255,0.26)",
    popular: false,
    price: "$49",
    priceLabel: "/month",
    isCustom: false,
    description: "Perfect for individual agents getting started",
    features: [
      "1 Virtual Avatar",
      "Up to 100 leads/month",
      "Basic property management",
      "Email support",
      "Standard integrations",
      "Basic analytics",
      "1% commission on closed deals",
    ],
    buttonText: "Start Free Trial",
    btnFilled: false,
  },
  {
    id: "pro",
    name: "Professional",
    imgSrc: "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Pricing-Images/professional.png",
    accentColor: "#a94cff",
    borderColor: "rgba(169,76,255,0.88)",
    cardGlow: "0 0 56px rgba(169,76,255,0.44)",
    popular: true,
    price: "$99",
    priceLabel: "/month",
    isCustom: false,
    description: "Ideal for growing real estate teams",
    features: [
      "3 Virtual Avatars",
      "Up to 500 leads/month",
      "Advanced property management",
      "Priority support",
      "All CRM integrations",
      "Advanced analytics & reporting",
      "Team collaboration tools",
      "Custom avatar training",
      "1% commission on closed deals",
    ],
    buttonText: "Get Started",
    btnFilled: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    imgSrc: "https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Pricing-Images/enterprise.png",
    accentColor: "#28dce8",
    borderColor: "rgba(40,220,232,0.74)",
    cardGlow: "0 0 42px rgba(40,220,232,0.28)",
    popular: false,
    price: "Custom",
    priceLabel: "",
    isCustom: true,
    description: "For large agencies and enterprises",
    features: [
      "Unlimited Virtual Avatars",
      "Unlimited leads",
      "White-label solution",
      "Dedicated account manager",
      "Custom integrations",
      "Advanced security & compliance",
      "Multi-location support",
      "Custom reporting",
      "Volume-based commission rates",
    ],
    buttonText: "Contact Sales",
    btnFilled: false,
  },
];

const PARTICLES = Array.from({ length: 45 }, (_, i) => ({
  id: i,
  size: Math.random() * 2.1 + 0.8,
  left: Math.random() * 100,
  top: Math.random() * 100,
  opacity: Math.random() * 0.36 + 0.08,
  duration: 2.4 + Math.random() * 3.8,
  delay: Math.random() * 5,
}));

function use3DTilt(deg = 4) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 150, damping: 22 });
  const sy = useSpring(my, { stiffness: 150, damping: 22 });
  const rotX = useTransform(sy, [-0.5, 0.5], [deg, -deg]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-deg, deg]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return { ref, rotX, rotY, onMove, onLeave };
}

const PricingCard: React.FC<{
  plan: (typeof PLANS)[0];
  index: number;
}> = ({ plan, index }) => {
  const tilt = use3DTilt(plan.popular ? 3 : 4);

  return (
    <motion.div
      ref={tilt.ref}
      onMouseMove={tilt.onMove}
      onMouseLeave={tilt.onLeave}
      initial={{ opacity: 0, y: 60, x: 40, scale: 0.92, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.0, ease: "easeOut", delay: 0.25 + index * 0.15 }}
      style={{
        rotateX: tilt.rotX,
        rotateY: tilt.rotY,
        transformStyle: "preserve-3d",
      }}
      className="relative h-full"
    >
      <div
        className="relative flex h-full flex-col overflow-visible px-4 pb-4 pt-3 sm:px-5 sm:pb-5"
        style={{
          minHeight: "640px",
          borderRadius: "26px",
          background:
            plan.name === "Enterprise"
              ? "linear-gradient(180deg,rgba(0,28,32,0.88),rgba(1,13,26,0.97) 52%,rgba(0,12,20,0.98))"
              : "linear-gradient(180deg,rgba(5,17,43,0.9),rgba(4,9,28,0.98) 52%,rgba(3,7,22,0.99))",
          border: `2px solid ${plan.borderColor}`,
          boxShadow: `${plan.cardGlow}, inset 0 1px 0 rgba(255,255,255,0.13), 0 24px 70px rgba(0,0,0,0.54)`,
        }}
      >
        {plan.popular && (
          <div
            className="absolute left-1/2 top-[-21px] z-30 flex -translate-x-1/2 items-center gap-2 px-8 py-2 text-sm font-black text-white"
            style={{
              borderRadius: "8px",
              background: "linear-gradient(180deg,#8d35ff,#5d13ca)",
              border: "1.5px solid rgba(207,151,255,0.72)",
              boxShadow: "0 0 24px rgba(169,76,255,0.75)",
              clipPath:
                "polygon(8% 0, 92% 0, 100% 50%, 92% 100%, 8% 100%, 0 50%)",
              whiteSpace: "nowrap",
            }}
          >
            <Star className="h-5 w-5 fill-yellow-300 text-yellow-300" />
            Most Popular
          </div>
        )}

        <div
          className="relative mb-1 flex h-[120px] items-end justify-center sm:h-[140px] lg:h-[150px]"
        >
          <div
            className="absolute inset-x-2 bottom-2 h-16 rounded-full blur-2xl"
            style={{ background: `${plan.accentColor}36` }}
          />
          <img
            src={plan.imgSrc}
            alt={`${plan.name} plan`}
            draggable={false}
            className="relative z-10 max-h-full w-full object-contain"
            style={{
              transform: plan.popular ? "scale(1.04)" : "scale(1.16)",
              filter: `drop-shadow(0 0 26px ${plan.accentColor}82) drop-shadow(0 18px 24px rgba(0,0,0,0.62))`,
            }}
          />
        </div>

        <h3 className="hf landing-subtitle mb-2 text-center text-white">
          {plan.name}
        </h3>

        <p className="bf landing-card-description mx-auto mb-4 min-h-[44px] max-w-[280px] text-center text-white/75">
          {plan.description}
        </p>

        <div
          className="mb-3 flex h-[54px] items-center justify-center gap-1 rounded-lg"
          style={{
            background:
              plan.name === "Enterprise"
                ? "linear-gradient(90deg,rgba(1,58,64,0.58),rgba(6,32,39,0.66))"
                : "linear-gradient(90deg,rgba(14,54,126,0.58),rgba(11,20,58,0.72))",
            border: "1px solid rgba(255,255,255,0.08)",
            boxShadow: `inset 0 0 32px ${plan.accentColor}14`,
          }}
        >
          {plan.isCustom ? (
            <span
              className="hf font-black leading-none"
              style={{
                color: "#b9fbff",
                fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)",
                textShadow: `0 0 22px ${plan.accentColor}`,
              }}
            >
              Custom
            </span>
          ) : (
            <>
              <span
                className="hf font-black leading-none text-white"
                style={{
                  color: plan.name === "Professional" ? "#f1d9ff" : "#dbe9ff",
                  fontSize: "clamp(1.7rem, 2.6vw, 2.3rem)",
                  textShadow: `0 0 24px ${plan.accentColor}`,
                }}
              >
                {plan.price}
              </span>
              <span className="bf landing-meta mt-5 font-medium text-white">
                {plan.priceLabel}
              </span>
            </>
          )}
        </div>

        <ul className="bf landing-card-description mb-5 flex flex-1 flex-col gap-2 text-white">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <span
                className="mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                style={{
                  background: plan.accentColor,
                  boxShadow: `0 0 10px ${plan.accentColor}`,
                }}
              >
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
              </span>
              <span className="leading-snug">{feature}</span>
            </li>
          ))}
        </ul>

        <motion.a
          href="/login"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="bf block h-[52px] w-full rounded-xl px-4 text-center font-black leading-[52px] text-white"
          style={
            plan.btnFilled
              ? {
                  fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
                  background:
                    "linear-gradient(90deg,#8a2cff 0%,#7f35f0 48%,#33185c 100%)",
                  border: "2px solid rgba(226,159,255,0.92)",
                  boxShadow:
                    "0 0 28px rgba(169,76,255,0.75), inset 0 0 18px rgba(255,255,255,0.16)",
                }
              : {
                  fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)",
                  background: "rgba(0,0,0,0.14)",
                  border: `2px solid ${plan.accentColor}`,
                  boxShadow: `0 0 22px ${plan.accentColor}73, inset 0 0 18px ${plan.accentColor}1f`,
                }
          }
        >
          {plan.buttonText}
        </motion.a>
      </div>
    </motion.div>
  );
};

const Pricing: React.FC = () => {
  const { billingStatus, isLoading } = useBilling();

  // Convert plans from API to display format with styling
  const displayPlans = useMemo(() => {
    // Use API plans if available, otherwise use fallback
    const plans = FALLBACK_PLANS;

    // Try to enhance with actual plan data from API if available
    if (billingStatus?.pricingTiers) {
      return Object.entries(billingStatus.pricingTiers).map(([key, tier], index) => ({
        ...plans[index], // Keep styling from fallback
        name: tier.name,
        price: tier.price === 0 ? "Free" : `$${tier.price}`,
        isCustom: tier.name.toLowerCase() === "enterprise",
        description: tier.name
          ? {
              free: "Perfect for getting started with real estate",
              starter: "Perfect for individual agents getting started",
              pro: "Recommended for growing teams",
              professional: "Recommended for growing teams",
              enterprise: "Custom solution for large organizations",
            }[tier.name.toLowerCase()] || plans[index]?.description
          : plans[index]?.description,
      }));
    }

    return plans;
  }, [billingStatus]);

  return (
    <div
      id="pricing"
      className="relative w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)",
      }}
    >
      <style>{`
        @keyframes shimmer-p { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes star-blink { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.45); opacity: .45; } }
        @media (max-width: 1023px) {
          #pricing .pricing-grid { max-width: 520px; }
          #pricing .pricing-grid > div { min-height: auto; }
        }
      `}</style>

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

      <div
        className="absolute inset-0 pointer-events-none opacity-[0.045]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.12) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.12) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {PARTICLES.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              opacity: particle.opacity,
              animation: `star-blink ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto flex w-full flex-col items-center justify-center" style={{ minHeight: "100vh", maxWidth: "min(1500px, 95vw)", padding: "clamp(28px, 4vh, 56px) clamp(14px, 3vw, 40px)" }}>
        <div className="mb-5 text-center lg:mb-6" style={{ perspective: "1400px" }}>
          <div
            className="bf landing-eyebrow mb-3 inline-flex items-center gap-2 rounded-full px-4 py-2 font-bold text-white"
            style={{
              background: "linear-gradient(90deg,rgba(91,25,176,0.72),rgba(25,46,112,0.72))",
              border: "1.5px solid rgba(155,91,255,0.7)",
              boxShadow: "0 0 24px rgba(119,61,255,0.48)",
            }}
          >
            <Star className="h-4 w-4 fill-[#c563ff] text-[#c563ff]" />
            Flexible Plans for Every Need
          </div>

          <motion.h2
            initial={{ opacity: 0, y: -60, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="hf landing-title mx-auto max-w-[1100px] text-center text-white"
            style={{ textShadow: "0 7px 26px rgba(0,0,0,0.55)" }}
          >
            <span className="font-syne-bold">Choose the Plan That</span>{" "}
            <span className="font-syne-bold"
              style={{
                background:
                  "linear-gradient(90deg,#d25dff 0%,#8c55ff 43%,#35c9ff 100%)",
                backgroundSize: "200% 100%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: "shimmer-p 4s ease infinite",
                filter: "drop-shadow(0 0 18px rgba(91,160,255,0.35))",
              }}
            >
              <br />
              Drives Your Success
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            className="bf landing-description mx-auto mt-3 max-w-[700px] text-center text-white/80"
          >
            Powerful tools. Smart automation. Better deals. Pick the plan that fits your goals.
          </motion.p>
        </div>

        <div
          className="pricing-grid mx-auto grid w-full grid-cols-1 items-end gap-5 lg:grid-cols-3 lg:gap-6"
          style={{ perspective: "2000px" }}
        >
          {displayPlans.map((plan, i) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              index={i}
            />
          ))}
        </div>
      </div>

      <FAQ />
    </div>
  );
};

export default Pricing;
