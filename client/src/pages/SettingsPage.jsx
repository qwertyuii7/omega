import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export const SettingsPage = React.memo(function SettingsPage({ onNavigate, onLogout }) {
  const { userName, isAdmin, userRole, updateProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(userName);
  const [department, setDepartment] = useState('Global Reserves & Treasury');
  const [timezone, setTimezone] = useState('UTC-05:00 Eastern Time');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [stockoutAlerts, setStockoutAlerts] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const corporateEmail = isAdmin ? 'admin@obsidian.corp' : 'user@obsidian.corp';

  const handleProfileSave = (e) => {
    e.preventDefault();
    if (updateProfile) {
      updateProfile(fullName);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3500);
  };

  const handleLogoutAction = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      if (onNavigate) {
        onNavigate('/');
      }
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-success-emerald text-black font-body text-xs font-bold shadow-[0_12px_30px_rgba(52,211,153,0.4)] animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Executive Profile & Telemetry Preferences Updated</span>
        </div>
      )}

      <section className={`rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl border ${
        isDark ? 'bg-surface-container-low border-white/10' : 'bg-white border-slate-200'
      }`}>
        <div className="absolute right-0 top-0 w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-lg relative border ${
              isDark ? 'bg-surface-container-highest border-white/20 text-[#ffffff]' : 'bg-slate-100 border-slate-300 text-slate-800'
            }`}>
              <span className="material-symbols-outlined text-4xl">person_shield</span>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success-emerald border-2 border-surface flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-black"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className={`font-headline-lg text-xl sm:text-2xl font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>{userName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] uppercase tracking-widest font-bold ${
                  isAdmin
                    ? isDark ? 'bg-white text-black' : 'bg-[#0f172a] text-[#ffffff]'
                    : isDark ? 'bg-surface-container-highest text-[#ffffff] border border-white/20' : 'bg-slate-200 text-slate-800'
                }`}>
                  {isAdmin ? 'Privileged Executive Admin' : 'Standard Product User'}
                </span>
              </div>
              <p className="font-label-sm text-xs text-on-surface-variant flex flex-wrap items-center gap-2">
                <span className={isDark ? 'text-[#ffffff]' : 'text-slate-900 font-semibold'}>{corporateEmail}</span>
                <span>•</span>
                <span>Clearance: Level 5 Executive</span>
                <span>•</span>
                <span>ID: OBS-8492-EX</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutAction}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-error-red/15 hover:bg-error-red text-error-red hover:text-black border border-error-red/30 hover:border-error-red font-body text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Terminate & Logout</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleProfileSave} className={`rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border ${
            isDark ? 'bg-surface-container-low border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <h3 className={`font-headline-lg text-lg font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Personal Information</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Manage identity and corporate department assignment</p>
              </div>
              <span className={`material-symbols-outlined text-xl ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>manage_accounts</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                  Executive Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className={`w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all border ${
                    isDark
                      ? 'bg-surface-container border-white/10 text-[#ffffff] focus:border-white focus:ring-1 focus:ring-white/20'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                    Assigned Division
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all cursor-pointer border ${
                      isDark
                        ? 'bg-surface-container border-white/10 text-[#ffffff] focus:border-white focus:ring-1 focus:ring-white/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
                    }`}
                  >
                    <option value="Global Reserves & Treasury">Global Reserves & Treasury</option>
                    <option value="Product Specification & Logistics">Product Specification & Logistics</option>
                    <option value="Executive Analytics Engine">Executive Analytics Engine</option>
                    <option value="Corporate Security & Compliance">Corporate Security & Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                    System Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className={`w-full rounded-xl px-4 py-3 text-sm font-body outline-none transition-all cursor-pointer border ${
                      isDark
                        ? 'bg-surface-container border-white/10 text-[#ffffff] focus:border-white focus:ring-1 focus:ring-white/20'
                        : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-slate-800'
                    }`}
                  >
                    <option value="UTC-05:00 Eastern Time">UTC-05:00 Eastern Time (NY)</option>
                    <option value="UTC+00:00 Greenwich Mean">UTC+00:00 Greenwich Mean (LDN)</option>
                    <option value="UTC+05:30 India Standard Time">UTC+05:30 India Standard Time (DEL)</option>
                    <option value="UTC+08:00 Singapore Time">UTC+08:00 Singapore Time (SGP)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className={`pt-4 border-t flex justify-end ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <button
                type="submit"
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-body text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isDark
                    ? 'bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                    : 'bg-[#0f172a] text-[#ffffff] hover:bg-[#1e293b] shadow-md'
                }`}
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>

          <div className={`rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border ${
            isDark ? 'bg-surface-container-low border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <h3 className={`font-headline-lg text-lg font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Telemetry Notification Protocols</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Automated system alerts and threshold triggers</p>
              </div>
              <span className={`material-symbols-outlined text-xl ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>notifications</span>
            </div>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                isDark ? 'bg-surface-container/50 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <p className={`font-body text-sm font-semibold ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Executive System Briefings</p>
                  <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">Receive real-time reserve valuation shifts via secure corporate email</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`px-4 py-2 rounded-xl font-body text-xs font-bold transition-all flex items-center gap-2 border shrink-0 cursor-pointer ${
                    emailAlerts
                      ? 'bg-success-emerald/15 text-success-emerald border-success-emerald/40 hover:bg-success-emerald/25 shadow-sm'
                      : isDark
                        ? 'bg-surface-container border-white/10 text-on-surface-variant hover:text-[#ffffff]'
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${emailAlerts ? 'bg-success-emerald animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
                  <span>{emailAlerts ? 'Protocol Enabled' : 'Protocol Disabled'}</span>
                </button>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-2xl border ${
                isDark ? 'bg-surface-container/50 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <p className={`font-body text-sm font-semibold ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Critical Stockout Emergency Alerts</p>
                  <p className="font-label-sm text-xs text-on-surface-variant mt-0.5">Immediate push notifications when reserve count drops below 15 units</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStockoutAlerts(!stockoutAlerts)}
                  className={`px-4 py-2 rounded-xl font-body text-xs font-bold transition-all flex items-center gap-2 border shrink-0 cursor-pointer ${
                    stockoutAlerts
                      ? 'bg-success-emerald/15 text-success-emerald border-success-emerald/40 hover:bg-success-emerald/25 shadow-sm'
                      : isDark
                        ? 'bg-surface-container border-white/10 text-on-surface-variant hover:text-[#ffffff]'
                        : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${stockoutAlerts ? 'bg-success-emerald animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
                  <span>{stockoutAlerts ? 'Protocol Enabled' : 'Protocol Disabled'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className={`rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border ${
            isDark ? 'bg-surface-container-low border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <h3 className={`font-headline-lg text-lg font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Interface Theme Architecture</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Select visual contrast mode across module viewports</p>
              </div>
              <span className={`material-symbols-outlined text-xl ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>palette</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => !isDark && toggleTheme()}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 ${
                  isDark
                    ? 'bg-white/10 border-white text-[#ffffff] shadow-[0_0_20px_rgba(255,255,255,0.15)] font-bold ring-2 ring-white'
                    : 'bg-slate-50 border-slate-300 text-slate-800 hover:border-slate-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isDark ? 'bg-[#12131a] border-white/20 text-[#ffffff]' : 'bg-slate-200 border-slate-300 text-slate-900'
                }`}>
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div>
                  <p className={`font-body text-sm font-semibold ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Obsidian Dark Suite</p>
                  <p className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">High-contrast glassmorphic dark interface</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => isDark && toggleTheme()}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col gap-3 ${
                  !isDark
                    ? 'bg-[#0f172a] border-[#0f172a] text-[#ffffff] shadow-[0_4px_15px_rgba(15,23,42,0.25)] font-bold ring-2 ring-[#0f172a]'
                    : 'bg-surface-container/50 border-white/10 text-on-surface-variant hover:border-white/30'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-[#f4f6fb] border border-black/20 flex items-center justify-center text-[#0f172a]">
                  <span className="material-symbols-outlined">light_mode</span>
                </div>
                <div>
                  <p className={`font-body text-sm font-semibold ${!isDark ? 'text-[#ffffff]' : 'text-[#ffffff]'}`}>Alabaster White Theme</p>
                  <p className="font-label-sm text-[10px] text-on-surface-variant mt-0.5">Crisp daytime executive light viewport</p>
                </div>
              </button>
            </div>
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 border ${
            isDark ? 'bg-surface-container-low border-white/10' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex items-center justify-between pb-4 border-b ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
              <div>
                <h3 className={`font-headline-lg text-lg font-bold tracking-tight ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>Active Security & Cryptography</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Session integrity and authentication telemetry</p>
              </div>
              <span className={`material-symbols-outlined text-xl ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>security</span>
            </div>

            <div className="space-y-4 font-body text-xs">
              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                isDark ? 'bg-surface-container/40 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-on-surface-variant">Transport Layer Encryption</span>
                <span className="font-mono font-bold text-success-emerald flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
                  TLS 1.3 AES-GCM-256
                </span>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                isDark ? 'bg-surface-container/40 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-on-surface-variant">Hardware Security Key (2FA)</span>
                <span className={`font-semibold ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>FIDO2 WebAuthn Enforced</span>
              </div>

              <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
                isDark ? 'bg-surface-container/40 border-white/5' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-on-surface-variant">Active Session Routing</span>
                <span className={`font-mono ${isDark ? 'text-[#ffffff]' : 'text-slate-900'}`}>10.240.89.12 (Internal Node)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
