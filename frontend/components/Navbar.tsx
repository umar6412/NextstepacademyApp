import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser, removeToken, User } from '../utils/api';
import { useToast } from './Toast';

export function Navbar() {
  const router = useRouter();
  const { addToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [router.pathname]);

  const handleLogout = () => {
    removeToken();
    addToast('Logged out successfully', 'info');
    router.push('/auth/login');
  };

  const navLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'AI Interviews', href: '/mock-interview' },
    { name: 'Courses', href: '/courses' },
    { name: 'Playground', href: '/playground' },
    { name: 'Jobs', href: '/jobs' },
    { name: 'Community', href: '/community' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Brand Logo with SIFAL BITZ Style */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-[#0A0B1E] p-0.5 overflow-hidden shadow-md border border-slate-200">
          <img
            src="/logo.png"
            alt="NextStep Academy Logo"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div>
          <span className="font-syne font-black text-base sm:text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
            NEXTSTEP <span className="text-[#7C3AED]">ACADEMY</span>
          </span>
          <span className="hidden sm:block text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            SIFAL BITZ GLOBAL LEARNING LABS
          </span>
        </div>
      </Link>

      {/* Navigation Links in Pill Capsule Container */}
      <nav className="hidden xl:flex items-center gap-1 bg-[#F1F5F9]/80 border border-slate-200 rounded-full px-3 py-1.5 shadow-inner text-xs font-medium text-slate-600">
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1 rounded-full transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#EDE9FE] text-[#7C3AED] font-bold shadow-sm'
                  : 'hover:text-slate-900 hover:bg-white/80'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* User Session / Auth CTA Button */}
      <div className="flex items-center gap-3">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2.5 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-2xl border border-slate-200 transition shadow-sm"
            >
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                {user.name ? user.name[0] : 'U'}
              </div>
              <span className="text-xs font-semibold text-slate-800 hidden sm:inline">{user.name || user.email}</span>
              <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                <div className="px-4 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                </div>
                <Link
                  href="/profile/edit"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] transition"
                >
                  Edit Profile
                </Link>
                <Link
                  href="/resume-builder"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-xs text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] transition"
                >
                  AI Resume Builder
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 transition font-semibold"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <Link
              href="/auth/login"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#D946EF] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:scale-105 transition"
            >
              Enroll Now
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
