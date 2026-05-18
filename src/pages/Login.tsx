
// import React, { useState } from "react";
// import { Eye, EyeOff } from "lucide-react";
// import { motion } from "framer-motion";
// import { useLoginForm } from "../Logics/Useloginform";

// // ── Replace with your actual logo ──
// import LogoImg from "../imges/WhatsApp_Image_2025-11-05_at_5.37.53_PM-removebg-preview.png";

// const Login = () => {
//   const {
//     formData,
//     showPassword,
//     handleSubmit,
//     handleChange,
//     togglePasswordVisibility,
//     navigateToSignup,
//     navigateToForgotPassword,
//   } = useLoginForm();

//   return (
//     <div
//       style={{
//         minHeight: "100vh",
//         width: "100%",
//         position: "relative",
//         overflow: "hidden",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         background: "#05071a",
//         fontFamily: "'Sora', sans-serif",
//       }}
//     >
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Sora:wght@400;500;600;700&display=swap');

//         @keyframes lp-twinkle { 0%,100%{opacity:.08} 50%{opacity:.50} }
//         @keyframes lp-float   { 0%,100%{transform:translateY(0px) rotate(0deg)} 50%{transform:translateY(-12px) rotate(2deg)} }
//         @keyframes lp-spin    { to{transform:rotate(360deg)} }
//         @keyframes lp-orbit   { to{transform:rotate(360deg) translateX(22px) rotate(-360deg)} }
//         @keyframes lp-pulse   { 0%,100%{opacity:.5;transform:scale(1)} 50%{opacity:0;transform:scale(1.5)} }

//         #lp-email, #lp-pass {
//           font-family: 'Sora', sans-serif;
//           color: white;
//           caret-color: #818cf8;
//         }
//         #lp-email::placeholder, #lp-pass::placeholder { color: rgba(255,255,255,0.25); }
//         #lp-email:focus, #lp-pass:focus {
//           outline: none;
//           border-color: rgba(139,92,246,0.80) !important;
//           box-shadow: 0 0 0 3px rgba(139,92,246,0.22), inset 0 0 20px rgba(109,40,217,0.12);
//           background: linear-gradient(135deg,rgba(30,24,80,0.85),rgba(55,40,130,0.70)) !important;
//         }
//       `}</style>

//       {/* ══════════════════════════════
//           BACKGROUND LAYERS
//       ══════════════════════════════ */}

//       {/* Base deep navy */}
//       <div style={{
//         position:"absolute", inset:0,
//         background:"radial-gradient(ellipse 120% 100% at 50% 50%, #060920 0%, #03040f 100%)",
//       }}/>

//       {/* Subtle left edge glow only */}
//       <div style={{
//         position:"absolute",
//         left:"-5%", top:"30%",
//         width:"15%", height:"40%",
//         background:"radial-gradient(ellipse at center, rgba(59,130,246,0.14) 0%, transparent 70%)",
//         filter:"blur(50px)",
//         pointerEvents:"none",
//       }}/>

//       {/* Purple nebula — RIGHT side */}
//       <div style={{
//         position:"absolute",
//         right:"-8%", top:"20%",
//         width:"45%", height:"70%",
//         background:"radial-gradient(ellipse at center, rgba(109,40,217,0.50) 0%, rgba(139,92,246,0.30) 35%, transparent 70%)",
//         filter:"blur(50px)",
//         pointerEvents:"none",
//       }}/>
//       <div style={{
//         position:"absolute",
//         right:"0%", bottom:"10%",
//         width:"30%", height:"50%",
//         background:"radial-gradient(ellipse at center, rgba(139,92,246,0.35) 0%, transparent 65%)",
//         filter:"blur(35px)",
//         pointerEvents:"none",
//       }}/>

//       {/* Grid */}
//       <div style={{
//         position:"absolute", inset:0, opacity:0.04, pointerEvents:"none",
//         backgroundImage:"linear-gradient(rgba(255,255,255,.18) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.18) 1px,transparent 1px)",
//         backgroundSize:"60px 60px",
//       }}/>

