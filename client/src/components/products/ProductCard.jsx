import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

export const ProductCard = React.memo(function ProductCard({ product, onSelectProduct, onTogglePublished }) {
  const { isAdmin } = useAuth();
  const ref = useScrollAnimation();

  return (
    <div
      ref={ref}
      onClick={() => onSelectProduct(product.id)}
      className="animate-fade-up bg-surface rounded-2xl p-5 border border-outline transition-all duration-300 flex flex-col justify-between group cursor-pointer shadow-level-1 hover:-translate-y-[2px] hover:shadow-level-2"
    >
      <div>
        <div className="relative aspect-[3/4] rounded-xl bg-background overflow-hidden mb-4 border border-transparent dark:border-outline">
          <img
            src={product.thumbnail || product.images?.[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          />
          <div className="absolute top-2.5 left-2.5">
            <span className="px-2.5 py-1 rounded-md bg-surface border border-outline-variant font-label-sm text-[10px] text-on-surface uppercase tracking-wider">
              {product.category}
            </span>
          </div>

          <div className="absolute top-2.5 right-2.5" onClick={(e) => e.stopPropagation()}>
            {isAdmin ? (
              <button
                type="button"
                onClick={() => onTogglePublished(product.id)}
                className={`px-3 py-1 min-h-[44px] rounded-md font-label-sm text-[10px] uppercase font-bold border ${
                  product.published
                    ? 'bg-surface-container text-success-emerald border-success-emerald'
                    : 'bg-surface-container text-warning-amber border-warning-amber'
                }`}
              >
                {product.published ? 'Published' : 'Hidden'}
              </button>
            ) : null}
          </div>
        </div>

        <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">
          SKU: OMG-{product.id + 1000}
        </div>
        <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary leading-snug line-clamp-1 mb-2">
          {product.title}
        </h3>
        <p className="font-body text-xs text-on-surface-variant line-clamp-2 mb-4">
          {product.description}
        </p>
      </div>

      <div className="pt-3 border-t border-outline flex items-center justify-between">
        <div>
          <span className="font-body text-base font-bold text-primary">
            ${product.price?.toFixed(2)}
          </span>
          <div className="font-label-sm text-[10px] text-on-surface-variant">
            Stock: {product.stock} units
          </div>
        </div>

        <div className="flex items-center gap-1 font-label-sm text-xs font-semibold text-on-surface bg-surface-container-highest px-2.5 py-1 rounded-lg border border-outline-variant">
          <span className="material-symbols-outlined text-warning-amber text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
            star
          </span>
          <span>{product.rating?.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
});
