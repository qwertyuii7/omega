import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const SettingsPage = React.memo(function SettingsPage({ onNavigate, onLogout }) {
  const { userName, isAdmin, userRole, updateProfile, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const [fullName, setFullName] = useState(userName);
  const [department, setDepartment] = useState('Global Reserves & Treasury');
  const [timezone, setTimezone] = useState('UTC-05:00 Eastern Time');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [stockoutAlerts, setStockoutAlerts] = useState(true);
  const [saveToast, setSaveToast] = useState(false);
  const ref = useScrollAnimation();

  const corporateEmail = isAdmin ? 'admin@omega.corp' : 'user@omega.corp';

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
    <div ref={ref} className="space-y-8 pb-12 animate-fade-up">
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-success-emerald text-black font-body text-xs font-bold shadow-[0_12px_30px_rgba(52,211,153,0.4)] animate-bounce">
          <span className="material-symbols-outlined text-lg">check_circle</span>
          <span>Profile Updated</span>
        </div>
      )}

      <section className="bg-surface rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-level-1 border border-outline">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 shadow-level-1 relative border bg-surface border-outline text-on-surface">
              <span className="material-symbols-outlined text-4xl">person_shield</span>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success-emerald border-2 border-surface flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-background"></span>
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1">
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-on-surface">{userName}</h2>
                <span className={`px-2.5 py-0.5 rounded-full font-label-sm text-[10px] uppercase tracking-widest font-bold ${
                  isAdmin
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-highest text-on-surface border border-outline-variant'
                }`}>
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              </div>
              <p className="font-label-sm text-xs text-on-surface-variant flex flex-wrap items-center gap-2">
                <span className="text-on-surface font-semibold">{corporateEmail}</span>
              </p>
            </div>
          </div>

          <button
            onClick={handleLogoutAction}
            className="w-full sm:w-auto px-6 py-3 min-h-[44px] rounded-md bg-transparent hover:bg-error text-error hover:text-white border border-error hover:border-error font-body text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm shrink-0 hover:shadow-md"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Logout</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <form onSubmit={handleProfileSave} className="bg-surface rounded-3xl p-6 sm:p-8 shadow-level-1 space-y-6 border border-outline">
            <div className="flex items-center justify-between pb-4 border-b border-outline">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-on-surface">Personal Information</h3>
              </div>
              <span className="material-symbols-outlined text-xl text-on-surface">manage_accounts</span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full rounded-md px-4 py-3 min-h-[44px] text-sm font-body outline-none transition-all border bg-background border-outline text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                    Division
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-md px-4 py-3 min-h-[44px] text-sm font-body outline-none transition-all cursor-pointer border bg-background border-outline text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="Global Reserves & Treasury">Reserves</option>
                    <option value="Product Specification & Logistics">Logistics</option>
                    <option value="Executive Analytics Engine">Analytics</option>
                    <option value="Corporate Security & Compliance">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-sm text-xs text-on-surface-variant uppercase tracking-wider mb-2 font-medium">
                    Timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-md px-4 py-3 min-h-[44px] text-sm font-body outline-none transition-all cursor-pointer border bg-background border-outline text-on-surface focus:border-primary focus:ring-1 focus:ring-primary/20"
                  >
                    <option value="UTC-05:00 Eastern Time">UTC-05:00 Eastern Time (NY)</option>
                    <option value="UTC+00:00 Greenwich Mean">UTC+00:00 Greenwich Mean (LDN)</option>
                    <option value="UTC+05:30 India Standard Time">UTC+05:30 India Standard Time (DEL)</option>
                    <option value="UTC+08:00 Singapore Time">UTC+08:00 Singapore Time (SGP)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t flex justify-end border-outline">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3 min-h-[44px] rounded-md font-body text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md hover:-translate-y-[1px]"
              >
                <span className="material-symbols-outlined text-base">save</span>
                <span>Save Changes</span>
              </button>
            </div>
          </form>

          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-level-1 space-y-6 border border-outline">
            <div className="flex items-center justify-between pb-4 border-b border-outline">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-on-surface">Notifications</h3>
              </div>
              <span className="material-symbols-outlined text-xl text-on-surface">notifications</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-[12px] border bg-background border-outline shadow-level-1">
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">Email Alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`px-4 py-2 min-h-[44px] rounded-md font-body text-xs font-bold transition-all flex items-center gap-2 border shrink-0 cursor-pointer ${
                    emailAlerts
                      ? 'bg-surface text-success-emerald border-success-emerald hover:border-success-emerald/50 shadow-sm'
                      : 'bg-surface border-outline text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${emailAlerts ? 'bg-success-emerald animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
                  <span>{emailAlerts ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[12px] border bg-background border-outline shadow-level-1">
                <div>
                  <p className="font-body text-sm font-semibold text-on-surface">Stockout Alerts</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStockoutAlerts(!stockoutAlerts)}
                  className={`px-4 py-2 min-h-[44px] rounded-md font-body text-xs font-bold transition-all flex items-center gap-2 border shrink-0 cursor-pointer ${
                    stockoutAlerts
                      ? 'bg-surface text-success-emerald border-success-emerald hover:border-success-emerald/50 shadow-sm'
                      : 'bg-surface border-outline text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${stockoutAlerts ? 'bg-success-emerald animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
                  <span>{stockoutAlerts ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-level-1 space-y-6 border border-outline">
            <div className="flex items-center justify-between pb-4 border-b border-outline">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-on-surface">Theme</h3>
              </div>
              <span className="material-symbols-outlined text-xl text-on-surface">palette</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => !isDark && toggleTheme()}
                className={`p-4 min-h-[44px] rounded-[12px] border text-left transition-all flex flex-col gap-3 ${
                  isDark
                    ? 'bg-surface border-primary text-on-surface shadow-level-1 ring-1 ring-primary'
                    : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  isDark ? 'bg-surface border-primary/30 text-primary' : 'bg-background border-outline text-on-surface'
                }`}>
                  <span className="material-symbols-outlined">dark_mode</span>
                </div>
                <div>
                  <p className={`font-body text-sm font-semibold ${isDark ? 'text-on-surface' : 'text-on-surface-variant'}`}>Dark Mode</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => isDark && toggleTheme()}
                className={`p-4 min-h-[44px] rounded-[12px] border text-left transition-all flex flex-col gap-3 ${
                  !isDark
                    ? 'bg-surface border-primary text-on-surface shadow-level-1 ring-1 ring-primary'
                    : 'bg-background border-outline text-on-surface-variant hover:border-primary'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                  !isDark ? 'bg-surface border-primary/30 text-primary' : 'bg-background border-outline text-on-surface'
                }`}>
                  <span className="material-symbols-outlined">light_mode</span>
                </div>
                <div>
                  <p className={`font-body text-sm font-semibold ${!isDark ? 'text-on-surface' : 'text-on-surface-variant'}`}>Light Mode</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-surface rounded-3xl p-6 sm:p-8 shadow-level-1 space-y-6 border border-outline">
            <div className="flex items-center justify-between pb-4 border-b border-outline">
              <div>
                <h3 className="font-display text-xl font-bold tracking-tight text-on-surface">Security</h3>
              </div>
              <span className="material-symbols-outlined text-xl text-on-surface">security</span>
            </div>

            <div className="space-y-4 font-body text-xs">
              <div className="flex items-center justify-between p-4 rounded-[12px] border bg-background border-outline shadow-level-1">
                <span className="text-on-surface-variant">Transport Layer Encryption</span>
                <span className="font-mono font-bold text-success-emerald flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-success-emerald animate-pulse"></span>
                  TLS 1.3 AES-GCM-256
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[12px] border bg-background border-outline shadow-level-1">
                <span className="text-on-surface-variant">Hardware Security Key (2FA)</span>
                <span className="font-semibold text-on-surface">FIDO2 WebAuthn Enforced</span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-[12px] border bg-background border-outline shadow-level-1">
                <span className="text-on-surface-variant">Active Session Routing</span>
                <span className="font-mono text-on-surface">10.240.89.12 (Internal Node)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
