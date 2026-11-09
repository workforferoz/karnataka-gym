'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGym } from '@/lib/store';
import { Footer } from '@/components/Footer';
import { sanitizePhone, checkRateLimit } from '@/lib/security';
import { UpiPaymentModal } from '@/components/UpiPaymentModal';
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  UserCheck,
  KeyRound,
  ArrowLeft,
  Lock,
  LayoutDashboard,
  Dumbbell,
  Award,
  LogIn,
  Eye,
  EyeOff,
  ShieldAlert,
  UserPlus,
  Mail,
  User,
  Sparkles,
  X,
  Target,
  Flame
} from 'lucide-react';

function GoogleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get('role'); // 'member' | 'trainer' | 'owner'

  const {
    users,
    plans,
    login,
    loginWithCredentials,
    loginWithGoogle,
    registerMemberAccount
  } = useGym();

  const [activeTab, setActiveTab] = useState<'member' | 'trainer' | 'owner'>('member');
  const [memberMode, setMemberMode] = useState<'signin' | 'register'>('signin');

  // Sign In credentials
  const [loginIdentifier, setLoginIdentifier] = useState('9743247790');
  const [loginPassword, setLoginPassword] = useState('1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Self-Service Registration fields
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regPlanId, setRegPlanId] = useState(plans[0]?.id || 'plan_quarterly');
  const [regGoal, setRegGoal] = useState('General Health & Fitness');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [showRegUpiModal, setShowRegUpiModal] = useState(false);

  const selectedRegPlan = plans.find((p) => p.id === regPlanId) || plans[0];
  const regPayableAmount =
    regPlanId === 'trial_7days'
      ? 0
      : selectedRegPlan
      ? selectedRegPlan.base_price - (selectedRegPlan.discount_amount || 0)
      : 0;

  // Google OAuth Modal
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Owner authentication credentials
  const [ownerPhone, setOwnerPhone] = useState('9902667407');
  const [ownerPin, setOwnerPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [ownerError, setOwnerError] = useState('');

  // Role redirection: Trainer and Owner have private dedicated links
  useEffect(() => {
    if (requestedRole === 'owner') {
      router.replace('/owner/login');
    } else if (requestedRole === 'trainer') {
      router.replace('/trainer/login');
    } else {
      setActiveTab('member');
    }
  }, [requestedRole, router]);

  // Demo Member Profile
  const demoMember =
    users.find((u) => u.phone === '9743247790') ||
    users.find((u) => u.id === 'member_rahul_desai') ||
    users.find((u) => u.role === 'member') || {
      id: 'member_rahul_desai',
      name: 'Rahul Desai',
      phone: '9743247790',
      email: 'rahul.desai@gmail.com',
      password: '1234',
      role: 'member' as const,
      marketing_opt_in: true,
      comm_preference: 'whatsapp' as const,
      created_at: '2025-01-01'
    };

  // 1. Handle Member ID/Password Sign In
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const rateCheck = checkRateLimit('login_credentials', 6, 60000);
    if (!rateCheck.allowed) {
      setLoginError(`Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await loginWithCredentials(loginIdentifier, loginPassword);
      if (!res.success) {
        setLoginError(res.message);
        return;
      }

      if (res.user?.role === 'owner' || res.user?.role === 'trainer') {
        router.push('/owner/dashboard');
      } else {
        router.push('/member/home');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // 2. Handle Self-Service Account Setup
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await registerMemberAccount({
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword,
        planId: regPlanId,
        fitnessGoal: regGoal,
        authProvider: 'password'
      });

      if (!res.success) {
        setRegError(res.message);
        return;
      }

      setRegSuccess(res.message);
      setTimeout(() => {
        router.push('/member/home');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenRegUpi = (e: React.MouseEvent) => {
    e.preventDefault();
    setRegError('');
    if (!regName.trim() || regName.trim().length < 2) {
      setRegError('Please enter your full name.');
      return;
    }
    if (regPhone.replace(/\D/g, '').length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (regPassword.length < 4) {
      setRegError('Password must be at least 4 characters long.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match. Please re-type your password.');
      return;
    }
    setShowRegUpiModal(true);
  };

  const handleRegUpiSuccess = async (details: { transactionId: string }) => {
    setShowRegUpiModal(false);
    setIsSubmitting(true);
    try {
      const res = await registerMemberAccount({
        name: regName,
        phone: regPhone,
        email: regEmail || undefined,
        password: regPassword,
        planId: regPlanId,
        fitnessGoal: regGoal,
        authProvider: 'password'
      });

      if (!res.success) {
        setRegError(res.message);
        return;
      }

      setRegSuccess(`Payment verified! ${res.message}`);
      setTimeout(() => {
        router.push('/member/home');
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Handle Google Authentication
  const handleGoogleSelect = async (account: { name: string; email: string; imageUrl?: string }) => {
    setShowGoogleModal(false);
    setIsSubmitting(true);
    try {
      const res = await loginWithGoogle(account);
      if (!res.success) {
        setLoginError(res.message);
        return;
      }
      if (res.user?.role === 'owner' || res.user?.role === 'trainer') {
        router.push('/owner/dashboard');
      } else {
        router.push('/member/home');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.includes('@') || !customGoogleName.trim()) {
      return;
    }
    handleGoogleSelect({
      name: customGoogleName.trim(),
      email: customGoogleEmail.trim().toLowerCase()
    });
  };

  // Direct 1-tap select for Trainers/Demo
  const handleDirectSelect = (user: typeof users[0]) => {
    login(user.id);
    if (user.role === 'owner' || user.role === 'front_desk' || user.role === 'trainer') {
      router.push('/owner/dashboard');
    } else {
      router.push('/member/home');
    }
  };

  // Owner PIN Authentication
  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerError('');

    const rateCheck = checkRateLimit('login_owner_pin', 5, 60000);
    if (!rateCheck.allowed) {
      setOwnerError(`Too many login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds.`);
      return;
    }

    const { sanitized } = sanitizePhone(ownerPhone);
    const cleanPin = ownerPin.trim();

    const isOwnerPhone = sanitized === '9902667407' || sanitized.endsWith('9902667407');
    const isOwnerPin = cleanPin === '9902';

    if (!isOwnerPhone || !isOwnerPin) {
      setOwnerError('Access Denied: Invalid Owner credentials. Only Karnataka Gym authorized owner with verified PIN can access the cockpit.');
      return;
    }

    const ownerUser = users.find((u) => u.role === 'owner') || users.find((u) => u.phone === '9902667407') || {
      id: 'user_owner_riyaz',
      role: 'owner' as const,
      phone: '9902667407',
      name: 'Riyaz (Gym Owner)'
    };

    login(ownerUser.id);
    router.push('/owner/dashboard');
  };

  const trainerUsers = users.filter((u) => u.role === 'trainer');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0E14] text-slate-100">
      {/* Top Website Return Bar */}
      <div className="bg-[#121622] border-b border-[#232B3E] px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#E5A93C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Karnataka Gym Website</span>
          </Link>
          <div className="text-[11px] text-slate-400 hidden sm:block">
            Kalidas Nagar, Hubballi • Helpline: <a href="tel:9902667407" className="text-[#E5A93C] font-semibold">9902667407</a>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        {/* Top Branding Card */}
        <div className="text-center space-y-3">
          <div className="inline-block relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 drop-shadow-[0_4px_12px_rgba(229,169,60,0.35)]">
            <Image
              src="/karnataka-gym-badge.png"
              alt="Karnataka Gym Hubballi"
              width={64}
              height={64}
              className="object-contain w-full h-full rounded-full"
              priority
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Karnataka Gym <span className="text-[#E5A93C]">Hubballi</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Member Digital Portal • Est. 2011 • Hubballi, Karnataka
            </p>
          </div>
        </div>

        {/* MEMBER LOGIN & ACCOUNT SETUP */}
        {activeTab === 'member' && (
          <div className="max-w-md mx-auto space-y-6">
            {/* Sub-Switch: Sign In vs Set Up Account */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#161B26] border border-[#232B3E]">
              <button
                type="button"
                onClick={() => {
                  setMemberMode('signin');
                  setLoginError('');
                }}
                className={`py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  memberMode === 'signin'
                    ? 'bg-[#E5A93C] text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Member Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMemberMode('register');
                  setRegError('');
                }}
                className={`py-2 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  memberMode === 'register'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Set Up Account</span>
              </button>
            </div>

            {/* MODE A: SIGN IN FORM */}
            {memberMode === 'signin' && (
              <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-6 shadow-xl space-y-5">
                <div className="border-b border-[#232B3E] pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-white">Member Credentials Login</h2>
                    <p className="text-[11px] text-slate-400">Login with your Phone, Email, or Member ID</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/30">
                    ID & Password
                  </span>
                </div>

                <form onSubmit={handleCredentialLogin} className="space-y-4">
                  {/* ID / Phone / Email Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Phone, Email, or Member ID
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setLoginIdentifier('9743247790');
                          setLoginPassword('1234');
                          setLoginError('');
                        }}
                        className="text-[11px] text-[#E5A93C] hover:underline font-bold cursor-pointer"
                      >
                        Demo: 9743247790
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. 9743247790 or rahul.desai@gmail.com"
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2.5 pl-10 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Password / PIN
                      </label>
                      <span className="text-[11px] text-[#E5A93C] font-semibold">
                        Demo: 1234
                      </span>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter 4-digit password (1234)"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#E5A93C] rounded-xl py-2.5 pl-10 pr-10 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                        title={showPassword ? 'Hide' : 'Show'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {loginError && (
                    <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#E5A93C] hover:bg-[#F59E0B] text-slate-950 font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4 stroke-[2.5]" />
                    <span>{isSubmitting ? 'Signing In...' : 'Sign In with ID & Password'}</span>
                  </button>
                </form>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-2">
                  <div className="border-t border-[#232B3E] w-full"></div>
                  <span className="bg-[#121622] px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 relative">
                    OR CONTINUE WITH
                  </span>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  onClick={() => setShowGoogleModal(true)}
                  className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-3 shadow-md hover:shadow-lg transition-all cursor-pointer border border-slate-300"
                >
                  <GoogleIcon className="w-5 h-5 flex-shrink-0" />
                  <span>Sign in with Google</span>
                </button>

                {/* Link to Set Up Account */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setMemberMode('register')}
                    className="text-xs text-slate-400 hover:text-[#E5A93C] transition-colors"
                  >
                    Don't have an account? <strong className="text-[#E5A93C] underline">Set up your account here →</strong>
                  </button>
                </div>
              </div>
            )}

            {/* MODE B: SELF-SERVICE REGISTRATION / ACCOUNT SETUP */}
            {memberMode === 'register' && (
              <div className="bg-[#121622] border-2 border-blue-600/60 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="border-b border-[#232B3E] pb-3 flex items-center justify-between">
                  <div>
                    <h2 className="text-sm font-extrabold text-white">Set Up Member Account</h2>
                    <p className="text-[11px] text-slate-400">Join Karnataka Gym Hubballi in 1 minute</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    New Member
                  </span>
                </div>

                {/* 1-Tap Google Setup */}
                <div>
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(true)}
                    className="w-full bg-white hover:bg-slate-100 text-slate-900 font-extrabold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2.5 shadow transition-all cursor-pointer border border-slate-300"
                  >
                    <GoogleIcon className="w-4 h-4 flex-shrink-0" />
                    <span>Quick 1-Tap Set Up with Google</span>
                  </button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-[#232B3E] w-full"></div>
                    <span className="bg-[#121622] px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 relative">
                      OR REGISTER WITH PHONE
                    </span>
                  </div>
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Ramesh Kulkarni"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 px-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                        +91
                      </div>
                      <input
                        type="tel"
                        placeholder="9845012345"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        maxLength={10}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 pl-11 pr-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        placeholder="e.g. ramesh@gmail.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password & Confirm */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Create Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showRegPassword ? 'text' : 'password'}
                          placeholder="Min 4 digits"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 px-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowRegPassword(!showRegPassword)}
                          className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                        >
                          {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                        Confirm Password *
                      </label>
                      <input
                        type={showRegPassword ? 'text' : 'password'}
                        placeholder="Re-enter password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 px-3 text-xs font-semibold text-white placeholder-slate-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* Plan Selection */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Choose Starting Membership Plan
                    </label>
                    <select
                      value={regPlanId}
                      onChange={(e) => setRegPlanId(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                    >
                      {plans.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.duration_months} Months) — ₹{p.base_price - (p.discount_amount || 0)}
                        </option>
                      ))}
                      <option value="trial_7days">7-Day Free Karnataka Gym Trial Pass (₹0)</option>
                    </select>
                  </div>

                  {/* Fitness Goal */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                      Primary Fitness Goal
                    </label>
                    <select
                      value={regGoal}
                      onChange={(e) => setRegGoal(e.target.value)}
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-blue-500 rounded-xl py-2 px-3 text-xs font-semibold text-white focus:outline-none"
                    >
                      <option value="General Health & Fitness">General Health & Fitness</option>
                      <option value="Raw Strength & Hypertrophy">Raw Strength & Hypertrophy</option>
                      <option value="Weight Loss & Conditioning">Weight Loss & Conditioning</option>
                      <option value="Bodybuilding Competition">Bodybuilding Competition</option>
                    </select>
                  </div>

                  {regError && (
                    <div className="p-2.5 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{regError}</span>
                    </div>
                  )}

                  {regSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-200 text-xs flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{regSuccess}</span>
                    </div>
                  )}

                  {regPayableAmount > 0 ? (
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={handleOpenRegUpi}
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-[#E5A93C] to-[#F59E0B] hover:from-[#d89e34] hover:to-[#e08f06] text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#E5A93C]/20 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                        <span>Pay ₹{regPayableAmount} via UPI QR (Instant Pass)</span>
                      </button>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#181F2F] hover:bg-[#20293D] text-slate-300 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-[#2D3850] transition-all cursor-pointer disabled:opacity-50"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Register Now (Pay Cash at Reception)</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-500 text-white font-extrabold py-3 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>{isSubmitting ? 'Creating Profile...' : 'Activate 7-Day Free Trial Pass'}</span>
                    </button>
                  )}
                </form>

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setMemberMode('signin')}
                    className="text-xs text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    Already have an account? <strong className="text-blue-400 underline">Sign in with ID & Password →</strong>
                  </button>
                </div>
              </div>
            )}

            {/* Registration UPI QR Payment Modal */}
            <UpiPaymentModal
              isOpen={showRegUpiModal}
              onClose={() => setShowRegUpiModal(false)}
              title={`Membership: ${selectedRegPlan?.name || 'Initial Plan'}`}
              amount={regPayableAmount}
              itemDescription={`Karnataka Gym ${selectedRegPlan?.name || ''} New Membership`}
              onPaymentSuccess={handleRegUpiSuccess}
            />

            {/* Quick 1-Tap Demo Card */}
            <div className="bg-[#121622] border border-[#232B3E] rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Demo Member Account:</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Password: 1234
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleDirectSelect(demoMember)}
                className="w-full p-3.5 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-[#E5A93C] text-left flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#1F2739] border border-[#2D3950] text-[#E5A93C] font-black flex items-center justify-center text-sm">
                    {demoMember.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-sm font-extrabold text-white block group-hover:text-[#E5A93C] transition-colors">
                      {demoMember.name}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      +91 {demoMember.phone} • {demoMember.email || 'rahul.desai@gmail.com'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-[#E5A93C]">
                  <span>1-Tap Demo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              <p className="text-[11px] text-slate-400 text-center">
                Click to test QR check-in, live workout streak, and member app features.
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: TRAINER LOGIN */}
        {activeTab === 'trainer' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#121622] border-2 border-emerald-800/60 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-600/15 border border-emerald-600/30 text-emerald-400 flex items-center justify-center">
                  <Dumbbell className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white">Trainer & Coach Portal</h2>
                  <p className="text-xs text-slate-400">Hubballi certified coaches: Vikram, Pooja & Rakesh</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-slate-300 block uppercase tracking-wider">
                  Select Certified Trainer:
                </span>

                {trainerUsers.map((trainer) => (
                  <button
                    key={trainer.id}
                    onClick={() => handleDirectSelect(trainer)}
                    className="w-full p-4 rounded-xl bg-[#171D2B] border border-[#28354A] hover:border-emerald-500 text-left flex items-center justify-between transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-950/60 border border-emerald-700 text-emerald-300 font-black flex items-center justify-center text-sm">
                        {trainer.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-extrabold text-white block group-hover:text-emerald-400 transition-colors">
                          {trainer.name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          +91 {trainer.phone} • Certified Floor Coach
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <span>Enter Desk</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-[11px] text-emerald-300 flex items-start gap-2">
                <Award className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  Trainers have full permissions to view active members, conduct assisted check-ins at reception, and assign diet charts.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: OWNER SECURE CREDENTIAL LOGIN */}
        {activeTab === 'owner' && (
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-[#121622] border-2 border-red-800/80 rounded-2xl p-6 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-red-600/15 border border-red-600/30 text-red-500 flex items-center justify-center">
                  <Lock className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-400 bg-red-950/80 border border-red-700/60 px-2 py-0.5 rounded-full">
                      Owner Only • Protected
                    </span>
                  </div>
                  <h2 className="text-base font-extrabold text-white mt-1">Owner Cockpit Authentication</h2>
                  <p className="text-xs text-slate-400">Strict credential verification for Karnataka Gym Hubballi</p>
                </div>
              </div>

              <form onSubmit={handleOwnerLogin} className="space-y-4 pt-1">
                {/* Owner Phone Input */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                    Owner Registered Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold text-xs">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      placeholder="9902667407"
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-12 pr-4 text-sm font-semibold text-white placeholder-slate-500 focus:outline-none"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Owner Secret PIN Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Owner Secret PIN
                    </label>
                    <span className="text-[11px] text-[#E5A93C] font-semibold">
                      PIN: 9902
                    </span>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type={showPin ? 'text' : 'password'}
                      value={ownerPin}
                      onChange={(e) => setOwnerPin(e.target.value)}
                      placeholder="Enter 4-Digit Owner PIN"
                      className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-red-500 rounded-xl py-2.5 pl-10 pr-10 text-sm font-mono tracking-widest text-white placeholder-slate-500 focus:outline-none"
                      maxLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                      title={showPin ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {ownerError && (
                  <div className="p-3 rounded-xl bg-red-950/70 border border-red-800 text-red-200 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{ownerError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>Verify Credentials & Enter Cockpit</span>
                </button>
              </form>

              <div className="p-3 rounded-xl bg-[#171D2B] border border-[#232B3E] text-[11px] text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E5A93C] flex-shrink-0 mt-0.5" />
                <span>
                  Only the verified owner can configure Member App appearance, announcement banners, churn recovery, and membership plans.
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* GOOGLE ACCOUNT CHOOSER MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#121622] border-2 border-slate-700 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setShowGoogleModal(false);
                setShowCustomGoogleInput(false);
              }}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center space-y-2 pt-2">
              <div className="inline-flex p-3 rounded-2xl bg-white shadow-md">
                <GoogleIcon className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-white">Sign in with Google</h3>
              <p className="text-xs text-slate-400">Choose an account to continue to Karnataka Gym Hubballi</p>
            </div>

            {!showCustomGoogleInput ? (
              <div className="space-y-2.5 pt-2">
                {/* Account 1: Rahul Desai (Member) */}
                <button
                  type="button"
                  onClick={() =>
                    handleGoogleSelect({
                      name: 'Rahul Desai',
                      email: 'rahul.desai@gmail.com',
                      imageUrl: ''
                    })
                  }
                  className="w-full p-3 rounded-2xl bg-[#181F2F] hover:bg-[#20293D] border border-[#2C3852] hover:border-[#4285F4] transition-all flex items-center gap-3 text-left group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-blue-600 font-black text-white text-sm flex items-center justify-center flex-shrink-0">
                    R
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-white block group-hover:text-blue-400 truncate">
                      Rahul Desai
                    </span>
                    <span className="text-[11px] text-slate-400 truncate block">rahul.desai@gmail.com</span>
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400">
                    Member
                  </span>
                </button>

                {/* Account 2: Custom Google Account Button */}
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full p-3 rounded-2xl bg-[#181F2F] hover:bg-[#20293D] border border-[#2C3852] hover:border-[#4285F4] transition-all flex items-center gap-3 text-left cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs font-bold text-white block">Use another Google Account</span>
                    <span className="text-[11px] text-slate-400">Sign in with your personal Gmail</span>
                  </div>
                </button>
              </div>
            ) : (
              /* Custom Google Form */
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sunil Kulkarni"
                    value={customGoogleName}
                    onChange={(e) => setCustomGoogleName(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#4285F4] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 mb-1">Gmail Address</label>
                  <input
                    type="email"
                    placeholder="sunil.gym@gmail.com"
                    value={customGoogleEmail}
                    onChange={(e) => setCustomGoogleEmail(e.target.value)}
                    className="w-full bg-[#181F2F] border border-[#2C3852] focus:border-[#4285F4] rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCustomGoogleInput(false)}
                    className="flex-1 py-2 rounded-xl border border-slate-700 text-slate-400 text-xs font-bold"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow"
                  >
                    Continue
                  </button>
                </div>
              </form>
            )}

            <div className="pt-2 text-center text-[10px] text-slate-500">
              Karnataka Gym Hubballi uses Google Auth to verify your identity.
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center text-sm font-bold">
          Loading Karnataka Gym Hubballi Portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