//       {/* Stars */}
//       <div style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none" }}>
//         {Array.from({length:70}).map((_,i) => (
//           <div key={i} style={{
//             position:"absolute", borderRadius:"50%", background:"white",
//             width:`${Math.random()*1.8+0.4}px`, height:`${Math.random()*1.8+0.4}px`,
//             left:`${Math.random()*100}%`, top:`${Math.random()*100}%`,
//             opacity: Math.random()*0.45+0.05,
//             animation:`lp-twinkle ${2+Math.random()*5}s ease-in-out infinite`,
//             animationDelay:`${Math.random()*6}s`,
//           }}/>
//         ))}
//       </div>

//       {/* Hexagon — top right */}
//       <svg
//         style={{ position:"absolute", top:70, right:90, opacity:0.20, pointerEvents:"none" }}
//         width="80" height="92" viewBox="0 0 80 92"
//       >
//         <polygon points="40,2 76,22 76,70 40,90 4,70 4,22"
//           fill="none" stroke="#818cf8" strokeWidth="1.5"/>
//         <polygon points="40,12 68,28 68,64 40,80 12,64 12,28"
//           fill="none" stroke="#818cf8" strokeWidth="0.8" opacity="0.4"/>
//       </svg>

//       {/* 3D Cube — right side */}
//       <motion.div
//         animate={{ y:[0,-10,0], rotate:[0,2,0] }}
//         transition={{ duration:5, repeat:Infinity, ease:"easeInOut" }}
//         style={{ position:"absolute", right:55, top:"48%", width:80, opacity:0.28, pointerEvents:"none" }}
//       >
//         <svg viewBox="0 0 80 80" fill="none">
//           <path d="M40 6L72 24V56L40 74L8 56V24L40 6Z"
//             fill="url(#cube-grad)" stroke="#60a5fa" strokeWidth="1.2"/>
//           <path d="M40 6V74M40 40L72 24M40 40L8 24"
//             stroke="#93c5fd" strokeWidth="0.8" opacity="0.5"/>
//           <defs>
//             <linearGradient id="cube-grad" x1="8" y1="6" x2="72" y2="74" gradientUnits="userSpaceOnUse">
//               <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.55"/>
//               <stop offset="100%" stopColor="#6d28d9" stopOpacity="0.35"/>
//             </linearGradient>
//           </defs>
//         </svg>
//       </motion.div>

//       {/* ══════════════════════════════
//           CARD
//       ══════════════════════════════ */}
//       <motion.div
//         initial={{ opacity:0, y:32, scale:0.96 }}
//         animate={{ opacity:1, y:0, scale:1 }}
//         transition={{ duration:0.75, ease:[0.22,1,0.36,1] }}
//         style={{
//           position:"relative", zIndex:20,
//           width:"100%", maxWidth:468,
//           margin:"20px 16px",
//         }}
//       >
//         {/* Neon border glow — blue top-left, purple bottom-right */}
//         <div style={{
//           position:"absolute", inset:-1, borderRadius:26, zIndex:0,
//           background:"linear-gradient(135deg, rgba(59,130,246,0.90) 0%, rgba(109,40,217,0.90) 100%)",
//           padding:1.5,
//           WebkitMask:"linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
//           WebkitMaskComposite:"xor",
//           maskComposite:"exclude",
//           filter:"blur(0px)",
//           boxShadow:"0 0 24px rgba(59,130,246,0.45), 0 0 48px rgba(109,40,217,0.35)",
//         }}/>

//         {/* Card body */}
//         <div style={{
//           position:"relative", zIndex:1,
//           borderRadius:24,
//           background:"rgba(8,10,38,0.78)",
//           boxShadow:"0 30px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
//           backdropFilter:"blur(28px)",
//           padding:"38px 34px 32px",
//         }}>

