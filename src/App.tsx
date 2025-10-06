import { useState, useEffect } from "react";
import { useApp } from "./context/AppContext";
import LoginScreen from "./components/LoginScreen";
import EmployeeDashboard from "./components/EmployeeDashboard";
import Leaderboard from "./components/Leaderboard";
import RewardsMarketplace from "./components/RewardsMarketplace";
import AchievementsPanel from "./components/AchievementsPanel";
import AdminPanel from "./components/AdminPanel";
import EmployeeManagement from "./components/EmployeeManagement";
// import AdminNavbar from './components/AdminNavbar';
import CelebrationOverlay from "./components/CelebrationOverlay";
import AchievementsManager from "./components/AchievementsManager";
import RewardsManager from "./components/RewardsManager";
import {
  LayoutDashboard,
  Trophy,
  ShoppingBag,
  Award,
  Shield,
  LogOut,
  Menu,
  X,
  Users,
  BarChart3,
  Gift,
} from "lucide-react";

type Tab =
  | "dashboard"
  | "leaderboard"
  | "rewards"
  | "achievements"
  | "admin"
  | "employees"
  | "analytics"
  | "manage-achievements"
  | "manage-rewards";

function App() {
  const { currentUser, logout, showCelebration, celebrationMessage } = useApp();
  const defaultTab = currentUser?.role === "admin" ? "employees" : "dashboard";
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setActiveTab(currentUser.role === "admin" ? "employees" : "dashboard");
    }
  }, [currentUser]);

  if (!currentUser) {
    return <LoginScreen />;
  }

  const tabs = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      forRole: ["employee", "admin"],
    },
    {
      id: "leaderboard",
      label: "Leaderboard",
      icon: Trophy,
      forRole: ["employee", "admin"],
    },
    {
      id: "achievements",
      label: "Achievements",
      icon: Award,
      forRole: ["employee", "admin"],
    },
    {
      id: "rewards",
      label: "Rewards",
      icon: ShoppingBag,
      forRole: ["employee", "admin"],
    },
    { id: "admin", label: "Admin Panel", icon: Shield, forRole: ["admin"] },
  ] as const;

  const availableTabs = tabs.filter((tab) =>
    tab.forRole.includes(currentUser.role)
  );

  const adminTabs = [
    { id: "admin", label: "Control Panel", icon: Shield },
    { id: "employees", label: "Employees", icon: Users },
    { id: "manage-achievements", label: "Achievements", icon: Award },
    { id: "manage-rewards", label: "Rewards", icon: Gift },
    { id: "leaderboard", label: "Leaderboard", icon: Trophy },
    // { id: "analytics", label: "Analytics", icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <CelebrationOverlay show={showCelebration} message={celebrationMessage} />

      {currentUser.role === "admin" ? (
        <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b-4 border-amber-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500 p-2 sm:p-3 rounded-xl shadow-lg">
                  <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-slate-900" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                    Admin Control
                  </h1>
                  <p className="text-slate-400 text-xs sm:text-sm font-medium hidden sm:block">
                    System Management Portal
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden md:flex items-center gap-4 lg:gap-6 px-4 lg:px-6 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
                  {adminTabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex items-center gap-2 transition-colors ${
                          activeTab === tab.id
                            ? "text-amber-400"
                            : "text-slate-300 hover:text-white"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-semibold">
                          {tab.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden md:flex items-center gap-3 lg:gap-4">
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-white">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-amber-400 font-semibold">
                      Administrator
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all hover:scale-105 hover:shadow-xl shadow-lg"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden lg:inline">Logout</span>
                  </button>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white bg-slate-800/50 rounded-lg"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden mt-4 space-y-2 pb-4">
                {adminTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as Tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-amber-500 text-slate-900"
                          : "text-white bg-slate-800/50 hover:bg-slate-700/50"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
                <div className="pt-2 border-t border-slate-700">
                  <div className="px-4 py-2 text-white">
                    <p className="text-sm font-bold">{currentUser.fullName}</p>
                    <p className="text-xs text-amber-400 font-semibold">
                      Administrator
                    </p>
                  </div>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </nav>
      ) : (
        <nav className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="bg-white/20 backdrop-blur-xl p-2 rounded-xl">
                  <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-white">
                    Nexgen Quest
                  </h1>
                  <p className="text-xs text-white/80 font-semibold">
                    Level {currentUser.level} • {currentUser.points} pts
                  </p>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as Tab)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-purple-600 shadow-lg scale-105"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="hidden lg:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 sm:gap-4">
                {/* <div className="hidden lg:block text-right">
                  <p className="text-white font-bold text-sm">
                    {currentUser.fullName}
                  </p>
                  <p className="text-white/80 text-xs capitalize">
                    {currentUser.role}
                  </p>
                </div> */}

                <button
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-bold transition-all hover:scale-105"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>

                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 text-white bg-white/10 rounded-lg"
                >
                  {mobileMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {mobileMenuOpen && (
              <div className="md:hidden pb-4 space-y-2">
                {availableTabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id as Tab);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-4 py-3 rounded-xl font-bold transition-all ${
                        activeTab === tab.id
                          ? "bg-white text-purple-600"
                          : "text-white bg-white/10"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {tab.label}
                    </button>
                  );
                })}
                <button
                  onClick={logout}
                  className="w-full flex items-center gap-2 px-4 py-3 bg-white/20 rounded-xl text-white font-bold"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && <EmployeeDashboard />}
        {activeTab === "leaderboard" && <Leaderboard />}
        {activeTab === "achievements" && <AchievementsPanel />}
        {activeTab === "rewards" && <RewardsMarketplace />}
        {activeTab === "admin" && currentUser.role === "admin" && (
          <AdminPanel />
        )}
        {activeTab === "employees" && currentUser.role === "admin" && (
          <EmployeeManagement />
        )}
        {activeTab === "manage-achievements" &&
          currentUser.role === "admin" && <AchievementsManager />}
        {activeTab === "manage-rewards" && currentUser.role === "admin" && (
          <RewardsManager />
        )}
        {activeTab === "analytics" && currentUser.role === "admin" && (
          <div className="bg-white rounded-2xl p-8 shadow-xl text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Analytics Coming Soon
            </h3>
            <p className="text-gray-600">
              Advanced analytics and reporting features will be available here.
            </p>
          </div>
        )}
      </main>

      {/* <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="font-semibold">
              Office Quest - Gamified Office Management Platform
            </p>
            <p className="mt-1">
              Real-time sync • Instant updates • Game-inspired design
            </p>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default App;
