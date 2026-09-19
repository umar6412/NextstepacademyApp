import React, { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  categoryTag: string;
  description: string;
  imageUrl: string;
  category: 'Coding' | 'System Design' | 'AI Interview' | 'Resume & Portfolio' | 'Core CS';
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes: number;
  xp: number;
  completed: boolean;
  subtasks: SubTask[];
  isCustom?: boolean;
}

const DEFAULT_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    categoryTag: 'CERTIFICATE PROGRAM',
    title: 'Essentials for Practitioners in Talent & Technical Development',
    description: 'Advance your career with an industry-standard technical foundation. Master Breadth-First Search (BFS) and Graph traversal patterns for technical interviews.',
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80',
    category: 'Coding',
    priority: 'High',
    estimatedMinutes: 45,
    xp: 120,
    completed: false,
    subtasks: [
      { id: 'st-1-1', title: 'Implement BFS queue-based island count in O(M*N)', completed: false },
      { id: 'st-1-2', title: 'Write unit tests for edge cases (all water, all land)', completed: false },
      { id: 'st-1-3', title: 'Benchmark time complexity vs recursive DFS', completed: false },
    ],
  },
  {
    id: 'task-2',
    categoryTag: 'SYSTEM DESIGN CERTIFICATE',
    title: 'Distributed Architecture & Rate Limiter Masterclass',
    description: 'Gain essential knowledge of cognitive system design, Redis token-bucket algorithms, and horizontal scaling principles underlying high-concurrency systems.',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
    category: 'System Design',
    priority: 'High',
    estimatedMinutes: 35,
    xp: 95,
    completed: false,
    subtasks: [
      { id: 'st-2-1', title: 'Diagram Token Bucket vs Leaky Bucket tradeoffs', completed: false },
      { id: 'st-2-2', title: 'Specify Redis Lua script for atomic decrement', completed: false },
      { id: 'st-2-3', title: 'Add fallback strategy when Redis cluster is degraded', completed: false },
    ],
  },
  {
    id: 'task-3',
    categoryTag: 'AI INTERVIEW & FACILITATION',
    title: 'Behavioral & System Defense Facilitation Certificate',
    description: 'Gain a complete understanding of technical communication by learning and practicing real-time defense of architectural tradeoffs with our AI Interviewer.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
    category: 'AI Interview',
    priority: 'Medium',
    estimatedMinutes: 20,
    xp: 85,
    completed: true,
    subtasks: [
      { id: 'st-3-1', title: 'Complete voice/text AI prompt evaluation', completed: true },
      { id: 'st-3-2', title: 'Review feedback score & communication metrics', completed: true },
    ],
  },
  {
    id: 'task-4',
    categoryTag: 'CAREER & PORTFOLIO PROGRAM',
    title: 'Executive Resume & Engineering Portfolio Strategy',
    description: 'Transform project bullet points into measurable business outcomes with STAR impact metrics, quantified latency improvements, and ATS optimization.',
    imageUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    category: 'Resume & Portfolio',
    priority: 'Medium',
    estimatedMinutes: 25,
    xp: 60,
    completed: false,
    subtasks: [
      { id: 'st-4-1', title: 'Apply STAR method to latest Next.js / FastAPI project', completed: false },
      { id: 'st-4-2', title: 'Ensure ATS score exceeds 85/100', completed: false },
    ],
  },
  {
    id: 'task-5',
    categoryTag: 'CORE CS FOUNDATION',
    title: 'Database Internals, B+ Trees & ACID Isolation',
    description: 'Gain comprehensive mastery of database storage engines, transaction isolation levels, indexing mechanics, and disk I/O optimization strategies.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    category: 'Core CS',
    priority: 'Low',
    estimatedMinutes: 15,
    xp: 45,
    completed: false,
    subtasks: [
      { id: 'st-5-1', title: 'Review B-Tree height calculations and disk I/O costs', completed: false },
      { id: 'st-5-2', title: 'Answer 5 rapid-fire SQL isolation level questions', completed: false },
    ],
  },
];

