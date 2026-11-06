'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useApp } from '@/context/AppContext';
import { X, Mail, Lock, User, Phone, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

export function AuthModal() {
  const { showAuthModal, authModalMode, closeAuthModal, openAuthModal, signIn, signUp } = useAuth();
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
