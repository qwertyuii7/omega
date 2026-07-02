import React, { Suspense, useCallback, useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductProvider } from './context/ProductContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/LoginPage';
import { useUrlParams } from './hooks/useUrlParams';

const ProductsPage = React.lazy(() =>
  import('./pages/ProductsPage').then((module) => ({ default: module.ProductsPage }))
);
const ProductDetailPage = React.lazy(() =>
  import('./pages/ProductDetailPage').then((module) => ({ default: module.ProductDetailPage }))
);
const AnalyticsPage = React.lazy(() =>
  import('./pages/AnalyticsPage').then((module) => ({ default: module.AnalyticsPage }))
);
const SettingsPage = React.lazy(() =>
  import('./pages/SettingsPage').then((module) => ({ default: module.SettingsPage }))
);

const PageLoader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
    <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
    <p className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">
      Initializing Executive Module...
    </p>
  </div>
);

function RouterContent() {
  const { isAuthenticated, logout } = useAuth();
  const [params, updateParams] = useUrlParams();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePop = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigate = useCallback((path) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => navigate('/products')} />;
  }

  const productDetailMatch = currentPath.match(/^\/products\/(\d+)$/);

  return (
    <DashboardLayout
      currentPath={currentPath}
      onNavigate={navigate}
      params={params}
      updateParams={updateParams}
    >
      <Suspense fallback={<PageLoader />}>
        {productDetailMatch ? (
          <ProductDetailPage productId={productDetailMatch[1]} onNavigate={navigate} />
        ) : currentPath === '/analytics' ? (
          <AnalyticsPage onNavigate={navigate} />
        ) : currentPath === '/settings' ? (
          <SettingsPage onNavigate={navigate} onLogout={handleLogout} />
        ) : (
          <ProductsPage params={params} updateParams={updateParams} onNavigate={navigate} />
        )}
      </Suspense>
    </DashboardLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ProductProvider>
          <RouterContent />
        </ProductProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
