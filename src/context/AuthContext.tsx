'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  address?: {
    houseFlat?: string;
    street?: string;
    area?: string;
    city?: string;
    pincode?: string;
  };
  created_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; profile?: UserProfile | null }>;
  signUp: (email: string, password: string, fullName: string, phone?: string, role?: 'customer' | 'admin') => Promise<{ error: Error | null; user?: User | null }>;
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
        setProfile(data as UserProfile);
        return data as UserProfile;
      }

      // Fallback if table doesn't have row yet (read from metadata)
      const fallbackProfile: UserProfile = {
        id: userId,
        email: userEmail || '',
        full_name: metadata?.full_name || userEmail?.split('@')[0] || 'User',
        phone: metadata?.phone || '',
        role: (metadata?.role === 'admin' ? 'admin' : 'customer'),
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    } catch (err) {
      const fallbackProfile: UserProfile = {
        id: userId,
        email: userEmail || '',
        full_name: userEmail?.split('@')[0] || 'User',
        role: (metadata?.role === 'admin' ? 'admin' : 'customer'),
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  useEffect(() => {
    // 1. Initial Session Check
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
    phone?: string,
    role: 'customer' | 'admin' = 'customer'
  ) => {
    setIsLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone || '',
          role: role,
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

  const signOut = async () => {
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

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAdmin,
        isLoading,
        signIn,
        signUp,
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
