"use client";

import { useState, useEffect } from "react";
import { Briefcase, Plus, CheckCircle, Clock } from "lucide-react";

type WorkTask = {
  id: string;
  project_name: string;
  task_name: string;
  deadline: string;
  status: string;
};

export default function WorkPage() {
  const [tasks, setTasks] = useState<WorkTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newProject, setNewProject] = useState("");
  const [newTaskName, setNewTaskName] = useState("");
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/work/`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newProject || !newTaskName || !newDeadline) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/work/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_name: newProject,
          task_name: newTaskName,
          deadline: new Date(newDeadline).toISOString(),
          status: "To Do"
        }),
      });
      if (res.ok) {
        setNewProject("");
        setNewTaskName("");
        setNewDeadline("");
        setIsAdding(false);
        fetchTasks();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Work Planner</h1>
          <p className="text-slate-400">Manage projects, tasks, and deadlines efficiently.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(8,145,178,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          New Task
        </button>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-cyan-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Create Work Task</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Project Name" 
              value={newProject}
              onChange={e => setNewProject(e.target.value)}
              className="w-48 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <input 
              type="text" 
              placeholder="Task Name" 
              value={newTaskName}
              onChange={e => setNewTaskName(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <input 
              type="datetime-local" 
              value={newDeadline}
              onChange={e => setNewDeadline(e.target.value)}
              className="w-56 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {["To Do", "In Progress", "Done"].map(statusGroup => (
          <div key={statusGroup} className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">{statusGroup}</h3>
              <span className="px-2 py-1 rounded-full text-xs bg-slate-800 text-slate-400">
                {tasks.filter(t => t.status === statusGroup).length}
              </span>
            </div>
            
            {tasks.filter(t => t.status === statusGroup).map(task => (
              <div key={task.id} className="glass-panel p-4 border-l-4 border-cyan-500 hover:scale-[1.02] transition-transform cursor-pointer">
                <span className="text-xs text-cyan-400 font-medium">{task.project_name}</span>
                <h4 className="text-white font-bold mt-1 mb-2">{task.task_name}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Clock size={14} />
                  {new Date(task.deadline).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
