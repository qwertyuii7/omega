import React, { useState, useMemo } from 'react';
import { useProducts } from '../context/ProductContext';

export const ProductDetailPage = React.memo(function ProductDetailPage({ productId, onNavigate }) {
  const { products, loading } = useProducts();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const product = useMemo(() => {
    return products.find((p) => p.id === parseInt(productId, 10));
  }, [products, productId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
        <p className="font-label-sm text-sm text-on-surface-variant uppercase tracking-widest">Loading Product Details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="glass-panel p-12 rounded-2xl text-center max-w-lg mx-auto my-12 border border-white/10">
        <span className="material-symbols-outlined text-4xl text-warning-amber mb-3">inventory_2</span>
        <h3 className="font-headline-lg text-lg font-bold text-white mb-2">Product Specification Not Found</h3>
        <p className="font-body text-sm text-on-surface-variant mb-6">
          The requested product ID (#{productId}) does not exist or has been archived from the registry.
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

  const images = product.images?.length > 0 ? product.images : [product.thumbnail];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-6 py-4 rounded-2xl bg-surface-container-lowest border border-white/10">
        <div className="flex items-center gap-2.5 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider">
          <button
            onClick={() => onNavigate('/products')}
            className="hover:text-white transition-colors flex items-center gap-1 font-semibold text-primary"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Registry</span>
          </button>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="capitalize">{product.category}</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-white font-bold truncate max-w-[200px] sm:max-w-md">{product.title}</span>
        </div>

        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-xs font-semibold uppercase tracking-wider border ${
          product.stock > 0
            ? 'bg-success-emerald/15 text-success-emerald border-success-emerald/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]'
            : 'bg-error-red/15 text-error-red border-error-red/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-success-emerald' : 'bg-error-red'}`}></span>
          <span>{product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 border border-white/10 rounded-3xl overflow-hidden bg-surface-container-lowest/70 backdrop-blur-xl shadow-2xl">
        <div className="lg:col-span-7 flex flex-col border-b lg:border-b-0 lg:border-r border-white/10 bg-black/60">
          <div className="relative flex-1 min-h-[420px] sm:min-h-[520px] flex items-center justify-center p-8 overflow-hidden group">
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.25) 0%, transparent 70%)' }}
            ></div>

            <img
              src={images[selectedImageIndex] || images[0]}
              alt={`${product.title} view ${selectedImageIndex + 1}`}
              className="w-full h-full max-h-[480px] object-contain drop-shadow-2xl z-10 transition-transform duration-500 group-hover:scale-105"
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-20 shadow-lg"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all z-20 shadow-lg"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 p-5 border-t border-white/10 bg-surface-container-lowest/90 overflow-x-auto hide-scrollbar">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 shrink-0 rounded-xl overflow-hidden transition-all duration-200 border-2 ${
                    selectedImageIndex === idx
                      ? 'border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.25)]'
                      : 'border-white/15 opacity-60 hover:opacity-100 hover:border-white/40'
                  }`}
                >
                  <img src={imgUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex justify-between items-start mb-3">
              <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest font-semibold">
                SKU: OBS-{product.id + 1000}
              </span>
              <span className="font-label-sm text-xs text-primary bg-white/10 px-3 py-1 rounded-full border border-white/15">
                {product.brand || 'Obsidian Reserve'}
              </span>
            </div>

            <h1 className="font-display-xl text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline justify-between py-4 border-y border-white/10 mb-6">
              <div>
                <span className="font-display-xl text-3xl font-bold text-white">
                  ${product.price?.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <span className="font-label-sm text-xs text-success-emerald ml-2 font-bold">
                    (-{product.discountPercentage}%)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1.5 font-label-sm text-sm font-bold text-white bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                <span className="material-symbols-outlined text-warning-amber text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  star
                </span>
                <span>{product.rating?.toFixed(1)} / 5.0</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <h3 className="font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-semibold">
                Executive Overview & Description
              </h3>
              <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">
                  Category Classification
                </span>
                <span className="font-body text-sm font-semibold text-white capitalize">{product.category}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">
                  Availability Status
                </span>
                <span className="font-body text-sm font-semibold text-white">{product.availabilityStatus || 'In Stock'}</span>
              </div>

              {product.weight && (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">
                    Unit Weight
                  </span>
                  <span className="font-body text-sm font-semibold text-white">{product.weight} kg</span>
                </div>
              )}

              {product.warrantyInformation && (
                <div className="p-3.5 rounded-xl bg-surface-container-low border border-white/5">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block mb-1">
                    Warranty Policy
                  </span>
                  <span className="font-body text-sm font-semibold text-white truncate">{product.warrantyInformation}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => alert(`Initiated deployment protocol for ${product.title}`)}
                className="w-full py-3.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">rocket_launch</span>
                <span>Deploy Module</span>
              </button>
              <button
                onClick={() => onNavigate('/products')}
                className="w-full py-3.5 rounded-xl bg-surface-container hover:bg-white/10 text-white font-body text-xs font-semibold uppercase tracking-wider border border-white/15 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-base">list</span>
                <span>Back to List</span>
              </button>
            </div>
            <p className="font-label-sm text-[11px] text-on-surface-variant text-center">
              Verified & Encrypted specification record • ID: #{product.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});
