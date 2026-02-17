import { useState, useCallback } from 'react';
import { User, UserRole } from '../lib/types';
import { MOCK_USERS } from '../lib/mockData';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
  });

  const login = useCallback(async (email: string, _password: string) => {
    setState(s => ({ ...s, loading: true, error: null }));
    await new Promise(r => setTimeout(r, 800)); // simulate network
    const found = MOCK_USERS.find(u => u.email === email);
    if (found) {
      setState({ user: found, loading: false, error: null });
      return true;
    } else {
      setState({ user: null, loading: false, error: 'Correo o contraseña incorrectos' });
      return false;
    }
  }, []);

  const loginAsRole = useCallback((role: UserRole) => {
    const found = MOCK_USERS.find(u => u.role === role);
    if (found) setState({ user: found, loading: false, error: null });
  }, []);

  const logout = useCallback(() => {
    setState({ user: null, loading: false, error: null });
  }, []);

  return { ...state, login, loginAsRole, logout };
}
