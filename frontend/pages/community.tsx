import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useToast } from '../components/Toast';

interface DiscussionPost {
  id: string;
  author: string;
  avatar: string;
  role: string;
  title: string;
  content: string;
  tag: string;
  upvotes: number;
  commentsCount: number;
  timeAgo: string;
}

const DISCUSSIONS: DiscussionPost[] = [
  {
    id: 'd-1',
    author: 'Priya Sharma',
    avatar: 'PS',
    role: 'Backend Engineer @ Razorpay Offer',
    title: 'How I defended Redis Token Bucket rate limiting in my Stripe L4 interview',
    content:
      'The interviewer asked about race conditions during high concurrent traffic. I explained how Redis Lua scripts guarantee atomicity without round-trip overhead. Highly recommend the NextStep System Design drill!',
    tag: 'System Design',
    upvotes: 48,
    commentsCount: 14,
    timeAgo: '3 hours ago',
  },
  {
    id: 'd-2',
    author: 'David Kim',
    avatar: 'DK',
    role: 'Full Stack Candidate',
    title: 'Next.js 14 Server Actions vs API Routes: Key tradeoffs you must know',
    content:
      'Server Actions provide seamless RPC-like mutations directly from components, but remember to validate authorization inside the action itself. What are your thoughts on rate limiting server actions?',
    tag: 'Next.js & Frontend',
    upvotes: 35,
    commentsCount: 9,
    timeAgo: '6 hours ago',
  },
  {
    id: 'd-3',
    author: 'Arun Patel',
    avatar: 'AP',
    role: 'AI / ML Engineer',
    title: 'STAR method breakdown for technical conflict: Senior dev wanted DynamoDB, I pushed PostgreSQL',
    content:
      'Shared my live benchmark prototype showing how JSONB indexing in PostgreSQL met our latency target while cutting license costs by 70%. Data-driven proofs always win in behavioral rounds.',
    tag: 'Behavioral & STAR',
    upvotes: 62,
    commentsCount: 21,
    timeAgo: '1 day ago',
  },
];

const LEADERBOARD = [
  { rank: 1, name: 'Elena Rostova', xp: '4,850 XP', streak: '28 Days 🔥', role: 'Full Stack Staff', badge: '🏆 Diamond' },
  { rank: 2, name: 'Alex Chen (You)', xp: '3,920 XP', streak: '9 Days 🔥', role: 'Full Stack Engineer', badge: '🥇 Platinum' },
  { rank: 3, name: 'Marcus Vance', xp: '3,410 XP', streak: '15 Days 🔥', role: 'System Architect', badge: '🥈 Gold' },
  { rank: 4, name: 'Aaliyah Khan', xp: '2,980 XP', streak: '12 Days 🔥', role: 'AI / ML Engineer', badge: '🥈 Gold' },
  { rank: 5, name: 'Liam Murphy', xp: '2,450 XP', streak: '7 Days 🔥', role: 'Frontend Engineer', badge: '🥉 Silver' },
];

