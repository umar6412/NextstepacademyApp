import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

interface RoadmapNode {
  id: string;
  title: string;
  category: string;
  status: 'completed' | 'in-progress' | 'locked';
  xp: number;
  description: string;
  skills: string[];
}

const CAREER_TRACKS = {
  'fullstack': {
    name: 'Full Stack Engineering Track',
    targetRole: 'Senior Full Stack Software Engineer',
    nodes: [
      {
        id: 'node-1',
        title: 'Tier 1: Next.js & React Core Architecture',
        category: 'Frontend Foundations',
        status: 'completed' as const,
        xp: 250,
        description: 'Server Components, Hydration, SSR/SSG/ISR rendering modes, and state management.',
        skills: ['Next.js 14', 'React', 'TypeScript', 'TailwindCSS'],
      },
      {
        id: 'node-2',
        title: 'Tier 2: Asynchronous FastAPI & High-Throughput APIs',
        category: 'Backend Architecture',
        status: 'completed' as const,
        xp: 300,
        description: 'Async endpoints, Pydantic schemas, Dependency Injection, and JWT Auth middleware.',
        skills: ['Python 3.11', 'FastAPI', 'Pydantic', 'JWT RBAC'],
      },
      {
        id: 'node-3',
        title: 'Tier 3: PostgreSQL Optimization & Caching Topologies',
        category: 'Data & Scaling',
        status: 'in-progress' as const,
        xp: 450,
        description: 'Composite B-Tree indexing, connection pooling (PgBouncer), and Redis distributed caching.',
        skills: ['PostgreSQL', 'Redis', 'SQLAlchemy', 'Indexing'],
      },
      {
        id: 'node-4',
        title: 'Tier 4: Distributed Systems & Event Streaming',
        category: 'Enterprise Scale',
        status: 'locked' as const,
        xp: 600,
        description: 'Kafka message brokers, distributed rate limiters, token bucket algorithms, and CAP defense.',
        skills: ['Apache Kafka', 'Microservices', 'Docker', 'System Defense'],
      },
    ],
  },
  'ai-engineer': {
    name: 'AI & LLM Application Engineering Track',
    targetRole: 'AI Application Engineer',
    nodes: [
      {
        id: 'ai-1',
        title: 'Tier 1: Vector Embeddings & Similarity Search',
        category: 'Vector Mathematics',
        status: 'completed' as const,
        xp: 250,
        description: 'Dense vector embeddings, cosine distance, and HNSW index mechanics.',
        skills: ['Pinecone', 'Qdrant', 'OpenAI Embeddings', 'NumPy'],
      },
      {
        id: 'ai-2',
        title: 'Tier 2: Production RAG Architectures',
        category: 'Retrieval Pipelines',
        status: 'in-progress' as const,
        xp: 400,
        description: 'Document chunking strategies, hybrid keyword/vector search, and re-ranking models.',
        skills: ['LangChain', 'LlamaIndex', 'Rerankers', 'FastAPI'],
      },
      {
        id: 'ai-3',
        title: 'Tier 3: Autonomous Multi-Agent Orchestration',
        category: 'Autonomous Systems',
        status: 'locked' as const,
        xp: 650,
        description: 'Tool calling, multi-agent state machines, memory retention, and automated evaluations.',
        skills: ['LangGraph', 'Agentic Workflows', 'Function Calling'],
      },
    ],
  },
};

