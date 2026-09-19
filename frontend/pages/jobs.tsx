import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

interface JobListing {
  id: string;
  company: string;
  role: string;
  matchScore: number;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  salary: string;
  tags: string[];
  description: string;
  applied: boolean;
  postedTime: string;
}

const JOBS_DATA: JobListing[] = [
  {
    id: 'job-1',
    company: 'Stripe',
    role: 'Full Stack Software Engineer (Next.js & Python)',
    matchScore: 96,
    location: 'San Francisco, CA (Remote Friendly)',
    type: 'Full-time',
    salary: '$155,000 – $190,000',
    tags: ['Next.js', 'React', 'FastAPI', 'PostgreSQL', 'System Design'],
    description: 'Build mission-critical billing infrastructure and high-throughput developer portals. Experience with idempotent API design, SSR caching, and distributed databases required.',
    applied: false,
    postedTime: '2 hours ago',
  },
  {
    id: 'job-2',
    company: 'Vercel',
    role: 'Frontend Infrastructure & AI Engineer',
    matchScore: 94,
    location: 'Remote (Worldwide)',
    type: 'Full-time',
    salary: '$140,000 – $180,000',
    tags: ['Next.js', 'TypeScript', 'TailwindCSS', 'AI SDK', 'Edge Functions'],
    description: 'Work directly on the future of web deployment, Next.js core ecosystem, and AI streaming components. Looking for candidates passionate about TTFB optimization and developer experience.',
    applied: false,
    postedTime: '5 hours ago',
  },
  {
    id: 'job-3',
    company: 'Datadog',
    role: 'Backend Distributed Systems Engineer',
    matchScore: 91,
    location: 'New York, NY (Hybrid)',
    type: 'Full-time',
    salary: '$160,000 – $205,000',
    tags: ['Python', 'Kafka', 'Redis', 'Microservices', 'Distributed Systems'],
    description: 'Scale our real-time telemetry ingestion pipelines processing millions of events per second. Deep knowledge of concurrency, rate limiting, and cache topologies required.',
    applied: true,
    postedTime: '1 day ago',
  },
  {
    id: 'job-4',
    company: 'OpenAI Ecosystem Partner',
    role: 'AI / RAG Application Developer',
    matchScore: 88,
    location: 'San Francisco, CA (Remote)',
    type: 'Full-time',
    salary: '$150,000 – $195,000',
    tags: ['LangChain', 'FastAPI', 'Vector DB', 'Python', 'LLMs'],
    description: 'Develop production RAG agents, prompt evaluation pipelines, and fine-tuning pipelines for enterprise clients.',
    applied: false,
    postedTime: '2 days ago',
  },
];

export default function JobsPage() {
  const { addToast } = useToast();
  const [jobs, setJobs] = useState<JobListing[]>(JOBS_DATA);
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeTab, setActiveTab] = useState<'all' | 'applied'>('all');
  const [activeJobModal, setActiveJobModal] = useState<JobListing | null>(null);

  const toggleApply = (jobId: string) => {
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const nextState = !j.applied;
          addToast(
            nextState
              ? `🚀 Application sent to ${j.company} with your NextStep Verified Profile & AI Interview Score!`
              : `Application withdrawn from ${j.company}`,
            nextState ? 'success' : 'info'
          );
          return { ...j, applied: nextState };
        }
        return j;
      })
    );
    if (activeJobModal && activeJobModal.id === jobId) {
      const current = jobs.find((j) => j.id === jobId);
      if (current) setActiveJobModal({ ...current, applied: !current.applied });
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (activeTab === 'applied' && !j.applied) return false;
    if (selectedTag !== 'All' && !j.tags.includes(selectedTag)) return false;
    return true;
  });

  return (
    <ProtectedRoute>
      <Head>
        <title>AI Career Job Portal & Matcher | NextStep Academy</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col text-slate-800 font-sans selection:bg-[#7C3AED] selection:text-white">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] p-6 sm:p-8 shadow-lg shadow-purple-200/50">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white bg-white/20 px-3.5 py-1 rounded-full uppercase border border-white/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Verified Talent Matcher
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  High-Impact Tech Roles Matched to Your Skills & AI Score
                </h1>
                <p className="text-sm sm:text-base text-white/80">
                  Apply directly with your verified NextStep portfolio, mock interview scores, and course completion badges.
                </p>
              </div>
            </div>

            {/* Filter & Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'all'
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Featured Roles ({jobs.length})
                </button>
                <button
                  onClick={() => setActiveTab('applied')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'applied'
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Applied ({jobs.filter((j) => j.applied).length})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Next.js', 'FastAPI', 'System Design', 'Kafka', 'Python'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedTag === tag
                        ? 'bg-[#EDE9FE] text-[#7C3AED] border border-purple-200 font-bold'
                        : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Listings Grid */}
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-purple-300 p-6 sm:p-7 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
                >
                  <div className="space-y-3 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-xs font-black text-[#7C3AED] uppercase tracking-wider">
                        {job.company}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{job.location}</span>
                      <span className="text-slate-300">•</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-200">
                        {job.type}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-auto">{job.postedTime}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#7C3AED] transition">
                      {job.role}
                    </h3>

                    <p className="text-xs text-slate-500 leading-relaxed max-w-3xl line-clamp-2">
                      {job.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#EDE9FE] text-[#7C3AED] border border-purple-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col items-start md:items-end justify-between gap-4 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 flex-shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-slate-400">AI Match</div>
                        <div className="text-sm font-black text-[#7C3AED]">{job.matchScore}% Strong Fit</div>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-purple-200 text-[#7C3AED] font-black flex items-center justify-center text-sm shadow-sm">
                        {job.matchScore}%
                      </div>
                    </div>

                    <div className="font-mono text-xs font-bold text-slate-700">{job.salary}</div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <button
                        onClick={() => setActiveJobModal(job)}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => toggleApply(job.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                          job.applied
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-purple-200'
                        }`}
                      >
                        {job.applied ? '✓ Applied' : '1-Click Apply →'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Job Detail Modal */}
        {activeJobModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 text-slate-800">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-black text-[#7C3AED] uppercase tracking-wider">
                    {activeJobModal.company}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">{activeJobModal.role}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeJobModal.location} • {activeJobModal.type} • {activeJobModal.salary}
                  </p>
                </div>
                <button
                  onClick={() => setActiveJobModal(null)}
                  className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-[#EDE9FE] border border-purple-200 flex items-center justify-between text-xs text-slate-700">
                <div>
                  <span className="font-bold text-[#7C3AED]">Match Analysis:</span> You meet 95%+ requirements
                  for this role based on your course completions and recent AI Mock Interview defense score (8.4/10).
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Job Description</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{activeJobModal.description}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs font-mono text-slate-500">{activeJobModal.salary}</span>
                <button
                  onClick={() => toggleApply(activeJobModal.id)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition shadow-lg ${
                    activeJobModal.applied
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-purple-200'
                  }`}
                >
                  {activeJobModal.applied ? '✓ Application Submitted' : 'Submit 1-Click Application'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
