"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export function GlobalNotifications() {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/^https?:\/\//, '') : 'localhost:8000';
    const wsUrl = `${wsProtocol}//${host}/api/v1/ws/notifications`;
    
    const socket = new WebSocket(wsUrl);
    
    socket.onmessage = (event) => {
      setNotification(event.data);
      setTimeout(() => setNotification(null), 5000);
    };

    return () => socket.close();
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right fade-in duration-300">
      <div className="bg-black/80 backdrop-blur-xl border border-red-500/40 p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_25px_rgba(220,38,38,0.3)]">
        <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center text-red-500">
          <Bell size={20} className="animate-pulse" />
        </div>
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-wider">System Alert</h4>
          <p className="text-red-200 text-sm">{notification}</p>
        </div>
      </div>
    </div>
  );
}
