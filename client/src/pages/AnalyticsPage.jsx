import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { useTheme } from '../context/ThemeContext';

export const AnalyticsPage = React.memo(function AnalyticsPage({ onNavigate }) {
  const { isAdmin } = useAuth();
  const { isDark } = useTheme();
  const { products, loading } = useProducts();
  const [selectedTimeframe, setSelectedTimeframe] = useState('Q3');

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
    link.setAttribute('download', `Obsidian_Executive_Audit_${selectedTimeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [analyticsData, selectedTimeframe]);

  if (!isAdmin) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto my-12 border-error-red/40">
        <span className="material-symbols-outlined text-5xl text-error-red mb-3">gpp_maybe</span>
        <h3 className="font-headline-lg text-xl font-bold text-white mb-2">Restricted Access Protocol</h3>
        <p className="font-body text-sm text-on-surface-variant mb-6 leading-relaxed">
          The Executive Analytics Engine is restricted to Administrator clearance levels. Standard profiles are restricted to Product Registry inspection only.
        </p>
        <button
          onClick={() => onNavigate('/products')}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">Calculating Analytics Engine Metrics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display-xl text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Executive Analytics Engine
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Real-time valuation matrices, risk distribution telemetry, and highest-yielding asset rankings across all active inventory reserves.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-base">download</span>
          <span>Export Audit Report</span>
        </button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-low subtle-border rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all shadow-lg">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Total Products</p>
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">inventory_2</span>
            </div>
          </div>
          <div>
            <h3 className="font-display-xl text-3xl font-bold text-white leading-tight">
              {analyticsData.totalProducts}
            </h3>
            <p className="font-label-sm text-[11px] text-success-emerald mt-1.5 flex items-center tracking-wide">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span> Active Registry Modules
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low subtle-border rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all shadow-lg">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Average Rating</p>
            <div className="w-9 h-9 rounded-lg bg-warning-amber/10 border border-warning-amber/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-warning-amber text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            </div>
          </div>
          <div>
            <h3 className="font-display-xl text-3xl font-bold text-white leading-tight">
              {analyticsData.averageRating.toFixed(2)} <span className="text-sm font-normal text-on-surface-variant">/ 5.0</span>
            </h3>
            <p className="font-label-sm text-[11px] text-success-emerald mt-1.5 flex items-center tracking-wide">
              <span className="material-symbols-outlined text-sm mr-1">verified</span> High Satisfaction Cluster
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low subtle-border rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all shadow-lg">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Inventory Valuation</p>
            <div className="w-9 h-9 rounded-lg bg-success-emerald/10 border border-success-emerald/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-success-emerald text-lg">account_balance_wallet</span>
            </div>
          </div>
          <div>
            <h3 className="font-display-xl text-3xl font-bold text-white leading-tight">
              ${(analyticsData.totalValue / 1000).toFixed(1)}k
            </h3>
            <p className="font-label-sm text-[11px] text-on-surface-variant mt-1.5 flex items-center tracking-wide">
              <span>Total MSRP × Units in Stock</span>
            </p>
          </div>
        </div>

        <div className="bg-surface-container-low subtle-border rounded-2xl p-6 flex flex-col justify-between h-40 hover:border-white/20 transition-all shadow-lg">
          <div className="flex justify-between items-start">
            <p className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">Category Segments</p>
            <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-lg">category</span>
            </div>
          </div>
          <div>
            <h3 className="font-display-xl text-3xl font-bold text-white leading-tight">
              {analyticsData.categoryDistribution.length}
            </h3>
            <p className="font-label-sm text-[11px] text-primary mt-1.5 flex items-center tracking-wide">
              <span>Diverse Product Ecosystem</span>
            </p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-7 bg-surface-container-low subtle-border rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h3 className="font-headline-lg text-xl font-bold text-white tracking-tight">Valuation & Growth Trajectory</h3>
              <p className="font-body text-xs text-on-surface-variant mt-1">Interactive Telemetry & Asset Projection</p>
            </div>
            <div className="flex rounded-lg bg-surface-container p-1 border border-white/10 font-label-sm text-xs">
              {['Q1', 'Q2', 'Q3', 'Q4', '1Y'].map((tf) => (
                <button
                  key={tf}
                  onClick={() => setSelectedTimeframe(tf)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    selectedTimeframe === tf
                      ? 'bg-white text-black font-bold shadow'
                      : 'text-on-surface-variant hover:text-white'
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

          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-center sm:text-left">
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">Asset Velocity</span>
              <span className="font-body text-sm font-bold text-white">{trajectoryPoints.velocity}</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">Turnover Efficiency</span>
              <span className="font-body text-sm font-bold text-white">{trajectoryPoints.turnover}</span>
            </div>
            <div>
              <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">System Reliability</span>
              <span className="font-body text-sm font-bold text-success-emerald">100% Nominal</span>
            </div>
          </div>
        </div>

        <div className="xl:col-span-5 bg-surface-container-low subtle-border rounded-3xl p-8 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-headline-lg text-lg font-bold text-white tracking-tight">Category Allocation</h3>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">Valuation breakdown by market sector</p>
            </div>
            <span className="material-symbols-outlined text-white text-xl">pie_chart</span>
          </div>

          <div className="space-y-4 flex-1 max-h-[340px] overflow-y-auto pr-2 hide-scrollbar">
            {analyticsData.categoryDistribution.map((item, idx) => (
              <div key={item.category} className="space-y-1.5 p-3 rounded-xl bg-surface-container/50 border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-body font-semibold text-white capitalize">{item.category}</span>
                  <div className="flex items-center gap-3 font-label-sm">
                    <span className="text-on-surface-variant">{item.count} units</span>
                    <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">{item.percentage}%</span>
                  </div>
                </div>

                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      idx === 0
                        ? (isDark ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.4)]' : 'bg-[#0f172a] shadow-[0_0_10px_rgba(15,23,42,0.4)]')
                        : idx === 1
                        ? (isDark ? 'bg-white/80' : 'bg-[#0f172a]/80')
                        : idx === 2
                        ? (isDark ? 'bg-white/60' : 'bg-[#0f172a]/60')
                        : (isDark ? 'bg-white/40' : 'bg-[#0f172a]/40')
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
        <div className="lg:col-span-8 bg-surface-container-low subtle-border rounded-3xl p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
            <div>
              <h3 className="font-headline-lg text-lg font-bold text-white tracking-tight">Top Yielding Assets</h3>
              <p className="font-body text-xs text-on-surface-variant mt-0.5">Highest capital valuation contributors across registry</p>
            </div>
            <span className="material-symbols-outlined text-white text-xl">workspace_premium</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest">
                  <th className="py-3 px-3">Rank</th>
                  <th className="py-3 px-4">Asset Identification</th>
                  <th className="py-3 px-4">Unit MSRP</th>
                  <th className="py-3 px-4">Reserve Count</th>
                  <th className="py-3 px-4 text-right">Total Valuation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {analyticsData.topProducts.map((p, idx) => {
                  const contribution = ((p.totalValuation / (analyticsData.totalValue || 1)) * 100).toFixed(1);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => onNavigate(`/products/${p.id}`)}
                      className="hover:bg-white/[0.04] transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-3 font-label-sm text-xs font-bold text-white">
                        #{idx + 1}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail || p.images?.[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-lg object-cover bg-surface-container border border-white/10 shrink-0"
                          />
                          <div>
                            <p className="font-body text-sm font-semibold text-white group-hover:text-primary leading-snug">
                              {p.title}
                            </p>
                            <span className="font-label-sm text-[10px] text-on-surface-variant capitalize">
                              {p.category} • Share: {contribution}%
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm text-white">
                        ${p.price?.toFixed(2)}
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm text-on-surface-variant">
                        {p.stock} units
                      </td>
                      <td className="py-4 px-4 font-label-sm text-sm font-bold text-white text-right">
                        ${(p.totalValuation).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-4 bg-surface-container-low subtle-border rounded-3xl p-8 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h3 className="font-headline-lg text-lg font-bold text-white tracking-tight">Reserve Risk Matrix</h3>
                <p className="font-body text-xs text-on-surface-variant mt-0.5">Inventory stock health telemetry</p>
              </div>
              <span className="material-symbols-outlined text-white text-xl">health_and_safety</span>
            </div>

            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-success-emerald/10 border border-success-emerald/20 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-success-emerald block font-bold">Nominal Reserves</span>
                  <span className="font-body text-xs text-on-surface-variant">Units operating well above buffer</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-success-emerald">
                  {analyticsData.stockHealth.nominal}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-warning-amber/10 border border-warning-amber/20 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-warning-amber block font-bold">Low Reserve Alert</span>
                  <span className="font-body text-xs text-on-surface-variant">Stock units below 15 threshold</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-warning-amber">
                  {analyticsData.stockHealth.lowStock}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-error-red/10 border border-error-red/20 flex items-center justify-between">
                <div>
                  <span className="font-label-sm text-[10px] uppercase tracking-wider text-error-red block font-bold">Critical Stockout</span>
                  <span className="font-body text-xs text-on-surface-variant">Depleted inventory lines</span>
                </div>
                <span className="font-display-xl text-2xl font-bold text-error-red">
                  {analyticsData.stockHealth.outOfStock}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 text-center">
            <p className="font-label-sm text-[11px] text-on-surface-variant/80">
              Automated reorder protocols trigger at 10 unit threshold.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
});

