import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { useTheme } from '../../context/ThemeContext';
import { useDebounce } from '../../hooks/useDebounce';

export const Navbar = React.memo(function Navbar({ currentPath, params, updateParams, setMobileOpen }) {
  const { isAdmin, userName } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { isLiveSimulation, toggleLiveSimulation, lastLiveUpdate } = useProducts();
  const [searchInput, setSearchInput] = useState(params.search || '');
  const debouncedSearch = useDebounce(searchInput, 350);

  useEffect(() => {
    setSearchInput(params.search || '');
  }, [params.search]);

  useEffect(() => {
    if (debouncedSearch !== (params.search || '')) {
      updateParams({ search: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch, params.search, updateParams]);

  const getPageTitle = () => {
    if (currentPath === '/analytics') return 'Executive Analytics Engine';
    if (currentPath === '/settings') return 'Account & Preferences';
    if (currentPath.startsWith('/products/')) return 'Product Specification';
    return 'Product Registry';
  };

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between bg-surface-dim/80 backdrop-blur-md sticky top-0 z-40 border-b border-white/10 shrink-0">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden text-on-surface-variant hover:text-white p-2 rounded-lg bg-surface-container border border-white/10"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="font-headline-lg text-lg md:text-2xl font-bold text-white tracking-tight">
            {getPageTitle()}
          </h2>
          <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider hidden sm:block">
            {isAdmin ? 'Privileged Executive Mode' : 'Standard Access Mode'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="flex items-center gap-3">
          {lastLiveUpdate && isLiveSimulation && (
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-success-emerald/10 border border-success-emerald/20 text-success-emerald font-label-sm text-[11px] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-success-emerald shadow-[0_0_8px_#34d399]"></span>
              <span>Updated: {lastLiveUpdate.title.slice(0, 15)}... ({lastLiveUpdate.oldStock} → {lastLiveUpdate.newStock})</span>
            </div>
          )}

          <button
            onClick={toggleLiveSimulation}
            title="Simulate Live Product Stock/Price Updates"
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-label-sm text-xs uppercase tracking-wider transition-all duration-200 shadow-sm ${
              isLiveSimulation
                ? isDark
                  ? 'bg-success-emerald/15 border-success-emerald text-success-emerald shadow-[0_0_15px_rgba(52,211,153,0.2)]'
                  : 'bg-white border-slate-300 text-slate-800 shadow font-semibold'
                : 'bg-surface-container border-white/15 text-on-surface-variant hover:text-white hover:border-white/30'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${isLiveSimulation ? 'bg-success-emerald animate-pulse shadow-[0_0_8px_#34d399]' : 'bg-on-surface-variant/40'}`}></span>
            <span className={`material-symbols-outlined text-[16px] ${isLiveSimulation ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="hidden sm:inline">
              {isLiveSimulation ? 'Live Feed: ON' : 'Live Feed: OFF'}
            </span>
          </button>

          <button
            onClick={toggleTheme}
            title={isDark ? 'Switch to Alabaster White Theme' : 'Switch to Obsidian Dark Theme'}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg border font-label-sm text-xs uppercase tracking-wider transition-all duration-200 shadow-sm ${
              !isDark
                ? 'bg-white border-slate-300 text-slate-800 shadow font-semibold'
                : 'bg-surface-container border-white/15 text-on-surface-variant hover:text-white hover:border-white/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {isDark ? 'light_mode' : 'dark_mode'}
            </span>
            <span className="hidden sm:inline">
              {isDark ? 'White Theme' : 'Dark Theme'}
            </span>
          </button>
        </div>

        {currentPath === '/products' && (
          <div className="relative w-48 sm:w-64 md:w-72">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
              search
            </span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Filter products..."
              className="w-full bg-surface-container-low border border-white/10 rounded-lg pl-10 pr-9 py-2 text-sm font-body text-white placeholder:text-on-surface-variant/50 focus:border-white focus:ring-1 focus:ring-white/20 outline-none transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-white"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pl-2 border-l border-white/10">
          <div className="w-9 h-9 rounded-full bg-surface-container-highest border border-white/20 overflow-hidden flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-white text-lg">person</span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="font-body text-xs font-semibold text-white leading-tight">{userName}</p>
            <span className={`inline-block font-label-sm text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 ${
              isAdmin ? 'bg-white/15 text-white border border-white/30' : 'bg-surface-container-highest text-on-surface-variant'
            }`}>
              {isAdmin ? 'ADMIN VIEW' : 'USER VIEW'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});
