"use client";

import { useState, useEffect } from "react";
import { BookOpen, Plus, Clock, Briefcase } from "lucide-react";

type StudySession = {
  id: string;
  subject: string;
  topic: string;
  duration_minutes: number;
  date: string;
};

export default function StudyPage() {
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newTopic, setNewTopic] = useState("");
  const [newDuration, setNewDuration] = useState("");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/study/`);
      if (res.ok) {
        const data = await res.json();
        setSessions(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newSubject || !newTopic || !newDuration) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/study/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: newSubject,
          topic: newTopic,
          duration_minutes: parseFloat(newDuration),
          date: new Date().toISOString()
        }),
      });
      if (res.ok) {
        setNewSubject("");
        setNewTopic("");
        setNewDuration("");
        setIsAdding(false);
        fetchSessions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration_minutes, 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Study Planner</h1>
          <p className="text-slate-400">Track subjects, topics, and total learning hours.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(79,70,229,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          Log Session
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="glass-panel p-6 border-indigo-500/20 flex items-center justify-between">
          <div>
            <h3 className="text-slate-400 font-medium mb-1">Total Study Time</h3>
            <p className="text-4xl font-bold text-white">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</p>
          </div>
          <Clock className="text-indigo-400" size={48} />
        </div>
        <div className="glass-panel p-6 border-orange-500/20 flex items-center justify-between">
          <div>
            <h3 className="text-slate-400 font-medium mb-1">Subjects Covered</h3>
            <p className="text-4xl font-bold text-white">{new Set(sessions.map(s => s.subject)).size}</p>
          </div>
          <BookOpen className="text-orange-400" size={48} />
        </div>
      </div>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-indigo-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Log Study Session</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Subject" 
              value={newSubject}
              onChange={e => setNewSubject(e.target.value)}
              className="w-48 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
            <input 
              type="text" 
              placeholder="Topic" 
              value={newTopic}
              onChange={e => setNewTopic(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
            <input 
              type="number" 
              placeholder="Minutes" 
              value={newDuration}
              onChange={e => setNewDuration(e.target.value)}
              className="w-32 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-indigo-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
          <div key={session.id} className="glass-panel p-6 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white truncate pr-2">{session.subject}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 whitespace-nowrap">
                {session.duration_minutes} min
              </span>
            </div>
            <p className="text-slate-400 mb-6">{session.topic}</p>
            <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500">
              {new Date(session.date).toLocaleDateString()}
            </div>
          </div>
        ))}
        {sessions.length === 0 && !isAdding && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            <Briefcase className="mb-4 opacity-50" size={48} />
            <p>No study sessions logged yet. Start learning!</p>
          </div>
        )}
      </div>
    </div>
  );
}
