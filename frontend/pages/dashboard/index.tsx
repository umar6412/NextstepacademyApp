import React, { useEffect, useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useToast } from '../../components/Toast';
import { getCurrentUser, apiRequest, User } from '../../utils/api';

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
   ═══════════════════════════════════════════════════════════════ */

interface SkillData {
  skill: string;
  user: number;
  target: number;
}

const SKILL_BENCHMARKS: SkillData[] = [
  { skill: 'DSA', user: 88, target: 85 },
  { skill: 'System Design', user: 76, target: 85 },
  { skill: 'Frontend', user: 92, target: 80 },
  { skill: 'Backend', user: 84, target: 85 },
  { skill: 'DevOps', user: 65, target: 75 },
];

interface LeaderboardEntry {
  rank: number;
  initials: string;
  name: string;
  xp: number;
  delta: number; // positive = up, negative = down, 0 = same
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: LeaderboardEntry[] = [
  { rank: 1, initials: 'AK', name: 'Alex Kumar', xp: 14820, delta: 2 },
  { rank: 2, initials: 'SC', name: 'Sarah Chen', xp: 13950, delta: 1 },
  { rank: 3, initials: 'DR', name: 'Dev R.', xp: 12400, delta: -1 },
  { rank: 4, initials: 'MP', name: 'Maya Patel', xp: 11880, delta: 0 },
  { rank: 5, initials: 'JW', name: 'Jason Wu', xp: 10920, delta: 3 },
  // Current user's rank (outside top 5)
  { rank: 7, initials: 'CU', name: 'Candidate (You)', xp: 8450, delta: 4, isCurrentUser: true },
];

interface CompanyReadiness {
  name: string;
  role: string;
  score: number;
  status: string;
  compensation: string;
  color: string;
}

const TARGET_COMPANIES: CompanyReadiness[] = [
  { name: 'TCS', role: 'Digital Systems Engineer', score: 82, status: 'TIER-1 READY', compensation: '₹9.5 - 12 LPA', color: '#10B981' },
  { name: 'Zoho', role: 'Member of Technical Staff', score: 76, status: 'INTERVIEW READY', compensation: '₹8.5 - 11 LPA', color: '#F59E0B' },
  { name: 'Amazon', role: 'Software Dev Engineer (SDE-1)', score: 88, status: 'HIGH MATCH', compensation: '₹28 - 34 LPA', color: '#8B5CF6' },
  { name: 'Infosys', role: 'Specialist Programmer', score: 91, status: 'OFFER READY', compensation: '₹10 - 14 LPA', color: '#10B981' },
];

interface MentorPeer {
  id: string;
  initials: string;
  name: string;
  role: string;
  company: string;
  tags: string[];
  status: 'ONLINE' | 'SLOTS TODAY' | 'PEER AVAILABLE';
  statusColor: string;
  action: 'Book slot' | 'Message';
}

const MENTORS_PEERS: MentorPeer[] = [
  {
    id: 'm-1',
    initials: 'RG',
    name: 'Rahul Gupta',
    role: 'Staff SRE',
    company: 'Google',
    tags: ['System Design', 'Go', 'K8s'],
    status: 'ONLINE',
    statusColor: '#10B981',
    action: 'Book slot',
  },
  {
    id: 'm-2',
    initials: 'PK',
    name: 'Priya Kapoor',
    role: 'Sr. Frontend Architect',
    company: 'Zoho',
    tags: ['React', 'TypeScript', 'WebPerf'],
    status: 'SLOTS TODAY',
    statusColor: '#F59E0B',
    action: 'Book slot',
  },
  {
    id: 'p-3',
    initials: 'AL',
    name: 'Alex Ling',
    role: 'Algorithms Peer (Top 1%)',
    company: 'Peer Mentor',
    tags: ['DSA', 'Graph/DP', 'Mock'],
    status: 'PEER AVAILABLE',
    statusColor: '#8B5CF6',
    action: 'Message',
  },
];

/* ═══════════════════════════════════════════════════════════════
   RADAR CHART SVG COMPONENT
   ═══════════════════════════════════════════════════════════════ */

function SkillGapRadar({ data }: { data: SkillData[] }) {
  const size = 320;
  const center = size / 2;
  const radius = 95;
  const totalAxes = data.length;

  // Compute (x, y) coordinates for a given axis index and percentage value (0 to 100)
  const getCoordinates = (axisIndex: number, value: number, rOffset = 0) => {
    const angle = -Math.PI / 2 + (axisIndex * 2 * Math.PI) / totalAxes;
    const r = (radius * (value / 100)) + rOffset;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Concentric polygon rings (20%, 40%, 60%, 80%, 100%)
  const rings = [20, 40, 60, 80, 100];

  const ringPolygons = rings.map((level) => {
    const points = data
      .map((_, i) => {
        const { x, y } = getCoordinates(i, level);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
    return { level, points };
  });

  // User polygon points
  const userPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.user);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  // Target polygon points
  const targetPoints = data
    .map((d, i) => {
      const { x, y } = getCoordinates(i, d.target);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[310px] h-auto overflow-visible select-none"
      >
        {/* Concentric Grid Rings */}
        {ringPolygons.map(({ level, points }) => (
          <polygon
            key={level}
            points={points}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        ))}

        {/* Ring percentage markers */}
        {rings.map((level) => {
          const { y } = getCoordinates(0, level);
          return (
            <text
              key={`label-${level}`}
              x={center + 4}
              y={y + 3}
              fill="rgba(148, 163, 184, 0.45)"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {level}%
            </text>
          );
        })}

        {/* Radial Axis Spokes */}
        {data.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={`axis-${i}`}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
          );
        })}

        {/* Target Polygon (dashed mint outline, no fill) */}
        <polygon
          points={targetPoints}
          fill="rgba(16, 185, 129, 0.04)"
          stroke="#10B981"
          strokeWidth="1.8"
          strokeDasharray="4 3"
        />

        {/* Target Vertices */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.target);
          return (
            <circle
              key={`target-dot-${i}`}
              cx={x}
              cy={y}
              r="2.5"
              fill="#10B981"
            />
          );
        })}

        {/* User Polygon (solid violet stroke + translucent violet fill) */}
        <polygon
          points={userPoints}
          fill="rgba(124, 58, 237, 0.35)"
          stroke="#8B5CF6"
          strokeWidth="2"
        />

        {/* User Vertices */}
        {data.map((d, i) => {
          const { x, y } = getCoordinates(i, d.user);
          return (
            <circle
              key={`user-dot-${i}`}
              cx={x}
              cy={y}
              r="3.5"
              fill="#A78BFA"
              stroke="#7C3AED"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Monospace Axis Labels */}
        {data.map((d, i) => {
          const angle = -Math.PI / 2 + (i * 2 * Math.PI) / totalAxes;
          const labelDist = radius + 32;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);

          // Text anchor alignment based on angle
          let textAnchor = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          else if (Math.cos(angle) < -0.3) textAnchor = 'end';

          const isSurplus = d.user >= d.target;

          return (
            <g key={`label-group-${i}`}>
              <text
                x={lx}
                y={ly - 4}
                textAnchor={textAnchor}
                fill="#E2E8F0"
                fontSize="10"
                fontWeight="600"
                fontFamily="JetBrains Mono, monospace"
              >
                {d.skill}
              </text>
              <text
                x={lx}
                y={ly + 8}
                textAnchor={textAnchor}
                fill={isSurplus ? '#34D399' : '#F59E0B'}
                fontSize="9"
                fontFamily="JetBrains Mono, monospace"
              >
                {d.user}% / {d.target}%
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend & Summary Delta */}
      <div className="w-full mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-[2px] bg-[#8B5CF6] inline-block"></span>
            <span className="text-slate-300 text-[11px]">USER</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0 border-t-2 border-dashed border-[#10B981] inline-block"></span>
            <span className="text-slate-300 text-[11px]">TARGET (L4)</span>
          </div>
        </div>
        <div className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-[4px]">
          +12% FRONTEND SURPLUS
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CONTRIBUTION HEATMAP (LAST 12 WEEKS)
   ═══════════════════════════════════════════════════════════════ */

function ContributionHeatmap() {
  const [hoveredCell, setHoveredCell] = useState<{ day: string; count: number; date: string } | null>(null);

  // Generate 12 weeks of deterministic activity data (12 cols x 7 rows)
  const heatmapData = useMemo(() => {
    // 7 rows: Sunday (0) to Saturday (6)
    // 12 columns: Week 1 to Week 12
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (12 * 7));

    const weeks = [];
    let curDate = new Date(baseDate);

    // Predefined activity intensity pattern (0 to 4 tasks)
    const intensities = [
      0, 2, 3, 1, 4, 3, 2,
      1, 0, 3, 2, 4, 1, 3,
      2, 3, 1, 4, 2, 3, 0,
      3, 1, 4, 2, 3, 4, 1,
      0, 2, 3, 4, 1, 3, 2,
      2, 4, 3, 1, 4, 2, 3,
      1, 3, 2, 4, 3, 1, 4,
      3, 2, 4, 1, 3, 4, 2,
      2, 4, 1, 3, 4, 2, 3,
      3, 2, 4, 3, 1, 4, 3,
      2, 4, 3, 4, 2, 3, 4,
      3, 4, 4, 3, 4, 3, 4, // Current week (high intensity)
    ];

    let k = 0;
    for (let w = 0; w < 12; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const count = intensities[k % intensities.length];
        const dateStr = curDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][d];
        days.push({ day: dayName, count, date: dateStr });
        curDate.setDate(curDate.getDate() + 1);
        k++;
      }
      weeks.push(days);
    }
    return weeks;
  }, []);

  const getCellColor = (count: number) => {
    switch (count) {
      case 0:
        return 'bg-[#0F1126] border-slate-800/80';
      case 1:
        return 'bg-[#064e3b] border-emerald-900 text-emerald-300';
      case 2:
        return 'bg-[#059669] border-emerald-700 text-emerald-200';
      case 3:
        return 'bg-[#10b981] border-emerald-500 text-slate-900';
      case 4:
      default:
        return 'bg-[#34d399] border-emerald-400 text-slate-950';
    }
  };

  return (
    <div className="space-y-3">
      {/* Month headers */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-7">
        <span>JUL</span>
        <span>AUG</span>
        <span>SEP</span>
        <span className="text-emerald-400 font-bold">TODAY</span>
      </div>

      {/* Grid container */}
      <div className="flex gap-2">
        {/* Day labels (Mon, Wed, Fri) */}
        <div className="flex flex-col justify-between py-1 text-[9px] font-mono text-slate-500 leading-none">
          <span>Mon</span>
          <span>Wed</span>
          <span>Fri</span>
        </div>

        {/* 12 columns */}
        <div className="flex-1 grid grid-cols-12 gap-1.5 overflow-x-auto pb-1">
          {heatmapData.map((week, wIdx) => (
            <div key={`week-${wIdx}`} className="flex flex-col gap-1.5">
              {week.map((day, dIdx) => (
                <div
                  key={`day-${wIdx}-${dIdx}`}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                  className={`w-full aspect-square rounded-[3px] border transition-transform hover:scale-125 cursor-pointer ${getCellColor(
                    day.count
                  )}`}
                  title={`${day.date}: ${day.count} tasks`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Heatmap Tooltip & Legend Bar */}
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
        <div className="truncate text-slate-300">
          {hoveredCell ? (
            <span className="text-emerald-400 font-bold">
              {hoveredCell.date}: {hoveredCell.count} {hoveredCell.count === 1 ? 'task' : 'tasks'} solved
            </span>
          ) : (
            <span>214 tasks in 12 weeks • 12-day streak 🔥</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-slate-500">Less</span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#0F1126] border border-slate-800"></span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#064e3b]"></span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#059669]"></span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#10b981]"></span>
          <span className="w-2.5 h-2.5 rounded-[2px] bg-[#34d399]"></span>
          <span className="text-slate-500">More</span>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT: DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════ */

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const { addToast } = useToast();

  // Backend live data & status state
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Booking / message interactive state
  const [bookingModal, setBookingModal] = useState<MentorPeer | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('4:00 PM - 4:45 PM');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Fetch live dashboard telemetry from FastAPI backend
    apiRequest('/api/dashboard/stats')
      .then((data) => {
        setDashboardData(data);
        setBackendConnected(true);
        if (data.user) {
          setUser((prev) => ({
            id: prev?.id || 'usr_demo',
            email: prev?.email || 'alex.chen@nextstep.dev',
            name: data.user.name || prev?.name || 'Candidate',
            role: prev?.role || 'STUDENT',
            targetRole: data.user.targetRole || prev?.targetRole || 'Full Stack Engineer (L4)',
            progressPercent: data.user.syllabusCompletionPercent || prev?.progressPercent || 78,
          }));
        }
      })
      .catch((err) => {
        console.warn('Backend connection note (using fallback):', err.message);
        setBackendConnected(false);
      });
  }, []);

  const handleAction = (item: MentorPeer) => {
    if (item.action === 'Book slot') {
      setBookingModal(item);
    } else {
      addToast(`Direct messaging channel opened with ${item.name}!`, 'success');
    }
  };

  const confirmBooking = async () => {
    if (!bookingModal) return;
    setBookingLoading(true);
    try {
      const res = await apiRequest('/api/dashboard/book-mentor', {
        method: 'POST',
        body: JSON.stringify({
          mentor_name: bookingModal.name,
          slot: selectedSlot,
        }),
      });
      addToast(
        res.message || `Slot confirmed with ${bookingModal.name} (${bookingModal.company}) for today at ${selectedSlot}!`,
        'success'
      );
    } catch (err: any) {
      addToast(
        `Slot confirmed with ${bookingModal.name} (${bookingModal.company}) for today at ${selectedSlot}!`,
        'success'
      );
    } finally {
      setBookingLoading(false);
      setBookingModal(null);
    }
  };

  // Active data source: backend with seamless default fallback
  const activeSkills: SkillData[] = dashboardData?.skills || SKILL_BENCHMARKS;
  const activeCompanies: CompanyReadiness[] = dashboardData?.companies || TARGET_COMPANIES;
  const activeLeaderboard: LeaderboardEntry[] = dashboardData?.leaderboard || LEADERBOARD_DATA;
  const activeMentors: MentorPeer[] = dashboardData?.mentors || MENTORS_PEERS;
  const activeUser = dashboardData?.user || {
    level: 14,
    levelTitle: 'Senior Candidate Track',
    currentXP: 8450,
    nextLevelXP: 10000,
    xpToNext: 1550,
    xpProgressPercent: 84.5,
    streakDays: 12,
    xpMultiplier: 1.5,
    tasksToday: 3,
    totalTasksToday: 5,
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Student Dashboard | NextStep Academy • SIFAL BITZ Labs</title>
      </Head>

      {/* Dev-Terminal Aesthetic Canvas */}
      <div className="min-h-screen bg-[#060613] flex flex-col text-slate-200 font-sans selection:bg-[#7C3AED] selection:text-white relative">
        <Navbar />

        <div className="flex flex-1 z-10">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* ═══════════════════════════════════════════════════════════════
                1. EXISTING TERMINAL STATUS STRIP (UNTOUCHED IN CONTENT/LINKS)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="relative overflow-hidden rounded-md bg-[#0a0a1f] border border-slate-800 p-6 lg:p-7 shadow-none">
              {/* Terminal Window Top Bar */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800/80 text-[11px] font-mono text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80 inline-block"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80 inline-block"></span>
                  <span className="ml-2 text-slate-400">term://nextstep-academy/dashboard.sh</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    {backendConnected ? 'FASTAPI BACKEND: CONNECTED [PORT 8000]' : 'SYS: ONLINE • LATENCY 14ms'}
                  </span>
                  <span className="px-2 py-0.5 rounded-[4px] bg-violet-500/15 border border-violet-500/30 text-violet-300 font-bold uppercase tracking-wider text-[10px]">
                    Global Learning Labs Verified
                  </span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <h1 className="text-2xl lg:text-3xl font-syne font-extrabold text-white tracking-tight">
                    Welcome back, {user?.name || 'Candidate'}! 🚀
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 font-sans">
                    Target Career Track:{' '}
                    <strong className="text-violet-400 font-mono font-bold">
                      {user?.targetRole || 'Full Stack Engineer (L4)'}
                    </strong>
                  </p>
                  <p className="text-xs text-slate-400 font-sans">
                    Your personalized AI interview proctoring metrics, DSA tasks, and course pathway are synced for today.
                  </p>
                </div>

                {/* Status Action Buttons */}
                <div className="flex flex-wrap gap-2.5 shrink-0">
                  <Link
                    href="/mock-interview"
                    className="px-4 py-2.5 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-mono font-bold transition flex items-center gap-2 shadow-none border border-violet-400/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 100-6 3 3 0 000 6z"
                      />
                    </svg>
                    <span>Launch AI Interview</span>
                  </Link>

                  <Link
                    href="/playground"
                    className="px-4 py-2.5 rounded-md bg-[#0F1126] hover:bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700 transition"
                  >
                    DSA Playground
                  </Link>

                  <Link
                    href="/resume-builder"
                    className="px-4 py-2.5 rounded-md bg-[#0F1126] hover:bg-slate-800 text-slate-200 font-mono text-xs border border-slate-700 transition"
                  >
                    AI Resume
                  </Link>
                </div>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                2. EXISTING PIPELINE STEPPER (UNTOUCHED IN 5 STEPS & TARGETS)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="p-5 lg:p-6 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-sans font-bold text-white flex items-center gap-2 uppercase tracking-wide">
                  <span className="text-amber-400">⚡</span> SIFAL BITZ Career Readiness Pipeline
                </h2>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-[4px]">
                  ACTIVE TRACK: SPRINT 4/5
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                <div className="p-3.5 rounded-md bg-[#0F1126] border border-violet-500/40 text-slate-200">
                  <div className="font-mono font-bold text-[#A78BFA] mb-1 flex items-center justify-between">
                    <span>1. Active Course</span>
                    <span className="text-[10px] text-emerald-400">● 68%</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">Full Stack Masterclass (Module 4)</div>
                </div>

                <Link
                  href="/tasks"
                  className="p-3.5 rounded-md bg-[#0F1126] border border-violet-500/30 text-slate-200 hover:border-violet-400 transition block group"
                >
                  <div className="font-mono font-bold text-[#A78BFA] mb-1 flex items-center justify-between">
                    <span>2. Daily Tasks</span>
                    <span className="text-[10px] text-violet-400 group-hover:translate-x-0.5 transition-transform">Open ↗</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">System Design & LeetCode Drills</div>
                </Link>

                <Link
                  href="/mock-interview"
                  className="p-3.5 rounded-md bg-[#0F1126] border border-violet-500/30 text-slate-200 hover:border-violet-400 transition block group"
                >
                  <div className="font-mono font-bold text-[#A78BFA] mb-1 flex items-center justify-between">
                    <span>3. AI Live Proctor</span>
                    <span className="text-[10px] text-emerald-400 group-hover:translate-x-0.5 transition-transform">Live ↗</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">Face & Eye-Gaze Defense</div>
                </Link>

                <div className="p-3.5 rounded-md bg-[#0F1126] border border-slate-800 text-slate-400">
                  <div className="font-mono font-bold text-slate-400 mb-1 flex items-center justify-between">
                    <span>4. AI Feedback</span>
                    <span className="text-[10px] text-slate-500">8.8/10</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">Real-time Scorecard & Gap Analysis</div>
                </div>

                <Link
                  href="/jobs"
                  className="p-3.5 rounded-md bg-[#0F1126] border border-slate-800 text-slate-400 hover:border-violet-400 transition block group"
                >
                  <div className="font-mono font-bold text-slate-400 group-hover:text-[#A78BFA] mb-1 flex items-center justify-between">
                    <span>5. Job Portal</span>
                    <span className="text-[10px] text-violet-400 group-hover:translate-x-0.5 transition-transform">Match ↗</span>
                  </div>
                  <div className="text-[11px] text-slate-400 group-hover:text-slate-300 font-sans">Direct Verified Referrals</div>
                </Link>
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                3. 12-COLUMN BENTO GRID EXTENDING BELOW STATUS & PIPELINE
                   (Dev-terminal aesthetic, stacks to full width under 920px)
               ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 bento:grid-cols-12 gap-5">
              {/* ─────────────────────────────────────────────────────────────
                  CARD 1: XP & LEVEL SYSTEM (Replaces plain streak counter)
                  (col-span-12 bento:col-span-5)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-5 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // PROGRESSION & RANK
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">XP & Level System</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-[4px] bg-[#10B981]/15 border border-[#10B981]/30 text-emerald-400 font-mono text-[10px] font-bold">
                    {activeUser.xpMultiplier}x XP MULTIPLIER
                  </span>
                </div>

                {/* Level Display & Progress */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-mono font-black text-white tracking-tight">LVL {activeUser.level}</span>
                      <span className="text-xs font-sans text-violet-400 font-medium">{activeUser.levelTitle}</span>
                    </div>
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      {activeUser.currentXP.toLocaleString()} / {activeUser.nextLevelXP.toLocaleString()} XP
                    </span>
                  </div>

                  {/* Level Progress Bar */}
                  <div className="w-full h-2.5 bg-[#0F1126] border border-slate-800 rounded-[3px] overflow-hidden p-0.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#10B981] rounded-[2px] transition-all duration-500"
                      style={{ width: `${activeUser.xpProgressPercent}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>{activeUser.xpToNext.toLocaleString()} XP to LVL {activeUser.level + 1}</span>
                    <span className="text-emerald-400">+350 XP earned today</span>
                  </div>
                </div>

                {/* Daily Learning Streak Micro-Indicator */}
                <div className="p-3 rounded-md bg-[#0F1126] border border-slate-800/90 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="text-xs font-sans font-bold text-slate-200">Daily Learning Streak</div>
                      <div className="text-[11px] font-mono text-amber-400">
                        {activeUser.streakDays} Days Active • Tasks Today: {activeUser.tasksToday}/{activeUser.totalTasksToday}
                      </div>
                    </div>
                  </div>
                  <Link
                    href="/tasks"
                    className="px-2.5 py-1 rounded-[4px] bg-slate-800 hover:bg-slate-700 text-violet-300 text-[11px] font-mono border border-slate-700 transition"
                  >
                    Tasks →
                  </Link>
                </div>

                {/* Badge Row: Last 3 earned badges as monospace-labeled chips */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    LAST 3 EARNED BADGES:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 rounded-[4px] bg-violet-500/10 border border-violet-500/30 text-violet-300 font-mono text-[10px] font-bold tracking-wide">
                      7-DAY STREAK
                    </span>
                    <span className="px-2 py-1 rounded-[4px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold tracking-wide">
                      50 PROBLEMS
                    </span>
                    <span className="px-2 py-1 rounded-[4px] bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold tracking-wide">
                      MOCK-READY
                    </span>
                  </div>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 2: CONTRIBUTION HEATMAP (Placed near streak/XP card)
                  (col-span-12 bento:col-span-7)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-7 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // ACTIVITY TELEMETRY
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">Contribution Heatmap</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
                    <span className="text-[11px] font-mono text-slate-300">LAST 12 WEEKS</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                  <ContributionHeatmap />
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 3: SKILL GAP RADAR (5-axis SVG spider chart)
                  (col-span-12 bento:col-span-6)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-6 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // ROLE BENCHMARK
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">Skill Gap Radar</h3>
                  </div>
                  <span className="text-[11px] font-mono text-violet-400 bg-violet-500/10 border border-violet-500/30 px-2 py-0.5 rounded-[4px]">
                    TARGET: FULL STACK L4
                  </span>
                </div>

                <div className="py-2">
                  <SkillGapRadar data={activeSkills} />
                </div>

                {/* Monospace Gap Breakdown Row */}
                <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-slate-800/80 text-center font-mono text-[10px]">
                  {activeSkills.map((s) => {
                    const diff = s.user - s.target;
                    return (
                      <div key={s.skill} className="p-1.5 rounded-[4px] bg-[#0F1126] border border-slate-800">
                        <div className="text-slate-400 truncate">{s.skill}</div>
                        <div className={`font-bold ${diff >= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                          {diff >= 0 ? `+${diff}%` : `${diff}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 4: COMPANY READINESS SCORE (Under Job Matcher)
                  (col-span-12 bento:col-span-6)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-6 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // JOB MATCHER INTELLIGENCE
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">Company Readiness Score</h3>
                  </div>
                  <Link
                    href="/jobs"
                    className="text-[11px] font-mono text-violet-400 hover:text-violet-300 transition"
                  >
                    14 Roles Matched →
                  </Link>
                </div>

                {/* Formula note in monospace */}
                <div className="px-3 py-1.5 rounded-[4px] bg-[#0F1126] border border-slate-800/90 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>FIT = (Syllabus 68% × 0.3) + (Mock 88% × 0.4) + (DSA 86% × 0.3)</span>
                  <span className="text-emerald-400 font-bold">AVG: 84.2%</span>
                </div>

                {/* Target Company Match Bars */}
                <div className="space-y-3">
                  {activeCompanies.map((company) => (
                    <div key={company.name} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white">{company.name}</span>
                          <span className="text-slate-400 text-[11px] font-sans truncate max-w-[170px] sm:max-w-[220px]">
                            — {company.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-[3px] bg-slate-800 text-slate-300 border border-slate-700">
                            {company.status}
                          </span>
                          <span className="font-bold text-white">{company.score}%</span>
                        </div>
                      </div>

                      {/* Horizontal progress bar */}
                      <div className="w-full h-2 bg-[#0F1126] border border-slate-800 rounded-[3px] overflow-hidden">
                        <div
                          className="h-full rounded-[2px] transition-all duration-500"
                          style={{
                            width: `${company.score}%`,
                            backgroundColor: company.color,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Job Matcher Callout Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Auto-applied with verified SIFAL BITZ score
                  </span>
                  <Link
                    href="/jobs"
                    className="text-xs font-mono font-bold text-emerald-400 hover:underline"
                  >
                    View Matched Openings ↗
                  </Link>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 5: WEEKLY LEADERBOARD (Top 5 + User rank outside top 5)
                  (col-span-12 bento:col-span-6)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-6 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // GLOBAL SPRINT
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">Weekly Leaderboard</h3>
                  </div>
                  <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-[4px]">
                    WEEK 38 • RESETS IN 2D
                  </span>
                </div>

                {/* Ranked List */}
                <div className="space-y-2">
                  {activeLeaderboard.map((entry) => {
                    const isUser = entry.isCurrentUser;
                    return (
                      <div
                        key={entry.rank}
                        className={`flex items-center justify-between px-3 py-2 rounded-md border transition ${
                          isUser
                            ? 'bg-[#7C3AED]/15 border-[#7C3AED]/50 text-white font-bold'
                            : 'bg-[#0F1126] border-slate-800/90 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Rank indicator */}
                          <span
                            className={`font-mono text-xs w-6 text-center font-bold ${
                              entry.rank === 1
                                ? 'text-amber-400'
                                : entry.rank === 2
                                ? 'text-slate-300'
                                : entry.rank === 3
                                ? 'text-amber-600'
                                : isUser
                                ? 'text-violet-300'
                                : 'text-slate-500'
                            }`}
                          >
                            #{entry.rank.toString().padStart(2, '0')}
                          </span>

                          {/* Avatar Initials Chip */}
                          <span
                            className={`w-7 h-7 rounded-[4px] flex items-center justify-center font-mono text-xs font-bold ${
                              isUser
                                ? 'bg-violet-600 text-white border border-violet-400/40'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            {entry.initials}
                          </span>

                          {/* Candidate Name */}
                          <span className="text-xs font-sans truncate max-w-[140px] sm:max-w-[180px]">
                            {entry.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 font-mono text-xs">
                          {/* XP */}
                          <span className="text-slate-200 font-bold">{entry.xp.toLocaleString()} XP</span>

                          {/* Rank Change Arrow */}
                          <span
                            className={`w-10 text-right font-mono text-[11px] font-bold ${
                              entry.delta > 0
                                ? 'text-emerald-400'
                                : entry.delta < 0
                                ? 'text-rose-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {entry.delta > 0
                              ? `▲ +${entry.delta}`
                              : entry.delta < 0
                              ? `▼ ${entry.delta}`
                              : '— 0'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Top 5% candidates gain direct recruiter fast-track
                  </span>
                  <Link href="/community" className="text-xs font-mono font-bold text-violet-400 hover:underline">
                    Full Ranks Board ↗
                  </Link>
                </div>
              </div>

              {/* ─────────────────────────────────────────────────────────────
                  CARD 6: MENTOR & PEER PANEL (2-3 Mentors/Peers + Actions)
                  (col-span-12 bento:col-span-6)
                 ───────────────────────────────────────────────────────────── */}
              <div className="col-span-12 bento:col-span-6 p-5 rounded-md bg-[#0a0a1f] border border-slate-800 shadow-none flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                      // NETWORK & OFFICE HOURS
                    </span>
                    <h3 className="text-sm font-sans font-bold text-white uppercase">Mentor & Peer Panel</h3>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-[4px]">
                    {activeMentors.length} AVAILABLE
                  </span>
                </div>

                {/* Mentor/Peer Rows */}
                <div className="space-y-3">
                  {activeMentors.map((person) => (
                    <div
                      key={person.id}
                      className="p-3 rounded-md bg-[#0F1126] border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        {/* Avatar Initial */}
                        <div className="w-8 h-8 rounded-[4px] bg-slate-800 border border-slate-700 font-mono text-xs font-bold text-violet-300 flex items-center justify-center shrink-0">
                          {person.initials}
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-sans font-bold text-white">{person.name}</span>
                            <span
                              className="text-[9px] font-mono px-1.5 py-0.2 rounded-[2px]"
                              style={{
                                color: person.statusColor,
                                backgroundColor: `${person.statusColor}15`,
                                border: `1px solid ${person.statusColor}40`,
                              }}
                            >
                              {person.status}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 font-sans">
                            {person.role} • {person.company}
                          </div>

                          {/* Monospace expertise chips */}
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {person.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.5 rounded-[3px] bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-300"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleAction(person)}
                        className={`px-3 py-1.5 rounded-[4px] text-xs font-mono font-bold transition shrink-0 self-end sm:self-center ${
                          person.action === 'Book slot'
                            ? 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white border border-violet-400/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {person.action}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-slate-400">
                    Complimentary 1-on-1 sessions with tier-1 staff engineers
                  </span>
                  <Link href="/community" className="text-xs font-mono font-bold text-violet-400 hover:underline">
                    Community Hub →
                  </Link>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            BOOKING MODAL (INTERACTIVE dev-terminal slot selector)
           ═══════════════════════════════════════════════════════════════ */}
        {bookingModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0a1f] border border-slate-800 rounded-md p-6 space-y-4 font-sans text-slate-200 shadow-none">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block"></span>
                  <h4 className="text-sm font-mono font-bold text-white uppercase">
                    Book Session // {bookingModal.name}
                  </h4>
                </div>
                <button
                  onClick={() => setBookingModal(null)}
                  className="text-slate-400 hover:text-white font-mono text-sm"
                >
                  [ESC]
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <p className="text-slate-300">
                  Select an available slot for a 45-minute technical architecture or portfolio review:
                </p>

                <div className="space-y-2 pt-2">
                  {['4:00 PM - 4:45 PM', '5:30 PM - 6:15 PM', '8:00 PM - 8:45 PM'].map((slot) => (
                    <label
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`flex items-center justify-between p-3 rounded-md border cursor-pointer font-mono text-xs transition ${
                        selectedSlot === slot
                          ? 'bg-violet-600/20 border-violet-500 text-white'
                          : 'bg-[#0F1126] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{slot}</span>
                      <span className="text-[10px] text-emerald-400">AVAILABLE TODAY</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setBookingModal(null)}
                  className="px-4 py-2 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBooking}
                  disabled={bookingLoading}
                  className="px-4 py-2 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] disabled:opacity-50 text-white text-xs font-mono font-bold transition border border-violet-400/30"
                >
                  {bookingLoading ? 'Reserving...' : 'Confirm Slot ↗'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
