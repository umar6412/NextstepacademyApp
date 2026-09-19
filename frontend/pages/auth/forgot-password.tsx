import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { apiRequest } from '../../utils/api';
import { useToast } from '../../components/Toast';

// ── Types ─────────────────────────────────────────────────────────────────────

type Step = 'email' | 'otp';

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(15 * 60); // 15 min in seconds
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Start countdown when OTP step begins
  useEffect(() => {
    if (step === 'otp') {
      setCountdown(15 * 60);
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current!);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step]);

  // ── Step 1: request OTP ───────────────────────────────────────────────────

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch {
      // 200 is always returned even for unknown emails; swallow network errors
      // in mock mode so the UI still proceeds
    } finally {
      setLoading(false);
    }
    addToast('If that email exists, an OTP has been sent. Check your inbox (or backend terminal in demo mode).', 'success');
    setStep('otp');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  // ── OTP input handling ────────────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(''));
      otpRefs.current[5]?.focus();
      e.preventDefault();
    }
  };

  // ── Step 2: verify OTP + reset password ──────────────────────────────────

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) {
      addToast('Please enter all 6 digits of your OTP.', 'error');
      return;
    }
    if (!newPassword || newPassword.length < 8) {
      addToast('New password must be at least 8 characters.', 'error');
      return;
    }
    setLoading(true);
    try {
      await apiRequest('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ email, otp: code, new_password: newPassword }),
      });
      addToast('Password reset successfully! You can now sign in.', 'success');
      router.push('/auth/login');
    } catch (err: any) {
      addToast(err.message || 'Invalid or expired OTP. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ── Resend OTP ────────────────────────────────────────────────────────────

  const handleResend = useCallback(async () => {
    setLoading(true);
    try {
      await apiRequest('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    } catch { /* swallow */ } finally {
      setLoading(false);
    }
    setOtp(Array(6).fill(''));
    setCountdown(15 * 60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timerRef.current!); return 0; }
        return c - 1;
      });
    }, 1000);
    addToast('A new OTP has been sent.', 'success');
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  }, [email, addToast]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-purple-50/30 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="p-8 rounded-2xl bg-white border border-slate-200 shadow-lg space-y-6">

          {/* Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#8B5CF6] to-[#7C3AED] items-center justify-center shadow-lg shadow-purple-200 text-white font-black text-2xl tracking-tighter">
              NS
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {step === 'email' ? 'Reset Your Password' : 'Enter Verification Code'}
            </h1>
            <p className="text-xs text-slate-500">
              {step === 'email'
                ? "Enter your account email and we'll send you a 6-digit OTP."
                : `We sent a 6-digit code to ${email}. Enter it below.`}
            </p>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {(['email', 'otp'] as Step[]).map((s, i) => (
              <React.Fragment key={s}>
                <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all ${
                  step === s ? 'bg-[#7C3AED] text-white' :
                  (step === 'otp' && s === 'email') ? 'bg-green-500 text-white' :
                  'bg-slate-100 text-slate-500'
                }`}>
                  {(step === 'otp' && s === 'email') ? '✓' : i + 1}
                </div>
                {i < 1 && <div className={`flex-1 h-0.5 rounded transition-all ${step === 'otp' ? 'bg-[#7C3AED]' : 'bg-slate-200'}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ── Step 1: Email form ───────────────────────────────────────── */}
          {step === 'email' && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div>
                <label htmlFor="fp-email" className="block text-xs font-medium text-slate-600 mb-1">Email Address</label>
                <input
                  id="fp-email"
                  type="email"
                  required
                  autoFocus
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#7C3AED] transition"
                />
              </div>

              <button
                id="fp-send-otp-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-lg shadow-purple-200 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Send OTP Code
              </button>
            </form>
          )}

          {/* ── Step 2: OTP + new password ───────────────────────────────── */}
          {step === 'otp' && (
            <form onSubmit={handleReset} className="space-y-5">
              {/* OTP digit boxes */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-3">6-Digit OTP</label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-digit-${i}`}
                      ref={(el) => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={i === 0 ? handleOtpPaste : undefined}
                      className={`w-11 h-14 text-center text-xl font-bold rounded-xl border transition focus:outline-none ${
                        digit ? 'border-[#7C3AED] bg-[#EDE9FE] text-[#7C3AED]' : 'border-slate-200 bg-slate-50 text-slate-900'
                      } focus:border-[#7C3AED] caret-[#7C3AED]`}
                    />
                  ))}
                </div>
              </div>

              {/* Countdown */}
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono font-semibold ${countdown <= 60 ? 'text-red-500' : 'text-slate-500'}`}>
                  {countdown > 0 ? `Expires in ${fmtCountdown(countdown)}` : 'OTP expired'}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading || countdown > (15 * 60 - 30)}
                  className="text-[#7C3AED] hover:text-[#6D28D9] font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Resend OTP
                </button>
              </div>

              {/* New password */}
              <div>
                <label htmlFor="fp-new-password" className="block text-xs font-medium text-slate-600 mb-1">New Password</label>
                <div className="relative">
                  <input
                    id="fp-new-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 pr-12 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-[#7C3AED] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#7C3AED] transition text-xs"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {/* Password strength bar */}
                {newPassword.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all ${
                          newPassword.length >= [8, 12, 16, 20][i]
                            ? ['bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-400'][i]
                            : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              <button
                id="fp-reset-btn"
                type="submit"
                disabled={loading || countdown === 0}
                className="w-full py-3 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold text-sm shadow-lg shadow-purple-200 transition duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Reset Password
              </button>
            </form>
          )}

          {/* Back to login */}
          <div className="pt-2 text-center border-t border-slate-100">
            <Link
              href="/auth/login"
              className="text-xs text-slate-500 hover:text-[#7C3AED] transition"
            >
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