//           {/* ── Logo ── */}
//           <div style={{ textAlign:"center", marginBottom:22 }}>
//             <motion.div
//               animate={{ y:[0,-6,0] }}
//               transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
//               style={{
//                 display:"inline-flex", alignItems:"center", justifyContent:"center",
//                 width:72, height:72, borderRadius:22, marginBottom:18,
//                 background:"linear-gradient(135deg,#2563eb,#7c3aed)",
//                 boxShadow:"0 8px 36px rgba(109,40,217,0.60)",
//                 position:"relative",
//               }}
//             >
//               {/* Pulse ring */}
//               <motion.div
//                 animate={{ scale:[1,1.5,1], opacity:[0.55,0,0.55] }}
//                 transition={{ duration:2.5, repeat:Infinity }}
//                 style={{
//                   position:"absolute", inset:-4, borderRadius:26,
//                   border:"2px solid rgba(139,92,246,0.50)",
//                 }}
//               />
//               {/* Orbit dot */}
//               <motion.div
//                 animate={{ rotate:360 }}
//                 transition={{ duration:4, repeat:Infinity, ease:"linear" }}
//                 style={{
//                   position:"absolute", inset:0, borderRadius:"50%",
//                   display:"flex", alignItems:"flex-start", justifyContent:"center",
//                   paddingTop:6,
//                 }}
//               >
//                 <div style={{
//                   width:7, height:7, borderRadius:"50%",
//                   background:"#60a5fa",
//                   boxShadow:"0 0 8px #60a5fa",
//                   transform:"translateX(28px)",
//                 }}/>
//               </motion.div>

//               {/* ── Your logo image — uncomment and set correct path ── */}
//               <img src={LogoImg} alt="NexEstate Logo"
//                 style={{ width:44, height:44, objectFit:"contain", position:"relative", zIndex:1 }}
//                 draggable={false}
//               />
//               {/* Default icon until logo is added */}
//               {/* <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8}
//                 style={{ width:34, height:34, position:"relative", zIndex:1 }}>
//                 <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
//                 <polyline points="9 22 9 12 15 12 15 22" />
//               </svg> */}
//             </motion.div>

//             {/* Welcome Back */}
//             <h1 style={{
//               fontFamily:"'Syne',sans-serif", fontWeight:900,
//               fontSize:"clamp(1.7rem,2.8vw,1.5rem)",
//               color:"#fff", margin:"0 0 8px", lineHeight:1.1,
//             }}>
//               Welcome Back
//             </h1>
//             <p style={{
//               fontFamily:"'Sora',sans-serif", fontWeight:400,
//               fontSize:"clamp(0.82rem,1.2vw,0.8rem)",
//               color:"rgba(255,255,255,0.48)", margin:0,
//             }}>
//               Access your AI agent dashboard
//             </p>
//           </div>

//           {/* ── Form ── */}
//           <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:16 }}>

