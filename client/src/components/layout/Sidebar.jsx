import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = React.memo(function Sidebar({ currentPath, onNavigate, mobileOpen, setMobileOpen }) {
  const { isAdmin, userName, logout } = useAuth();

  const navItems = [
    {
      id: 'products',
      label: 'Products',
      icon: 'inventory_2',
      path: '/products'
    },
    ...(isAdmin ? [{
      id: 'analytics',
      label: 'Analytics',
      icon: 'analytics',
      path: '/analytics'
    }] : []),
    {
      id: 'settings',
      label: 'Settings',
      icon: 'manage_accounts',
      path: '/settings'
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <nav className={`
        fixed left-0 top-0 z-50 h-full w-64 p-6 flex flex-col justify-between
        bg-surface border-r border-outline
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? 'translate-x-0 shadow-level-3' : '-translate-x-full'}
      `}>
        <div>
          <div className="mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  hexagon
                </span>
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-on-surface leading-tight tracking-tight">Omega</h1>
                <p className="font-body text-[11px] text-on-surface-variant uppercase tracking-widest">Admin Suite</p>
              </div>
            </div>
            <button 
              onClick={() => setMobileOpen(false)} 
              className="text-on-surface-variant hover:text-on-surface p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <p className="font-body text-xs text-on-surface-muted uppercase tracking-widest px-3 mb-4 font-semibold">Menu</p>
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
                      ? 'bg-background text-primary font-semibold border-l-2 border-primary'
                      : 'text-on-surface-variant font-medium hover:text-on-surface hover:bg-background border-l-2 border-transparent'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] transition-transform ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {item.icon}
                  </span>
                  <span className="font-body text-[13px] uppercase tracking-widest">{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>

        <div className="pt-6 border-t border-outline space-y-4">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg bg-surface border border-outline">
            <div className="w-9 h-9 rounded-full bg-background border border-outline overflow-hidden shrink-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface-variant text-lg">admin_panel_settings</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-body text-xs font-semibold text-on-surface truncate">{userName.split(' ')[0]}</p>
              <p className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider truncate">
                {isAdmin ? 'Admin' : 'User'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              onNavigate('/');
            }}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 min-h-[44px] rounded-md bg-transparent hover:bg-error/10 text-on-surface hover:text-error border border-outline transition-all duration-200 font-body text-xs font-semibold uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-base">logout</span>
            <span>Sign Out</span>
          </button>
        </div>
      </nav>
    </>
  );
});
