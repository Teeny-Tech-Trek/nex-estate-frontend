



import React, { useState, useEffect, useRef } from 'react';
import { fetchNotifications, markNotificationAsRead } from '@/services/notification.api';
import { motion, AnimatePresence } from 'framer-motion';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Building, 
  CalendarCheck2,
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Dashboard from './Dasboard';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Avatars', path: '/avatars' },
  { icon: Building, label: 'Properties', path: '/properties' },
  { icon: CalendarCheck2, label: 'Visits', path: '/visits' },
  { icon: MessageSquare, label: 'Leads', path: '/leads' },
  // { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const AppLayout = () => {
    const toggleMobileSidebar = () => {
      setIsMobileSidebarOpen((open) => !open);
    };

    const closeMobileSidebar = () => {
      setIsMobileSidebarOpen(false);
    };
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);


  // Notification state
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    }
    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationDropdown]);

  const fetchNotificationData = async () => {
    setLoadingNotifications(true);
    try {
      const data = await fetchNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingNotifications(false);
    }
  };

  useEffect(() => {
    fetchNotificationData();
    // Optionally, poll every 60s:
    // const interval = setInterval(fetchNotificationData, 60000);
    // return () => clearInterval(interval);
  }, []);

  const isLikelyObjectId = (value: string) => /^[a-f0-9]{24}$/i.test(value);

  const userDisplayName = [user?.firstName, user?.lastName]
    .filter((part): part is string => Boolean(part && part.trim()))
    .join(" ")
    .trim() || "User";

  const organizationName = (() => {
    const org = user?.workingUnderOrganization;
    if (!org) return null;
    if (typeof org === "object") {
      return org.name?.trim() || null;
    }
    if (typeof org === "string" && org.trim() && !isLikelyObjectId(org.trim())) {
      return org.trim();
    }
    return null;
  })();

  const subtitle = organizationName
    ? organizationName
    : user?.accountType === "organization"
      ? "Organization Account"
      : user?.role === "individual"
        ? "Individual Account"
        : "No Organization";

  return (
    <div className="min-h-screen bg-[#F8FAFB]">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-br from-[#0a1628] via-[#0f1e3a] to-[#0a1628] shadow-sm">
        <div className="flex items-center justify-between" style={{ height: "clamp(56px, 6vh, 68px)", padding: "0 clamp(12px, 2vw, 32px)" }}>
          {/* LEFT SECTION - Logo and Name */}
          <div className="flex items-center gap-2.5 min-w-fit">
            <div className="bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0" style={{ width: "clamp(36px, 3vw, 48px)", height: "clamp(36px, 3vw, 48px)" }}>
              <img src="https://4ssqc15iraz2fnfu.public.blob.vercel-storage.com/Logo.png" alt="logo" className="w-full h-full object-contain" />
            </div>
            <div className="hidden sm:block min-w-0">
              <h2 className="font-semibold text-white truncate" style={{ fontSize: "clamp(13px, 1.1vw, 17px)" }}>{userDisplayName}</h2>
              <p className="text-gray-100 leading-none truncate" style={{ fontSize: "clamp(10px, 0.8vw, 13px)" }}>{subtitle}</p>
            </div>
          </div>

          {/* MIDDLE SECTION - Desktop Navigation */}
          <nav className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2 z-10" style={{ gap: "clamp(2px, 0.3vw, 8px)" }}>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-1.5 rounded-lg font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'text-gray-100 hover:bg-white/10 hover:text-white'
                }`}
                style={{ padding: "clamp(6px, 0.8vw, 10px) clamp(10px, 1.2vw, 18px)", fontSize: "clamp(12px, 0.92vw, 14px)" }}
              >
                <Icon style={{ width: "clamp(14px, 1.1vw, 17px)", height: "clamp(14px, 1.1vw, 17px)" }} />
                <span className="hidden xl:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

          {/* RIGHT SECTION - Bell and User */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Bell Icon */}
            <div className="relative" ref={notificationRef}>
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-9 w-9 rounded-lg hover:bg-white/10 text-white group"
                onClick={() => setShowNotificationDropdown((v) => !v)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 min-w-[18px] h-5 px-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full text-xs text-white flex items-center justify-center font-bold shadow-lg border border-[#0f1e3a] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Button>
              {showNotificationDropdown && (
                <div className="absolute right-0 mt-2 w-[min(20rem,calc(100vw-24px))] max-h-[min(24rem,70vh)] bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-y-auto overflow-x-hidden">
                  <div className="p-3 border-b font-semibold text-gray-800 flex items-center justify-between">
                    Notifications
                    {loadingNotifications && <span className="text-xs text-gray-400 ml-2">Loading...</span>}
                  </div>
                  {notifications.length === 0 && !loadingNotifications && (
                    <div className="p-4 text-gray-500 text-sm text-center">No notifications</div>
                  )}
                  {notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`px-4 py-3 border-b last:border-b-0 flex flex-col gap-1 cursor-pointer transition-colors ${n.read ? 'bg-white' : 'bg-blue-50/60 hover:bg-blue-100/80'}`}
                      onClick={async () => {
                        if (!n.read) {
                          await markNotificationAsRead(n._id);
                          fetchNotificationData();
                        }
                      }}
                    >
                      <div className="font-medium text-gray-900 text-sm break-words">{n.title}</div>
                      <div className="text-xs text-gray-600 break-words">{n.message}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileSidebar}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-white h-9"
            >
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <ChevronRight className={`h-4 w-4 transition-transform duration-300 ${isMobileSidebarOpen ? 'rotate-90' : ''}`} />
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileSidebar}
              className="lg:hidden p-2 h-9 w-9 hover:bg-white/10 rounded-lg text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile/User Dropdown Menu */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl"
            style={{ top: "clamp(60px, 7vh, 72px)", right: "clamp(8px, 1.5vw, 20px)", width: "min(300px, calc(100vw - 24px))" }}
          >
            {/* User Info */}
            <div 
              className="p-4 border-b border-gray-100 cursor-pointer"
              onClick={() => {
                navigate('/avatars');
                closeMobileSidebar();
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {userDisplayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {subtitle}
                  </p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation (only on mobile) */}
            <div className="lg:hidden p-2">
              <nav className="space-y-1">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        closeMobileSidebar();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive 
                          ? 'bg-blue-50 text-blue-600' 
                          : 'text-black hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Sign Out */}
            <div className="p-2 border-t border-gray-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 rounded-lg font-medium"
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div style={{ paddingTop: "clamp(56px, 6vh, 68px)" }}>
        {/* Page Content */}
        <main className="">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

  