export default function CareerRoadmapPage() {
  const { addToast } = useToast();
  const [selectedTrack, setSelectedTrack] = useState<keyof typeof CAREER_TRACKS>('fullstack');
  const [targetCompany, setTargetCompany] = useState('Stripe');

  const currentTrack = CAREER_TRACKS[selectedTrack];

  const companyRequirements: Record<string, { match: number; missing: string[] }> = {
    Stripe: { match: 86, missing: ['Distributed Rate Limiter Defense', 'Idempotency Key Patterns'] },
    Google: { match: 82, missing: ['Graph Dijkstra Traversals in <15m', 'Memory Complexity Optimization'] },
    Vercel: { match: 94, missing: ['Edge Middleware Cache Purging'] },
    Amazon: { match: 88, missing: ['Leadership Principles (STAR Deep Dive)'] },
  };

  const req = companyRequirements[targetCompany] || companyRequirements['Stripe'];

  return (
    <ProtectedRoute>
      <Head>
        <title>Interactive Career Roadmap & Skill Tree | NextStep Academy</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col text-slate-800 font-sans selection:bg-[#7C3AED] selection:text-white">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] p-6 sm:p-8 shadow-lg shadow-purple-200/50">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#EDE9FE] rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white bg-white/20 px-3.5 py-1 rounded-full uppercase border border-white/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Dynamic Career Roadmap
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Visual Engineering Skill Tree & Company Gap Analyzer
                </h1>
                <p className="text-sm text-slate-300">
                  Step-by-step master roadmap tracking milestones, unlockable certifications, and target company requirements.
                </p>
              </div>
            </div>

            {/* Target Company Match Bar */}
            <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-5 backdrop-blur-md">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-purple-200 text-[#7C3AED] font-black text-lg flex items-center justify-center shadow-md flex-shrink-0">
                  {req.match}%
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span>Target Dream Company Match: {targetCompany}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Missing to reach 95%+: <span className="text-[#7C3AED] font-semibold">{req.missing.join(', ')}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">Dream Company:</span>
                <select
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="bg-slate-50 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-amber-400"
                >
                  <option value="Stripe">Stripe ($175k Avg)</option>
                  <option value="Google">Google ($190k Avg)</option>
                  <option value="Vercel">Vercel ($165k Avg)</option>
                  <option value="Amazon">Amazon ($170k Avg)</option>
                </select>
              </div>
            </div>

            {/* Track Switcher */}
            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
              {Object.entries(CAREER_TRACKS).map(([key, track]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTrack(key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    selectedTrack === key
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {track.name}
                </button>
              ))}
            </div>

            {/* Visual Skill Tree Vertical Pathway */}
            <div className="space-y-6 relative">
              <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-amber-500 via-amber-400 to-slate-800 hidden sm:block"></div>

              {currentTrack.nodes.map((node, index) => (
                <div key={node.id} className="relative flex items-start gap-6 sm:pl-3 group">
                  {/* Status Circle Node */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-black z-10 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      node.status === 'completed'
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                        : node.status === 'in-progress'
                        ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-purple-200 animate-pulse'
                        : 'bg-slate-900 border-slate-700 text-slate-500'
                    }`}
                  >
                    {node.status === 'completed' ? '✓' : node.status === 'in-progress' ? '⚡' : index + 1}
                  </div>

                  {/* Node Content Card */}
                  <div
                    className={`flex-1 p-6 rounded-3xl border transition-all duration-300 shadow-sm ${
                      node.status === 'in-progress'
                        ? 'bg-slate-900 border-amber-500/40 ring-1 ring-amber-400/30 shadow-amber-500/5'
                        : node.status === 'completed'
                        ? 'bg-slate-900/80 border-emerald-500/30'
                        : 'bg-slate-900/40 border-slate-100 opacity-60'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#7C3AED] bg-[#EDE9FE] px-2.5 py-0.5 rounded border border-purple-200">
                          {node.category}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            node.status === 'completed'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : node.status === 'in-progress'
                              ? 'text-[#7C3AED] bg-[#EDE9FE]'
                              : 'text-slate-500 bg-slate-50'
                          }`}
                        >
                          {node.status}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-[#7C3AED]">+{node.xp} XP</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2">{node.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{node.description}</p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {node.skills.map((sk) => (
                          <span
                            key={sk}
                            className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-50 text-slate-300 border border-slate-200"
                          >
                            {sk}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={node.status === 'locked' ? '#' : '/tasks'}
                        className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                          node.status === 'locked'
                            ? 'bg-slate-50 text-slate-500 cursor-not-allowed'
                            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-md shadow-purple-200'
                        }`}
                      >
                        {node.status === 'completed' ? 'Review Drills' : node.status === 'in-progress' ? 'Continue Milestone →' : 'Locked 🔒'}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
