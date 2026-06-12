"use client";

import { useState, useEffect, useRef } from "react";
import { BrainCircuit, Send, Bot, User } from "lucide-react";

export default function AIPage() {
  const [messages, setMessages] = useState<{role: 'user' | 'moni', text: string}[]>([
    { role: 'moni', text: 'Hello! I am MONI, your Personal Life Assistant. I have secure access to your calendar, finances, notes, and goals. How can I help you today?' }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("manitor_token");
    if (!token) {
      window.location.href = "/login";
      return;
    }
    
    const wsBaseUrl = process.env.NEXT_PUBLIC_API_URL 
      ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '') 
      : 'localhost:8000';
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${wsBaseUrl}/api/v1/ai/ws/chat?token=${token}`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onmessage = (event) => {
      if (event.data === "[DONE]") {
        setIsTyping(false);
        setIsStreaming(false);
      } else {
        setIsTyping(false); // Stop typing dots once streaming begins
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMsg = newMessages[newMessages.length - 1];
          if (lastMsg.role === 'moni') {
            newMessages[newMessages.length - 1] = { ...lastMsg, text: lastMsg.text + event.data };
          } else {
            newMessages.push({ role: 'moni', text: event.data });
          }
          return newMessages;
        });
      }
    };
    
    socket.onerror = () => {
      setMessages(prev => [...prev, { role: 'moni', text: "Error connecting to AI streaming server." }]);
      setIsTyping(false);
      setIsStreaming(false);
    };

    wsRef.current = socket;
    return () => socket.close();
  }, []);

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || isStreaming || isTyping) return;
    const userText = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput("");
    setIsTyping(true);
    setIsStreaming(true);

    wsRef.current.send(userText);
  };

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-red-500/20 text-red-500 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.3)]">
          <BrainCircuit size={32} />
        </div>
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white mb-1">MONI AI</h1>
          <p className="text-slate-400">Your omniscient life co-pilot.</p>
        </div>
      </header>

      <div className="flex-1 glass-panel flex flex-col overflow-hidden mb-6 relative">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(220,38,38,0.3)] ${msg.role === 'user' ? 'bg-red-600 text-white' : 'bg-black text-red-500 border border-red-500/30'}`}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              <div className={`px-5 py-3 rounded-2xl max-w-[70%] shadow-lg ${msg.role === 'user' ? 'bg-red-600 text-white rounded-tr-sm shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'bg-black text-slate-200 border border-red-500/20 rounded-tl-sm'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-black text-red-500 border border-red-500/30 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(220,38,38,0.2)]">
                <Bot size={20} />
              </div>
              <div className="px-5 py-4 rounded-2xl bg-black text-red-500 border border-red-500/20 rounded-tl-sm flex gap-2">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 bg-slate-900/50 border-t border-slate-800">
          <div className="flex gap-3">
            <input 
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask MONI anything about your life..."
              className="flex-1 bg-black border border-red-500/30 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-red-500 focus:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
            />
            <button 
              onClick={handleSend}
              disabled={isTyping || isStreaming}
              className="px-6 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)]"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
