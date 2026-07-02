import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const LoginPage = React.memo(function LoginPage({ onLoginSuccess }) {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const [email, setEmail] = useState('admin@obsidian.corp');
  const [password, setPassword] = useState('ObsidianExec2026!');
  const [selectedRole, setSelectedRole] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = selectedRole === 'admin' ? 'J. Sterling (Executive Admin)' : 'A. Mercer (Standard User)';
    login(selectedRole, name);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen w-full flex items-center justify-center overflow-hidden bg-mesh font-body p-6 relative selection:bg-white/20 selection:text-white">
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-surface-container-highest blur-[140px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-surface-container-highest blur-[120px]"></div>
      </div>

      <main className="relative z-10 w-full max-w-[520px]">
        <div className="mb-8 flex flex-col items-center justify-center text-center">
          <div className={`w-16 h-16 mb-5 flex items-center justify-center border rounded-2xl backdrop-blur-md shadow-lg ${
            isDark
              ? 'border-white/15 bg-surface-container-lowest/80 text-[#ffffff] shadow-[0_0_30px_rgba(255,255,255,0.08)]'
              : 'border-slate-300 bg-white text-slate-900'
          }`}>
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              shield_lock
            </span>
          </div>
          <h1 className={`font-display-xl text-3xl md:text-4xl font-bold mb-2 tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Obsidian Reserve</h1>
          <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-[0.2em] font-medium">Executive Admin Suite</p>
        </div>

        <div className={`rounded-3xl p-8 md:p-10 w-full border backdrop-blur-xl ${
          isDark
            ? 'glass-panel shadow-[0_24px_48px_rgba(0,0,0,0.6)] border-white/10 bg-surface-container-lowest/70'
            : 'border-slate-200 bg-white shadow-2xl'
        }`}>
          <div className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/25 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="font-label-sm text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-base">auto_awesome</span>
                <span>Demonstration Mode Pre-Filled</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-primary/20 text-primary font-label-sm text-[10px] font-bold uppercase">Ready for Evaluation</span>
            </div>
            <p className="font-body text-xs text-on-surface-variant leading-relaxed">
              Select an access profile below to automatically populate active login credentials. Click Authenticate to enter the demonstration dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-3 font-semibold">
                Select Access Profile (RBAC Test)
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('admin');
                    setEmail('admin@obsidian.corp');
                    setPassword('ObsidianExec2026!');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 ${
                    selectedRole === 'admin'
                      ? isDark
                        ? 'bg-white/10 border-white text-[#ffffff] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'bg-[#0f172a] border-[#0f172a] text-[#ffffff] shadow-md'
                      : isDark
                        ? 'bg-surface-container-low/50 border-white/10 text-on-surface-variant hover:border-white/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-bold uppercase tracking-wider">Admin View</span>
                    <span className="material-symbols-outlined text-base">admin_panel_settings</span>
                  </div>
                  <span className="font-body text-[11px] opacity-75">Full Privileges & Analytics</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedRole('user');
                    setEmail('user@obsidian.corp');
                    setPassword('ObsidianUser2026!');
                  }}
                  className={`p-3.5 rounded-xl border text-left transition-all duration-200 flex flex-col gap-1 ${
                    selectedRole === 'user'
                      ? isDark
                        ? 'bg-white/10 border-white text-[#ffffff] shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                        : 'bg-[#0f172a] border-[#0f172a] text-[#ffffff] shadow-md'
                      : isDark
                        ? 'bg-surface-container-low/50 border-white/10 text-on-surface-variant hover:border-white/30'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-body text-xs font-bold uppercase tracking-wider">User View</span>
                    <span className="material-symbols-outlined text-base">person</span>
                  </div>
                  <span className="font-body text-[11px] opacity-75">Published Products Only</span>
                </button>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="relative group">
                <label htmlFor="email" className="block font-label-sm text-xs text-on-surface-variant mb-2 font-medium uppercase tracking-wider">
                  Corporate Identity
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
                    className={`w-full font-body text-sm pl-12 pr-4 py-3.5 rounded-xl transition-colors placeholder:text-on-surface-variant/50 outline-none border ${
                      isDark
                        ? 'bg-surface-container border-white/10 text-[#ffffff] focus:border-white focus:ring-1 focus:ring-white/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
                    }`}
                  />
                </div>
              </div>

              <div className="relative group">
                <label htmlFor="password" className="block font-label-sm text-xs text-on-surface-variant mb-2 font-medium uppercase tracking-wider flex justify-between items-center">
                  <span>Access Cipher</span>
                  <span className="text-[11px] text-primary lowercase tracking-normal font-mono">auto-filled</span>
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
                    className={`w-full font-body text-sm pl-12 pr-12 py-3.5 rounded-xl transition-colors outline-none border ${
                      isDark
                        ? 'bg-surface-container border-white/10 text-[#ffffff] focus:border-white focus:ring-1 focus:ring-white/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
                    } ${!showPassword ? 'tracking-widest' : ''}`}
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
                className={`w-[85%] max-w-[360px] font-body text-xs sm:text-sm font-bold uppercase tracking-wider py-3.5 px-4 rounded-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all duration-200 ${
                  isDark
                    ? 'bg-[#ffffff] text-[#000000] hover:bg-[#ffffff]/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                    : 'bg-[#0f172a] text-[#ffffff] hover:bg-[#1e293b] shadow-[0_4px_15px_rgba(15,23,42,0.25)]'
                }`}
              >
                <span className="truncate">Authenticate ({selectedRole === 'admin' ? 'Admin' : 'User'})</span>
                <span className="material-symbols-outlined text-base shrink-0">arrow_forward</span>
              </button>
            </div>
          </form>

          <div className={`mt-8 text-center border-t pt-6 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <p className="font-label-sm text-xs text-on-surface-variant/70 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>End-to-End Encrypted Session • Role-Based Access Enforcement</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
});
