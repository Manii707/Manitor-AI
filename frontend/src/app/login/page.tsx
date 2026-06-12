"use client";

import { useState } from "react";
import { Lock, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("Manikandan");
  const [password, setPassword] = useState("63798");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Login failed");
      
      localStorage.setItem("manitor_token", data.access_token);
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* Logo Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full border border-red-500/80 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6),inset_0_0_15px_rgba(220,38,38,0.4)] bg-black/60 backdrop-blur-sm mb-6">
            <span className="text-3xl font-light text-red-500 font-heading" style={{ textShadow: '0 0 10px rgba(220,38,38,0.9)' }}>M</span>
          </div>
          <h1 
            className="text-4xl font-light text-white uppercase tracking-[0.5em] font-heading text-center ml-4" 
            style={{ textShadow: '0 0 15px rgba(220,38,38,0.7)' }}
          >
            MANITOR
          </h1>
          <p className="text-red-500/80 tracking-[0.2em] text-sm mt-2 font-light">SYSTEM LOGIN</p>
        </div>

        {/* Auth Box */}
        <div className="bg-black/40 backdrop-blur-xl border border-red-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(220,38,38,0.05)] relative overflow-hidden">
          {/* Top Line Accent */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50"></div>
          
          {error && (
            <div className="mb-6 p-3 bg-red-950/50 border border-red-500/50 text-red-400 text-sm rounded-xl text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-red-500/50" />
                </div>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full bg-black/50 border border-red-500/20 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-red-500/50 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-red-500/50" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-black/50 border border-red-500/20 text-white rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-red-500/50 focus:shadow-[0_0_15px_rgba(220,38,38,0.2)] transition-all placeholder:text-slate-600"
                  required
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading || !password || !username}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "AUTHENTICATING..." : "LOGIN"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
