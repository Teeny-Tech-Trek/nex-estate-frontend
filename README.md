<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10,15,25&height=260&section=header&text=NexEstate&fontSize=72&fontColor=ffffff&fontAlignY=42&desc=AI-Powered%20Real%20Estate%20Platform%20%E2%80%A2%20React%20%E2%80%A2%20SaaS&descAlignY=62&descSize=20&animation=fadeIn&stroke=06B6D4&strokeWidth=1" width="100%"/>

</div>

<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=20&duration=3000&pause=800&color=06B6D4&center=true&vCenter=true&multiline=false&repeat=true&width=680&height=50&lines=Multi-Tenant+Real+Estate+SaaS+%F0%9F%8F%A0;React+18+%2B+Vite+%2B+TypeScript+%2B+Jotai+%E2%9A%A1;Agent+Management+%C2%B7+Lead+Pipeline+%C2%B7+Analytics+%F0%9F%93%88;Razorpay+Billing+%C2%B7+Multi-Org+Teams+%F0%9F%93%A0)](https://git.io/typing-svg)

</div>

<br/>

<div align="center">

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix-000000?style=for-the-badge)](https://ui.shadcn.com)
[![Jotai](https://img.shields.io/badge/Jotai-State-000000?style=for-the-badge&logo=jamstack&logoColor=white)](https://jotai.org)
[![Vercel](https://img.shields.io/badge/Vercel-Deploy-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## 🎯 Overview

**NexEstate** is the customer-facing SPA for a multi-tenant real estate AI platform. Users create AI agent avatars that handle lead qualification, property showcasing, and appointment booking. The dashboard provides team management, lead pipeline, property analytics, and subscription billing via Razorpay.

Built with **React 18 + Vite + TypeScript**, deployed on **Vercel**. Internal-facing API via the [`tech_trekkers_real_estate_backend`](../tech_trekkers_real_estate_backend).

---

## 🏗️ Architecture

```
Public Routes                  Protected Routes (AppLayout)
├─ HomeAllPages (/)           ├─ Dashboard
├─ Pricing (/pricing)         ├─ Avatars (agents)
├─ Login                       ├─ Properties
├─ Signup                      ├─ Leads
├─ GoogleCallback             ├─ Visits
└─ AgentChatPage (/agent/:id) └─ Settings + Billing
                              └─ Analytics (stub)

Data Flow: UI Page → Logics/use* Hook → services/* → axios (auth interceptor)
State Management: Jotai (auth) + React Context + localStorage
```

**Authentication:** JWT access token in `localStorage` + httpOnly refresh cookie (server-side validation). Axios interceptor injects Bearer header; 401 → auto-refresh via `/auth/refresh`.

---

## 🛠️ Tech Stack

| Concern | Technology |
|:---|:---|
| **Framework** | React 18.3 + React Router 6 |
| **Build** | Vite 5.4 + TypeScript 5.5 |
| **Styling** | Tailwind CSS 3.4 + shadcn/ui (Radix primitives) |
| **State** | Jotai (persisted auth) + Context + `useState` |
| **HTTP** | Axios (interceptors for auth + refresh) |
| **Server Cache** | React Query (mounted, underused) |
| **Forms** | React Hook Form + Zod (installed) |
| **Animation** | Framer Motion v12 + GSAP |
| **Charts** | Recharts (primary) + Chart.js |
| **Icons** | Lucide React |
| **Payments** | Razorpay (checkout popup) |
| **Deploy** | Vercel (SPA rewrite) |

---

## 📁 Project Structure

```
src/
├── App.tsx                  # Route definitions + provider setup
├── main.tsx                 # React root mount
├── config/                  # apiConfig (axios), paymentToggle
├── services/                # API calls (auth, avatar, property, lead, billing)
├── Logics/                  # Business logic hooks (use*)
├── pages/                   # Route screens
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── AppLayout.tsx        # Authenticated shell (nav, sidebar)
│   ├── ProtectedRoute.tsx   # Route guard + role checks
│   └── shared/              # ChatModal, PropertyFormModal, etc.
├── contexts/AuthContext.tsx # Auth provider + session restore
├── atoms/authAtom.ts        # Jotai persisted auth state
├── features/billing/        # Razorpay checkout + billing components
├── types/                   # TypeScript domain models
├── hooks/                   # usePlanLimits, useAuth, mobile, toast
└── lib/                     # utils, cdn, dashboardUtils
```

---

## 🚀 Getting Started

### 1. Install & Configure

```bash
npm install

# Create .env.local
cp .env.example .env.local
```

### 2. Environment Variables

| Var | Purpose | Example |
|:---|:---|:---|
| `VITE_API_URL` | Backend API base | `https://api.nexestate.techtrekkers.ai/api` |
| `VITE_RAZORPAY_KEY` | Razorpay public key (required) | `rzp_test_...` |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth ID | `...googleusercontent.com` |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect | `http://localhost:5173/auth/google/callback` |
| `VITE_SUPPORT_EMAIL` | Fallback contact | `sales@nexestate.techtrekkers.ai` |

### 3. Run Locally

```bash
npm run dev           # Vite dev server → http://localhost:5173
npm run build         # Production bundle
npm run lint          # ESLint
```

> Make sure the backend (`tech_trekkers_real_estate_backend`) is running on `localhost:5000` and has your frontend origin in `FRONTEND_URLS`.

---

## 📖 Key Features

### Dashboard
Real-time KPI metrics (recharts line chart), activity feed, top agents, team stats.

### Avatar Management
Create/edit/delete AI agents. Auto-generate QR codes for public chat links. Toggle active/paused status. Track agent performance.

### Property CRUD
Image upload + processing. Multi-select amenities. Hazard tracking. Analytics per property. Favorite toggle.

### Lead Pipeline
9-state pipeline (new → qualified → contacted → negotiating → won → lost → etc.). Lead quality classification (cold→warm→hot→very_hot). Owner attribution. Bulk actions.

### Billing / Razorpay
Plan selection. Soft quotas enforced on frontend (advisory only — backend always re-checks). Create order → Razorpay popup → verify signature. Success/failure handling. Plan-limit alerts.

### Team Management
Invite organization members. Role-based access control (owner/admin/member). Leave-requests workflow.

### Public Agent Chat (`/agent/:id`)
Shareable link powered by the backend's RAG + OpenAI fallback. Streaming responses with typewriter effect. Lead capture gate (email gate on first message).

---

## 🔐 Authentication & Authorization

**Flows:**
- **Email/password** → `POST /auth/login` → access token + refresh cookie
- **Google OAuth** → `POST /auth/google/exchange-code` → same result + account creation on first sign-in
- **Session restore** — on page load, `AuthContext.useEffect` checks `localStorage.user` + access token; if valid, revalidates with `/auth/me` in the background

**Role-based guards** — `ProtectedRoute` props:
- `requireOwner` — only account owner
- `requireAdmin` — owner or admin
- `requireOrganization` — org member (not individual)
- `requireRoles={[...]}` — explicit role list
- `allowIndividual` — permit solo accounts

---

## 💳 Billing (`src/features/billing/`)

**Razorpay integration:**
1. User selects plan → `createOrder(planId)` → backend returns `orderId` + `amount` (in paise)
2. Razorpay popup opens with public key from `VITE_RAZORPAY_KEY`
3. User completes payment
4. Success callback → `verifyPayment(orderId, paymentId, signature)` → backend activates subscription

**Kill-switch:** Backend env var `PAYMENTS_ENABLED` controls globally. When `false`, `POST /billing/create-order` returns `503 PAYMENTS_DISABLED`; frontend shows `PaymentsDisabledModal` with hardcoded support email.

**Quotas:** `usePlanLimits` hook fetches `/billing/status`, tracks usage (agents, properties, team members, messages). Frontend shows alerts at limit; backend always re-enforces.

---

## ⚙️ Services & Data Flow

**Example: Fetch dashboard metrics**
```
Dashboard page
  ↓ calls useDashboardLogic()
    ↓ calls dashboardService.getMetrics()
      ↓ calls axios.get('/dashboard/metrics')
        ↓ request interceptor injects Bearer token
          ↓ backend validates JWT
            ↓ backend returns metrics
              ↓ normalizeMetrics() transforms response
                ↓ return to hook
                  ↓ page renders state
```

**Services:** `auth.service.ts`, `avatar.service.ts`, `property.service.ts`, `lead.service.ts`, `notification.service.ts`, `billing.service.ts`.

---

## 🎨 UI System

**shadcn/ui + Tailwind**
- ~50 Radix-primitive components in `components/ui/`
- Theming via CSS variables (HSL) — light mode; dark mode class-based (no `ThemeProvider` today)
- Custom animations: `fade-in`, `float`, `gradient-shift`, `scale-in`
- Gradients: `hero`, `premium`, `glass` (glassmorphism)

**Toasts:** shadcn Radix `useToast()` (preferred) + Sonner + React Hot Toast (all coexist).

**Charts:** Recharts for KPIs (line, area, bar). Chart.js present but unused.

**Animation:** Framer Motion for the AppLayout sidebar toggle, landing sections, pricing cards (tilt effect), public agent chat typewriter.

---

## ⚠️ Known Issues & Tech Debt

- **React Query underused** — all fetching is manual + window events (`twin:saved`, `auth:logout`). Greenfield for migration.
- **No `ThemeProvider`** from `next-themes` despite `sonner` consuming `useTheme()`.
- **Large commented-out legacy code** in `ProtectedRoute.tsx`, `settings.api.ts`, `PropertyFormModal.tsx`.
- **Orphan files:** `ErrorBoundary.tsx`, `SettingsPage.jsx`, `DeletionRequestsPanel.jsx` (unrouted).
- **Mixed extensions:** `.jsx` and `.tsx` inconsistently.
- **Misspelled component name:** `Dasboard.tsx` (imported as `Dashboard`).
- **Two lockfiles:** `package-lock.json` + `bun.lockb` — standardize on npm.
- **XSS risk:** `accessToken` in `localStorage` (not HttpOnly) — required for Bearer injection, but noted.

---

## 📋 Environment Variables — Full Reference

```bash
# Required
VITE_API_URL=https://api.nexestate.techtrekkers.ai/api
VITE_RAZORPAY_KEY=rzp_test_<key>
VITE_GOOGLE_CLIENT_ID=<id>.googleusercontent.com
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Optional
VITE_SUPPORT_EMAIL=sales@nexestate.techtrekkers.ai
VITE_ASSET_CDN_URL=https://cdn.example.com
```

---

## 🚢 Deployment

Vercel auto-deploy on `main` branch push. SPA rewrite in `vercel.json` routes all paths to `/index.html`. Set all `VITE_*` vars in Vercel project settings.

```bash
git push origin main
# Watch Vercel dashboard for "Ready" status
```

---

## 🎓 Getting Help

| I want to… | Start here |
|:---|:---|
| Add a route | `src/App.tsx` (route) → `src/pages/*` → `Logics/use*` hook → `services/*` module |
| Change API calls | `src/services/*` module + `config/apiConfig.ts` |
| Update auth behavior | `contexts/AuthContext.tsx` + `atoms/authAtom.ts` |
| Work on billing | `features/billing/*` (UpgradeButton, razorpay.ts, services) |
| Add a UI component | `npx shadcn@latest add <name>` |
| Adjust authenticated shell | `components/AppLayout.tsx` (sidebar, nav, notifications) |
| Tweak public agent chat | `pages/AgentChatPage.tsx` + `services/agent.service.ts` |

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=10,15,25&height=120&section=footer" width="100%"/>

**Gradient used: `10,15,25` (cyan-blue)**

</div>
