// Phase 3 Implementation Guide
// Complete frontend billing & Razorpay checkout integration

/**
 * ARCHITECTURE OVERVIEW
 * ====================
 * 
 * Frontend Payment Flow:
 * 1. User clicks "Get Started" button on plan (Pricing or Settings)
 * 2. UpgradeButton.tsx → calls billingService.createOrder(planId)
 * 3. Backend creates Razorpay order via TTT Payment Service
 * 4. Razorpay popup opens with order details
 * 5. User completes payment in popup
 * 6. UpgradeButton.tsx → calls billingService.verifyPayment(orderId, paymentId, signature)
 * 7. Backend verifies with TTT Payment Service
 * 8. TTT triggers webhook → /api/billing/internal/activate
 * 9. Organization subscription status updates
 * 10. Frontend shows success message and refreshes billing data
 */

/**
 * ENVIRONMENT SETUP
 * =================
 */

// 1. Add to .env.local (frontend)
// VITE_RAZORPAY_KEY=your_razorpay_test_key

// 2. Verify backend .env has:
// CENTRAL_BILLING_INTERNAL_KEY=your_internal_key
// TTT_PAYMENT_SERVICE_URL=http://localhost:5000 (or production URL)

/**
 * FILE STRUCTURE
 * ==============
 */

// Frontend
// src/features/billing/
// ├── types/
// │   └── billing.types.ts (29 interfaces for all billing data)
// ├── services/
// │   └── billing.service.ts (API methods: getPlans, createOrder, verifyPayment, etc.)
// ├── utils/
// │   └── razorpay.ts (initializeRazorpay, openRazorpayCheckout, formatCurrency)
// ├── hooks/
// │   └── useBilling.ts (useCallback operations with loading/error states)
// ├── components/
// │   ├── UpgradeButton.tsx (Checkout trigger)
// │   ├── CurrentPlanCard.tsx (Displays current subscription)
// │   ├── PlanCard.tsx (Single plan card)
// │   ├── BillingTabContent.tsx (Complete billing tab)
// └── index.ts (Central exports)

// Updated Pages
// src/pages/Settings.tsx
//   - Billing tab now uses <BillingTabContent />
//   - Maintains existing layout, updated data source
// 
// src/pages/Pricing.tsx
//   - Integrates useBilling hook
//   - Fetches plans from backend instead of hardcoded
//   - Keeps all 3D animations and styling

// Backend
// src/modules/billing/billing.controller.js
//   - Added: verifyPayment(req, res, next) function
//   - Calls verifyPaymentInCentral from billing.service.js
// 
// src/modules/billing/billing.routes.js
//   - Added: POST /verify-payment route
//   - Requires auth + billing permission

/**
 * KEY COMPONENTS
 * ==============
 */

// 1. UpgradeButton Component
// Features:
//   - Triggers createOrder API call
//   - Opens Razorpay popup with order details
//   - Verifies payment signature after success
//   - Shows loading state during checkout
//   - Displays success/error toast messages
// Usage:
//   <UpgradeButton
//     planId="pro"
//     planName="Professional"
//     currentPlan={currentPlan?.name}
//     onUpgradeSuccess={() => refreshBilling()}
//     disabled={isCurrentPlan}
//   />

// 2. CurrentPlanCard Component
// Features:
//   - Shows current subscription details
//   - Displays usage bars (agents, members, properties)
//   - Shows plan limits in grid format
//   - Shows renewal date
// Usage:
//   <CurrentPlanCard billingStatus={billingStatus} />

// 3. PlanCard Component
// Features:
//   - Displays single plan with all details
//   - Shows popular/enterprise badges
//   - Lists plan features with checkmarks
//   - Integrates UpgradeButton
// Usage:
//   <PlanCard
//     plan={plan}
//     currentPlanName={currentPlan?.name}
//     onUpgradeSuccess={() => refresh()}
//   />

