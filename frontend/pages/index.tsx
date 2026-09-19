import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  Video, Code2, FileCheck, Layers, ArrowRight, Menu, X,
  Cpu, Zap, Shield, BarChart3, ChevronRight, Sparkles,
  Monitor, BrainCircuit, Target, GraduationCap
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════════════ */

/** Track mouse position for parallax (normalized -1 to 1) */
function useMouseParallax() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      x.set(nx);
      y.set(ny);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [x, y]);

  return { x, y };
}

/** Smooth scroll progress 0→1 for first viewport */
function useHeroScrollProgress() {
  const { scrollY } = useScroll();
  const progress = useTransform(scrollY, [0, 800], [0, 1]);
  const smoothProgress = useSpring(progress, { stiffness: 80, damping: 30 });
  return smoothProgress;
}

/* ═══════════════════════════════════════════════════════════════
   BACKGROUND COMPONENTS
   ═══════════════════════════════════════════════════════════════ */

/** Animated particle field */
const ParticleField = React.memo(function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    })), []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-purple-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `twinkle ${p.duration}s ease-in-out ${p.delay}s infinite, drift ${p.duration * 1.5}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
});

/** Cursor-following glow */
function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
      }
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed w-[400px] h-[400px] rounded-full pointer-events-none z-0 hidden lg:block"
      style={{
        background: 'radial-gradient(circle, rgba(124, 58, 237, 0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        willChange: 'transform',
      }}
      aria-hidden="true"
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════════ */

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: (delay: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ═══════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════ */

const navLinks = [
  { name: 'Courses', href: '/courses' },
  { name: 'AI Interview', href: '/mock-interview' },
  { name: 'DSA Lab', href: '/playground' },
  { name: 'Resume', href: '/resume-builder' },
  { name: 'Placements', href: '/jobs' },
];

const featurePills = [
  { emoji: '🤖', text: 'Live AI Proctoring', accent: 'border-blue-500/30 text-blue-300 hover:border-blue-400/60 hover:bg-blue-500/5' },
  { emoji: '⚡', text: 'Multi-Language IDE', accent: 'border-purple-500/30 text-purple-300 hover:border-purple-400/60 hover:bg-purple-500/5' },
  { emoji: '📝', text: '95%+ ATS Scanner', accent: 'border-emerald-500/30 text-emerald-300 hover:border-emerald-400/60 hover:bg-emerald-500/5' },
  { emoji: '🏢', text: '30+ Hiring Partners', accent: 'border-amber-500/30 text-amber-300 hover:border-amber-400/60 hover:bg-amber-500/5' },
];

const stats = [
  { value: 96.4, suffix: '%', label: 'Verified Offer Rate', color: 'text-purple-400' },
  { value: 500, suffix: '+', label: 'Daily Technical Drills', color: 'text-cyan-400' },
  { value: 8.8, suffix: '/10', label: 'Avg. AI Defense Score', color: 'text-emerald-400' },
  { value: 30, suffix: '+', label: 'Hiring Partners', color: 'text-amber-400' },
];

const featureCards = [
  {
    icon: Video,
    title: 'AI Mock Interviews',
    desc: 'Real-time webcam proctoring with emotion detection, eye-gaze tracking, and live technical architecture defense scoring.',
    accent: 'purple',
    href: '/mock-interview',
  },
  {
    icon: Code2,
    title: 'DSA Code Lab',
    desc: 'In-browser sandbox for TypeScript, Python, and JavaScript with LeetCode-style test suites and AI complexity audits.',
    accent: 'cyan',
    href: '/playground',
  },
  {
    icon: FileCheck,
    title: 'ATS Resume Analyzer',
    desc: '2-column live ATS editor with real-time pass rate scoring, STAR formula rewording, and one-click PDF export.',
    accent: 'emerald',
    href: '/resume-builder',
  },
  {
    icon: Layers,
    title: 'System Design Studio',
    desc: 'Interactive system design blueprints, daily architecture drills, and Sprint-based milestone tracking.',
    accent: 'amber',
    href: '/tasks',
  },
];

const accentColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'shadow-purple-500/20' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/20' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/20' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'shadow-amber-500/20' },
};

/* ═══════════════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════════════ */

function AnimatedStat({ value, suffix, label, color }: { value: number; suffix: string; label: string; color: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 50;
          const inc = value / steps;
          let cur = 0;
          const interval = setInterval(() => {
            cur += inc;
            if (cur >= value) { cur = value; clearInterval(interval); }
            setDisplay(cur);
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  const displayVal = value % 1 === 0 ? Math.floor(display) : display.toFixed(1);

  return (
    <motion.div
      ref={ref}
      variants={staggerChild}
      className="glass rounded-2xl h-[120px] p-6 flex flex-col justify-center items-center text-center border border-white/[0.04] hover:border-purple-500/20 transition-all duration-500 group"
    >
      <p className={`text-3xl sm:text-4xl font-bold ${color} tracking-tight leading-none`}>
        {displayVal}{suffix}
      </p>
      <p className="text-xs text-slate-400 mt-2 font-medium leading-tight">{label}</p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */

export default function Home() {
  const [enrollModalOpen, setEnrollModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', targetRole: 'Full Stack Engineer', status: 'Student' });
  const [submitted, setSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* Mouse parallax */
  const mouse = useMouseParallax();
  const heroProgress = useHeroScrollProgress();

  /* Parallax transforms for hero */
  const imageX = useTransform(mouse.x, [-1, 1], [-12, 12]);
  const imageY = useTransform(mouse.y, [-1, 1], [-8, 8]);
  const card1X = useTransform(mouse.x, [-1, 1], [-20, 20]);
  const card1Y = useTransform(mouse.y, [-1, 1], [-15, 15]);
  const card2X = useTransform(mouse.x, [-1, 1], [15, -15]);
  const card2Y = useTransform(mouse.y, [-1, 1], [-18, 18]);
  const card3X = useTransform(mouse.x, [-1, 1], [-10, 10]);
  const card3Y = useTransform(mouse.y, [-1, 1], [12, -12]);

  /* Scroll-driven hero exit */
  const heroImageScale = useTransform(heroProgress, [0, 1], [1, 0.92]);
  const heroImageY = useTransform(heroProgress, [0, 1], [0, -40]);
  const heroImageOpacity = useTransform(heroProgress, [0, 1], [1, 0.5]);
  const heroTextX = useTransform(heroProgress, [0, 1], [0, -30]);

  /* Smooth spring versions */
  const smoothImageX = useSpring(imageX, { stiffness: 50, damping: 20 });
  const smoothImageY = useSpring(imageY, { stiffness: 50, damping: 20 });

  /* Navbar scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Enrollment form handler */
  const handleEnrollSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEnrollModalOpen(false);
      setFormData({ name: '', email: '', phone: '', targetRole: 'Full Stack Engineer', status: 'Student' });
    }, 2000);
  }, []);

  return (
    <>
      <Head>
        <title>NextStep Academy • AI/ML Career Accelerator & Interview Labs</title>
        <meta
          name="description"
          content="Next-Generation AI Career Preparation Platform. Master technical drills, practice live AI mock defenses with emotion/gaze proctoring, build ATS resumes, and accelerate your engineering career."
        />
        <link rel="icon" href="/logo.png" />
      </Head>

      <div className="min-h-screen bg-sifal-bg text-white font-sans selection:bg-purple-600 selection:text-white relative">
        <CursorGlow />

        {/* ═══════════ NAVBAR ═══════════ */}
        <motion.header
          className={`fixed top-0 left-0 right-0 z-[100] h-[64px] px-6 lg:px-10 flex items-center transition-all duration-500 ${
            scrolled
              ? 'bg-[#060613]/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-lg shadow-black/20'
              : 'bg-[#060613]/70 backdrop-blur-md border-b border-transparent'
          }`}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-full max-w-[1400px] mx-auto flex items-center justify-between relative">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group" aria-label="NextStep Academy Home">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px] overflow-hidden shadow-lg shadow-purple-900/30 group-hover:shadow-purple-500/40 transition-shadow">
                <div className="w-full h-full rounded-xl bg-sifal-bg flex items-center justify-center overflow-hidden">
                  <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-sm text-white tracking-tight">NEXTSTEP</span>
                <span className="font-display font-bold text-sm text-purple-400 tracking-tight ml-1">ACADEMY</span>
              </div>
            </Link>

            {/* Navigation perfectly centered */}
            <nav className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="animated-underline px-3.5 py-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Login + Get Started on right */}
            <div className="flex items-center gap-3">
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-4 py-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors"
              >
                Login
              </Link>
              <motion.button
                onClick={() => setEnrollModalOpen(true)}
                className="btn-shine bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white font-semibold text-[13px] px-5 py-2.5 rounded-xl shadow-lg shadow-purple-900/30"
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started
              </motion.button>
              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.04] transition"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <motion.div
              className="lg:hidden absolute top-[64px] left-0 right-0 bg-[#060613]/95 backdrop-blur-2xl border-b border-white/[0.08] px-6 py-4 shadow-2xl"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex flex-col gap-1 max-w-[1400px] mx-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="sm:hidden px-4 py-2.5 text-sm text-slate-400 hover:text-white hover:bg-white/[0.04] rounded-lg transition"
                >
                  Login
                </Link>
              </div>
            </motion.div>
          )}
        </motion.header>

        {/* ═══════════ HERO SECTION ═══════════ */}
        <main>
          <section className="relative min-h-[calc(100vh-64px)] flex items-center overflow-hidden pt-[100px] pb-12 px-6 lg:px-8 grid-pattern" aria-label="Hero">
            {/* Background */}
            <ParticleField />

            {/* Ambient orbs */}
            <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-purple-600/[0.07] blur-[120px] animate-orb-1 pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[100px] animate-orb-2 pointer-events-none z-0" aria-hidden="true" />
            <div className="absolute -bottom-20 left-1/3 w-[400px] h-[400px] rounded-full bg-fuchsia-600/[0.04] blur-[100px] animate-drift-slow pointer-events-none z-0" aria-hidden="true" />

            <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-[52%_48%] gap-10 lg:gap-[40px] items-center relative z-[2]">
              {/* ──── LEFT COLUMN ──── */}
              <motion.div
                className="w-full space-y-7 text-left flex flex-col items-start"
                style={{ x: heroTextX }}
              >
                {/* Badge */}
                <motion.div
                  className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass border border-purple-500/20"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-purple-300 text-[11px] font-semibold tracking-wider uppercase">
                    NEXT-GEN AI EDTECH & CAREER ACCELERATOR
                  </span>
                </motion.div>

                {/* Headline */}
                <div className="w-full max-w-[600px]">
                  <motion.h1
                    className="text-[clamp(48px,14vw,72px)] lg:text-[clamp(64px,6vw,100px)] font-display font-bold text-white tracking-[-0.04em] leading-[0.92]"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.1}
                  >
                    Become a
                  </motion.h1>
                  <motion.h1
                    className="text-[clamp(48px,14vw,72px)] lg:text-[clamp(64px,6vw,100px)] font-display font-bold tracking-[-0.04em] leading-[0.92] bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.2}
                  >
                    AI/ML
                  </motion.h1>
                  <motion.div
                    className="flex items-baseline gap-1"
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    custom={0.3}
                  >
                    <h1 className="text-[clamp(48px,14vw,72px)] lg:text-[clamp(64px,6vw,100px)] font-display font-bold tracking-[-0.04em] leading-[0.92] bg-gradient-to-r from-violet-400 to-purple-300 bg-clip-text text-transparent">
                      Engineer
                    </h1>
                    <span className="typewriter-cursor" aria-hidden="true" />
                  </motion.div>
                </div>

                {/* Description */}
                <motion.p
                  className="mt-[28px] text-sm sm:text-[15px] text-slate-400 leading-[1.7] max-w-[620px]"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.4}
                >
                  Accelerate your software engineering career with real-time AI
                  computer vision mock interview defense, in-browser DSA code
                  playground, verified ATS resume optimization, daily system design
                  blueprints, and placement assistance with 30+ hiring partners.
                </motion.p>

                {/* Feature Pills */}
                <motion.div
                  className="flex flex-wrap items-center gap-[10px] mt-[28px] w-full"
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {featurePills.map((pill) => (
                    <motion.div
                      key={pill.text}
                      variants={staggerChild}
                      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 15 } }}
                      className={`h-[42px] px-[16px] inline-flex items-center gap-2 rounded-xl glass ${pill.accent} text-xs font-medium cursor-default transition-all duration-300`}
                    >
                      <span className="text-sm">{pill.emoji}</span>
                      <span>{pill.text}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-[28px] w-full"
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={0.8}
                >
                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/mock-interview"
                      className="btn-shine inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white text-sm font-semibold px-7 py-4 rounded-2xl shadow-xl shadow-purple-900/40 hover:shadow-purple-700/50 transition-shadow w-full sm:w-auto"
                    >
                      Try Live AI Interview Lab
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href="/playground"
                      className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl text-sm font-semibold text-purple-300 border border-purple-500/30 hover:border-purple-400/60 hover:bg-purple-500/5 transition-all w-full sm:w-auto"
                    >
                      <Zap size={16} />
                      DSA Code Playground
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* ──── RIGHT COLUMN: Hero Image & Floating Cards ──── */}
              <motion.div
                className="hero-visual relative flex items-center justify-center w-full z-[2] mt-8 lg:mt-0"
                style={{
                  scale: heroImageScale,
                  y: heroImageY,
                  opacity: heroImageOpacity,
                }}
              >
                {/* Glow ring */}
                <div className="absolute w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] rounded-full border border-purple-500/10 animate-spin-slow pointer-events-none z-0" aria-hidden="true" />

                {/* Image container with parallax */}
                <motion.div
                  className="relative z-[2] w-[min(100%,520px)] max-h-[620px]"
                  style={{ x: smoothImageX, y: smoothImageY }}
                  initial={{ opacity: 0, scale: 0.94, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Glow behind image */}
                  <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-purple-600/15 via-indigo-600/10 to-fuchsia-600/10 blur-2xl animate-pulse-glow pointer-events-none" aria-hidden="true" />

                  <div className="relative w-full h-[320px] sm:h-[400px] lg:h-[500px] rounded-[24px] overflow-hidden border border-white/[0.08] shadow-2xl shadow-purple-900/30">
                    <img
                      src="/student_hero.png"
                      alt="Student demonstrating the NextStep Academy platform on a laptop"
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                    {/* Bottom gradient */}
                    <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-sifal-bg via-sifal-bg/60 to-transparent" />
                  </div>
                </motion.div>

                {/* Floating Card 1 — Live AI Proctoring (Top 8%, Right -30px) */}
                <motion.div
                  className="absolute top-[8%] -right-[10px] sm:-right-[30px] z-[10] float-card-1"
                  style={{ x: card1X, y: card1Y }}
                >
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-blue-500/15 shadow-lg shadow-blue-900/10 hover:shadow-blue-500/20 hover:border-blue-400/30 transition-all cursor-default">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                        <Video size={14} className="text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">Live Webcam</p>
                        <p className="text-[11px] font-bold text-blue-400 leading-tight">AI Proctoring</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 2 — DSA Code Runner (Top 12%, Left -30px) */}
                <motion.div
                  className="absolute top-[12%] -left-[10px] sm:-left-[30px] z-[10] float-card-2"
                  style={{ x: card2X, y: card2Y }}
                >
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-emerald-500/15 shadow-lg shadow-emerald-900/10 hover:shadow-emerald-500/20 hover:border-emerald-400/30 transition-all cursor-default">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                        <Code2 size={14} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">DSA In-Browser</p>
                        <p className="text-[11px] font-bold text-emerald-400 leading-tight">Code Runner</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Card 3 — ATS Resume (Bottom 8%, Right -20px) */}
                <motion.div
                  className="absolute bottom-[8%] -right-[5px] sm:-right-[20px] z-[10] float-card-3"
                  style={{ x: card3X, y: card3Y }}
                >
                  <div className="glass rounded-xl p-3 sm:p-3.5 border border-amber-500/15 shadow-lg shadow-amber-900/10 hover:shadow-amber-500/20 hover:border-amber-400/30 transition-all cursor-default">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center">
                        <FileCheck size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-medium text-slate-400 leading-tight">95%+ Pass Rate</p>
                        <p className="text-[11px] font-bold text-amber-400 leading-tight">ATS Resume</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* ═══════════ STATS SECTION (SEPARATE BELOW HERO) ═══════════ */}
          <section className="relative z-[2] max-w-[1400px] mx-auto mt-[70px] mb-[80px] px-6 lg:px-8" aria-label="Statistics">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {stats.map((stat, i) => (
                <AnimatedStat key={i} {...stat} />
              ))}
            </motion.div>
          </section>

          {/* ═══════════ FEATURES SECTION ═══════════ */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 relative" aria-label="Features">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/[0.04] blur-[120px] rounded-full pointer-events-none" aria-hidden="true" />

            <div className="max-w-7xl mx-auto relative z-10">
              {/* Section header */}
              <motion.div
                className="text-center space-y-4 max-w-2xl mx-auto mb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/15 text-purple-300 text-[11px] font-semibold tracking-wider uppercase">
                  <Sparkles size={12} />
                  <span>Platform Engines</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold text-white tracking-tight">
                  Everything You Need to Crack{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Your Next Interview
                  </span>
                </h2>
                <p className="text-sm text-slate-500 max-w-lg mx-auto">
                  Four interactive engines designed to transform you into an industry-ready engineer.
                </p>
              </motion.div>

              {/* 2x2 Card Grid */}
              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
              >
                {featureCards.map((card) => {
                  const colors = accentColors[card.accent];
                  const Icon = card.icon;
                  return (
                    <motion.div
                      key={card.title}
                      variants={staggerChild}
                    >
                      <Link href={card.href} className="block">
                        <motion.div
                          className="gradient-border-card p-7 sm:p-8 space-y-5 group cursor-pointer h-full"
                          whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
                        >
                          {/* Icon */}
                          <motion.div
                            className={`w-12 h-12 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.glow} shadow-lg`}
                            whileHover={{ scale: 1.1, rotate: 5 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                          >
                            <Icon size={22} className={colors.text} />
                          </motion.div>

                          {/* Content */}
                          <div className="space-y-2.5">
                            <h3 className="text-lg font-display font-bold text-white group-hover:text-purple-300 transition-colors">
                              {card.title}
                            </h3>
                            <p className="text-[13px] text-slate-500 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>

                          {/* Arrow */}
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 group-hover:text-purple-300 transition-colors">
                            <span>Explore</span>
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ═══════════ PILLARS SECTION ═══════════ */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/[0.03] relative" aria-label="Key Pillars">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center space-y-4 max-w-2xl mx-auto mb-16"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                  Four Key Pillars Behind Every{' '}
                  <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                    Success Story
                  </span>
                </h2>
                <div className="w-20 h-[2px] bg-gradient-to-r from-purple-500 to-fuchsia-500 mx-auto rounded-full" />
              </motion.div>

              <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
              >
                {[
                  { icon: GraduationCap, title: 'Expert-Led Training', desc: 'Learn Full Stack Architecture, Cloud Deployments, and System Design with practical, real-world corporate engineering drills.', accent: 'purple' },
                  { icon: Shield, title: 'Industry Certifications', desc: 'Earn verified corporate credentials in AI workflows, DSA mastery, and Cloud Infrastructure that add tangible resume weight.', accent: 'cyan' },
                  { icon: BrainCircuit, title: 'Hands-on Live Projects', desc: 'Work on production SaaS pipelines, real-time computer vision classifiers, CI/CD pipelines, and microservice architectures.', accent: 'emerald' },
                  { icon: Target, title: 'Placement & Mentorship', desc: 'Direct access to interview rounds with 30+ recruiting partners, ATS resume audits, and AI proctor defense simulations.', accent: 'amber' },
                ].map((pillar) => {
                  const colors = accentColors[pillar.accent];
                  const Icon = pillar.icon;
                  return (
                    <motion.div key={pillar.title} variants={staggerChild}>
                      <motion.div
                        className="gradient-border-card p-6 space-y-4 h-full"
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <Icon size={18} className={colors.text} />
                        </div>
                        <h3 className="text-base font-display font-bold text-white">{pillar.title}</h3>
                        <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ═══════════ TRANSFORMATION SECTION ═══════════ */}
          <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-white/[0.03]" aria-label="About">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left Text */}
              <motion.div
                className="space-y-6"
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0}
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-purple-500/15 text-purple-300 text-[11px] font-semibold tracking-wider uppercase">
                  <GraduationCap size={12} />
                  <span>SIFAL BITZ GLOBAL LEARNING LABS</span>
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-display font-bold text-white tracking-tight leading-tight">
                  Transforming students into{' '}
                  <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                    industry-ready engineers
                  </span>
                </h2>

                <div className="w-16 h-[2px] bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" />

                <p className="text-sm text-slate-400 leading-relaxed">
                  We bridge the gap between classroom theory and what the corporate industry actually demands. At NextStep
                  Academy & SIFAL Bitz Global Learning Labs, we equip you with the exact tools, analytical techniques,
                  live AI mock defense, and practical production environments that employers expect you to know on Day 1.
                </p>

                <motion.button
                  onClick={() => setEnrollModalOpen(true)}
                  className="btn-shine bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white font-semibold text-sm px-7 py-4 rounded-2xl shadow-xl shadow-purple-900/30 inline-flex items-center gap-2"
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Join Our Next Batch
                  <ArrowRight size={16} />
                </motion.button>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="relative"
                variants={fadeInScale}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={0.2}
              >
                <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600/10 to-indigo-600/5 rounded-3xl blur-2xl pointer-events-none" aria-hidden="true" />
                <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-purple-900/20">
                  <img
                    src="/corporate_mentor.jpg"
                    alt="Corporate mentor in a modern city setting"
                    className="w-full h-[360px] sm:h-[420px] object-cover"
                    loading="lazy"
                  />
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-sifal-bg to-transparent" />
                </div>

                {/* Floating badge */}
                <motion.div
                  className="absolute -bottom-5 right-4 sm:right-8 glass rounded-2xl p-4 border border-purple-500/20 shadow-xl shadow-purple-900/20 text-center"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <span className="text-2xl font-bold text-purple-400 font-display">30+</span>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Hiring Partners</p>
                </motion.div>
              </motion.div>
            </div>
          </section>
        </main>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="bg-[#030308] text-slate-500 pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-t border-white/[0.03]" aria-label="Footer">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent mb-14" aria-hidden="true" />

          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Brand */}
            <div className="md:col-span-5 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 p-[1px] overflow-hidden">
                  <div className="w-full h-full rounded-xl bg-[#030308] overflow-hidden">
                    <img src="/logo.png" alt="" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <span className="font-display font-bold text-sm text-white">NEXTSTEP</span>
                  <span className="font-display font-bold text-sm text-purple-400 ml-1">ACADEMY</span>
                  <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                    SIFAL BITZ GLOBAL LEARNING LABS
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm">
                Next-Generation AI Career Preparation Platform. Master technical drills, practice live AI mock defenses, build ATS resumes, and accelerate your engineering career.
              </p>
              <p className="text-xs text-slate-700">
                © 2026 NextStep Academy • SIFAL Bitz Global Learning Labs. All rights reserved.
              </p>
            </div>

            {/* Links */}
            <div className="md:col-span-3 space-y-4">
              <h4 className="text-[11px] font-semibold text-purple-400 uppercase tracking-widest">Platform</h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { name: 'AI Mock Interview Labs', href: '/mock-interview' },
                  { name: 'DSA Code Playground', href: '/playground' },
                  { name: 'AI Resume Builder', href: '/resume-builder' },
                  { name: 'Career Roadmap', href: '/roadmap' },
                  { name: 'Daily Tasks', href: '/tasks' },
                  { name: 'Courses', href: '/courses' },
                  { name: 'Job Matcher', href: '/jobs' },
                  { name: 'Community', href: '/community' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="animated-underline hover:text-purple-300 transition-colors inline-block">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="md:col-span-4 space-y-4">
              <h4 className="text-[11px] font-semibold text-purple-400 uppercase tracking-widest">Contact</h4>
              <ul className="space-y-3 text-xs">
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg glass border border-white/[0.04] flex items-center justify-center text-purple-400 text-xs">✉️</div>
                  <a href="mailto:info@sifalbitzglobal.com" className="hover:text-purple-300 transition-colors">info@sifalbitzglobal.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg glass border border-white/[0.04] flex items-center justify-center text-emerald-400 text-xs">📞</div>
                  <a href="tel:+919629990529" className="hover:text-purple-300 transition-colors">+91 9629990529</a>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-lg glass border border-white/[0.04] flex items-center justify-center text-amber-400 text-xs shrink-0">📍</div>
                  <span>TMB Building, 5/2, 2nd Floor, Deivanayaki Nagar, Anna Nagar, Madurai, Tamil Nadu 625020</span>
                </li>
              </ul>
            </div>
          </div>
        </footer>

        {/* ═══════════ FLOATING ACTION BUTTONS ═══════════ */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3">
          <motion.a
            href="https://wa.me/919629990529"
            target="_blank"
            rel="noopener noreferrer"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl shadow-emerald-900/30 group relative"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">💬</span>
            <span className="absolute right-16 glass text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-white/[0.06]">
              WhatsApp Us
            </span>
          </motion.a>

          <motion.a
            href="tel:+919629990529"
            className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#EF4444] text-white flex items-center justify-center shadow-2xl shadow-red-900/30 group relative"
            title="Call Support"
            aria-label="Call Support"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-2xl">📞</span>
            <span className="absolute right-16 glass text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition whitespace-nowrap border border-white/[0.06]">
              Call Advisor
            </span>
          </motion.a>
        </div>

        {/* ═══════════ ENROLLMENT MODAL ═══════════ */}
        {enrollModalOpen && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong rounded-3xl max-w-md w-full p-8 shadow-2xl shadow-purple-900/30 border border-purple-500/15 relative space-y-6"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <button
                onClick={() => setEnrollModalOpen(false)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition p-1"
                aria-label="Close enrollment form"
              >
                <X size={18} />
              </button>

              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-2xl mx-auto">
                  🎓
                </div>
                <h3 className="font-display font-bold text-xl text-white">Join NextStep Academy</h3>
                <p className="text-xs text-slate-500">
                  SIFAL Bitz Global Learning Labs • 100% Placement Assistance
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-900/20 border border-emerald-500/20 text-center space-y-2">
                  <div className="text-3xl">🎉</div>
                  <h4 className="font-semibold text-emerald-300 text-base">Application Received!</h4>
                  <p className="text-xs text-emerald-400/80">Our counselor will contact you within 2 business hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEnrollSubmit} className="space-y-4">
                  {[
                    { label: 'Full Name', type: 'text', key: 'name', placeholder: 'e.g. Rahul Sharma' },
                    { label: 'Email Address', type: 'email', key: 'email', placeholder: 'e.g. rahul@example.com' },
                    { label: 'Phone / WhatsApp', type: 'tel', key: 'phone', placeholder: '+91 98765 43210' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={(formData as any)[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl glass border border-white/[0.06] text-sm text-white placeholder-slate-600 focus:ring-1 focus:ring-purple-500 focus:border-purple-500/40 focus:outline-none bg-transparent transition"
                      />
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Target Role</label>
                      <select
                        value={formData.targetRole}
                        onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl glass border border-white/[0.06] text-sm text-white focus:ring-1 focus:ring-purple-500 focus:outline-none bg-sifal-bg transition"
                      >
                        <option>Full Stack Engineer</option>
                        <option>AI / ML Engineer</option>
                        <option>Backend Specialist</option>
                        <option>Frontend Specialist</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl glass border border-white/[0.06] text-sm text-white focus:ring-1 focus:ring-purple-500 focus:outline-none bg-sifal-bg transition"
                      >
                        <option>Student</option>
                        <option>2025 Graduate</option>
                        <option>2024 Graduate</option>
                        <option>Working Professional</option>
                      </select>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    className="btn-shine w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-600 text-white font-semibold text-sm shadow-xl shadow-purple-900/30"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Submit Application & Get Callback
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}
