"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === '/login') {
      setIsAuthenticated(true);
      return;
    }

    const token = localStorage.getItem("manitor_token");
    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  if (!isAuthenticated && pathname !== '/login') {
    return <div className="min-h-screen w-full bg-black flex items-center justify-center text-red-500 tracking-widest uppercase font-light text-sm animate-pulse">Initializing Secure Connection...</div>;
  }

  return <>{children}</>;
}
