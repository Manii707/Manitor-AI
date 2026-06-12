"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Plus, ListTodo, Search } from "lucide-react";

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState("General");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("manitor_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/work/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    
    setAdding(true);
    try {
      const token = localStorage.getItem("manitor_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/work/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          task_name: newTaskName, 
          project_name: newTaskCategory,
          deadline: new Date(Date.now() + 86400000).toISOString() // Tomorrow
        }),
      });
      if (res.ok) {
        setNewTaskName("");
        fetchTasks();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  const toggleTaskStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem("manitor_token");
      const newStatus = currentStatus === "Completed" ? "To Do" : "Completed";
      
      // Optimistic update
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
      
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/work/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error(err);
      fetchTasks(); // Revert on failure
    }
  };

  if (loading) return <div className="text-red-500 animate-pulse text-sm p-8 tracking-widest uppercase">Loading Task Matrix...</div>;

  const pendingTasks = tasks.filter(t => t.status !== "Completed");
  const completedTasks = tasks.filter(t => t.status === "Completed");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto">
      <header className="flex justify-between items-end mb-8 border-b border-red-500/20 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-red-950/50 border border-red-500/30 flex items-center justify-center text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
            <ListTodo size={28} />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white mb-1">Task Matrix</h1>
            <p className="text-slate-400">Organize and execute your daily objectives.</p>
          </div>
        </div>
      </header>

      {/* Add Task Form */}
      <div className="glass-panel p-2 flex items-center gap-2">
        <div className="pl-4 text-slate-500"><Plus size={20} /></div>
        <input 
          type="text" 
          placeholder="Initiate new objective..." 
          className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0 placeholder:text-slate-600 font-medium"
          value={newTaskName}
          onChange={e => setNewTaskName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddTask(e)}
        />
        <select 
          className="bg-black/50 border border-red-500/20 text-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:border-red-500/50"
          value={newTaskCategory}
          onChange={e => setNewTaskCategory(e.target.value)}
        >
          <option>General</option>
          <option>Work</option>
          <option>Study</option>
          <option>Personal</option>
        </select>
        <button 
          onClick={handleAddTask}
          disabled={adding || !newTaskName.trim()}
          className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          Inject
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending Tasks */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,1)]"></span>
              Active Objectives
            </h2>
            <span className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full">{pendingTasks.length} Pending</span>
          </div>
          
          <div className="space-y-3">
            {pendingTasks.length === 0 ? (
              <p className="text-slate-500 text-sm italic text-center py-8">All active objectives complete. Awaiting new input.</p>
            ) : (
              pendingTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-black/40 border border-white/5 flex items-start gap-4 group hover:border-red-500/30 transition-all shadow-lg hover:shadow-[0_0_15px_rgba(220,38,38,0.1)]">
                  <button onClick={() => toggleTaskStatus(task.id, task.status)} className="mt-0.5 text-slate-500 hover:text-red-500 transition-colors">
                    <Circle size={20} />
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white group-hover:text-red-100">{task.task_name}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded flex items-center gap-1">
                        {task.project_name}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="glass-panel p-6 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span>
              Archived Log
            </h2>
            <span className="text-xs font-bold text-slate-400 bg-white/5 px-3 py-1 rounded-full">{completedTasks.length} Done</span>
          </div>
          
          <div className="space-y-3">
            {completedTasks.length === 0 ? (
              <p className="text-slate-600 text-sm italic text-center py-8">No objectives archived yet.</p>
            ) : (
              completedTasks.map(task => (
                <div key={task.id} className="p-4 rounded-xl bg-black/20 border border-transparent flex items-start gap-4 group">
                  <button onClick={() => toggleTaskStatus(task.id, task.status)} className="mt-0.5 text-emerald-500/70 hover:text-emerald-400 transition-colors">
                    <CheckCircle2 size={20} />
                  </button>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-400 line-through decoration-slate-600">{task.task_name}</p>
                    <p className="text-xs text-slate-600 mt-1 uppercase tracking-wider">{task.project_name}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
