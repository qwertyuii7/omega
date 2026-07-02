import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('obsidian_user_role') || null;
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('obsidian_user_name') || '';
  });

  const login = useCallback((role, name = '') => {
    const defaultName = role === 'admin' ? 'J. Sterling (Executive Admin)' : 'A. Mercer (Product Specialist)';
    const finalName = name || defaultName;
    setUserRole(role);
    setUserName(finalName);
    localStorage.setItem('obsidian_user_role', role);
    localStorage.setItem('obsidian_user_name', finalName);
  }, []);

  const logout = useCallback(() => {
    setUserRole(null);
    setUserName('');
    localStorage.removeItem('obsidian_user_role');
    localStorage.removeItem('obsidian_user_name');
  }, []);

  const updateProfile = useCallback((name) => {
    setUserName(name);
    localStorage.setItem('obsidian_user_name', name);
  }, []);

  const value = useMemo(() => ({
    userRole,
    userName,
    isAdmin: userRole === 'admin',
    isAuthenticated: !!userRole,
    login,
    logout,
    updateProfile
  }), [userRole, userName, login, logout, updateProfile]);

  return (
    <AuthContext.Provider value={value}>
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
