import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const ProductCard = React.memo(function ProductCard({ product, onSelectProduct, onTogglePublished }) {
  const { isAdmin } = useAuth();

  return (
    <div
      onClick={() => onSelectProduct(product.id)}
      className="glass-panel rounded-2xl p-5 border border-white/10 hover:border-white/25 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:shadow-[0_12px_24px_rgba(0,0,0,0.4)]"
    >
      <div>
        <div className="relative h-44 rounded-xl bg-surface-container-highest overflow-hidden mb-4 border border-white/5">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-white/10 font-label-sm text-[10px] text-white uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onTogglePublished(product.id)}
                className={`px-2 py-0.5 rounded-md font-label-sm text-[10px] uppercase font-bold border backdrop-blur-md ${
                  product.published
                    ? 'bg-success-emerald/20 text-success-emerald border-success-emerald/40'
                    : 'bg-warning-amber/20 text-warning-amber border-warning-amber/40'
                }`}
              >
                {product.published ? 'Published' : 'Hidden'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
          SKU: OBS-{product.id + 1000}
        </div>
        <h3 className="font-body text-base font-bold text-white group-hover:text-primary leading-snug line-clamp-1 mb-2">
          {product.title}
        </h3>
        <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>

      <div className="pt-3 border-t border-white/10 flex items-center justify-between">
        <div>
          <span className="font-label-sm text-base font-bold text-white">
            ${product.price?.toFixed(2)}
          </span>
          <div className="font-label-sm text-[10px] text-on-surface-variant">
            Stock: {product.stock} units
          </div>
        </div>

        <div className="flex items-center gap-1 font-label-sm text-xs font-semibold text-white bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
          <span className="material-symbols-outlined text-warning-amber text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span>{product.rating?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
});
