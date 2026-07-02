import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = React.memo(function Sidebar({ currentPath, onNavigate, mobileOpen, setMobileOpen }) {
  const { isAdmin, userName, logout } = useAuth();

  const navItems = [
    {
      id: 'products',
      label: 'Product Registry',
      icon: 'inventory_2',
      path: '/products'
    },
    ...(isAdmin ? [{
      id: 'analytics',
      label: 'Analytics Engine',
      icon: 'analytics',
      path: '/analytics'
    }] : []),
    {
      id: 'settings',
      label: 'Account Settings',
      icon: 'manage_accounts',
      path: '/settings'
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <nav className={`
        fixed left-0 top-0 z-50 h-full w-64 p-6 flex flex-col justify-between
        bg-surface-container-lowest border-r border-white/10
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hexagon
                </span>
              </div>
              <div>
                <h1 className="font-headline-lg text-lg font-bold text-white leading-tight tracking-tight">Obsidian</h1>
                <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-[0.18em]">Reserve Suite</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileOpen(false)} 
              className="md:hidden text-on-surface-variant hover:text-white p-1"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="font-label-sm text-[10px] text-on-surface-variant/60 uppercase tracking-[0.2em] px-3 mb-2 font-semibold">Core Modules</p>
            {navItems.map((item) => {
              const isActive = currentPath === item.path || (item.path === '/products' && currentPath.startsWith('/products'));
              return (
                <a
                  key={item.id}
                  href={item.path}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(item.path);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-md transition-all duration-200 group ${
                    isActive
                      ? 'bg-white/10 text-white font-medium border-l-2 border-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                      : 'text-on-surface-variant font-normal hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-on-surface-variant'}`}>
                    {item.icon}
                  </span>
                  <span className="font-body text-sm tracking-wide">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 space-y-4">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-surface-container-low/60 border border-white/5">
            <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-white/20 overflow-hidden shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">admin_panel_settings</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs font-semibold text-white truncate">{userName.split(' ')[0]}</p>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
                {isAdmin ? 'Executive Admin' : 'Standard User'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-md bg-white/5 hover:bg-error-red/20 text-on-surface-variant hover:text-error-red border border-white/10 hover:border-error-red/40 transition-all duration-200 font-label-sm text-xs uppercase tracking-wider"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
});