// 4. BillingTabContent Component
// Features:
//   - Combines CurrentPlanCard and available plans
//   - Renders only if canManageBilling is true
//   - Converts pricingTiers to Plan format
// Usage:
//   <BillingTabContent
//     billingStatus={logic.billingInfo}
//     canManageBilling={logic.canManageBilling}
//     onUpgradeSuccess={() => logic.loadAllData()}
//   />

/**
 * PAYMENT FLOW DETAILS
 * ====================
 */

// Step 1: User initiates upgrade
// - Click "Get Started" button on plan
// - Validation: Check billing permission
// - Show loading state

// Step 2: Create order
// Frontend calls: billingService.createOrder(planId)
// Backend:
//   - POST /api/billing/create-order
//   - requireAuth middleware
//   - requireBillingPermission middleware
//   - Validates organization sync (has centralBillingCustomerId)
//   - Calls TTT: POST /api/v1/payments/create-order
// Response: { success: true, order: { orderId, amount, currency, ... } }

// Step 3: Open Razorpay checkout
// Frontend:
//   - Calls razorpayUtils.initializeRazorpay() to load script
//   - Calls razorpayUtils.openRazorpayCheckout(options, onSuccess, onError)
//   - Razorpay popup opens with order details
//   - User completes payment

// Step 4: Verify payment
// Frontend calls: billingService.verifyPayment(orderId, paymentId, signature)
// Backend:
//   - POST /api/billing/verify-payment
//   - requireAuth middleware
//   - requireBillingPermission middleware
//   - Calls TTT: POST /api/v1/payments/verify
//   - TTT responds with subscription details
// Response: { success: true, subscription: {...}, subscription_status: 'active' }

// Step 5: TTT webhook activation
// TTT triggers webhook: POST /api/billing/internal/activate
// Body: { organizationId, customerId, planId, status: 'active', ... }
// Backend:
//   - Middleware: verifyInternalApiKey (Bearer token)
//   - Validates payload structure
//   - Checks idempotency (customerId + status already active?)
//   - Updates Organization.subscription in MongoDB
//   - Returns: { success: true, idempotent: false, organization: {...} }

// Step 6: Frontend update
// - Show success toast: "Successfully upgraded to {planName} plan"
// - Call onUpgradeSuccess callback
// - Refresh billing data to reflect new subscription

/**
 * USAGE IN COMPONENTS
 * ===================
 */

// In Settings.tsx
import { BillingTabContent } from "@/features/billing/components/BillingTabContent";

// In billing tab section:
{activeTab === 'billing' && logic.isOrganizationUser && logic.billingInfo && (
  <BillingTabContent
    billingStatus={logic.billingInfo}
    canManageBilling={logic.canManageBilling}
    onUpgradeSuccess={() => logic.loadAllData()}
  />
)}

// In Pricing.tsx
import { useBilling } from "@/features/billing";

const Pricing: React.FC = () => {
  const { billingStatus, isLoading } = useBilling();
  
  const displayPlans = useMemo(() => {
    // ... transform API plans to display format
    // Falls back to FALLBACK_PLANS if API unavailable
  }, [billingStatus]);

  // Maps displayPlans with PricingCard component
};

/**
 * API ENDPOINTS
 * =============
 */

// GET /api/billing/plans
// Public endpoint, no auth required
// Returns: Plan[] with pricing tiers

// GET /settings/billing
// Returns: BillingStatus with current subscription and usage

// POST /api/billing/create-order
// Body: { planId: string }
// Returns: { success: true, order: Order }

// POST /api/billing/verify-payment
// Body: { orderId, paymentId, signature }
// Returns: { success: true, message, subscription, subscription_status }

// POST /api/billing/sync-subscription
// Manual sync with TTT Payment Service
// Returns: { success: true, subscription: Subscription }

// POST /api/billing/internal/activate (Webhook from TTT)
// Headers: Authorization: Bearer CENTRAL_BILLING_INTERNAL_KEY
// Body: { organizationId, customerId, planId, planFeatures, status }
// Returns: { success: true, idempotent, organization }

/**
 * ERROR HANDLING
 * ==============
 */

