"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Home, Bell, DollarSign, PiggyBank, Book, Calendar, Settings, Brain, Briefcase, FileText, Target, BarChart3, LogOut, User as UserIcon, Mail } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home, href: '/' },
  { name: 'Tasks', icon: Target, href: '/tasks' },
  { name: 'MONI AI', icon: Brain, href: '/ai' },
  { name: 'Analytics', icon: BarChart3, href: '/analytics' },
  { name: 'Reminders', icon: Bell, href: '/reminders' },
  { name: 'Calendar', icon: Calendar, href: '/calendar' },
  { name: 'Expenses', icon: DollarSign, href: '/expenses' },
  { name: 'Savings', icon: PiggyBank, href: '/savings' },
  { name: 'Notes', icon: FileText, href: '/notes' },
  { name: 'Study', icon: Book, href: '/study' },
  { name: 'Goals', icon: Target, href: '/goals' },
];

export function Sidebar() {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("manitor_token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 glass flex flex-col p-4 z-50">
      <nav className="flex-1 space-y-2 mt-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors text-slate-400 hover:text-red-400"
            >
              <Icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-4 border-t border-white/10 relative">
        
        {/* Profile Popover */}
        {showProfile && (
          <div className="absolute bottom-full left-0 w-full mb-4 bg-black/90 backdrop-blur-xl border border-red-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(220,38,38,0.2)] animate-in slide-in-from-bottom-2 fade-in duration-200 z-50">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500/50 flex items-center justify-center text-red-500 font-bold font-heading">
                  M
                </div>
                <div>
                  <p className="text-sm font-bold text-white tracking-wider">Manikandan</p>
                  <p className="text-xs text-red-400">System Admin</p>
                </div>
              </div>
              
              <div className="space-y-2 py-1">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <UserIcon size={14} />
                  <span>Admin Privileges</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Mail size={14} />
                  <span>money.boxx007@gmail.com</span>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="w-full mt-2 flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/40 text-red-500 hover:text-red-400 py-2 rounded-lg transition-colors border border-red-500/20 text-sm font-medium"
              >
                <LogOut size={16} />
                <span>Log Out Terminal</span>
              </button>
            </div>
          </div>
        )}

        {/* Profile Trigger */}
        <div 
          onClick={() => setShowProfile(!showProfile)}
          className={`flex items-center gap-3 px-2 py-2 cursor-pointer rounded-xl transition-all ${showProfile ? 'bg-red-500/10 border-red-500/30' : 'hover:bg-white/5 border-transparent'} border`}
        >
          <div className="w-10 h-10 rounded-full bg-red-950 border border-red-500/30 flex items-center justify-center text-red-500 font-bold font-heading">
            M
          </div>
          <div>
            <p className="text-sm font-medium text-white">Manikandan</p>
            <p className="text-xs text-slate-400">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
