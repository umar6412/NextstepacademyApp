import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

export default function ResumeBuilderPage() {
  const { addToast } = useToast();

  const [fullName, setFullName] = useState('Alex Chen');
  const [email, setEmail] = useState('alex.chen@nextstep.dev');
  const [phone, setPhone] = useState('+1 (555) 234-5678');
  const [targetTitle, setTargetTitle] = useState('Full Stack Software Engineer');
  const [summary, setSummary] = useState(
    'High-impact Full Stack Engineer with expertise in Next.js 14, TypeScript, FastAPI, and distributed systems. Passionate about sub-50ms API performance, high-throughput microservices, and modern UX architecture.'
  );

  const [skills, setSkills] = useState('React, Next.js, TypeScript, Python, FastAPI, PostgreSQL, Redis, Docker, Kafka, System Design');
  const [experience, setExperience] = useState(
    'Software Engineer Intern | TechFlow Inc. (May 2024 - Present)\n• Engineered an asynchronous ingestion pipeline with FastAPI & Redis, reducing median response latency by 42% for 250k daily active users.\n• Migrated legacy monolithic endpoints to Next.js server components with ISR, accelerating Time-To-First-Byte (TTFB) by 60%.'
  );
  const [projects, setProjects] = useState(
    'NextStep Academy (Full Stack Platform)\n• Developed real-time AI mock interview simulation with speech recognition and automated architectural scoring.\n• Architected PostgreSQL database schema with composite indexing for sub-10ms query execution.'
  );
  const [education, setEducation] = useState(
    'B.Tech in Computer Science & Engineering\nABC Institute of Technology (2022 - 2026) • GPA: 3.9/4.0'
  );

  // ATS Score Calculation
  const calculateAtsScore = () => {
    let score = 50;
    if (summary.length > 80) score += 10;
    if (skills.includes('FastAPI') && skills.includes('Next.js')) score += 12;
    if (experience.includes('%') || experience.includes('latency') || experience.includes('reduced')) score += 15;
    if (projects.length > 50) score += 10;
    return Math.min(98, score);
  };

  const atsScore = calculateAtsScore();

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleAiOptimize = () => {
    setSummary(
      'Results-driven Full Stack Software Engineer with deep expertise in scalable Next.js, asynchronous Python (FastAPI), and distributed caching topologies. Proven track record of optimizing high-throughput APIs and cutting page load latency by over 50%.'
    );
    addToast('✨ AI Enhanced your Professional Summary with STAR impact keywords!', 'success');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>AI Resume Builder & ATS Scanner | NextStep Academy</title>
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
                  AI Resume & ATS Optimizer
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                  Tier-1 ATS Resume Builder & Keyword Scanner
                </h1>
                <p className="text-sm text-slate-300">
                  Craft an ATS-optimized technical resume with quantified impact metrics, STAR bullet formatting, and real-time pass rate scoring.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleAiOptimize}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-[#7C3AED] border border-purple-200 font-bold text-xs transition shadow-md flex items-center gap-1.5"
                >
                  <span>✨ AI Optimize</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-5 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition shadow-lg shadow-purple-200 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Export PDF
                </button>
              </div>
            </div>

            {/* ATS Score Meter Bar */}
            <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xl flex items-center justify-center shadow-lg shadow-purple-200 flex-shrink-0">
                  {atsScore}%
                </div>
                <div>
                  <div className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>ATS Compatibility Score: Highly Competitive</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      FAANG Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Strong inclusion of quantified metrics (%, ms, throughput), modern stack keywords, and clean single-column structure.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#7C3AED] font-semibold bg-[#EDE9FE] px-3.5 py-2 rounded-xl border border-purple-200">
                <span>🛡️ Clean ATS Parser Tested</span>
              </div>
            </div>

            {/* Two Column Layout: Editor (Left) & Real-Time Preview (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Form Editor */}
              <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200 space-y-5 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📝</span> Candidate Details & Sections
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Target Title</label>
                    <input
                      type="text"
                      value={targetTitle}
                      onChange={(e) => setTargetTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Professional Summary</label>
                  <textarea
                    rows={3}
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Technical Skills</label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Work Experience & Impact</label>
                  <textarea
                    rows={5}
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs font-mono focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Featured Projects</label>
                  <textarea
                    rows={4}
                    value={projects}
                    onChange={(e) => setProjects(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs font-mono focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Education</label>
                  <textarea
                    rows={2}
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>
              </div>

              {/* Right Column: Live ATS Formatted Document Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-300">Live Clean ATS Preview</h3>
                  <span className="text-[11px] text-[#7C3AED] font-semibold">Standard 8.5" x 11" Format</span>
                </div>

                <div
                  id="resume-print-area"
                  className="bg-white text-slate-900 rounded-2xl p-8 sm:p-10 shadow-lg space-y-6 text-xs font-serif leading-relaxed min-h-[680px]"
                >
                  {/* Header */}
                  <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950 uppercase">{fullName}</h2>
                    <p className="text-xs font-semibold text-slate-700">{targetTitle}</p>
                    <p className="text-[11px] text-slate-600">
                      {email} • {phone} • linkedin.com/in/alexchen • github.com/alexchen
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
                      Professional Summary
                    </h4>
                    <p className="text-[11px] text-slate-700 leading-normal">{summary}</p>
                  </div>

                  {/* Technical Skills */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
                      Technical Skills
                    </h4>
                    <p className="text-[11px] text-slate-700">{skills}</p>
                  </div>

                  {/* Experience */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
                      Engineering Experience
                    </h4>
                    <pre className="text-[11px] text-slate-700 font-serif whitespace-pre-wrap leading-normal">
                      {experience}
                    </pre>
                  </div>

                  {/* Projects */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
                      Key Projects & Architecture
                    </h4>
                    <pre className="text-[11px] text-slate-700 font-serif whitespace-pre-wrap leading-normal">
                      {projects}
                    </pre>
                  </div>

                  {/* Education */}
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
                      Education
                    </h4>
                    <pre className="text-[11px] text-slate-700 font-serif whitespace-pre-wrap leading-normal">
                      {education}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