// UpgradeButton catches and displays:
// - "Failed to create order" - Order creation API failed
// - "Failed to initialize Razorpay" - Script loading failed
// - "Payment Failed" - User cancelled or payment declined
// - "Payment verification failed" - Signature mismatch
// - Any error from backend APIs

// useBilling hook manages:
// - isLoading state for async operations
// - error state with descriptive messages
// - Automatic refresh of billingStatus after payment

/**
 * TESTING CHECKLIST
 * =================
 */

// Frontend Tests
// [ ] Pricing page loads and displays plans
// [ ] Settings billing tab shows current subscription
// [ ] Click "Get Started" opens Razorpay popup
// [ ] Payment success shows success message
// [ ] Payment failure shows error message
// [ ] Usage bars display correctly
// [ ] Plan details show seat/agent/property limits

// Backend Tests
// [ ] GET /api/billing/plans returns plans
// [ ] GET /settings/billing returns current subscription
// [ ] POST /api/billing/create-order creates order
// [ ] POST /api/billing/verify-payment verifies signature
// [ ] POST /api/billing/internal/activate updates org
// [ ] Idempotency check prevents duplicate activations

// End-to-End Tests
// [ ] User navigates to Pricing
// [ ] Clicks "Get Started" for a plan
// [ ] Razorpay popup opens
// [ ] Payment succeeds (use Razorpay test card)
// [ ] Frontend shows success
// [ ] Refresh Settings - shows new subscription
// [ ] Feature gating allows new limits

/**
 * RAZORPAY TEST CARDS
 * ===================
 */

// Success Card:
// Card Number: 4111 1111 1111 1111
// Expiry: Any future date (e.g., 12/25)
// CVV: Any 3 digits (e.g., 123)

// Declined Card:
// Card Number: 4000 0000 0000 0002
// Expiry: Any future date
// CVV: Any 3 digits

/**
 * PERFORMANCE CONSIDERATIONS
 * ==========================
 */

// 1. Plan caching in useBilling
//    - Plans fetched on mount
//    - Not refetched unless component remounts
//    - Safe to use in multiple components

// 2. Billing status polling
//    - No automatic polling implemented
//    - Call syncSubscription() manually for updates
//    - Or refresh on page navigation

// 3. Razorpay script
//    - Loaded asynchronously on demand
//    - Cached in window.Razorpay
//    - Prevents duplicate loads

/**
 * DEPLOYMENT NOTES
 * ================
 */

// 1. Environment Variables
//    Frontend: VITE_RAZORPAY_KEY (test or prod key)
//    Backend: CENTRAL_BILLING_INTERNAL_KEY, TTT_PAYMENT_SERVICE_URL

// 2. CORS Configuration
//    - Razorpay requires domain whitelist
//    - TTT Payment Service needs backend allowed

// 3. SSL/TLS
//    - Razorpay requires HTTPS in production
//    - Local development can use HTTP

// 4. Webhook Security
//    - Internal activate endpoint verifies API key
//    - Never trust webhook source IP
//    - Always verify signature

/**
 * DEBUGGING
 * =========
 */

// Browser Console
// window.Razorpay - Check if script loaded
// localStorage - Check auth tokens
// Network tab - Monitor API calls

// Backend Logs
// [BILLING_ORDER] - Order creation logs
// [BILLING_PAYMENT_VERIFICATION] - Payment verification logs
// [BILLING_ACTIVATION] - Webhook activation logs
// [SUBSCRIPTION_CHECK] - Subscription status checks

// Common Issues
// 1. Razorpay script fails to load
//    - Check VITE_RAZORPAY_KEY env var
//    - Check CORS headers from Razorpay CDN
//
// 2. "Organization not synced" error
//    - Organization.subscription.centralBillingCustomerId is empty
//    - Call /api/billing/initialize first
//
// 3. Payment verification fails
//    - Signature mismatch (tampering detected)
//    - Check orderId/paymentId values
//    - Verify TTT service is responding