//             {/* Email */}
//             <div>
//               <label style={{
//                 display:"block", marginBottom:9,
//                 fontFamily:"'Sora',sans-serif", fontWeight:600,
//                 fontSize:"0.82rem", color:"rgba(255,255,255,0.88)",
//               }}>
//                 Email Address
//               </label>
//               <div style={{ position:"relative" }}>
//                 <span style={{
//                   position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
//                   color:"rgba(148,163,184,0.70)", pointerEvents:"none", display:"flex",
//                 }}>
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{width:18,height:18}}>
//                     <rect x="2" y="4" width="20" height="16" rx="2"/>
//                     <path d="M2 7l10 7 10-7"/>
//                   </svg>
//                 </span>
//                 <input
//                   id="lp-email"
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   placeholder="agent@realestate.ai"
//                   required
//                   style={{
//                     width:"100%", boxSizing:"border-box",
//                     paddingLeft:48, paddingRight:16,
//                     paddingTop:14, paddingBottom:14,
//                     borderRadius:12, fontSize:"0.9rem", fontWeight:500,
//                     background:"linear-gradient(135deg,rgba(20,18,65,0.80),rgba(45,35,115,0.65))",
//                     border:"1px solid rgba(99,102,241,0.32)",
//                     transition:"all 0.22s",
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div>
//               <label style={{
//                 display:"block", marginBottom:9,
//                 fontFamily:"'Sora',sans-serif", fontWeight:600,
//                 fontSize:"0.82rem", color:"rgba(255,255,255,0.88)",
//               }}>
//                 Password
//               </label>
//               <div style={{ position:"relative" }}>
//                 <span style={{
//                   position:"absolute", left:16, top:"50%", transform:"translateY(-50%)",
//                   color:"rgba(148,163,184,0.70)", pointerEvents:"none", display:"flex",
//                 }}>
//                   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} style={{width:18,height:18}}>
//                     <rect x="3" y="11" width="18" height="11" rx="2"/>
//                     <path d="M7 11V7a5 5 0 0110 0v4"/>
//                   </svg>
//                 </span>
//                 <input
//                   id="lp-pass"
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   placeholder="Enter your password"
//                   required
//                   style={{
//                     width:"100%", boxSizing:"border-box",
//                     paddingLeft:48, paddingRight:48,
//                     paddingTop:14, paddingBottom:14,
//                     borderRadius:12, fontSize:"0.9rem", fontWeight:500,
//                     background:"linear-gradient(135deg,rgba(20,18,65,0.80),rgba(45,35,115,0.65))",
//                     border:"1px solid rgba(99,102,241,0.32)",
//                     transition:"all 0.22s",
//                   }}
//                 />
//                 {/* Eye toggle */}
//                 <button
//                   type="button"
//                   onClick={togglePasswordVisibility}
//                   style={{
//                     position:"absolute", right:14, top:"50%", transform:"translateY(-50%)",
//                     background:"none", border:"none", cursor:"pointer", padding:4,
//                     color:"rgba(148,163,184,0.60)", display:"flex", alignItems:"center",
//                     transition:"color 0.18s",
//                   }}
//                   onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.90)"}
//                   onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "rgba(148,163,184,0.60)"}
//                 >
//                   {showPassword
//                     ? <EyeOff style={{width:18,height:18}}/>
//                     : <Eye    style={{width:18,height:18}}/>
//                   }
//                 </button>
//               </div>
//             </div>

//             {/* Remember me + Forgot password */}
//             <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:2 }}>
//               <label style={{
//                 display:"flex", alignItems:"center", gap:9, cursor:"pointer",
//                 fontFamily:"'Sora',sans-serif", fontWeight:400,
//                 fontSize:"0.85rem", color:"rgba(255,255,255,0.62)",
//                 userSelect:"none",
//               }}>
//                 {/* Custom checkbox */}
//                 <div style={{
//                   width:17, height:17, borderRadius:4, flexShrink:0,
//                   background: formData.rememberMe ? "rgba(99,102,241,0.85)" : "transparent",
//                   border:`1.5px solid ${formData.rememberMe ? "#818cf8" : "rgba(148,163,184,0.45)"}`,
//                   display:"flex", alignItems:"center", justifyContent:"center",
//                   transition:"all 0.18s", cursor:"pointer",
//                 }}
//                   onClick={() => handleChange({ target:{ name:"rememberMe", type:"checkbox", checked:!formData.rememberMe } } as any)}
//                 >
//                   {formData.rememberMe && (
//                     <svg viewBox="0 0 12 10" fill="none" style={{width:10,height:8}}>
//                       <path d="M1 5l3 3 7-7" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                   )}
//                 </div>
//                 Remember me
//               </label>

//               <button
//                 type="button"
//                 onClick={navigateToForgotPassword}
//                 style={{
//                   fontFamily:"'Sora',sans-serif", fontWeight:600,
//                   fontSize:"0.85rem", color:"#818cf8",
//                   background:"none", border:"none", cursor:"pointer",
//                   transition:"color 0.18s",
//                 }}
//                 onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#a5b4fc"}
//                 onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#818cf8"}
//               >
//                 Forgot password?
//               </button>
//             </div>

