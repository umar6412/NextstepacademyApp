import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavItem {
  label: string;
  href: string;
  badge?: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      label: 'Overview',
      href: '/dashboard',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 00-1-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Daily Tasks',
      href: '/tasks',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      label: 'AI Interviews',
      href: '/mock-interview',
      badge: 'PROCTOR',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
      ),
    },
    {
      label: 'DSA Playground',
      href: '/playground',
      badge: 'IDE',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      label: 'Career Roadmap',
      href: '/roadmap',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
    },
    {
      label: 'AI Resume Builder',
      href: '/resume-builder',
      badge: 'ATS',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: 'Courses & Labs',
      href: '/courses',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      label: 'Job Matcher',
      href: '/jobs',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Community & Ranks',
      href: '/community',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      label: 'Performance Report',
      href: '/reports',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      label: 'Profile Settings',
      href: '/profile/edit',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white p-4 flex flex-col justify-between hidden lg:flex min-h-[calc(100vh-57px)]">
      <div className="space-y-1.5">
        {/* Brand Banner in Sidebar */}
        <Link href="/" className="flex items-center gap-2.5 p-2 rounded-2xl bg-slate-50 border border-slate-200 mb-3 group hover:border-[#7C3AED]/40 transition">
          <div className="w-9 h-9 rounded-xl bg-[#0A0B1E] overflow-hidden border border-slate-200 shrink-0">
            <img src="/logo.png" alt="NextStep Academy" className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-syne font-bold text-slate-900 tracking-tight truncate group-hover:text-[#7C3AED] transition">NextStep Academy</h4>
            <p className="text-[9px] font-mono text-slate-500 uppercase tracking-wider">SIFAL BITZ LABS</p>
          </div>
        </Link>

        <div className="px-3 py-1.5 text-[10px] font-bold text-[#7C3AED] uppercase tracking-widest font-mono flex items-center justify-between">
          <span>Labs Portal</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] animate-ping"></span>
        </div>

        {navItems.map((item) => {
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#EDE9FE] text-[#7C3AED] shadow-sm border border-purple-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={isActive ? 'text-[#7C3AED]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded-md bg-purple-100 text-[#7C3AED] border border-purple-200">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Readiness Progress Widget */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#EDE9FE] to-white border border-purple-200 space-y-2.5 shadow-sm relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-[#7C3AED]/10 rounded-full blur-xl pointer-events-none"></div>
        <div className="flex items-center justify-between text-xs font-bold text-slate-900">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
            Global Readiness
          </span>
          <span className="text-[#7C3AED] font-mono">84%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#D946EF] w-[84%] rounded-full"></div>
        </div>
        <p className="text-[10px] text-slate-500 leading-tight">
          Complete today's AI Interview to achieve 90%+ Tier-1 verification.
        </p>
      </div>
    </aside>
  );
}
