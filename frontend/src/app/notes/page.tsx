"use client";

import { useState, useEffect } from "react";
import { FileText, Plus, Tag, Search, Brain } from "lucide-react";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string;
  created_at: string;
  qdrant_id: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newTags, setNewTags] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes/`);
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = async () => {
    if (!newTitle || !newContent) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/notes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: newContent,
          tags: newTags
        }),
      });
      if (res.ok) {
        setNewTitle("");
        setNewContent("");
        setNewTags("");
        setIsAdding(false);
        fetchNotes();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 h-full flex flex-col">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Smart Notes</h1>
          <p className="text-slate-400">Your AI-indexed knowledge base.</p>
        </div>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Semantic Search..." 
              className="pl-10 pr-4 py-2.5 rounded-full bg-slate-800/50 border border-slate-700 text-white focus:outline-none focus:border-blue-500 w-64 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-medium transition-all shadow-[0_0_20px_rgba(147,51,234,0.5)] cursor-pointer"
          >
            <Plus size={20} />
            New Note
          </button>
        </div>
      </header>

      {isAdding && (
        <div className="glass-panel p-6 mb-8 border-purple-500/30">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Draft Note</h2>
            <div className="flex items-center gap-2 text-xs text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
              <Brain size={14} />
              Auto-indexing enabled
            </div>
          </div>
          <div className="space-y-4">
            <input 
              type="text" 
              placeholder="Title" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 text-xl font-medium"
            />
            <textarea 
              placeholder="Write your note here... (Markdown supported)" 
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full h-48 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
            />
            <div className="flex gap-4 items-center">
              <div className="flex-1 relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Tags (comma separated)" 
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <button onClick={handleAdd} className="px-8 py-2 bg-purple-600 hover:bg-purple-500 rounded-xl text-white font-medium cursor-pointer">Save to Knowledge Base</button>
              <button onClick={() => setIsAdding(false)} className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map(note => (
          <div key={note.id} className="glass-panel p-6 flex flex-col h-64 hover:scale-[1.02] transition-transform duration-300">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-white truncate pr-4">{note.title}</h3>
              <FileText className="text-purple-400 shrink-0" size={20} />
            </div>
            
            <p className="text-slate-400 text-sm flex-1 overflow-hidden line-clamp-4">
              {note.content}
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col gap-2">
              <div className="flex gap-2 overflow-hidden">
                {note.tags.split(',').map(tag => tag.trim()).filter(Boolean).map((tag, i) => (
                  <span key={i} className="px-2 py-1 rounded-md text-xs font-medium bg-slate-800 text-purple-300 border border-slate-700">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{new Date(note.created_at).toLocaleDateString()}</span>
                {note.qdrant_id && (
                  <span className="flex items-center gap-1 text-green-500">
                    <Brain size={12} /> Indexed
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        {notes.length === 0 && !isAdding && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-2xl">
            <Brain className="mb-4 opacity-50" size={48} />
            <p className="mb-2">Your knowledge base is empty.</p>
            <p className="text-sm">Notes you create here are embedded into Qdrant for MONI AI to access.</p>
          </div>
        )}
      </div>
    </div>
  );
}