export default function DailyTasksPage() {
  const { addToast } = useToast();
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTaskDetails, setActiveTaskDetails] = useState<TaskItem | null>(null);

  // Focus Timer state
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTaskTimer, setActiveTaskTimer] = useState<string | null>(null);

  // Carousel ref for natural horizontal scrolling
  const carouselRef = useRef<HTMLDivElement>(null);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategoryTag, setNewTaskCategoryTag] = useState('CERTIFICATE PROGRAM');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskImageUrl, setNewTaskImageUrl] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState<TaskItem['category']>('Coding');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem['priority']>('Medium');
  const [newTaskMinutes, setNewTaskMinutes] = useState(30);
  const [newTaskXp, setNewTaskXp] = useState(80);
  const [newTaskSubtasks, setNewTaskSubtasks] = useState<string>('');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nextstep_natural_tasks');
    if (saved) {
      try {
        setTasks(JSON.parse(saved));
      } catch (e) {
        setTasks(DEFAULT_TASKS);
      }
    } else {
      setTasks(DEFAULT_TASKS);
    }
  }, []);

  const saveTasks = (newTasks: TaskItem[]) => {
    setTasks(newTasks);
    localStorage.setItem('nextstep_natural_tasks', JSON.stringify(newTasks));
  };

  // Timer interval
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      addToast('🎉 Focus Session Finished! Excellent progress.', 'success');
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, addToast]);

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        const updatedSubtasks = t.subtasks.map((st) => ({
          ...st,
          completed: nextState,
        }));
        if (nextState) {
          addToast(`🌟 Completed: "${t.title.slice(0, 32)}..." (+${t.xp} XP)`, 'success');
        }
        return { ...t, completed: nextState, subtasks: updatedSubtasks };
      }
      return t;
    });
    saveTasks(updated);
    if (activeTaskDetails && activeTaskDetails.id === id) {
      const current = updated.find((t) => t.id === id);
      if (current) setActiveTaskDetails(current);
    }
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    const updated = tasks.map((t) => {
      if (t.id === taskId) {
        const nextSubtasks = t.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allCompleted = nextSubtasks.length > 0 && nextSubtasks.every((st) => st.completed);
        return {
          ...t,
          subtasks: nextSubtasks,
          completed: allCompleted,
        };
      }
      return t;
    });
    saveTasks(updated);
    if (activeTaskDetails && activeTaskDetails.id === taskId) {
      const current = updated.find((t) => t.id === taskId);
      if (current) setActiveTaskDetails(current);
    }
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
    if (activeTaskDetails?.id === id) setActiveTaskDetails(null);
    addToast('Task removed from board', 'info');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      addToast('Please enter a task title', 'error');
      return;
    }

    const subtaskArray: SubTask[] = newTaskSubtasks
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((title, idx) => ({
        id: `custom-st-${Date.now()}-${idx}`,
        title,
        completed: false,
      }));

    const sampleImages = [
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800&auto=format&fit=crop&q=80',
    ];

    const newTask: TaskItem = {
      id: `task-custom-${Date.now()}`,
      title: newTaskTitle.trim(),
      categoryTag: newTaskCategoryTag.trim().toUpperCase() || 'CERTIFICATE PROGRAM',
      description: newTaskDesc.trim() || 'Daily engineering practice and talent mastery module.',
      imageUrl: newTaskImageUrl.trim() || sampleImages[Math.floor(Math.random() * sampleImages.length)],
      category: newTaskCategory,
      priority: newTaskPriority,
      estimatedMinutes: Number(newTaskMinutes) || 30,
      xp: Number(newTaskXp) || 75,
      completed: false,
      subtasks: subtaskArray,
      isCustom: true,
    };

    const updated = [newTask, ...tasks];
    saveTasks(updated);
    setIsModalOpen(false);
    addToast('✅ New practice module added!', 'success');

    // Reset
    setNewTaskTitle('');
    setNewTaskCategoryTag('CERTIFICATE PROGRAM');
    setNewTaskDesc('');
    setNewTaskImageUrl('');
    setNewTaskMinutes(30);
    setNewTaskXp(80);
    setNewTaskSubtasks('');
  };

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 380;
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const resetAllTasks = () => {
    if (confirm('Reset daily tasks to default curriculum?')) {
      saveTasks(DEFAULT_TASKS);
      addToast('Board reset to standard curriculum', 'info');
    }
  };

  const startFocusForTask = (task: TaskItem) => {
    setActiveTaskTimer(task.title);
    setTimerSeconds(task.estimatedMinutes * 60);
    setIsTimerRunning(true);
    addToast(`⏱️ Started Focus Timer (${task.estimatedMinutes}m): ${task.title.slice(0, 24)}...`, 'info');
  };

  // Calculations
  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const earnedXp = tasks.filter((t) => t.completed).reduce((acc, curr) => acc + curr.xp, 0);

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    if (selectedFilter === 'in-progress' && task.completed) return false;
    if (selectedFilter === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'All' && task.category !== selectedCategory) return false;
    return true;
  });

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Daily Tasks & Practice Modules | NextStep Academy</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col text-slate-800 font-sans selection:bg-[#7C3AED] selection:text-white">
        <Navbar />

        <div className="flex flex-1">
          <Sidebar />

          <main className="flex-1 px-4 sm:px-8 lg:px-12 py-8 max-w-7xl mx-auto w-full space-y-8">
            {/* Top Glowing Header Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] p-6 sm:p-8 shadow-lg shadow-purple-200/50">
              <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#EDE9FE] rounded-full blur-3xl pointer-events-none"></div>
              <div className="relative z-10 space-y-3 max-w-3xl">
                <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white bg-white/20 px-3.5 py-1 rounded-full uppercase border border-white/30 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Daily Practitioner Roadmap
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Master key talent development concepts and technical drills for top-tier roles.
                </h1>
                <p className="text-sm sm:text-base text-slate-300">
                  Track your daily progress, tackle curated algorithm modules, design distributed systems, and practice AI mock defense in real-time.
                </p>
              </div>
            </div>

            {/* Quick Stats & Interactive Focus Bar */}
            <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-5 backdrop-blur-md">
              {/* Progress and Streaks */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm w-full lg:w-auto">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-sm shadow-md shadow-purple-200">
                    {progressPercent}%
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">
                      {completedCount} of {totalCount} Completed
                    </div>
                    <div className="text-xs text-slate-400">Daily Milestone Progress</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] border border-purple-200 flex items-center justify-center text-xl">
                    🔥
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">9-Day Streak</div>
                    <div className="text-xs text-emerald-400 font-medium">+1.2x XP Multiplier Active</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-100 hidden sm:block"></div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] border border-purple-200 flex items-center justify-center text-xl text-[#7C3AED] font-bold">
                    ⭐
                  </div>
                  <div>
                    <div className="font-bold text-[#7C3AED] text-sm">{earnedXp} XP Earned</div>
                    <div className="text-xs text-slate-400">Today’s Session Score</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons & Focus Timer */}
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                {/* Focus Timer */}
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-300 shadow-inner">
                  <span className="text-[11px] text-slate-400">⏱️ Focus:</span>
                  <span className="font-mono font-bold text-[#7C3AED] text-sm tracking-wider">{formatTime(timerSeconds)}</span>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`px-3 py-1 rounded-lg font-bold text-xs transition ${
                      isTimerRunning
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        : 'bg-[#7C3AED] text-white hover:bg-amber-400 font-bold shadow-md shadow-purple-200'
                    }`}
                  >
                    {isTimerRunning ? 'Pause' : 'Start'}
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSeconds(25 * 60);
                      setActiveTaskTimer(null);
                    }}
                    className="text-slate-400 hover:text-slate-900 px-1.5 py-0.5 rounded transition"
                    title="Reset Timer"
                  >
                    ↺
                  </button>
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-lg shadow-purple-200 flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                  </svg>
                  Add Custom Goal
                </button>
              </div>
            </div>

            {/* Filter Pills and Search */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center gap-2">
                {['All', 'Coding', 'System Design', 'AI Interview', 'Resume & Portfolio', 'Core CS'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      selectedCategory === cat
                        ? 'bg-[#7C3AED] text-white font-bold shadow-md shadow-purple-200'
                        : 'bg-slate-900/80 text-slate-300 hover:text-slate-900 hover:bg-slate-800 border border-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 text-xs bg-slate-900/80 px-2 py-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedFilter === 'all' ? 'text-[#7C3AED] font-bold bg-[#EDE9FE]' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  All ({tasks.length})
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setSelectedFilter('in-progress')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedFilter === 'in-progress' ? 'text-[#7C3AED] font-bold bg-[#EDE9FE]' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  In Progress ({tasks.filter((t) => !t.completed).length})
                </button>
                <span className="text-slate-600">|</span>
                <button
                  onClick={() => setSelectedFilter('completed')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition ${
                    selectedFilter === 'completed' ? 'text-[#7C3AED] font-bold bg-[#EDE9FE]' : 'text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Completed ({completedCount})
                </button>
              </div>
            </div>

            {/* Showcase Carousel Row with Sleek Floating Nav Controls */}
            <div className="relative group">
              {/* Carousel Left Navigation */}
              <button
                onClick={() => scrollCarousel('left')}
                className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-200 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-md"
                aria-label="Previous cards"
              >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Scrollable Container */}
              <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-6 pt-2 px-1 scroll-smooth no-scrollbar snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredTasks.length === 0 ? (
                  <div className="w-full text-center py-16 bg-slate-900/60 rounded-3xl border border-dashed border-slate-200 p-8 space-y-3">
                    <p className="text-slate-400 font-medium">No practice modules found matching the selected filter.</p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setSelectedFilter('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#7C3AED] text-white text-xs font-bold hover:bg-amber-400 transition"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const completedSubtasks = task.subtasks.filter((st) => st.completed).length;

                    return (
                      <div
                        key={task.id}
                        className={`flex-none w-[320px] sm:w-[360px] bg-slate-900/90 rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden snap-start group/card ${
                          task.completed
                            ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5 opacity-90'
                            : 'border-slate-200 hover:border-amber-500/40 shadow-sm hover:shadow-lg hover:shadow-amber-500/5 hover:-translate-y-1'
                        }`}
                      >
                        {/* Upper Section with Image & Glowing Overlay */}
                        <div>
                          <div className="relative h-48 w-full overflow-hidden bg-slate-50">
                            <img
                              src={task.imageUrl}
                              alt={task.title}
                              className="w-full h-full object-cover rounded-t-3xl transition-transform duration-700 group-hover/card:scale-105 opacity-90"
                              onError={(e: any) => {
                                e.target.src =
                                  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80';
                              }}
                            />
                            {/* Gradient Overlay for high text contrast */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>

                            {/* Top Badges */}
                            <div className="absolute top-3 right-3 flex items-center gap-1.5">
                              <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#7C3AED] border border-purple-200 text-[11px] font-bold shadow-md">
                                +{task.xp} XP
                              </span>
                              {task.completed && (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[11px] font-bold flex items-center gap-1 shadow-md">
                                  ✓ Done
                                </span>
                              )}
                            </div>

                            <div className="absolute bottom-3 left-3">
                              <span className="px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur-md text-slate-200 border border-slate-200 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                                ⏱️ {task.estimatedMinutes} Mins
                              </span>
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-6 space-y-3">
                            <span className="inline-block text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-widest bg-[#EDE9FE] px-2.5 py-0.5 rounded-md border border-purple-200">
                              {task.categoryTag}
                            </span>

                            <h3 className="text-base font-bold text-slate-900 leading-snug group-hover/card:text-[#7C3AED] transition">
                              {task.title}
                            </h3>

                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                              {task.description}
                            </p>

                            {/* Subtask Milestones Progress Bar */}
                            {task.subtasks.length > 0 && (
                              <div className="pt-2">
                                <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 mb-1.5">
                                  <span>Milestones</span>
                                  <span className="text-[#7C3AED] font-bold">{completedSubtasks}/{task.subtasks.length} Completed</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Bottom Card Actions */}
                        <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-2.5 mt-2">
                          <button
                            onClick={() => toggleTask(task.id)}
                            className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                              task.completed
                                ? 'bg-slate-50 hover:bg-slate-100 text-slate-300 border border-slate-200'
                                : 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-slate-950 hover:from-amber-400 hover:to-amber-300 shadow-md shadow-purple-200 font-bold'
                            }`}
                          >
                            {task.completed ? '✓ Completed' : 'Mark Complete'}
                          </button>

                          <button
                            onClick={() => setActiveTaskDetails(task)}
                            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-300 hover:text-slate-900 transition"
                            title="View milestones & details"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>

                          {task.category === 'AI Interview' && (
                            <Link
                              href="/mock-interview"
                              className="p-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-[#7C3AED] hover:text-slate-950 transition border border-purple-200"
                              title="Launch AI Interview Simulator"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Carousel Right Navigation */}
              <button
                onClick={() => scrollCarousel('right')}
                className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-2xl bg-slate-900/90 hover:bg-amber-500 text-white hover:text-slate-950 border border-slate-200 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110 backdrop-blur-md"
                aria-label="Next cards"
              >
                <svg className="w-5 h-5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Bottom Section: Step-by-Step Curriculum & Placement Guide */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
              {/* Daily Checklist Table (2 cols) */}
              <div className="lg:col-span-2 bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Today’s Step-by-Step Curriculum</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Click any milestone item to track real-time progression.</p>
                  </div>
                  <button
                    onClick={resetAllTasks}
                    className="text-xs font-medium text-slate-400 hover:text-[#7C3AED] underline transition"
                  >
                    Reset Defaults
                  </button>
                </div>

                <div className="space-y-3.5">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                        task.completed
                          ? 'bg-slate-50/40 border-slate-100 opacity-75'
                          : 'bg-white/90 border-slate-200 hover:border-purple-200 shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className={`mt-1 w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                            task.completed
                              ? 'bg-amber-500 border-amber-500 text-slate-950'
                              : 'border-white/20 bg-slate-50 hover:border-amber-400'
                          }`}
                        >
                          {task.completed && (
                            <svg className="w-3.5 h-3.5 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>

                        <div className="flex-1 space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4
                              className={`text-sm font-bold ${
                                task.completed ? 'line-through text-slate-400' : 'text-white'
                              }`}
                            >
                              {task.title}
                            </h4>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-50 text-slate-300 border border-slate-200">
                                {task.category}
                              </span>
                              <span className="text-xs font-bold text-[#7C3AED]">+{task.xp} XP</span>
                            </div>
                          </div>

                          {/* Subtasks */}
                          {task.subtasks.length > 0 && (
                            <div className="space-y-1.5 pt-1">
                              {task.subtasks.map((st) => (
                                <label
                                  key={st.id}
                                  onClick={() => toggleSubtask(task.id, st.id)}
                                  className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer hover:text-[#7C3AED] transition"
                                >
                                  <input
                                    type="checkbox"
                                    checked={st.completed}
                                    onChange={() => {}}
                                    className="w-3.5 h-3.5 rounded text-amber-500 bg-slate-900 border-white/20 cursor-pointer accent-amber-500"
                                  />
                                  <span className={st.completed ? 'line-through text-slate-400' : ''}>
                                    {st.title}
                                  </span>
                                </label>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400">
                            <span>⏱️ {task.estimatedMinutes} minutes</span>
                            <span>•</span>
                            <button
                              onClick={() => startFocusForTask(task)}
                              className="text-[#7C3AED] font-semibold hover:underline"
                            >
                              Start Focus Timer →
                            </button>
                            {task.isCustom && (
                              <>
                                <span>•</span>
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="text-rose-400 hover:underline"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Placement & Facilitation Guide Card (1 col) */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-amber-500/20 via-slate-900 to-slate-900 border border-purple-200 text-white rounded-3xl p-6 sm:p-7 shadow-sm space-y-4 backdrop-blur-md">
                  <div className="w-11 h-11 rounded-2xl bg-[#7C3AED] text-white font-black flex items-center justify-center text-xl shadow-lg shadow-purple-200">
                    🎓
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Placement Facilitator</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Consistent daily practice in both coding algorithms and live technical defense yields a 4x increase in top-tier offer conversion.
                  </p>

                  <div className="p-4 rounded-2xl bg-black/40 border border-slate-200 space-y-1.5 text-xs">
                    <div className="font-bold text-[#7C3AED] flex items-center gap-1.5">
                      <span>⚡</span> Next Milestone
                    </div>
                    <p className="text-slate-300">Complete 2 more modules today to maintain your active 9-Day Streak bonus.</p>
                  </div>

                  <Link
                    href="/mock-interview"
                    className="block text-center w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition shadow-lg shadow-purple-200"
                  >
                    Launch AI Practice Interview
                  </Link>
                </div>

                {/* Talent Consistency Tracker */}
                <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 backdrop-blur-md">
                  <h4 className="text-sm font-bold text-slate-900">Weekly Consistency</h4>
                  <div className="grid grid-cols-7 gap-2 text-center">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                      <div key={idx} className="space-y-1">
                        <div
                          className={`h-9 rounded-xl flex items-center justify-center text-xs font-bold transition ${
                            idx === 6
                              ? 'bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/50 shadow-md shadow-amber-400/20'
                              : idx === 3
                              ? 'bg-slate-50 text-slate-400 border border-slate-200'
                              : 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                          }`}
                        >
                          {idx === 3 ? '—' : '✓'}
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Modal: View Details & Subtasks */}
        {activeTaskDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-lg space-y-5 border border-slate-200 text-white">
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <span className="text-[10px] font-extrabold text-[#7C3AED] uppercase tracking-wider bg-[#EDE9FE] px-2.5 py-0.5 rounded border border-purple-200">
                    {activeTaskDetails.categoryTag}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-2">{activeTaskDetails.title}</h3>
                </div>
                <button
                  onClick={() => setActiveTaskDetails(null)}
                  className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{activeTaskDetails.description}</p>

              {/* Subtasks */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Action Milestones</h4>
                <div className="space-y-2">
                  {activeTaskDetails.subtasks.map((st) => (
                    <label
                      key={st.id}
                      onClick={() => toggleSubtask(activeTaskDetails.id, st.id)}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/90 border border-slate-200 hover:border-purple-200 transition cursor-pointer text-xs text-slate-200"
                    >
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => {}}
                        className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                      />
                      <span className={st.completed ? 'line-through text-slate-400' : 'font-medium'}>
                        {st.title}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <button
                  onClick={() => {
                    startFocusForTask(activeTaskDetails);
                    setActiveTaskDetails(null);
                  }}
                  className="text-xs font-bold text-[#7C3AED] hover:underline"
                >
                  ⏱️ Bind Focus Timer ({activeTaskDetails.estimatedMinutes}m)
                </button>
                <button
                  onClick={() => {
                    toggleTask(activeTaskDetails.id);
                    setActiveTaskDetails(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-slate-950 text-xs font-bold transition hover:from-amber-400 hover:to-amber-300 shadow-md shadow-purple-200"
                >
                  {activeTaskDetails.completed ? 'Mark Incomplete' : 'Complete Module'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add Custom Task */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fadeIn">
            <div className="bg-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-lg space-y-5 border border-slate-200 text-white">
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>✨</span> Add Practice Module
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-900 p-1.5 rounded-full hover:bg-slate-100 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Module Title <span className="text-[#7C3AED]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="e.g. Distributed Caching with Redis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Header Tag</label>
                    <input
                      type="text"
                      value={newTaskCategoryTag}
                      onChange={(e) => setNewTaskCategoryTag(e.target.value)}
                      placeholder="e.g. CERTIFICATE PROGRAM"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                    <select
                      value={newTaskCategory}
                      onChange={(e) => setNewTaskCategory(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    >
                      <option value="Coding">Coding & DSA</option>
                      <option value="System Design">System Design</option>
                      <option value="AI Interview">AI Interview</option>
                      <option value="Resume & Portfolio">Resume & Career</option>
                      <option value="Core CS">Core CS & DB</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="Gain essential knowledge and skills needed to master this topic..."
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={newTaskMinutes}
                      onChange={(e) => setNewTaskMinutes(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">XP Points</label>
                    <input
                      type="number"
                      min={10}
                      max={300}
                      value={newTaskXp}
                      onChange={(e) => setNewTaskXp(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Milestones (1 per line)
                  </label>
                  <textarea
                    rows={3}
                    value={newTaskSubtasks}
                    onChange={(e) => setNewTaskSubtasks(e.target.value)}
                    placeholder="Step 1: Read architecture diagram&#10;Step 2: Implement LRU eviction&#10;Step 3: Run stress benchmark"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400 transition"
                  ></textarea>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-300 hover:text-slate-900 hover:bg-slate-50 text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold transition shadow-lg shadow-purple-200"
                  >
                    Add to Program
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
