import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { Navbar } from '../../components/Navbar';
import { Sidebar } from '../../components/Sidebar';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { getCurrentUser, setCurrentUser, User } from '../../utils/api';
import { useToast } from '../../components/Toast';

export default function ProfileEditPage() {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [bio, setBio] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setTargetRole(user.targetRole || 'Full Stack Software Engineer');
      setBio(user.bio || '');
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const currentUser = getCurrentUser();
    const updated: User = {
      id: currentUser?.id || 'usr_1',
      role: currentUser?.role || 'STUDENT',
      name,
      email,
      targetRole,
      bio,
      progressPercent: currentUser?.progressPercent || 78,
    };
    setCurrentUser(updated);
    addToast('Profile updated successfully!', 'success');
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Edit Profile | NextStep Academy</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col text-slate-800">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h1 className="text-2xl font-bold text-slate-900">Edit Profile</h1>
              <p className="text-xs text-slate-400">Update your target career track and student profile info.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-5 bg-white border border-slate-200 shadow-sm p-6 rounded-2xl">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50/50 border border-slate-100 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Career Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Bio / Headline</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell recruiters and AI interviewers about your background..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm transition shadow-md shadow-purple-200"
              >
                Save Profile Changes
              </button>
            </form>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
