import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export const DashboardLayout = React.memo(function DashboardLayout({ children, currentPath, onNavigate, params, updateParams }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col font-body selection:bg-white/20 selection:text-white">
      <Sidebar 
        currentPath={currentPath} 
        onNavigate={onNavigate}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <div className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        <Navbar 
          currentPath={currentPath} 
          params={params} 
          updateParams={updateParams}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 p-6 md:p-10 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
});