//             {/* Sign In Button */}
//             <motion.button
//               type="submit"
//               style={{
//                 width:"100%",
//                 padding:"15px 24px",
//                 borderRadius:12,
//                 background:"linear-gradient(90deg,#2563eb 0%,#4f46e5 45%,#7c3aed 100%)",
//                 boxShadow:"0 4px 28px rgba(109,40,217,0.55), 0 1px 0 rgba(255,255,255,0.08) inset",
//                 border:"none", cursor:"pointer", color:"#fff",
//                 fontFamily:"'Syne',sans-serif", fontWeight:800,
//                 fontSize:"1rem", letterSpacing:"0.03em",
//                 display:"flex", alignItems:"center", justifyContent:"center", gap:10,
//                 marginTop:6,
//               }}
//               whileHover={{ scale:1.02, boxShadow:"0 6px 38px rgba(109,40,217,0.72)" }}
//               whileTap={{ scale:0.97 }}
//             >
//               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} style={{width:18,height:18}}>
//                 <rect x="3" y="11" width="18" height="11" rx="2"/>
//                 <path d="M7 11V7a5 5 0 0110 0v4"/>
//               </svg>
//               Sign In
//             </motion.button>
//           </form>

//           {/* ── OR Divider ── */}
//           <div style={{
//             display:"flex", alignItems:"center", gap:14, margin:"22px 0 18px",
//           }}>
//             <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.09)" }}/>
//             <span style={{
//               fontFamily:"'Sora',sans-serif", fontWeight:500,
//               fontSize:"0.72rem", color:"rgba(255,255,255,0.32)",
//               letterSpacing:"0.08em",
//             }}>OR</span>
//             <div style={{ flex:1, height:1, background:"rgba(255,255,255,0.09)" }}/>
//           </div>

//           {/* ── Social Login Buttons ── */}
//           <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14 }}>

//             {/* Google */}
//             <motion.button type="button"
//               style={{
//                 width:56, height:56, borderRadius:14, cursor:"pointer",
//                 background:"rgba(255,255,255,0.06)",
//                 border:"1px solid rgba(255,255,255,0.11)",
//                 display:"flex", alignItems:"center", justifyContent:"center",
//               }}
//               whileHover={{ scale:1.09, background:"rgba(255,255,255,0.12)" }}
//               whileTap={{ scale:0.94 }}
//             >
//               <svg viewBox="0 0 24 24" style={{width:22,height:22}}>
//                 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
//                 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
//                 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
//                 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
//               </svg>
//             </motion.button>

//             {/* Microsoft */}
//             <motion.button type="button"
//               style={{
//                 width:56, height:56, borderRadius:14, cursor:"pointer",
//                 background:"rgba(255,255,255,0.06)",
//                 border:"1px solid rgba(255,255,255,0.11)",
//                 display:"flex", alignItems:"center", justifyContent:"center",
//               }}
//               whileHover={{ scale:1.09, background:"rgba(255,255,255,0.12)" }}
//               whileTap={{ scale:0.94 }}
//             >
//               <svg viewBox="0 0 21 21" style={{width:20,height:20}}>
//                 <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
//                 <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
//                 <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
//                 <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
//               </svg>
//             </motion.button>

//             {/* Apple */}
//             <motion.button type="button"
//               style={{
//                 width:56, height:56, borderRadius:14, cursor:"pointer",
//                 background:"rgba(255,255,255,0.06)",
//                 border:"1px solid rgba(255,255,255,0.11)",
//                 display:"flex", alignItems:"center", justifyContent:"center",
//               }}
//               whileHover={{ scale:1.09, background:"rgba(255,255,255,0.12)" }}
//               whileTap={{ scale:0.94 }}
//             >
//               <svg viewBox="0 0 24 24" fill="white" style={{width:21,height:21}}>
//                 <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
//               </svg>
//             </motion.button>
//           </div>

//           {/* ── Sign up link ── */}
//           <p style={{
//             textAlign:"center", marginTop:22, marginBottom:0,
//             fontFamily:"'Sora',sans-serif", fontWeight:400,
//             fontSize:"0.875rem", color:"rgba(255,255,255,0.42)",
//           }}>
//             Don't have an account?{" "}
//             <button
//               type="button"
//               onClick={navigateToSignup}
//               style={{
//                 fontFamily:"'Sora',sans-serif", fontWeight:700,
//                 fontSize:"0.875rem", color:"#818cf8",
//                 background:"none", border:"none", cursor:"pointer",
//                 transition:"color 0.18s",
//               }}
//               onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = "#c4b5fd"}
//               onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = "#818cf8"}
//             >
//               Sign up for free
//             </button>
//           </p>

