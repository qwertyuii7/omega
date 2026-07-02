import React, { useState, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { ProductRow } from '../components/products/ProductRow';
import { ProductCard } from '../components/products/ProductCard';
import { ColumnCustomizer } from '../components/products/ColumnCustomizer';

export const ProductsPage = React.memo(function ProductsPage({ params, updateParams, onNavigate }) {
  const { isAdmin } = useAuth();
  const {
    products,
    loading,
    error,
    categories,
    columns,
    toggleProductPublished,
    toggleColumnVisibility,
    moveColumn,
    resetColumns
  } = useProducts();

  const [showColumnModal, setShowColumnModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!isAdmin && !p.published) return false;

      if (params.category && params.category !== 'all' && p.category !== params.category) {
        return false;
      }

      if (params.search) {
        const query = params.search.toLowerCase();
        const matchesTitle = p.title?.toLowerCase().includes(query);
        const matchesBrand = p.brand?.toLowerCase().includes(query);
        const matchesDesc = p.description?.toLowerCase().includes(query);
        const matchesCategory = p.category?.toLowerCase().includes(query);
        if (!matchesTitle && !matchesBrand && !matchesDesc && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (!params.sort || params.sort === 'none') return 0;
      const orderMultiplier = params.order === 'desc' ? -1 : 1;

      if (params.sort === 'price') {
        return (a.price - b.price) * orderMultiplier;
      }
      if (params.sort === 'rating') {
        return (a.rating - b.rating) * orderMultiplier;
      }
      if (params.sort === 'name') {
        return a.title.localeCompare(b.title) * orderMultiplier;
      }
      return 0;
    });
  }, [products, isAdmin, params.category, params.search, params.sort, params.order]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  }, [filteredProducts.length, itemsPerPage]);

  const currentPage = useMemo(() => {
    return Math.min(totalPages, Math.max(1, params.page || 1));
  }, [totalPages, params.page]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleSelectProduct = useCallback((id) => {
    onNavigate(`/products/${id}`);
  }, [onNavigate]);

  const handleCategoryChange = useCallback((cat) => {
    updateParams({ category: cat, page: 1 });
  }, [updateParams]);

  const handleSortChange = useCallback((sortBy) => {
    if (params.sort === sortBy) {
      updateParams({ order: params.order === 'asc' ? 'desc' : 'asc', page: 1 });
    } else {
      updateParams({ sort: sortBy, order: 'asc', page: 1 });
    }
  }, [params.sort, params.order, updateParams]);

  const handlePageChange = useCallback((newPage) => {
    updateParams({ page: newPage });
  }, [updateParams]);

  const handleViewChange = useCallback((newView) => {
    updateParams({ view: newView });
  }, [updateParams]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">Loading Product Registry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-panel p-8 rounded-2xl text-center max-w-lg mx-auto my-12 border-error-red/40">
        <span className="material-symbols-outlined text-4xl text-error-red mb-3">error</span>
        <h3 className="font-headline-lg text-lg font-bold text-white mb-2">Registry Connection Error</h3>
        <p className="font-body text-sm text-on-surface-variant mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="font-display-xl text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
            Product Registry
          </h1>
          <p className="font-body text-sm text-on-surface-variant max-w-2xl leading-relaxed">
            Comprehensive overview of active inventory, strategic positioning, and specifications. Utilize advanced multi-category filtering, sorting, and customizable schemas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowColumnModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container border border-white/10 hover:border-white/30 text-white font-label-sm text-xs transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-base">view_column</span>
            <span>Columns</span>
          </button>

          <div className="flex rounded-xl bg-surface-container p-1 border border-white/10">
            <button
              onClick={() => handleViewChange('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-sm text-xs transition-colors ${
                params.view !== 'grid' ? 'bg-white text-black font-semibold shadow' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">table_rows</span>
              <span>Table</span>
            </button>
            <button
              onClick={() => handleViewChange('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-sm text-xs transition-colors ${
                params.view === 'grid' ? 'bg-white text-black font-semibold shadow' : 'text-on-surface-variant hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-base">grid_view</span>
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      <div className="border border-white/10 rounded-2xl p-4 bg-surface-container-lowest/60 backdrop-blur-md space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            <button
              onClick={() => handleCategoryChange('all')}
              className={`whitespace-nowrap px-4 py-2 rounded-xl font-label-sm text-xs border transition-all ${
                (!params.category || params.category === 'all')
                  ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                  : 'bg-surface-container-high border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
              }`}
            >
              All Categories ({products.length})
            </button>
            {categories.slice(0, 8).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`whitespace-nowrap px-3.5 py-2 rounded-xl font-label-sm text-xs capitalize border transition-all ${
                  params.category === cat
                    ? 'bg-white text-black font-bold border-white shadow-[0_0_15px_rgba(255,255,255,0.15)]'
                    : 'bg-transparent border-white/10 text-on-surface-variant hover:text-white hover:bg-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider hidden sm:inline">Sort By:</span>
            {[
              { id: 'price', label: 'Price' },
              { id: 'rating', label: 'Rating' },
              { id: 'name', label: 'Name' }
            ].map((s) => {
              const isSelected = params.sort === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSortChange(s.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-label-sm text-xs border transition-all ${
                    isSelected
                      ? 'bg-white/15 text-white border-white shadow-[0_0_10px_rgba(255,255,255,0.1)] font-semibold'
                      : 'bg-surface-container border-white/10 text-on-surface-variant hover:text-white'
                  }`}
                >
                  <span>{s.label}</span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm">
                      {params.order === 'desc' ? 'arrow_downward' : 'arrow_upward'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {(params.category !== 'all' || params.search || params.sort !== 'none') && (
          <div className="pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-label-sm">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-on-surface-variant">Active Filters:</span>
              {params.search && (
                <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-white flex items-center gap-1.5">
                  Search: "{params.search}"
                </span>
              )}
              {params.category !== 'all' && (
                <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-white capitalize flex items-center gap-1.5">
                  Category: {params.category}
                </span>
              )}
              {params.sort !== 'none' && (
                <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/30 text-white capitalize flex items-center gap-1.5">
                  Sort: {params.sort} ({params.order.toUpperCase()})
                </span>
              )}
            </div>
            <button
              onClick={() => updateParams({ search: '', category: 'all', sort: 'none', order: 'asc', page: 1 })}
              className="text-error-red hover:underline font-semibold"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass-panel p-16 rounded-2xl text-center max-w-xl mx-auto border border-white/10 my-8">
          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">search_off</span>
          <h3 className="font-headline-lg text-lg font-bold text-white mb-2">No Matching Products Found</h3>
          <p className="font-body text-sm text-on-surface-variant mb-6">
            We couldn't find any products matching your active search queries or category filters.
          </p>
          <button
            onClick={() => updateParams({ search: '', category: 'all', sort: 'none', page: 1 })}
            className="px-6 py-2.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90"
          >
            Clear Filters
          </button>
        </div>
      ) : params.view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelectProduct={handleSelectProduct}
              onTogglePublished={toggleProductPublished}
            />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-surface-container-lowest/50 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface-container-low/60">
                  {columns.map((col) => {
                    if (!col.visible) return null;
                    return (
                      <th
                        key={col.id}
                        className={`py-4 px-5 font-label-sm text-[11px] text-on-surface-variant uppercase tracking-widest font-semibold ${
                          col.id === 'image' ? 'w-20' : ''
                        }`}
                      >
                        {col.label}
                      </th>
                    );
                  })}
                  <th className="py-4 px-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedProducts.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    columns={columns}
                    onSelectProduct={handleSelectProduct}
                    onTogglePublished={toggleProductPublished}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
        <div className="font-body text-xs text-on-surface-variant">
          Showing <span className="font-bold text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-bold text-white">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> of{' '}
          <span className="font-bold text-white">{filteredProducts.length}</span> entries
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-xl bg-surface-container border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>

          <div className="flex items-center gap-1.5 px-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
              .map((page, idx, arr) => {
                const prevPage = arr[idx - 1];
                return (
                  <React.Fragment key={page}>
                    {prevPage && page - prevPage > 1 && (
                      <span className="text-on-surface-variant px-1 font-label-sm">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(page)}
                      className={`w-9 h-9 rounded-xl font-label-sm text-xs font-bold transition-all ${
                        page === currentPage
                          ? 'bg-white text-black shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                          : 'bg-surface-container border border-white/10 text-on-surface-variant hover:text-white hover:border-white/20'
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-xl bg-surface-container border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      {showColumnModal && (
        <ColumnCustomizer
          columns={columns}
          toggleColumnVisibility={toggleColumnVisibility}
          moveColumn={moveColumn}
          resetColumns={resetColumns}
          onClose={() => setShowColumnModal(false)}
        />
      )}
    </div>
  );
});
