"use client";

import { useState, useEffect } from "react";
import { Target, Plus, Trophy, Flag } from "lucide-react";

type Goal = {
  id: string;
  title: string;
  type: string;
  progress_percentage: number;
  deadline: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Short-Term");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/`);
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newTitle || !newDeadline) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/goals/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          type: newType,
          progress_percentage: 0,
          deadline: new Date(newDeadline).toISOString(),
        }),
      });
      if (res.ok) {
        setNewTitle("");
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
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Life Goals</h1>
          <p className="text-slate-400">Track short-term milestones and long-term ambitions.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-yellow-600 hover:bg-yellow-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(202,138,4,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          New Goal
        </button>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-yellow-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Set a New Goal</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="What do you want to achieve?" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            >
              <option>Short-Term</option>
              <option>Long-Term</option>
            </select>
            <input 
              type="date" 
              value={newDeadline}
              onChange={e => setNewDeadline(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map(goal => (
          <div key={goal.id} className="glass-panel p-6 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${goal.type === 'Long-Term' ? 'bg-purple-500/20 text-purple-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {goal.type === 'Long-Term' ? <Trophy size={24} /> : <Flag size={24} />}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                  <p className="text-sm text-slate-400">{goal.type} • By {new Date(goal.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Progress</span>
                <span className="text-slate-400">{goal.progress_percentage.toFixed(0)}%</span>
              </div>
              <div className="h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className={`h-full ${goal.type === 'Long-Term' ? 'bg-gradient-to-r from-purple-500 to-pink-400' : 'bg-gradient-to-r from-yellow-500 to-orange-400'}`} 
                  style={{ width: `${goal.progress_percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            <Target className="mb-4 opacity-50" size={48} />
            <p>No goals defined yet. Aim high and add one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