//         </div>{/* end card body */}
//       </motion.div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import {
  Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck,
  Loader2, CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
// SignIn page
// ─────────────────────────────────────────────
const SignIn: React.FC = () => {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPwd, setShowPwd]     = useState(false);
  const [remember, setRemember]   = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState("Something went wrong. Please check your credentials and try again.");
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitStatus("idle");
    setSubmitError("Something went wrong. Please check your credentials and try again.");
    try {
      // 🛜 Replace with your real auth API call
      await login(email, password);
      setSubmitStatus("success");
      const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;
      window.setTimeout(() => {
        navigate(from || "/dashboard", { replace: true });
      }, 250);
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : "Something went wrong. Please check your credentials and try again.";
      setSubmitError(message);
      setSubmitStatus("error");
      window.setTimeout(() => setSubmitStatus("idle"), 3500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      access_type: 'offline',
      prompt: 'consent',
    });
    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    window.location.href = url;
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "linear-gradient(135deg,#060b24 0%,#0d1340 50%,#060b24 100%)" }}
    >

      {/* ═════════════ LEFT — image + brand ═════════════ */}
      <div className="hidden lg:flex relative w-1/2 overflow-hidden">

        {/* Background image — REPLACE this path with your own */}
        <img
          src="/Website-Images/LoginImage.png"
          alt="Modern luxury home"
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          className="absolute inset-0 w-full h-full object-cover select-none"
          onError={(e) => {
            // graceful fallback if image is missing
            const img = e.currentTarget;
            img.removeAttribute("src");
            img.style.background =
              "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)";
          }}
        />

        {/* Subtle gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/35 via-transparent to-slate-900/45" />

        {/* Content */}
        <div className="relative z-10 flex flex-col w-full h-full p-10 xl:p-12 text-white">

          {/* Logo */}
          {/* <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
            >
              <Building2 className="w-5 h-5 text-white" strokeWidth={2.4} />
            </div>
            <div className="text-[22px] font-extrabold leading-none">
              <span className="text-white">Nex</span>
              <span
                className="bg-clip-text text-transparent"
                style={{
                  background: "linear-gradient(90deg, #a78bfa, #c084fc)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Estate
              </span>
            </div>
          </div> */}

          {/* Welcome text */}
          <div className="mt-16 xl:mt-20 max-w-md">
            <h1 className="text-4xl xl:text-[44px] font-extrabold leading-[1.1] tracking-tight">
              Welcome Back
            </h1>
            <h2 className="text-3xl xl:text-[34px] font-extrabold leading-[1.15] tracking-tight mt-2">
              Sign in to your account
            </h2>
            <p className="mt-5 text-[15px] xl:text-base leading-relaxed text-white/80 max-w-sm">
              Access your dashboard, manage properties,
              and grow your real estate business.
            </p>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* "Your data is protected" card */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl max-w-sm backdrop-blur-md"
            style={{
              background: "rgba(15, 15, 40, 0.40)",
              border:     "1px solid rgba(255, 255, 255, 0.10)",
            }}
          >
            <div
              className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "rgba(139, 92, 246, 0.20)",
                border:     "1px solid rgba(167, 139, 250, 0.40)",
              }}
            >
              <ShieldCheck className="w-5 h-5 text-violet-300" strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-bold text-[14px] text-white leading-tight">
                Your data is protected
              </div>
              <div className="text-[12.5px] text-white/65 leading-snug mt-1">
                We use industry-standard security to
                keep your information safe.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═════════════ RIGHT — sign in form ═════════════ */}
      <div className="w-full lg:w-1/2 relative flex items-center justify-center" style={{ padding: "clamp(16px, 4vw, 48px)" }}>

        {/* Top-right: sign up link */}
        <div className="absolute flex items-center gap-2" style={{ top: "clamp(14px, 2vw, 24px)", right: "clamp(14px, 2vw, 32px)", fontSize: "clamp(12px, 0.95vw, 14px)" }}>
          <span className="text-white/60 hidden xs:inline">Don&apos;t have an account?</span>
          <a
            href="/signup"
            className="font-bold text-violet-200 hover:text-white transition-colors"
          >
            Sign up
          </a>
        </div>

        {/* Form card */}
        <div
          className="w-full bg-white rounded-3xl"
          style={{
            maxWidth: "min(480px, 100%)",
            padding: "clamp(20px, 3vw, 40px) clamp(20px, 3vw, 40px)",
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.04), 0 24px 48px -12px rgba(15, 15, 40, 0.08), 0 0 0 1px rgba(15, 15, 40, 0.03)",
          }}
        >

          {/* Heading */}
          <h1 className="font-extrabold text-gray-900 leading-none tracking-tight" style={{ fontSize: "clamp(26px, 3.2vw, 36px)" }}>
            Sign In
          </h1>
          <p className="mt-2 text-gray-500" style={{ fontSize: "clamp(13px, 1vw, 15px)" }}>
            Welcome back! Please enter your details.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-[13.5px] font-bold text-gray-900 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none"
                  strokeWidth={2}
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full h-[46px] pl-11 pr-4 rounded-xl bg-white text-[14px] text-gray-900 placeholder:text-gray-400 border border-gray-200 hover:border-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-[13.5px] font-bold text-gray-900"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-[13px] font-bold text-violet-600 hover:text-violet-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400 pointer-events-none"
                  strokeWidth={2}
                />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full h-[46px] pl-11 pr-11 rounded-xl bg-white text-[14px] text-gray-900 placeholder:text-gray-400 border border-gray-200 hover:border-gray-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPwd
                    ? <EyeOff className="w-[18px] h-[18px]" strokeWidth={2} />
                    : <Eye    className="w-[18px] h-[18px]" strokeWidth={2} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none w-fit group">
              <span className="relative inline-flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="peer sr-only"
                />
                <span
                  className="w-5 h-5 rounded-md border-2 border-gray-300 group-hover:border-gray-400 peer-checked:border-transparent transition-all"
                  style={{}}
                />
                <span
                  className="absolute w-5 h-5 rounded-md flex items-center justify-center opacity-0 peer-checked:opacity-100 transition-opacity"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
                  aria-hidden
                >
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4.5L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </span>
              <span className="text-[14px] text-gray-700 font-medium">Remember me</span>
            </label>

            {/* Submit button — multi-state with smooth transitions */}
            <motion.button
              type="submit"
              disabled={isSubmitting || submitStatus === "success"}
              whileHover={!isSubmitting && submitStatus !== "success" ? { y: -2 } : undefined}
              whileTap={!isSubmitting && submitStatus !== "success" ? { y: 0 } : undefined}
              className="w-full h-[48px] mt-1 rounded-xl text-white font-bold text-[14.5px] flex items-center justify-center gap-2 transition-shadow disabled:cursor-default"
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
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.4} />
                    Signing in...
                  </motion.span>
                ) : submitStatus === "success" ? (
                  <motion.span
                    key="success"
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" strokeWidth={2.4} />
                    Welcome back!
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="flex items-center gap-2"
                  >
                    Sign In
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
                  className="text-sm rounded-xl px-4 py-3 bg-red-50 border border-red-200 text-red-600"
                >
                  {submitError}
                </motion.div>
              )}
            </AnimatePresence>

            {/* OR divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[12px] font-medium text-gray-400 tracking-wider">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Social — Google */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="w-full h-[44px] rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 text-[13.5px] font-semibold text-gray-800 transition-all"
            >
              <GoogleIcon className="w-[18px] h-[18px]" />
              Continue with Google
            </button>

            {/* Social — Apple */}
            <button
              type="button"
              className="w-full h-[44px] rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-3 text-[13.5px] font-semibold text-gray-800 transition-all"
            >
              <AppleIcon className="w-[18px] h-[18px] text-gray-900" />
              Continue with Apple
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 pt-3 text-[12.5px] text-gray-400">
              <ShieldCheck className="w-4 h-4" strokeWidth={2} />
              <span>Secure &amp; private. We&apos;ll never share your information.</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
