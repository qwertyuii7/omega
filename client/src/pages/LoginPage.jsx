import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const LoginPage = React.memo(function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const ref = useScrollAnimation();

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = selectedRole === 'admin' ? 'Admin' : 'User';
    login(selectedRole, name);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div ref={ref} className="bg-surface text-on-surface min-h-screen w-full flex items-center justify-center overflow-hidden bg-mesh font-body p-6 relative selection:bg-black/10 selection:text-black animate-fade-up">
      <main className="relative z-10 w-full max-w-[520px]">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-5 flex items-center justify-center border rounded-2xl bg-surface border-outline/30 text-on-surface">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_lock
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-2 tracking-tight text-on-surface">Omega</h1>

        </div>

        <div className="rounded-[16px] p-8 md:p-10 w-full border border-outline bg-surface shadow-level-1">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <div>
              <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">
                Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setEmail('admin@omega.corp');
                    setPassword('OmegaExec2026!');
                  }}
                  className={`p-3.5 rounded-[12px] border text-left transition-all duration-200 flex flex-col gap-1 ${
                    selectedRole === 'admin'
                      ? 'bg-primary text-white border-primary shadow-level-1 ring-1 ring-primary'
                      : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-bold uppercase tracking-wider">Admin</span>
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('user');
                    setEmail('user@omega.corp');
                    setPassword('OmegaUser2026!');
                  }}
                  className={`p-3.5 rounded-[12px] border text-left transition-all duration-200 flex flex-col gap-1 ${
                    selectedRole === 'user'
                      ? 'bg-primary text-white border-primary shadow-level-1 ring-1 ring-primary'
                      : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-bold uppercase tracking-wider">User</span>
                    <span className="material-symbols-outlined text-base">person</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="relative group">
                <label htmlFor="email" className="block font-label-sm text-xs text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-xl">
                    badge
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full font-body text-sm pl-12 pr-4 py-3.5 min-h-[44px] rounded-md transition-colors placeholder:text-on-surface-variant/50 outline-none border bg-background border-outline text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="password" className="block font-label-sm text-xs text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-xl">
                    vpn_key
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full font-body text-sm pl-12 pr-12 py-3.5 min-h-[44px] rounded-md transition-colors outline-none border bg-background border-outline text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20 ${!showPassword ? 'tracking-widest' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {showPassword ? 'visibility' : 'visibility_off'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                className="w-full font-body text-sm font-bold uppercase tracking-widest py-4 min-h-[48px] rounded-md flex items-center justify-center gap-2 transition-all duration-200 bg-primary text-white hover:bg-primary/90 shadow-level-1 hover:shadow-md hover:-translate-y-[1px]"
              >
                <span className="truncate">Login</span>
                <span className="material-symbols-outlined text-base shrink-0">arrow_forward</span>
              </button>
            </div>
          </form>


        </div>
      </main>
    </div>
  );
});
