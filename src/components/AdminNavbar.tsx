import { Shield, LogOut, Award, Users, Gift, BarChart3 } from "lucide-react";

interface AdminNavbarProps {
  adminName: string;
  onLogout: () => void;
}

export default function AdminNavbar({ adminName, onLogout }: AdminNavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b-4 border-amber-500">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-3 rounded-xl shadow-lg">
              <Shield className="w-8 h-8 text-slate-900" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Admin Control Center
              </h1>
              <p className="text-slate-400 text-sm font-medium">
                System Management Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-6 px-6 py-2 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Users className="w-5 h-5" />
                <span className="text-sm font-semibold">Employees</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Award className="w-5 h-5" />
                <span className="text-sm font-semibold">Achievements</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <Gift className="w-5 h-5" />
                <span className="text-sm font-semibold">Rewards</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors cursor-pointer">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-semibold">Analytics</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all hover:scale-105 hover:shadow-xl shadow-lg"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
