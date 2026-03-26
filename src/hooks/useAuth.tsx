import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { mapAuthErrorMessage, normalizeEmail } from '@/lib/authErrors';
import {
  findOfflineUserByEmail,
  getOfflineSessionUser,
  hashPassword,
  setOfflineSession,
  upsertOfflineUser,
} from '@/lib/offlineDatabase';

type AppRole = Database['public']['Enums']['app_role'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, role: AppRole, jobTitle?: string, avatar?: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function resolveRole(userId: string): Promise<AppRole> {
  try {
    const { data } = await supabase.from('user_roles').select('role').eq('user_id', userId).maybeSingle();
    return data?.role ?? 'employee';
  } catch {
    return 'employee';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Primeiro, inicializa a sessão atual
    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        setSession(currentSession);
        setUser(currentSession.user);
        const resolvedRole = await resolveRole(currentSession.user.id);
        setRole(resolvedRole);
        setOfflineSession(currentSession.user.id);
        setLoading(false);
        return;
      }

      // Modo offline: tenta recuperar sessão local
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const offlineSession = getOfflineSessionUser();
        if (offlineSession) {
          setUser({ id: offlineSession.id, email: offlineSession.email } as User);
          setRole(offlineSession.role);
        }
      }

      setLoading(false);
    });

    // Escuta mudanças de estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (!currentSession?.user) {
        setRole(null);
        setLoading(false);
        return;
      }

      const resolvedRole = await resolveRole(currentSession.user.id);
      setRole(resolvedRole);
      setLoading(false);

      // Persiste dados para uso offline
      upsertOfflineUser({
        id: currentSession.user.id,
        email: normalizeEmail(currentSession.user.email ?? ''),
        name: (currentSession.user.user_metadata?.name as string) ?? 'Usuário',
        role: resolvedRole,
        passwordHash: findOfflineUserByEmail(normalizeEmail(currentSession.user.email ?? ''))?.passwordHash ?? null,
        createdAt: new Date().toISOString(),
      });
      setOfflineSession(currentSession.user.id);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    name: string,
    roleValue: AppRole,
    jobTitle?: string,
    avatar?: string,
  ) => {
    const normalizedEmail = normalizeEmail(email);

    // O Supabase trigger `handle_new_user` cria automaticamente os registros
    // em profiles, employees e user_roles usando os metadados abaixo.
    const { error, data } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: {
          name: name.trim(),
          role: roleValue,
          job_title: jobTitle?.trim() ?? null,
          avatar: avatar ?? '👤',
        },
      },
    });

    if (!error) {
      // Persiste localmente para suporte offline
      upsertOfflineUser({
        id: data.user?.id ?? crypto.randomUUID(),
        email: normalizedEmail,
        name: name.trim(),
        role: roleValue,
        passwordHash: await hashPassword(password),
        createdAt: new Date().toISOString(),
      });
    }

    return { error: error ? new Error(mapAuthErrorMessage(error.message)) : null };
  };

  const signIn = async (email: string, password: string) => {
    const normalizedEmail = normalizeEmail(email);
    const inputPasswordHash = await hashPassword(password);

    const { error, data } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });

    if (!error) {
      const userRole = data.user ? await resolveRole(data.user.id) : 'employee';
      upsertOfflineUser({
        id: data.user?.id ?? crypto.randomUUID(),
        email: normalizedEmail,
        name: (data.user?.user_metadata?.name as string) ?? 'Usuário',
        role: userRole,
        passwordHash: inputPasswordHash,
        createdAt: new Date().toISOString(),
      });
      return { error: null };
    }

    // Fallback offline: verifica credenciais locais
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      const offlineUser = findOfflineUserByEmail(normalizedEmail);
      if (offlineUser?.passwordHash && offlineUser.passwordHash === inputPasswordHash) {
        setUser({ id: offlineUser.id, email: offlineUser.email } as User);
        setRole(offlineUser.role);
        setOfflineSession(offlineUser.id);
        return { error: null };
      }
    }

    return { error: new Error(mapAuthErrorMessage(error.message)) };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
    setOfflineSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