export default function CommunityPage() {
  const { addToast } = useToast();
  const [posts, setPosts] = useState<DiscussionPost[]>(DISCUSSIONS);
  const [activeTab, setActiveTab] = useState<'discussions' | 'leaderboard' | 'peer-matching'>('discussions');

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTag, setNewPostTag] = useState('System Design');

  const handleUpvote = (id: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))
    );
    addToast('👍 Upvoted community discussion!', 'success');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      addToast('Please enter title and content', 'error');
      return;
    }

    const post: DiscussionPost = {
      id: `post-${Date.now()}`,
      author: 'Alex Chen (You)',
      avatar: 'AC',
      role: 'Full Stack Engineer',
      title: newPostTitle.trim(),
      content: newPostContent.trim(),
      tag: newPostTag,
      upvotes: 1,
      commentsCount: 0,
      timeAgo: 'Just now',
    };

    setPosts([post, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    addToast('✨ Question posted to NextStep Community!', 'success');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Community, Peer Mentorship & Leaderboard | NextStep Academy</title>
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
                  NextStep Talent Network
                </div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                  Peer Community, Global Leaderboard & Mock Matching
                </h1>
                <p className="text-sm text-slate-300">
                  Connect with fellow engineers, share real interview debriefs, climb the XP rankings, and schedule 1-on-1 peer mock defense rounds.
                </p>
              </div>
            </div>

            {/* Tab Switcher */}
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 shadow-sm w-fit">
              <button
                onClick={() => setActiveTab('discussions')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'discussions'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                💬 Peer Discussions ({posts.length})
              </button>
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                🏆 Global Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('peer-matching')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'peer-matching'
                    ? 'bg-[#7C3AED] text-white shadow-md shadow-purple-200'
                    : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                🤝 1-on-1 Mock Matching
              </button>
            </div>

            {/* Tab 1: Discussions */}
            {activeTab === 'discussions' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Posts Feed (8 cols) */}
                <div className="lg:col-span-8 space-y-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-slate-900/80 rounded-3xl p-6 border border-slate-200 hover:border-purple-200 transition shadow-sm space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-amber-500/20 text-[#7C3AED] border border-purple-200 font-bold flex items-center justify-center text-xs">
                            {post.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900">{post.author}</div>
                            <div className="text-[10px] text-slate-400">{post.role}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md bg-slate-50 text-[#7C3AED] border border-slate-200">
                            {post.tag}
                          </span>
                          <span className="text-[11px] text-slate-500">{post.timeAgo}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900">{post.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{post.content}</p>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-400">
                        <button
                          onClick={() => handleUpvote(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-[#7C3AED] transition"
                        >
                          <span>▲ Upvote</span>
                          <span className="font-bold">({post.upvotes})</span>
                        </button>

                        <span>💬 {post.commentsCount} Comments</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Create Post Form (4 cols) */}
                <div className="lg:col-span-4">
                  <div className="bg-slate-900/80 rounded-3xl p-6 border border-slate-200 space-y-4 shadow-sm sticky top-24">
                    <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <span>✏️</span> Start a Discussion
                    </h3>

                    <form onSubmit={handleCreatePost} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Topic Title</label>
                        <input
                          type="text"
                          required
                          value={newPostTitle}
                          onChange={(e) => setNewPostTitle(e.target.value)}
                          placeholder="e.g. Question regarding Redis replication..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Category</label>
                        <select
                          value={newPostTag}
                          onChange={(e) => setNewPostTag(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400"
                        >
                          <option value="System Design">System Design</option>
                          <option value="Next.js & Frontend">Next.js & Frontend</option>
                          <option value="FastAPI & Backend">FastAPI & Backend</option>
                          <option value="Behavioral & STAR">Behavioral & STAR</option>
                          <option value="Interview Debrief">Interview Debrief</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Details / Insights</label>
                        <textarea
                          rows={4}
                          required
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Share your question or interview breakdown..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-white text-xs focus:outline-none focus:border-amber-400"
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-xs transition shadow-md shadow-purple-200"
                      >
                        Publish Post
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Leaderboard */}
            {activeTab === 'leaderboard' && (
              <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Global Practice Leaderboard</h3>
                    <p className="text-xs text-slate-400">Rankings based on XP earned through coding drills & AI mock defenses.</p>
                  </div>
                  <span className="text-xs font-bold text-[#7C3AED]">Updated Hourly ⚡</span>
                </div>

                <div className="space-y-3">
                  {LEADERBOARD.map((user) => (
                    <div
                      key={user.rank}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                        user.rank === 2
                          ? 'bg-[#EDE9FE] border-purple-200 shadow-md'
                          : 'bg-white/90 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center ${
                            user.rank === 1
                              ? 'bg-amber-400 text-slate-950'
                              : user.rank === 2
                              ? 'bg-[#7C3AED] text-white font-bold'
                              : 'bg-slate-100 text-slate-300'
                          }`}
                        >
                          #{user.rank}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-400">{user.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <span className="text-xs text-slate-300">{user.streak}</span>
                        <span className="text-xs font-bold text-[#7C3AED]">{user.xp}</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-slate-300">
                          {user.badge}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Peer Matching */}
            {activeTab === 'peer-matching' && (
              <div className="bg-slate-900/80 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">1-on-1 Peer Mock Interview Matching</h3>
                  <p className="text-xs text-slate-400">
                    Practice live system design defense with other engineers targeting the same role.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Find a Match for Tonight</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      We pair you with a candidate of similar XP and target role. Each person conducts 30 minutes of interview and 15 minutes of structured feedback.
                    </p>
                    <button
                      onClick={() => addToast('🎉 Match Request Submitted! You will receive an email confirmation.', 'success')}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-slate-950 font-bold text-xs shadow-md shadow-purple-200"
                    >
                      Join Live Peer Match Queue
                    </button>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900">Upcoming Confirmed Sessions</h4>
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="text-xs font-bold text-[#7C3AED]">System Design: Distributed Cache</div>
                      <div className="text-[11px] text-slate-300">Partner: Priya S. • Tomorrow at 7:00 PM IST</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
