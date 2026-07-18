import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export const ProductDetailPage = React.memo(function ProductDetailPage({ productId, onNavigate }) {
  const { products, loading } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const ref = useScrollAnimation();

  const product = useMemo(() => {
    return products.find((p) => p.id === parseInt(productId, 10));
  }, [products, productId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton w-1/3 max-w-[200px] h-12"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-outline rounded-[16px] overflow-hidden bg-surface shadow-level-1 h-[600px]">
          <div className="skeleton lg:col-span-7 h-full w-full rounded-none"></div>
          <div className="lg:col-span-5 p-8 flex flex-col space-y-6">
            <div className="skeleton w-1/3 h-6"></div>
            <div className="skeleton w-3/4 h-12 mt-2"></div>
            <div className="skeleton w-full h-8 mt-4"></div>
            <div className="skeleton w-full h-32 mt-6"></div>
            <div className="skeleton w-full h-12 mt-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-surface-container p-12 rounded-2xl text-center max-w-lg mx-auto my-12 border border-outline-variant">
        <span className="material-symbols-outlined text-4xl text-warning-amber mb-3">inventory_2</span>
        <h3 className="font-display text-2xl font-bold text-on-surface mb-2">Product Not Found</h3>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          The requested product ID (#{productId}) does not exist.
        </p>
        <button
          onClick={() => onNavigate('/products')}
          className="px-6 py-2.5 min-h-[44px] rounded-xl bg-primary text-on-primary font-body text-xs font-bold uppercase tracking-wider hover:bg-primary/90"
        >
          Return to Registry
        </button>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <div ref={ref} className="space-y-6 animate-fade-up">
      <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-surface border border-outline">
        <div className="flex items-center gap-2.5 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
          <button
            onClick={() => onNavigate('/products')}
            className="hover:text-on-surface-variant transition-colors flex items-center gap-1 font-semibold text-primary min-h-[44px]"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back</span>
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="capitalize">{product.category}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-bold truncate max-w-[200px] sm:max-w-md">{product.title}</span>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-xs font-semibold uppercase tracking-wider border ${
          product.stock > 0
            ? 'bg-surface-container text-success-emerald border-success-emerald'
            : 'bg-surface-container text-error border-error'
        }`}>
          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-success-emerald' : 'bg-error-red'}`}></span>
          <span>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-outline rounded-[16px] overflow-hidden bg-surface shadow-level-1">
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-outline bg-background">
          <div className="relative flex-1 min-h-[420px] sm:min-h-[520px] flex items-center justify-center p-8 overflow-hidden group">

            <img
              src={images[selectedImageIndex] || images[0]}
              alt={`${product.title} view ${selectedImageIndex + 1}`}
              className="w-full h-full max-h-[480px] object-contain drop-shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105 dark:border dark:border-outline dark:bg-background dark:rounded-xl"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface-container border border-outline-variant text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-all z-20 shadow-sm"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 min-h-[44px] min-w-[44px] rounded-full bg-surface-container border border-outline-variant text-on-surface flex items-center justify-center hover:bg-surface-container-highest transition-all z-20 shadow-sm"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 p-5 border-t border-outline bg-background overflow-x-auto hide-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 min-h-[44px] min-w-[44px] rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                    selectedImageIndex === idx
                      ? 'border-primary'
                      : 'border-outline-variant opacity-60 hover:opacity-100 hover:border-outline'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-10 flex flex-col justify-between space-y-10">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                SKU: OMG-{product.id + 1000}
              </span>
              <span className="font-label-sm text-xs text-primary border border-primary px-3 py-1 rounded-full">
                {product.brand || 'Omega Reserve'}
              </span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-bold text-on-surface leading-tight tracking-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline justify-between py-4 border-y border-outline mb-6">
              <div>
                <span className="font-display-xl text-3xl font-bold text-on-surface">
                  ${product.price?.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="font-label-sm text-xs text-success-emerald ml-2 font-bold">
                    (-{product.discountPercentage}%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 font-label-sm text-sm font-bold text-on-surface bg-surface-container-highest px-3 py-1.5 rounded-xl border border-outline-variant">
                <span className="material-symbols-outlined text-warning-amber text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>{product.rating?.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Description
              </h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-surface shadow-level-1 border border-outline">
                <span className="font-label-sm text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">
                  Category
                </span>
                <span className="font-body text-sm font-semibold text-on-surface capitalize">{product.category}</span>
              </div>

              <div className="p-4 rounded-xl bg-surface shadow-level-1 border border-outline">
                <span className="font-label-sm text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">
                  Availability
                </span>
                <span className="font-body text-sm font-semibold text-on-surface">{product.availabilityStatus || 'In Stock'}</span>
              </div>

              {product.weight && (
                <div className="p-4 rounded-xl bg-surface shadow-level-1 border border-outline">
                  <span className="font-label-sm text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">
                    Weight
                  </span>
                  <span className="font-body text-sm font-semibold text-on-surface">{product.weight} kg</span>
                </div>
              )}

              {product.warrantyInformation && (
                <div className="p-4 rounded-xl bg-surface shadow-level-1 border border-outline">
                  <span className="font-label-sm text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">
                    Warranty
                  </span>
                  <span className="font-body text-sm font-semibold text-on-surface truncate">{product.warrantyInformation}</span>
                </div>
              )}
            </div>
          </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                className="w-full py-4 min-h-[48px] rounded-md bg-primary text-white font-body text-xs font-bold uppercase tracking-widest hover:-translate-y-[1px] hover:shadow-md transition-all duration-200 ease-out flex items-center justify-center gap-2"
              >
                <span>Add to Cart</span>
              </button>
              <button
                onClick={() => onNavigate('/products')}
                className="w-full py-4 min-h-[48px] rounded-md bg-transparent text-on-surface font-body text-xs font-semibold uppercase tracking-widest border border-outline hover:bg-background transition-all flex items-center justify-center gap-2"
              >
                <span>Back</span>
              </button>
          </div>
        </div>
      </div>
    </div>
  );
});
