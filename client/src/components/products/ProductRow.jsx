import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProductRow = React.memo(function ProductRow({ product, columns, onSelectProduct, onTogglePublished }) {
  const { isAdmin } = useAuth();

  const getStockBadge = (stock) => {
    if (stock <= 0) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-error-red/10 text-error-red border border-error-red/20 font-label-sm text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-error-red shadow-[0_0_5px_#ffb4ab]"></span>
          Out of Stock
        </span>
      );
    }
    if (stock <= 15) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-warning-amber/10 text-warning-amber border border-warning-amber/20 font-label-sm text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-warning-amber shadow-[0_0_5px_#fbbf24]"></span>
          Low Stock ({stock})
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-success-emerald/10 text-success-emerald border border-success-emerald/20 font-label-sm text-[11px]">
        <span className="w-1.5 h-1.5 rounded-full bg-success-emerald shadow-[0_0_5px_#34d399]"></span>
        In Stock ({stock})
      </span>
    );
  };

  return (
    <tr 
      onClick={() => onSelectProduct(product.id)}
      className="hover:bg-white/[0.04] transition-colors group cursor-pointer border-b border-white/5 last:border-0"
    >
      {columns.map((col) => {
        if (!col.visible) return null;

        switch (col.id) {
          case 'image':
            return (
              <td key={col.id} className="py-3.5 px-5 w-20">
                <div className="w-12 h-12 rounded-lg bg-surface-container-highest border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={product.thumbnail || product.images?.[0]}
                    alt={product.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </td>
            );

          case 'title':
            return (
              <td key={col.id} className="py-3.5 px-5">
                <div className="font-body text-sm font-semibold text-white group-hover:text-primary mb-0.5 leading-snug">
                  {product.title}
                </div>
                <div className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                  SKU: OBS-{product.id + 1000} • {product.brand || 'Obsidian Corp'}
                </div>
              </td>
            );

          case 'category':
            return (
              <td key={col.id} className="py-3.5 px-5">
                <span className="inline-block px-2.5 py-1 rounded-md bg-white/5 border border-white/10 font-label-sm text-[11px] text-on-surface-variant capitalize tracking-wide">
                  {product.category}
                </span>
              </td>
            );

          case 'price':
            return (
              <td key={col.id} className="py-3.5 px-5">
                <div className="font-label-sm text-sm font-bold text-white">
                  ${product.price?.toFixed(2)}
                </div>
                {product.discountPercentage > 0 && (
                  <div className="font-label-sm text-[10px] text-success-emerald">
                    -{product.discountPercentage}% OFF
                  </div>
                )}
              </td>
            );

          case 'stockStatus':
            return (
              <td key={col.id} className="py-3.5 px-5">
                {getStockBadge(product.stock)}
              </td>
            );

          case 'rating':
            return (
              <td key={col.id} className="py-3.5 px-5">
                <div className="flex items-center gap-1.5 font-label-sm text-sm font-medium text-white">
                  <span className="material-symbols-outlined text-warning-amber text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span>{product.rating?.toFixed(1)}</span>
                </div>
              </td>
            );

          case 'status':
            return (
              <td key={col.id} className="py-3.5 px-5" onClick={(e) => e.stopPropagation()}>
                {isAdmin ? (
                  <button
                    type="button"
                    onClick={() => onTogglePublished(product.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full font-label-sm text-[11px] font-semibold border transition-all ${
                      product.published
                        ? 'bg-success-emerald/15 text-success-emerald border-success-emerald/30 hover:bg-success-emerald/25 shadow-[0_0_10px_rgba(52,211,153,0.15)]'
                        : 'bg-warning-amber/15 text-warning-amber border-warning-amber/30 hover:bg-warning-amber/25'
                    }`}
                    title="Toggle Product Visibility"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${product.published ? 'bg-success-emerald' : 'bg-warning-amber'}`}></span>
                    <span>{product.published ? 'Published' : 'Hidden / Draft'}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-success-emerald/10 text-success-emerald border border-success-emerald/20 font-label-sm text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-success-emerald"></span>
                    Published
                  </span>
                )}
              </td>
            );

          default:
            return null;
        }
      })}

      <td className="py-3.5 px-4 text-right">
        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-white transition-colors text-xl">
          chevron_right
        </span>
      </td>
    </tr>
  );
});
