'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export function AuthModal() {
  const { showAuthModal, authModalMode, closeAuthModal, openAuthModal, signIn, signUp, signInWithGoogle } = useAuth();
  const { addToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      if (authModalMode === 'login') {
        const { error, profile } = await signIn(email, password);
        if (error) {
          setErrorMsg(error.message);
          addToast('Login Failed', error.message, 'error');
        } else {
          addToast(
            'Welcome Back!',
            `Logged in as ${profile?.full_name || email} (${profile?.role === 'admin' ? 'Admin' : 'Customer'})`,
            'success'
          );
          closeAuthModal();
        }
      } else {
        const { error, user } = await signUp(email, password, fullName, phone, role);
        if (error) {
          setErrorMsg(error.message);
          addToast('Registration Failed', error.message, 'error');
        } else {
          addToast(
            'Account Created!',
            'Your account is ready. Please check your email if confirmation is required.',
            'success'
          );
          closeAuthModal();
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) {
        setErrorMsg(error.message);
        addToast('Google Sign-in Note', error.message, 'error');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Google sign-in could not be initiated.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-floating border border-savera-dark/10 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Decorative corner accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-savera-saffron/20 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-savera-dark hover:bg-savera-cream transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="inline-flex items-center gap-1.5 bg-savera-cream text-savera-green px-3 py-1 rounded-full text-[11px] font-bold mb-2">
              <Sparkles className="w-3 h-3 text-savera-saffron" />
              <span>Savera Godhan Agri Farm</span>
            </div>
            <h2 className="font-serif text-2xl font-bold text-savera-dark">
              {authModalMode === 'login' ? 'Sign In to Your Account' : 'Create Your Account'}
            </h2>
            <p className="text-xs text-savera-brown mt-1">
              {authModalMode === 'login'
                ? 'Access your daily milk subscriptions, orders, and addresses.'
                : 'Join Savera Farms for fresh farm deliveries at your doorstep.'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200">
              {errorMsg}
            </div>
          )}

          {/* Social Sign In (Google) */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full bg-white hover:bg-gray-50 border border-savera-dark/20 text-savera-dark font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-3 shadow-sm hover:shadow text-xs disabled:opacity-50"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-savera-dark/10 w-full" />
            <span className="bg-white px-3 text-[10px] text-gray-400 uppercase tracking-widest font-bold absolute">
              or with email & password
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {authModalMode === 'signup' && (
              <>
                <div>
                  <label className="text-savera-dark font-bold block mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priya Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-9 pr-3 py-2.5 text-savera-dark focus:outline-none focus:border-savera-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-savera-dark font-bold block mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-9 pr-3 py-2.5 text-savera-dark focus:outline-none focus:border-savera-green"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-savera-dark font-bold block mb-1">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('customer')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition ${
                        role === 'customer'
                          ? 'bg-savera-green text-white border-savera-green'
                          : 'bg-savera-offwhite text-savera-dark border-savera-dark/15'
                      }`}
                    >
                      Customer
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('admin')}
                      className={`p-2.5 rounded-xl border font-bold text-center transition ${
                        role === 'admin'
                          ? 'bg-savera-dark text-savera-saffron border-savera-dark'
                          : 'bg-savera-offwhite text-savera-dark border-savera-dark/15'
                      }`}
                    >
                      Admin / Staff
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-savera-dark font-bold block mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-9 pr-3 py-2.5 text-savera-dark focus:outline-none focus:border-savera-green"
                />
              </div>
            </div>

            <div>
              <label className="text-savera-dark font-bold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-savera-offwhite border border-savera-dark/15 rounded-xl pl-9 pr-3 py-2.5 text-savera-dark focus:outline-none focus:border-savera-green"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-savera-dark hover:bg-savera-green text-savera-cream font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Please wait...' : authModalMode === 'login' ? 'Sign In' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 text-savera-saffron" />
            </button>
          </form>

          {/* Mode Switcher */}
          <div className="text-center text-xs text-savera-brown pt-2 border-t border-savera-dark/10">
            {authModalMode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('signup')}
                  className="font-bold text-savera-green hover:underline ml-1"
                >
                  Create one now
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="font-bold text-savera-green hover:underline ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
