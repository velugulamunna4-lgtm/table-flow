'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/env';
import { restaurantConfig } from '@/config/restaurant.config';
import {
  UtensilsCrossed,
  ChefHat,
  ShieldCheck,
  ArrowRight,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/waiter';

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'waiter' | 'kitchen' | 'owner'>('waiter');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const supabase = getSupabaseBrowserClient();
    const isConfigured = isSupabaseConfigured();

    if (mode === 'signin') {
      if (isConfigured) {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) {
            throw error;
          }

          // Fetch profile to redirect to correct portal if not overridden
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

          const targetRole = profile?.role || 'waiter';
          const defaultPath =
            targetRole === 'kitchen'
              ? '/kitchen'
              : targetRole === 'owner' || targetRole === 'admin'
              ? '/admin'
              : '/waiter';

          setSuccessMsg('Authenticated! Entering staff terminal...');
          setTimeout(() => {
            router.push(redirectTo !== '/waiter' ? redirectTo : defaultPath);
          }, 600);
          return;
        } catch (err: any) {
          setErrorMsg(err.message || 'Failed to sign in. Please check your credentials.');
          setLoading(false);
          return;
        }
      } else {
        // Demo environment fallback
        document.cookie = `tableflow_demo_bypass=1; path=/; max-age=86400`;
        document.cookie = `tableflow_staff_session=${role}; path=/; max-age=86400`;
        setSuccessMsg('Demo session active! Redirecting...');
        setTimeout(() => {
          router.push(redirectTo);
        }, 500);
        return;
      }
    } else {
      // Sign up flow
      if (isConfigured) {
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
                role: role,
              },
            },
          });

          if (error) throw error;

          setSuccessMsg('Account created successfully! You can now log in.');
          setMode('signin');
          setLoading(false);
          return;
        } catch (err: any) {
          setErrorMsg(err.message || 'Failed to create account.');
          setLoading(false);
          return;
        }
      } else {
        setSuccessMsg('Demo account registered. You can now sign in.');
        setMode('signin');
        setLoading(false);
        return;
      }
    }
  };

  const handleQuickLogin = (roleType: 'waiter' | 'kitchen' | 'owner') => {
    const demoEmail =
      roleType === 'kitchen'
        ? 'kitchen@demo.com'
        : roleType === 'owner'
        ? 'owner@demo.com'
        : 'waiter@demo.com';

    setEmail(demoEmail);
    setPassword('TableFlow@Demo2026');
    setRole(roleType);

    // Set demo cookie immediately for quick access
    document.cookie = `tableflow_demo_bypass=1; path=/; max-age=86400`;
    document.cookie = `tableflow_staff_session=${roleType}; path=/; max-age=86400`;

    const targetUrl =
      roleType === 'kitchen' ? '/kitchen' : roleType === 'owner' ? '/admin' : '/waiter';
    router.push(targetUrl);
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center p-4 sm:p-6 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-surface rounded-3xl p-6 sm:p-8 border border-borderSubtle shadow-lifted space-y-6"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-primary text-white flex items-center justify-center font-heading font-black text-2xl shadow-accent">
            TF
          </div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-content-primary">
            {restaurantConfig.name} Staff Portal
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary">
            Secure Terminal for Waiters, Kitchen Chefs, and Management
          </p>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 p-1 bg-canvas rounded-pill border border-borderSubtle text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-pill transition-all ${
              mode === 'signin'
                ? 'bg-white text-content-primary shadow-soft'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setErrorMsg(null);
            }}
            className={`py-2 rounded-pill transition-all ${
              mode === 'signup'
                ? 'bg-white text-content-primary shadow-soft'
                : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Register Staff
          </button>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-[#FFF2F4] border border-status-alert/40 text-status-alert text-xs flex items-center gap-2 font-medium"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-3.5 rounded-2xl bg-status-success/15 border border-status-success/40 text-status-success text-xs flex items-center gap-2 font-medium"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Credentials Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-content-muted absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Captain Rahul"
                    className="w-full h-11 pl-10 pr-4 rounded-2xl bg-canvas border border-borderSubtle text-sm text-content-primary focus:outline-none focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-content-primary mb-1">
                  Assign Staff Role
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-2xl bg-canvas border border-borderSubtle text-sm text-content-primary focus:outline-none focus:border-primary transition-all"
                >
                  <option value="waiter">Floor Waiter / Captain</option>
                  <option value="kitchen">Kitchen KDS Chef</option>
                  <option value="owner">Restaurant Owner / Admin</option>
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">
              Staff Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-content-muted absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@restaurant.com"
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-canvas border border-borderSubtle text-sm text-content-primary focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-content-primary mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-content-muted absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-11 pl-10 pr-4 rounded-2xl bg-canvas border border-borderSubtle text-sm text-content-primary focus:outline-none focus:border-primary transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-pill bg-primary hover:bg-primary-hover active:scale-98 text-white font-bold text-sm shadow-accent flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : mode === 'signin' ? 'Sign In to Terminal' : 'Create Staff Profile'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* 1-Click Demo Login Shortcuts */}
        <div className="pt-4 border-t border-borderSubtle space-y-2.5">
          <div className="text-center text-xs font-bold text-content-muted uppercase tracking-wider">
            Quick 1-Click Role Access
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleQuickLogin('waiter')}
              className="p-2.5 rounded-2xl bg-canvas hover:bg-surface border border-borderSubtle flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <UtensilsCrossed className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-content-primary">Waiter Hub</span>
            </button>

            <button
              onClick={() => handleQuickLogin('kitchen')}
              className="p-2.5 rounded-2xl bg-canvas hover:bg-surface border border-borderSubtle flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <ChefHat className="w-5 h-5 text-sun group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-content-primary">Kitchen KDS</span>
            </button>

            <button
              onClick={() => handleQuickLogin('owner')}
              className="p-2.5 rounded-2xl bg-canvas hover:bg-surface border border-borderSubtle flex flex-col items-center gap-1.5 transition-all text-center group"
            >
              <ShieldCheck className="w-5 h-5 text-status-success group-hover:scale-110 transition-transform" />
              <span className="text-[11px] font-bold text-content-primary">Admin Panel</span>
            </button>
          </div>
        </div>

        {/* Back to Customer Menu */}
        <div className="text-center pt-2">
          <Link
            href="/t/7"
            className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>Switch to Customer Table 7 View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
