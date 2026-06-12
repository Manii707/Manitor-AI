"use client";

import { useState, useEffect } from "react";
import { BarChart as BarChartIcon, PieChart as PieChartIcon } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("manitor_token");
    if (!token) return;

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/analytics/summary`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Fetch failed");
        return res.json();
      })
      .then(data => setStats(data))
      .catch(console.error);
  }, []);

  if (!stats) return <div className="text-white p-8 animate-pulse">Loading analytics engine...</div>;

  // Mock data for charts visualization
  const barData = [
    { name: 'Mon', study: 2, work: 5 },
    { name: 'Tue', study: 3, work: 4 },
    { name: 'Wed', study: 1, work: 6 },
    { name: 'Thu', study: 4, work: 4 },
    { name: 'Fri', study: 2, work: 3 },
    { name: 'Sat', study: 5, work: 1 },
    { name: 'Sun', study: 4, work: 0 },
  ];

  const pieData = [
    { name: 'Food', value: 400 },
    { name: 'Rent', value: 1200 },
    { name: 'Transport', value: 200 },
    { name: 'Entertainment', value: 300 },
  ];
  const COLORS = ['#ef4444', '#f43f5e', '#f97316', '#991b1b'];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Analytics</h1>
          <p className="text-slate-400">Your life, visualized.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 border-red-500/40 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
          <h3 className="text-slate-400 font-medium mb-1">Total Spending</h3>
          <p className="text-3xl font-bold text-white">${Number(stats.expenses_total || 0).toFixed(2)}</p>
        </div>
        <div className="glass-panel p-6 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
          <h3 className="text-slate-400 font-medium mb-1">Total Savings</h3>
          <p className="text-3xl font-bold text-white">${Number(stats.savings_total || 0).toFixed(2)}</p>
        </div>
        <div className="glass-panel p-6 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
          <h3 className="text-slate-400 font-medium mb-1">Study Hours</h3>
          <p className="text-3xl font-bold text-white">{(Number(stats.study_time_minutes || 0) / 60).toFixed(1)}h</p>
        </div>
        <div className="glass-panel p-6 border-red-900/60 shadow-[0_0_15px_rgba(153,27,27,0.2)]">
          <h3 className="text-slate-400 font-medium mb-1">Active Tasks</h3>
          <p className="text-3xl font-bold text-white">{Number(stats.work_tasks_count || 0) + Number(stats.reminders_count || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold text-white mb-6">Spending Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-panel p-8">
          <h3 className="text-xl font-bold text-white mb-6">Productivity Trends (Hours)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff', backgroundColor: 'transparent' }}
                />
                <Legend />
                <Bar dataKey="work" fill="#ef4444" radius={[4, 4, 0, 0]} name="Work" />
                <Bar dataKey="study" fill="#f97316" radius={[4, 4, 0, 0]} name="Study" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
