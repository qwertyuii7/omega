import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const AnalyticsPage = React.memo(function AnalyticsPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();
  const { products, loading } = useProducts();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Q3');
  const ref = useScrollAnimation();

  const analyticsData = useMemo(() => {
    if (!products || products.length === 0) {
      return {
        totalProducts: 0,
        averageRating: 0,
        totalValue: 0,
        categoryDistribution: [],
        topProducts: [],
        stockHealth: { nominal: 0, lowStock: 0, outOfStock: 0 }
      };
    }

    let totalValueSum = 0;
    let totalRatingSum = 0;
    let nominalCount = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    const categoryCountMap = {};
    const categoryValueMap = {};

    products.forEach((p) => {
      const price = p.price || 0;
      const stock = p.stock || 0;
      const rating = p.rating || 0;
      const cat = p.category || 'Uncategorized';

      const inventoryValue = price * stock;
      totalValueSum += inventoryValue;
      totalRatingSum += rating;

      if (stock === 0) {
        outOfStockCount += 1;
      } else if (stock <= 15) {
        lowStockCount += 1;
      } else {
        nominalCount += 1;
      }

      categoryCountMap[cat] = (categoryCountMap[cat] || 0) + 1;
      categoryValueMap[cat] = (categoryValueMap[cat] || 0) + inventoryValue;
    });

    const averageRating = totalRatingSum / products.length;

    const categoryDistribution = Object.entries(categoryCountMap)
      .map(([category, count]) => {
        const percentage = Math.round((count / products.length) * 100);
        const val = categoryValueMap[category];
        return { category, count, percentage, value: val };
      })
      .sort((a, b) => b.count - a.count);

    const topProducts = [...products]
      .map((p) => ({
        ...p,
        totalValuation: (p.price || 0) * (p.stock || 0)
      }))
      .sort((a, b) => b.totalValuation - a.totalValuation)
      .slice(0, 5);

    return {
      totalProducts: products.length,
      averageRating,
      totalValue: totalValueSum,
      categoryDistribution,
      topProducts,
      stockHealth: {
        nominal: nominalCount,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      }
    };
  }, [products]);

  const trajectoryPoints = useMemo(() => {
    switch (selectedTimeframe) {
      case 'Q1':
        return { path: 'M0 170 Q 200 140, 400 150 T 600 110 T 800 80', velocity: '+8.2% QoQ', turnover: '88.4%' };
      case 'Q2':
        return { path: 'M0 150 Q 200 120, 400 100 T 600 90 T 800 50', velocity: '+12.7% QoQ', turnover: '91.1%' };
      case 'Q4':
        return { path: 'M0 140 Q 200 90, 400 60 T 600 40 T 800 15', velocity: '+24.1% QoQ', turnover: '97.8%' };
      case '1Y':
        return { path: 'M0 180 Q 200 130, 400 90 T 600 50 T 800 10', velocity: '+42.6% YoY', turnover: '96.5%' };
      case 'Q3':
      default:
        return { path: 'M0 160 Q 150 80, 300 130 T 550 60 T 800 20', velocity: '+18.4% QoQ', turnover: '94.2%' };
    }
  }, [selectedTimeframe]);

  const handleExportCSV = useCallback(() => {
    if (!analyticsData || analyticsData.totalProducts === 0) return;

    const headers = ['Category', 'Unit Count', 'Market Share (%)', 'Total Valuation ($)'];
    const rows = analyticsData.categoryDistribution.map((item) => [
      item.category,
      item.count,
      item.percentage,
      item.value.toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Omega_Executive_Audit_${selectedTimeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [analyticsData, selectedTimeframe]);

    if (!isAdmin) {
      return (
        <div className="bg-surface-container p-12 rounded-2xl text-center max-w-lg mx-auto my-12 border border-error">
          <span className="material-symbols-outlined text-5xl text-error mb-3">gpp_maybe</span>
          <h3 className="font-headline-lg text-xl font-bold text-on-surface mb-2">Restricted Access Protocol</h3>
          <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
            The Executive Analytics Engine is restricted to Administrator clearance levels. Standard profiles are restricted to Product Registry inspection only.
          </p>
          <button
            onClick={() => onNavigate('/products')}
            className="px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-on-primary font-body text-xs font-bold uppercase tracking-wider hover:bg-primary/90 shadow-sm"
          >
            Return to Registry
          </button>
        </div>
      );
    }
  
    if (loading) {
      return (
        <div className="space-y-8">
          <div className="skeleton w-1/3 h-12 mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-40 w-full rounded-2xl"></div>)}
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="skeleton xl:col-span-7 h-96 rounded-3xl"></div>
            <div className="skeleton xl:col-span-5 h-96 rounded-3xl"></div>
          </div>
        </div>
      );
    }

  return (
    <div ref={ref} className="space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-on-surface tracking-tight mb-2">
            Analytics
          </h1>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-xl bg-primary text-on-primary font-body text-xs font-bold uppercase tracking-wider hover:bg-primary/90 shadow-sm transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export</span>
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface rounded-2xl p-6 flex flex-col justify-between h-40 border border-outline transition-all shadow-level-1">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Total Products</p>
            <div className="w-9 h-9 rounded-lg bg-surface border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-lg">inventory_2</span>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-on-surface leading-tight">
              {analyticsData.totalProducts}
            </h3>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 flex flex-col justify-between h-40 border border-outline transition-all shadow-level-1">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Average Rating</p>
            <div className="w-9 h-9 rounded-lg bg-surface border border-warning-amber flex items-center justify-center">
              <span className="material-symbols-outlined text-warning-amber text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-on-surface leading-tight">
              {analyticsData.averageRating.toFixed(2)} <span className="text-sm font-normal text-on-surface-variant">/ 5.0</span>
            </h3>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 flex flex-col justify-between h-40 border border-outline transition-all shadow-level-1">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Inventory Valuation</p>
            <div className="w-9 h-9 rounded-lg bg-surface border border-success-emerald flex items-center justify-center">
              <span className="material-symbols-outlined text-success-emerald text-lg">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-on-surface leading-tight">
              ${(analyticsData.totalValue / 1000).toFixed(1)}k
            </h3>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-6 flex flex-col justify-between h-40 border border-outline transition-all shadow-level-1">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Category Segments</p>
            <div className="w-9 h-9 rounded-lg bg-surface border border-outline flex items-center justify-center">
              <span className="material-symbols-outlined text-on-surface text-lg">category</span>
            </div>
          </div>
          <div>
            <h3 className="font-display text-3xl font-bold text-on-surface leading-tight">
              {analyticsData.categoryDistribution.length}
            </h3>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-surface border border-outline rounded-3xl p-8 flex flex-col justify-between shadow-level-1">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">Growth Trajectory</h3>
            </div>
            <div className="flex rounded-lg bg-surface-container p-1 border border-outline-variant font-label-sm text-xs">
              {['Q1', 'Q2', 'Q3', 'Q4', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 min-h-[44px] rounded-md transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-primary text-on-primary font-bold shadow'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full h-64 sm:h-72 relative flex items-center justify-center my-4">
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 200">
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={isDark ? "rgba(255, 255, 255, 0.25)" : "rgba(15, 23, 42, 0.22)"} />
                  <stop offset="100%" stopColor={isDark ? "rgba(255, 255, 255, 0)" : "rgba(15, 23, 42, 0)"} />
                </linearGradient>
              </defs>
              <path className="fill-[url(#chartGradient)] transition-all duration-700" d={`${trajectoryPoints.path} L800 200 L0 200 Z`} />
              <path
                className={`fill-none stroke-[3.5] transition-all duration-700 ${
                  isDark
                    ? 'stroke-white drop-shadow-[0_4px_12px_rgba(255,255,255,0.4)]'
                    : 'stroke-[#0f172a] drop-shadow-[0_4px_12px_rgba(15,23,42,0.35)]'
                }`}
                d={trajectoryPoints.path}
              />
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-outline-variant text-center sm:text-left">
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">Asset Velocity</span>
              <span className="font-body text-sm font-bold text-on-surface">{trajectoryPoints.velocity}</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">Turnover Efficiency</span>
              <span className="font-body text-sm font-bold text-on-surface">{trajectoryPoints.turnover}</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">System Reliability</span>
              <span className="font-body text-sm font-bold text-success-emerald">100% Nominal</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 bg-surface border border-outline rounded-3xl p-8 flex flex-col shadow-level-1">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline">
            <div>
              <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">Categories</h3>
            </div>
            <span className="material-symbols-outlined text-on-surface text-xl">pie_chart</span>
          </div>

          <div className="space-y-4 flex-1 max-h-[340px] overflow-y-auto pr-2 hide-scrollbar">
            {analyticsData.categoryDistribution.map((item, idx) => (
              <div key={item.category} className="space-y-1.5 p-3 rounded-xl bg-surface-container-low border border-outline-variant">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body font-semibold text-on-surface capitalize">{item.category}</span>
                  <div className="flex items-center gap-3 font-label-sm">
                    <span className="text-on-surface-variant">{item.count} units</span>
                    <span className="text-on-surface font-bold bg-surface-container-highest px-2 py-0.5 rounded">{item.percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0
                        ? 'bg-primary'
                        : idx === 1
                        ? 'bg-primary/80'
                        : idx === 2
                        ? 'bg-primary/60'
                        : 'bg-primary/40'
                    }`}
                    style={{ width: `${Math.max(8, item.percentage)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] font-label-sm text-on-surface-variant/70 pt-0.5">
                  <span>Sector Share</span>
                  <span>Est. Val: ${(item.value / 1000).toFixed(1)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-surface border border-outline rounded-3xl p-8 shadow-level-1">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline">
            <div>
              <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">Top Assets</h3>
            </div>
            <span className="material-symbols-outlined text-on-surface text-xl">workspace_premium</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-4">Asset Identification</th>
                  <th className="py-3 px-4">Unit MSRP</th>
                  <th className="py-3 px-4">Reserve Count</th>
                  <th className="py-3 px-4 text-right">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {analyticsData.topProducts.map((p, idx) => {
                  const contribution = ((p.totalValuation / (analyticsData.totalValue || 1)) * 100).toFixed(1);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onNavigate(`/products/${p.id}`)}
                      className="hover:bg-surface-container-highest transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-3 font-label-sm text-xs font-bold text-on-surface">
                        #{idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail || p.images?.[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-surface-container border border-outline-variant shrink-0"
                          />
                          <div>
                            <p className="font-body text-sm font-semibold text-on-surface group-hover:text-primary leading-snug">
                              {p.title}
                            </p>
                            <span className="font-label-sm text-[10px] text-on-surface-variant capitalize">
                              {p.category} • Share: {contribution}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm text-on-surface">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm text-on-surface-variant">
                        {p.stock} units
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm font-bold text-on-surface text-right">
                        ${(p.totalValuation).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface border border-outline rounded-3xl p-8 flex flex-col justify-between shadow-level-1">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-outline">
              <div>
                <h3 className="font-display text-2xl font-bold text-on-surface tracking-tight">Stock Health</h3>
              </div>
              <span className="material-symbols-outlined text-on-surface text-xl">health_and_safety</span>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-surface-container border border-success-emerald flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-success-emerald block font-bold">In Stock</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-success-emerald">
                  {analyticsData.stockHealth.nominal}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container border border-warning-amber flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-warning-amber block font-bold">Low Stock</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-warning-amber">
                  {analyticsData.stockHealth.lowStock}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-surface-container border border-error flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-error block font-bold">Out of Stock</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-error">
                  {analyticsData.stockHealth.outOfStock}
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
});

