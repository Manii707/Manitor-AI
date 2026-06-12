"use client";

import { useEffect, useState } from 'react';
import { Brain, TrendingUp, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("manitor_token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/dashboard`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return <div className="min-h-[80vh] flex items-center justify-center text-red-500 animate-pulse tracking-[0.3em] font-light text-sm uppercase">Synchronizing Live Data...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Good Evening, Manikandan</h1>
          <p className="text-slate-400">Here is your real-time life summary powered by MONI.</p>
        </div>
        <Link href="/ai" className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] cursor-pointer inline-block">
          Ask MONI AI
        </Link>
      </header>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Productivity Score", value: data?.productivity_score || "0%", icon: TrendingUp, color: "text-red-500" },
          { title: "Tasks Completed", value: data?.tasks_completed || "0/0", icon: CheckCircle2, color: "text-rose-500" },
          { title: "Monthly Savings", value: data?.monthly_savings || "$0", icon: Brain, color: "text-red-400" },
          { title: "Upcoming Events", value: data?.upcoming_events || "0 Today", icon: CalendarIcon, color: "text-orange-500" }
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-400 font-medium">{stat.title}</h3>
              <stat.icon className={stat.color} size={24} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
            
            {/* Dynamic Chart */}
            <div className="glass-panel p-6 h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-4">Expense Activity</h2>
              <div className="flex-1 flex items-end justify-between border border-dashed border-red-500/20 rounded-xl bg-black/20 p-6 gap-3">
                {data?.chart_data?.map((val: number, idx: number) => (
                  <div key={idx} className="w-full bg-red-500/20 rounded-t-sm hover:bg-red-500/40 transition-colors relative group" style={{ height: `${maxHeightPercentage(val, data.chart_data)}%` }}>
                    <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-red-950 text-red-200 text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap">
                      ${val.toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Dynamic Tasks */}
            <div className="glass-panel p-6 h-[400px] flex flex-col">
              <h2 className="text-xl font-bold text-white mb-4">Remaining Tasks</h2>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-red-500/20 scrollbar-track-transparent">
                {(!data?.remaining_tasks || data.remaining_tasks.length === 0) ? (
                  <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">All caught up! No pending tasks.</div>
                ) : (
                  data.remaining_tasks.map((task: any, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 flex items-start gap-3 group cursor-pointer hover:border-red-500/30 transition-colors">
                      <div className="w-5 h-5 rounded-full border border-slate-500 group-hover:border-red-500 mt-0.5 flex-shrink-0 transition-colors"></div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-red-100 transition-colors">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">{task.category}</span>
                          <span className="text-xs text-slate-500">{task.due}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Dynamic Insights based on state */}
        <div className="space-y-8">
          <div className="glass-panel p-6 h-[400px] flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">MONI Insights</h2>
            <div className="flex-1 space-y-4">
              {data?.remaining_tasks?.length > 3 && (
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <p className="text-sm text-orange-200">⚡ You have quite a few tasks pending! Consider asking me (MONI) to help you prioritize your day.</p>
                </div>
              )}
              {data?.tasks_completed?.split('/')[0] === "0" && data?.remaining_tasks?.length > 0 && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-200">💡 Let's get started! Knock out the easiest task on your list to build momentum.</p>
                </div>
              )}
              {data?.tasks_completed?.split('/')[0] !== "0" && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-sm text-emerald-200">✨ Great job completing tasks today! Keep the streak going.</p>
                </div>
              )}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <p className="text-sm text-slate-300">🧠 I'm tracking your real-time performance. Let me know if you need help budgeting or studying!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function maxHeightPercentage(val: number, arr: number[]) {
  const max = Math.max(...arr, 1);
  return Math.max((val / max) * 100, 5);
}
