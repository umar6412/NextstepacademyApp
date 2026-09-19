import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

interface CourseModule {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  rating: number;
  enrolled: boolean;
  progressPercent: number;
  imageUrl: string;
  description: string;
  modules: CourseModule[];
}

const COURSES_DATA: Course[] = [
  {
    id: 'c-1',
    title: 'Modern Full Stack Mastery with Next.js & FastAPI',
    category: 'Full Stack Engineering',
    level: 'Intermediate',
    duration: '14 Hours • 8 Modules',
    rating: 4.9,
    enrolled: true,
    progressPercent: 65,
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    description: 'Master enterprise Next.js App Router, SSR/SSG architectures, FastAPI async endpoints, SQLAlchemy ORM, and JWT authentication.',
    modules: [
      { id: 'm1', title: 'Full Stack Architecture & Monorepo Best Practices', duration: '45 mins', completed: true },
      { id: 'm2', title: 'Next.js 13+ Hybrid Rendering, SSR & Hydration', duration: '60 mins', completed: true },
      { id: 'm3', title: 'FastAPI High-Performance Async Endpoints & Pydantic', duration: '55 mins', completed: true },
      { id: 'm4', title: 'PostgreSQL Relational Data Modeling & Indexing', duration: '75 mins', completed: false },
      { id: 'm5', title: 'Production Security, JWT & RBAC Middleware', duration: '50 mins', completed: false },
    ],
  },
  {
    id: 'c-2',
    title: 'Distributed Systems & Microservices Architecture',
    category: 'System Design',
    level: 'Advanced',
    duration: '18 Hours • 10 Modules',
    rating: 4.95,
    enrolled: true,
    progressPercent: 40,
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    description: 'Design fault-tolerant distributed systems, event-driven architectures with Kafka, Redis caching topologies, and CAP tradeoffs.',
    modules: [
      { id: 'm2-1', title: 'CAP Theorem, Partition Tolerance & Consensus Protocols', duration: '60 mins', completed: true },
      { id: 'm2-2', title: 'Distributed Rate Limiters & Token Bucket Mechanics', duration: '45 mins', completed: true },
      { id: 'm2-3', title: 'Event-Driven Architectures & Message Brokers', duration: '90 mins', completed: false },
      { id: 'm2-4', title: 'Database Sharding, Replication & Consistency Models', duration: '80 mins', completed: false },
    ],
  },
  {
    id: 'c-3',
    title: 'Generative AI & LLM Application Engineering',
    category: 'AI / Machine Learning',
    level: 'Advanced',
    duration: '12 Hours • 6 Modules',
    rating: 4.88,
    enrolled: false,
    progressPercent: 0,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    description: 'Build production-ready Retrieval-Augmented Generation (RAG) pipelines, vector database embeddings with Pinecone/Qdrant, and Agentic AI workflows.',
    modules: [
      { id: 'm3-1', title: 'Embeddings & Vector Space Mathematics', duration: '50 mins', completed: false },
      { id: 'm3-2', title: 'Building Production RAG with LangChain & LlamaIndex', duration: '75 mins', completed: false },
      { id: 'm3-3', title: 'Autonomous Multi-Agent Orchestration & Tool Calling', duration: '90 mins', completed: false },
    ],
  },
  {
    id: 'c-4',
    title: 'Algorithms & Data Structures for Tier-1 Tech Interviews',
    category: 'Coding & DSA',
    level: 'Intermediate',
    duration: '22 Hours • 12 Modules',
    rating: 4.92,
    enrolled: true,
    progressPercent: 80,
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    description: 'Conquer graph traversals (BFS/DFS), Dynamic Programming tabular patterns, Trie structures, and Union-Find for FAANG coding rounds.',
    modules: [
      { id: 'm4-1', title: 'Graph Traversal & Shortest Path (Dijkstra)', duration: '60 mins', completed: true },
      { id: 'm4-2', title: 'Dynamic Programming 1D & 2D Memoization Patterns', duration: '90 mins', completed: true },
      { id: 'm4-3', title: 'Advanced Heap & Interval Overlap Mechanics', duration: '45 mins', completed: true },
      { id: 'm4-4', title: 'Trie Multi-String Search & Bitmask DP', duration: '70 mins', completed: false },
    ],
  },
];

