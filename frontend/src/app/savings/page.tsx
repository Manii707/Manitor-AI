"use client";

import { useState, useEffect } from "react";
import { Plus, PiggyBank, Target } from "lucide-react";

type SavingsGoal = {
  id: string;
  title: string;
  target_amount: number;
  current_amount: number;
  deadline: string;
};

export default function SavingsPage() {
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newTarget, setNewTarget] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/savings/`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newTitle || !newTarget || !newDeadline) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/savings/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          target_amount: parseFloat(newTarget),
          deadline: new Date(newDeadline).toISOString()
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewTarget("");
        setNewDeadline("");
        setIsAdding(false);
        fetchGoals();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Savings Goals</h1>
          <p className="text-slate-400">Track your financial milestones and targets.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(22,163,74,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          New Goal
        </button>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-green-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Create Savings Goal</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Goal Title (e.g. New Laptop)" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
            <input 
              type="number" 
              placeholder="Target Amount ($)" 
              value={newTarget}
              onChange={e => setNewTarget(e.target.value)}
              className="w-48 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
            <input 
              type="date" 
              value={newDeadline}
              onChange={e => setNewDeadline(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-green-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {goals.map(goal => {
          const progress = Math.min((goal.current_amount / goal.target_amount) * 100, 100);
          return (
            <div key={goal.id} className="glass-panel p-6 hover:scale-[1.01] transition-transform duration-300">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-500/20 text-green-400">
                    <Target size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <p className="text-sm text-slate-400">By {new Date(goal.deadline).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">${goal.current_amount.toFixed(2)} Saved</span>
                  <span className="text-slate-400">${goal.target_amount.toFixed(2)} Target</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="text-right text-xs text-green-400 font-medium">
                  {progress.toFixed(1)}% Completed
                </div>
              </div>
            </div>
          );
        })}
        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            <PiggyBank className="mb-4 opacity-50" size={48} />
            <p>No savings goals found. Start saving today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
