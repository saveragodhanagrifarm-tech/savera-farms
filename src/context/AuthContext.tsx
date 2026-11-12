'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin' | 'rider';
  address?: {
    houseFlat?: string;
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  wallet_balance?: number;
  reward_points?: number;
  created_at?: string;
  assignedRoute?: string;
}

export const PRESET_ACCOUNTS = [
  {
    id: 'usr-admin-1',
    email: 'admin@saverafarms.com',
    password: 'SaveraAdmin2026!',
    full_name: 'Super Admin (Head Office)',
    phone: '+91 98765 43210',
    role: 'admin' as const,
    assignedRoute: 'All Panchkula & Chandigarh Hubs',
  },
  {
    id: 'usr-admin-2',
    email: 'operations@saverafarms.com',
    password: 'SaveraAdmin2026!',
    full_name: 'Operations Admin',
    phone: '+91 98765 43211',
    role: 'admin' as const,
    assignedRoute: 'Panchkula Sector 19 Cold Depot',
  },
  {
    id: 'usr-admin-3',
    email: 'manager@saverafarms.com',
    password: 'SaveraAdmin2026!',
    full_name: 'Dispatch & Store Manager',
    phone: '+91 98765 43212',
    role: 'admin' as const,
    assignedRoute: 'Chandigarh & Panchkula Distribution Hub',
  },
  {
    id: 'usr-rider-1',
    email: 'rider1@saverafarms.com',
    password: 'SaveraRider2026!',
    full_name: 'Delivery Partner 1 (Panchkula)',
    phone: '+91 98111 22334',
    role: 'rider' as const,
    assignedRoute: 'Panchkula Hub & Sectors 1–15 (134xxx)',
  },
  {
    id: 'usr-rider-2',
    email: 'rider2@saverafarms.com',
    password: 'SaveraRider2026!',
    full_name: 'Delivery Partner 2 (Chandigarh)',
    phone: '+91 98222 33445',
    role: 'rider' as const,
    assignedRoute: 'Chandigarh Hub & Mohali (160xxx)',
  },
  {
    id: 'usr-rider-1-alias',
    email: 'rider.ramesh@saverafarms.com',
    password: 'SaveraRider2026!',
    full_name: 'Delivery Partner 1 (Panchkula)',
    phone: '+91 98111 22334',
    role: 'rider' as const,
    assignedRoute: 'Panchkula Hub & Sectors 1–15 (134xxx)',
  },
  {
    id: 'usr-rider-2-alias',
    email: 'rider.gurpreet@saverafarms.com',
    password: 'SaveraRider2026!',
    full_name: 'Delivery Partner 2 (Chandigarh)',
    phone: '+91 98222 33445',
    role: 'rider' as const,
    assignedRoute: 'Chandigarh Hub & Mohali (160xxx)',
  },
];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isRider: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; profile?: UserProfile | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string) => Promise<{ error: Error | null; user?: User | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  showAuthModal: boolean;
  authModalMode: 'login' | 'signup';
  openAuthModal: (mode?: 'login' | 'signup') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  const fetchProfile = async (userId: string, userEmail?: string, metadata?: any): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (data && !error) {
        // Enforce: only authorized pre-approved emails can hold 'admin' role
        const email = data.email?.toLowerCase() || '';
        const isAuthorizedAdmin = email === 'admin@saverafarms.com' || email === 'operations@saverafarms.com' || email === 'manager@saverafarms.com';
        const role: 'customer' | 'admin' | 'rider' = (data.role === 'admin' && isAuthorizedAdmin)
          ? 'admin'
          : (data.role === 'rider' ? 'rider' : 'customer');
        const resolvedProfile: UserProfile = { ...data, role };
        setProfile(resolvedProfile);
        return resolvedProfile;
      }

      // Fallback from metadata with whitelist check
      const email = userEmail?.toLowerCase() || '';
      const isAuthorizedAdmin = email === 'admin@saverafarms.com' || email === 'operations@saverafarms.com' || email === 'manager@saverafarms.com';
      const role: 'customer' | 'admin' | 'rider' = isAuthorizedAdmin && metadata?.role === 'admin' 
        ? 'admin' 
        : (metadata?.role === 'rider' ? 'rider' : 'customer');

      const fallbackProfile: UserProfile = {
        id: userId,
        email: userEmail || '',
        full_name: metadata?.full_name || userEmail?.split('@')[0] || 'User',
        phone: metadata?.phone || '',
        role,
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    } catch (err) {
      const email = userEmail?.toLowerCase() || '';
      const isAuthorizedAdmin = email === 'admin@saverafarms.com' || email === 'operations@saverafarms.com' || email === 'manager@saverafarms.com';
      const fallbackProfile: UserProfile = {
        id: userId,
        email: userEmail || '',
        full_name: userEmail?.split('@')[0] || 'User',
        role: isAuthorizedAdmin ? 'admin' : 'customer',
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    // 0. Check preset auth stored in localStorage
    if (typeof window !== 'undefined') {
      const savedPreset = localStorage.getItem('savera_preset_auth');
      if (savedPreset) {
        try {
          const parsed = JSON.parse(savedPreset);
          if (parsed?.user && parsed?.profile) {
            setUser(parsed.user);
            setProfile(parsed.profile);
            setIsLoading(false);
            return;
          }
        } catch (e) {}
      }
    }

    // 1. Initial Supabase Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id, session.user.email, session.user.user_metadata).finally(() => {
          setIsLoading(false);
        });
      } else {
        setUser(null);
        setProfile(null);
        setIsLoading(false);
      }
    });

    // 2. Auth State Change Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // If preset auth is active, do not overwrite
      if (typeof window !== 'undefined' && localStorage.getItem('savera_preset_auth')) {
        return;
      }
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id, session.user.email, session.user.user_metadata);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    // Check preset accounts (Admin 1, Admin 2, Rider 1, Rider 2)
    const preset = PRESET_ACCOUNTS.find((a) => a.email.toLowerCase() === normalizedEmail);
    if (preset) {
      if (preset.password !== password) {
        setIsLoading(false);
        return { error: new Error('Incorrect password for this authorized account.') };
      }

      const presetUser = {
        id: preset.id,
        email: preset.email,
        app_metadata: {},
        user_metadata: { full_name: preset.full_name, phone: preset.phone, role: preset.role },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      } as unknown as User;

      const presetProfile: UserProfile = {
        id: preset.id,
        email: preset.email,
        full_name: preset.full_name,
        phone: preset.phone,
        role: preset.role,
        assignedRoute: preset.assignedRoute,
        wallet_balance: preset.role === 'admin' ? 50000 : 0,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem('savera_preset_auth', JSON.stringify({ user: presetUser, profile: presetProfile }));
      }

      setUser(presetUser);
      setProfile(presetProfile);
      setIsLoading(false);
      setShowAuthModal(false);
      return { error: null, profile: presetProfile };
    }

    // Standard Supabase login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    let loadedProfile: UserProfile | null = null;
    if (data.user) {
      setUser(data.user);
      loadedProfile = await fetchProfile(data.user.id, data.user.email, data.user.user_metadata);
    }
    setIsLoading(false);
    setShowAuthModal(false);
    return { error: null, profile: loadedProfile };
  };

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    phone?: string
  ) => {
    setIsLoading(true);
    // Security check: Public registrations are strictly customers. Admin/Rider roles cannot be self-assigned.
    const role = 'customer' as const;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role,
        },
      },
    });

    if (error) {
      setIsLoading(false);
      return { error };
    }

    if (data.user) {
      setUser(data.user);
      await fetchProfile(data.user.id, data.user.email, { full_name: fullName, phone, role });
    }
    setIsLoading(false);
    setShowAuthModal(false);
    return { error: null, user: data.user };
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://savera-farms.pages.dev';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/account/`,
      },
    });
    if (error) {
      setIsLoading(false);
      return { error };
    }
    return { error: null };
  };

  const signOut = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('savera_preset_auth');
    }
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.email, user.user_metadata);
    }
  };

  const openAuthModal = (mode: 'login' | 'signup' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const isAdmin = profile?.role === 'admin';
  const isRider = profile?.role === 'rider';

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isRider,
        isLoading,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        refreshProfile,
        showAuthModal,
        authModalMode,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
