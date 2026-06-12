"use client";

import { useState, useEffect } from "react";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";

type CalendarEvent = {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  event_type: string;
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Personal");
  const [newStart, setNewStart] = useState("");
  const [newEnd, setNewEnd] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newTitle || !newStart || !newEnd) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/calendar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          event_type: newType,
          start_time: new Date(newStart).toISOString(),
          end_time: new Date(newEnd).toISOString(),
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewStart("");
        setNewEnd("");
        setIsAdding(false);
        fetchEvents();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Calendar</h1>
          <p className="text-slate-400">Schedule events, meetings, and personal time.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(225,29,72,0.5)] cursor-pointer"
        >
          <Plus size={20} />
          New Event
        </button>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-rose-500/30">
          <h2 className="text-xl font-semibold text-white mb-4">Schedule Event</h2>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="Event Title" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
            />
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
            >
              <option>Personal</option>
              <option>Work</option>
              <option>Study</option>
            </select>
            <input 
              type="datetime-local" 
              value={newStart}
              onChange={e => setNewStart(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
            />
            <input 
              type="datetime-local" 
              value={newEnd}
              onChange={e => setNewEnd(e.target.value)}
              className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-rose-500"
            />
            <button onClick={handleAdd} className="px-6 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-white font-medium cursor-pointer">Save</button>
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      <div className="glass-panel overflow-hidden">
        <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-2 text-slate-300 font-medium">
          <CalendarIcon size={20} />
          <span>Upcoming Schedule</span>
        </div>
        <div className="divide-y divide-white/5">
          {events.sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()).map(event => (
            <div key={event.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-2 h-12 rounded-full ${event.event_type === 'Work' ? 'bg-cyan-500' : event.event_type === 'Study' ? 'bg-indigo-500' : 'bg-rose-500'}`}></div>
                <div>
                  <h3 className="text-lg font-bold text-white">{event.title}</h3>
                  <p className="text-slate-400 text-sm flex items-center gap-2">
                    <Clock size={14} />
                    {new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300">
                {event.event_type}
              </span>
            </div>
          ))}
          {events.length === 0 && !isAdding && (
            <div className="p-12 text-center text-slate-500">
              No upcoming events scheduled.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
