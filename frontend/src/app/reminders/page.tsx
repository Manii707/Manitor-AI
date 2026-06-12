"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Bell } from "lucide-react";

type Reminder = {
  id: string;
  title: string;
  description: string;
  due_date: string;
  priority: string;
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem("manitor_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/reminders/`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newTitle || !newDate) return;
    try {
      const token = localStorage.getItem("manitor_token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/v1/reminders/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          due_date: new Date(newDate).toISOString(),
          priority: "High",
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewDate("");
        setIsAdding(false);
        fetchReminders();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Reminders</h1>
          <p className="text-slate-400">Manage your upcoming tasks and notifications.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(59,130,246,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          New Reminder
        </button>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-blue-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Create New Reminder</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="What do you need to remember?" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <input 
              type="datetime-local" 
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reminders.map(reminder => (
          <div key={reminder.id} className="glass-panel p-6 flex flex-col justify-between hover:-translate-y-1 transition-transform duration-300">
            <div>
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">{reminder.title}</h3>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/20">
                  {reminder.priority}
                </span>
              </div>
              <p className="text-slate-400 text-sm mb-6">{reminder.description || "No description provided."}</p>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-slate-700/50 text-slate-400 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(reminder.due_date).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{new Date(reminder.due_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
            </div>
          </div>
        ))}
        {reminders.length === 0 && !isAdding && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            <Bell className="mb-4 opacity-50" size={48} />
            <p>No reminders found. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}
