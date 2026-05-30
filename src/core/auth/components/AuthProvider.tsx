import { createContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/core/supabase/client';
import type { UserProfile } from '@/shared/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthActions {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

type AuthContextType = AuthState & AuthActions;

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!session && !!user;

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    setProfile(data as UserProfile | null);
    return data;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      try {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Error fetching session/profile:', err);
      } finally {
        setIsLoading(false);
      }
    }).catch((err) => {
      console.error('getSession error:', err);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        try {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          if (newSession?.user) {
            await fetchProfile(newSession.user.id);
          } else {
            setProfile(null);
          }
        } catch (err) {
          console.error('Error on auth state change:', err);
        } finally {
          setIsLoading(false);
        }
      }
    );

    // Fail-safe timeout: Force isLoading to false after 3 seconds if Supabase hangs
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}auth/callback`,
      },
    });
  };

  const signOut = async () => {
    // Clear local state IMMEDIATELY so the UI reacts instantly
    setUser(null);
    setSession(null);
    setProfile(null);

    // Then attempt to sign out from the server
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Error during signOut:', err);
    }
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const { error } = await (supabase.from('user_profiles') as any)
      .update(data)
      .eq('id', user.id);
    if (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
    setProfile((prev) => prev ? { ...prev, ...data } : null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthenticated,
        signInWithGoogle,
        signOut,
        updateProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