export default function CoursesPage() {
  const { addToast } = useToast();
  const [courses, setCourses] = useState<Course[]>(COURSES_DATA);
  const [activeTab, setActiveTab] = useState<'enrolled' | 'explore'>('enrolled');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);

  const toggleEnroll = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextState = !c.enrolled;
          addToast(nextState ? `🎉 Enrolled in "${c.title}"!` : 'Unenrolled from course', nextState ? 'success' : 'info');
          return { ...c, enrolled: nextState, progressPercent: nextState ? c.progressPercent || 10 : 0 };
        }
        return c;
      })
    );
  };

  const toggleModuleCompletion = (courseId: string, moduleId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedModules = c.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          const completedCount = updatedModules.filter((m) => m.completed).length;
          const newProgress = Math.round((completedCount / updatedModules.length) * 100);
          return { ...c, modules: updatedModules, progressPercent: newProgress };
        }
        return c;
      })
    );
    if (activeCourseModal && activeCourseModal.id === courseId) {
      const updatedCourse = courses.find((c) => c.id === courseId);
      if (updatedCourse) setActiveCourseModal({ ...updatedCourse });
    }
  };

  const filteredCourses = courses.filter((c) => {
    if (activeTab === 'enrolled' && !c.enrolled) return false;
    if (selectedCategory !== 'All' && c.category !== selectedCategory) return false;
    return true;
  });

  return (
    <ProtectedRoute>
      <Head>
        <title>Curated Career Courses | NextStep Academy</title>
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
                  Curated Mastery Curriculum
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Industry-Grade Technical Courses & Certifications
                </h1>
                <p className="text-sm sm:text-base text-white/80">
                  Interactive modules designed with real-world engineering standards, system blueprints, and FAANG coding patterns.
                </p>
              </div>
            </div>

            {/* Filter & Tab Switcher Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setActiveTab('enrolled')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'enrolled'
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  My Enrolled Courses ({courses.filter((c) => c.enrolled).length})
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeTab === 'explore'
                      ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Explore Catalog ({courses.length})
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Full Stack Engineering', 'System Design', 'AI / Machine Learning', 'Coding & DSA'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-[#EDE9FE] text-[#7C3AED] border border-purple-200 font-bold'
                        : 'bg-white text-slate-500 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border border-slate-200 hover:border-purple-300 overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-purple-100/50 hover:-translate-y-1 flex flex-col justify-between group"
                >
                  <div>
                    {/* Course Banner */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>

                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#7C3AED] border border-purple-200 text-[11px] font-bold shadow-sm">
                          ⭐ {course.rating}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-700 border border-slate-200 text-[11px] font-bold shadow-sm">
                          {course.level}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-[#EDE9FE]/90 backdrop-blur-md text-[#7C3AED] border border-purple-200 text-[10px] font-extrabold uppercase tracking-wider">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#7C3AED] transition">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {course.description}
                      </p>

                      <div className="text-[11px] text-slate-400 font-medium">
                        ⏱️ {course.duration}
                      </div>

                      {/* Progress bar if enrolled */}
                      {course.enrolled && (
                        <div className="pt-2 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                            <span>Syllabus Progress</span>
                            <span className="text-[#7C3AED] font-bold">{course.progressPercent}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full transition-all duration-300"
                              style={{ width: `${course.progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-3">
                    <button
                      onClick={() => setActiveCourseModal(course)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-200 text-center"
                    >
                      {course.enrolled ? 'Continue Modules →' : 'View Syllabus & Enroll'}
                    </button>

                    <button
                      onClick={() => toggleEnroll(course.id)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition ${
                        course.enrolled
                          ? 'border-slate-200 bg-slate-50 text-slate-500 hover:text-rose-500'
                          : 'border-purple-200 bg-[#EDE9FE] text-[#7C3AED] hover:bg-purple-100'
                      }`}
                      title={course.enrolled ? 'Leave course' : 'Quick enroll'}
                    >
                      {course.enrolled ? '✓ Enrolled' : '+ Enroll'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>

        {/* Syllabus / Module Modal */}
        {activeCourseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 text-slate-800">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider bg-[#EDE9FE] px-2.5 py-0.5 rounded border border-purple-200">
                    {activeCourseModal.category}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-2">{activeCourseModal.title}</h3>
                </div>
                <button
                  onClick={() => setActiveCourseModal(null)}
                  className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{activeCourseModal.description}</p>

              {/* Modules list */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Course Modules & Labs</h4>
                {activeCourseModal.modules.map((m, idx) => (
                  <div
                    key={m.id}
                    onClick={() => toggleModuleCompletion(activeCourseModal.id, m.id)}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                      m.completed
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 hover:border-purple-300 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                          m.completed ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {m.completed ? '✓' : idx + 1}
                      </div>
                      <div>
                        <div className={`text-xs font-bold ${m.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {m.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{m.duration}</div>
                      </div>
                    </div>

                    <span className="text-[11px] font-semibold text-[#7C3AED]">
                      {m.completed ? 'Completed' : 'Start Lab →'}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <span className="text-xs text-slate-500">
                  {activeCourseModal.modules.filter((m) => m.completed).length} of {activeCourseModal.modules.length} Lessons Finished
                </span>
                <button
                  onClick={() => {
                    if (!activeCourseModal.enrolled) toggleEnroll(activeCourseModal.id);
                    addToast('🚀 Launching interactive coding lesson...', 'success');
                    setActiveCourseModal(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-md shadow-purple-200"
                >
                  Start Interactive Lab
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
