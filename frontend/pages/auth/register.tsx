import React from 'react';
import Head from 'next/head';
import { AuthForm } from '../../components/AuthForm';
import { Navbar } from '../../components/Navbar';

export default function RegisterPage() {
  return (
    <>
      <Head>
        <title>Create Account | NextStep Academy</title>
        <meta name="description" content="Join NextStep Academy - Learn, Practice, Interview, and Launch your tech career." />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/30 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Ambient Glow background */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#EDE9FE] rounded-full blur-3xl pointer-events-none"></div>
          <AuthForm mode="register" />
        </div>
      </div>
    </>
  );
}
