import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

export default function PerformanceReportsPage() {
  const { addToast } = useToast();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Performance & Career Readiness Report | NextStep Academy</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col text-slate-800 font-sans selection:bg-[#7C3AED] selection:text-white">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] p-6 sm:p-8 shadow-lg shadow-purple-200/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white bg-white/20 px-3.5 py-1 rounded-full uppercase border border-white/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Verified Analytics & Metrics
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Comprehensive Candidate Readiness Evaluation
                </h1>
                <p className="text-sm text-white/80">
                  Aggregated telemetry across algorithm speed, system design tradeoffs, AI mock defenses, and daily milestones.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-white text-[#7C3AED] font-bold text-xs transition shadow-md hover:bg-white/90 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Export PDF Report
                </button>
              </div>
            </div>

            {/* Overall Score Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1 p-6 rounded-3xl bg-white border border-slate-200 flex flex-col items-center justify-center text-center space-y-3 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] text-white font-black text-3xl flex items-center justify-center shadow-lg shadow-purple-200">
                  84%
                </div>
                <div>
                  <div className="text-lg font-bold text-slate-900">Tier-1 Ready</div>
                  <div className="text-xs text-[#7C3AED] font-semibold">Top 8% Candidate Rank</div>
                </div>
                <p className="text-[11px] text-slate-500 leading-tight">
                  Qualified for Senior/Staff Full Stack & Backend roles.
                </p>
              </div>

              <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs text-slate-500">Technical Depth</div>
                  <div className="text-2xl font-black text-[#7C3AED]">8.8 / 10</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#7C3AED] w-[88%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Strong distributed systems grasp</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs text-slate-500">STAR Communication</div>
                  <div className="text-2xl font-black text-emerald-500">9.1 / 10</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[91%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Concise, data-driven answers</div>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                  <div className="text-xs text-slate-500">Algorithm Efficiency</div>
                  <div className="text-2xl font-black text-sky-500">8.2 / 10</div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-sky-500 w-[82%]"></div>
                  </div>
                  <div className="text-[10px] text-slate-400">Mastery of BFS, Graph & DP</div>
                </div>
              </div>
            </div>

            {/* Detailed Evaluation Matrices */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Radar Breakdown Table */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">Skill Matrix Breakdown</h3>
                <div className="space-y-3.5">
                  {[
                    { name: 'System Design & Scalability', score: 92, status: 'Mastered' },
                    { name: 'Next.js / React Architecture', score: 95, status: 'Mastered' },
                    { name: 'FastAPI / Python Async Backend', score: 88, status: 'Proficient' },
                    { name: 'Database Indexing & PostgreSQL', score: 82, status: 'Proficient' },
                    { name: 'Live Architectural Defense', score: 84, status: 'Proficient' },
                    { name: 'Dynamic Programming & Graphs', score: 78, status: 'Needs Practice' },
                  ].map((skill, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>{skill.name}</span>
                        <span className="text-[#7C3AED] font-bold">{skill.score}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            skill.score >= 90
                              ? 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED]'
                              : skill.score >= 80
                              ? 'bg-emerald-500'
                              : 'bg-sky-500'
                          }`}
                          style={{ width: `${skill.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Plan & Recommendations */}
              <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-5 shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900">AI Placement Recommendations</h3>
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-purple-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-[#7C3AED]">🔥 Target Next: Graph Traversal Speed</div>
                      <p className="text-slate-600">
                        Spend 20 mins completing BFS/Dijkstra practice modules on the Tasks board to raise your algorithmic score from 8.2 to 9.0+.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900">⭐ Mock Interview Simulator</div>
                      <p className="text-slate-600">
                        Take one more Distributed Systems defense session to achieve 90%+ readiness rank.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    href="/tasks"
                    className="text-xs font-bold text-[#7C3AED] hover:underline"
                  >
                    Go to Daily Practice Tasks →
                  </Link>
                  <Link
                    href="/mock-interview"
                    className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition shadow-md shadow-purple-200"
                  >
                    Start AI Mock Interview
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
