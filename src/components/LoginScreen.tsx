import { useState } from "react";
import { LogIn, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { mockUsers } from "../data/mockData";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        if (!fullName) {
          setError("Please enter your full name");
          setLoading(false);
          return;
        }
        await signup(email, password, fullName);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setError("");
    setLoading(true);
    try {
      await login(userEmail, userPassword);
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="max-w-md w-full space-y-8 relative">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl border border-white/20 shadow-2xl">
              <Sparkles
                className="w-16 h-16 text-yellow-300"
                strokeWidth={1.5}
              />
            </div>
          </div>
          <h1 className="text-5xl font-black text-white mb-2 tracking-tight">
            Nexgen Quest
          </h1>
          <p className="text-xl text-white/90 font-medium">
            Level Up Your Workday
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            {isSignUp && (
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-bold text-white mb-2"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-transparent focus:border-white focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                  required
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-white mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-transparent focus:border-white focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-white mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-white/90 border-2 border-transparent focus:border-white focus:bg-white outline-none transition-all text-gray-900 placeholder-gray-400"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold py-4 rounded-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-5 h-5" />
              {loading ? "Please wait..." : isSignUp ? "Sign Up" : "Sign In"}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="w-full text-white/90 text-sm font-semibold hover:text-white transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Sign Up"}
            </button>
          </form>

          <div className="mt-8">
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/70 font-semibold">
                  Quick Login
                </span>
              </div>
            </div> */}

            <div className="mt-6 grid gap-3">
              {/* {mockUsers
                .filter((u) => u.role === "employee")
                .slice(0, 2)
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => quickLogin(user.email, "demo123")}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-white/20 hover:bg-white/30 rounded-xl text-white font-medium transition-all hover:scale-105 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {user.fullName} (employee)
                  </button>
                ))} */}
              {/* <button
                onClick={() => quickLogin("admin@gmail.com", "admin@123")}
                disabled={loading}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl text-white font-bold transition-all hover:scale-105 border border-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Admin Login
              </button> */}
            </div>
          </div>
        </div>

        <p className="text-center text-white/70 text-sm">
          {/* Demo app - Choose any account above to explore */}
        </p>
      </div>
    </div>
  );
}
