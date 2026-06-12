"use client";

import { Sidebar } from '@/components/Sidebar';
import { GlobalNotifications } from '@/components/GlobalNotifications';
import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  if (isLogin) {
    return <main className="w-full min-h-screen bg-black">{children}</main>;
  }

  return (
    <AuthGuard>
      <Sidebar />
      <GlobalNotifications />
      <div className="fixed top-0 left-64 right-0 flex items-center justify-center gap-6 pt-8 pointer-events-none z-40 bg-gradient-to-b from-black/90 to-transparent pb-10">
        <div className="w-10 h-10 rounded-full border border-red-500/80 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6),inset_0_0_15px_rgba(220,38,38,0.4)] bg-black/60 backdrop-blur-sm">
          <span className="font-heading text-xl font-light text-red-500" style={{ textShadow: '0 0 10px rgba(220,38,38,0.9)' }}>M</span>
        </div>
        <h1 
          className="font-heading text-3xl font-light text-white uppercase tracking-[0.5em]" 
          style={{ textShadow: '0 0 15px rgba(220,38,38,0.7), 0 0 30px rgba(220,38,38,0.3)' }}
        >
          MANITOR AI
        </h1>
      </div>
      <main className="flex-1 ml-64 p-8 pt-28 min-h-screen relative z-10">
        {children}
      </main>
    </AuthGuard>
  );
}
