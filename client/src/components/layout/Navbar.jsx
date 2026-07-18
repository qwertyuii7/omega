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
    if (currentPath === '/analytics') return 'Analytics';
    if (currentPath === '/settings') return 'Settings';
    if (currentPath.startsWith('/products/')) return 'Product Detail';
    return 'Products';
  };

  return (
    <header className="h-20 px-6 md:px-10 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline shrink-0">
      <div className="flex items-center gap-4 md:gap-8">
        <button 
          onClick={() => setMobileOpen(true)}
          className="text-on-surface-variant hover:text-on-surface p-2 rounded-lg border border-outline min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors hover:bg-background"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>

        <div>
          <h2 className="font-display text-lg md:text-2xl font-semibold text-on-surface">
            {getPageTitle()}
          </h2>
          <p className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider hidden sm:block">
            {isAdmin ? 'Admin View' : 'User View'}
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
            className={`flex items-center gap-2 px-3.5 py-2 min-h-[44px] rounded-md border font-label-sm text-xs uppercase tracking-widest transition-all duration-200 shadow-sm ${
              isLiveSimulation
                ? 'bg-success-emerald/15 border-success-emerald/30 text-success-emerald'
                : 'bg-transparent border-outline text-on-surface-variant hover:text-on-surface hover:border-outline-variant'
            }`}
          >
            <span className={`w-2 h-2 rounded-full shrink-0 ${isLiveSimulation ? 'bg-success-emerald animate-pulse' : 'bg-on-surface-variant/40'}`}></span>
            <span className={`material-symbols-outlined text-[16px] ${isLiveSimulation ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span className="hidden sm:inline">
              {isLiveSimulation ? 'Live Feed: ON' : 'Live Feed: OFF'}
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
              className="w-full bg-surface border border-outline rounded-md pl-10 pr-9 py-2 min-h-[44px] text-sm font-body text-on-surface placeholder:text-on-surface-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="text-on-surface-variant hover:text-on-surface p-2 rounded-full hover:bg-surface-container-highest transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <span className="material-symbols-outlined text-[22px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-outline">
          <div className="w-9 h-9 rounded-full bg-surface border border-outline overflow-hidden flex items-center justify-center">
            <span className="material-symbols-outlined text-on-surface text-lg">person</span>
          </div>
          <div className="hidden lg:block text-left">
            <p className="font-body text-xs font-semibold text-on-surface leading-tight">{userName}</p>
            <span className={`inline-block font-label-sm text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded mt-0.5 ${
              isAdmin ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-background text-on-surface-variant'
            }`}>
              {isAdmin ? 'ADMIN' : 'USER'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
});
