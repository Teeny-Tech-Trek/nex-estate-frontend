import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppLayout from "@/components/AppLayout";
import Navbar from "@/components/Navbar";
import { ComponentErrorBoundary } from "@/components/ComponentErrorBoundary";
import Index from "./pages/HomeAllPages";
import Avatars from "./pages/Avatars";
import Properties from "./pages/Properties";
import Visits from "./pages/Visits";
import Leads from "./pages/Leads";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GoogleCallback from "./pages/GoogleCallback";
import LinkGoogle from "./pages/LinkGoogle";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AgentChatPage from "./pages/AgentChatPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import Footer from "./components/Footer";
import { useEffect } from "react";
import Dashboard from "./components/Dasboard";
import OnboardingFlow from "./components/OnboardingFlow";

const queryClient = new QueryClient();

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const App = () => (
  <ComponentErrorBoundary level="global" label="Application">
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
              <OnboardingFlow />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/pricing" element={
                <>
               
                  <Pricing />
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Navbar />
                  <Login />
                      <Footer />
                </>
              } />
              <Route path="/signup" element={
                <>
                  <Navbar />
                  <Signup />
                      <Footer />
                </>
              } />
              <Route path="/auth/google/callback" element={<GoogleCallback />} />
              <Route path="/auth/google/link" element={<LinkGoogle />} />
              <Route path="/forgot-password" element={
                <>
                  <Navbar />
                  <ForgotPassword />
                  <Footer />
                </>
              } />
              <Route path="/reset-password/:token" element={
                <>
                  <Navbar />
                  <ResetPassword />
                  <Footer />
                </>
              } />
              <Route path="/accept-invite" element={<AcceptInvitePage />} />
              <Route path="/agent/:id" element={
                <ComponentErrorBoundary level="route" label="Agent Chat">
                  <AgentChatPage />
                </ComponentErrorBoundary>
              } />
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={
                    <ComponentErrorBoundary level="route" label="Dashboard">
                      <Dashboard />
                    </ComponentErrorBoundary>
                  } />
                  <Route path="/avatars" element={
                    <ComponentErrorBoundary level="route" label="Avatars">
                      <Avatars />
                    </ComponentErrorBoundary>
                  } />
                  <Route path="/properties" element={
                    <ComponentErrorBoundary level="route" label="Properties">
                      <Properties />
                    </ComponentErrorBoundary>
                  } />
                  <Route path="/visits" element={
                    <ComponentErrorBoundary level="route" label="Visits">
                      <Visits />
                    </ComponentErrorBoundary>
                  } />
                  <Route
                    element={
                      <ProtectedRoute
                        allowedRoles={["owner", "admin", "member", "agent", "individual"]}
                      />
                    }
                  >
                    <Route path="/leads" element={
                      <ComponentErrorBoundary level="route" label="Leads">
                        <Leads />
                      </ComponentErrorBoundary>
                    } />
                  </Route>
                  <Route path="/analytics" element={
                    <ComponentErrorBoundary level="route" label="Analytics">
                      <Analytics />
                    </ComponentErrorBoundary>
                  } />
                  <Route path="/settings" element={
                    <ComponentErrorBoundary level="route" label="Settings">
                      <Settings />
                    </ComponentErrorBoundary>
                  } />
                </Route>
              </Route>
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ComponentErrorBoundary>
);

export default App;
