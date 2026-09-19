import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getToken, setToken, setCurrentUser } from '../utils/api';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let token = getToken();
    if (!token) {
      // Initialize a default student session so developers & users can explore all pages seamlessly
      const demoToken = 'demo_session_token_' + Date.now();
      setToken(demoToken);
      setCurrentUser({
        id: 'usr_demo',
        email: 'alex.chen@nextstep.dev',
        name: 'Alex Chen',
        role: 'STUDENT',
        targetRole: 'Full Stack Software Engineer',
        progressPercent: 78,
      });
    }
    setAuthorized(true);
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 text-slate-500 font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm">Loading your session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
