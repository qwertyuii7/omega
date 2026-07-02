import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const ProductContext = createContext(null);

const DEFAULT_COLUMNS = [
  { id: 'image', label: 'Image', visible: true },
  { id: 'title', label: 'Initiative / Product', visible: true },
  { id: 'category', label: 'Category', visible: true },
  { id: 'price', label: 'Price (MSRP)', visible: true },
  { id: 'stockStatus', label: 'Stock Status', visible: true },
  { id: 'rating', label: 'Rating Score', visible: true },
  { id: 'status', label: 'Visibility', visible: true }
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [visibilityMap, setVisibilityMap] = useState(() => {
    try {
      const saved = localStorage.getItem('obsidian_visibility_map');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [columns, setColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('obsidian_table_columns');
      return saved ? JSON.parse(saved) : DEFAULT_COLUMNS;
    } catch {
      return DEFAULT_COLUMNS;
    }
  });

  const [isLiveSimulation, setIsLiveSimulation] = useState(false);
  const [lastLiveUpdate, setLastLiveUpdate] = useState(null);

  const updateVisibilityMap = useCallback((newMap) => {
    setVisibilityMap(newMap);
    localStorage.setItem('obsidian_visibility_map', JSON.stringify(newMap));
  }, []);

  const toggleProductPublished = useCallback((productId) => {
    setVisibilityMap((prev) => {
      const currentVal = prev[productId];
      const defaultPublished = productId % 5 !== 0;
      const nextVal = currentVal !== undefined ? !currentVal : !defaultPublished;
      const nextMap = { ...prev, [productId]: nextVal };
      localStorage.setItem('obsidian_visibility_map', JSON.stringify(nextMap));
      return nextMap;
    });
  }, []);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const response = await fetch('https://dummyjson.com/products?limit=100');
        if (!response.ok) throw new Error('Failed to fetch product registry');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const enrichedProducts = useMemo(() => {
    return products.map((p) => {
      const isPublished = visibilityMap[p.id] !== undefined
        ? visibilityMap[p.id]
        : (p.id % 5 !== 0);
      return {
        ...p,
        published: isPublished
      };
    });
  }, [products, visibilityMap]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(cats).sort();
  }, [products]);

  const toggleColumnVisibility = useCallback((colId) => {
    setColumns((prev) => {
      const next = prev.map((c) => c.id === colId ? { ...c, visible: !c.visible } : c);
      localStorage.setItem('obsidian_table_columns', JSON.stringify(next));
      return next;
    });
  }, []);

  const moveColumn = useCallback((fromIndex, toIndex) => {
    setColumns((prev) => {
      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      localStorage.setItem('obsidian_table_columns', JSON.stringify(copy));
      return copy;
    });
  }, []);

  const resetColumns = useCallback(() => {
    setColumns(DEFAULT_COLUMNS);
    localStorage.removeItem('obsidian_table_columns');
  }, []);

  useEffect(() => {
    if (!isLiveSimulation || products.length === 0) return;

    const interval = setInterval(() => {
      setProducts((prev) => {
        const randomIndex = Math.floor(Math.random() * prev.length);
        const target = prev[randomIndex];
        if (!target) return prev;

        const stockDelta = Math.floor(Math.random() * 6) - 2;
        const newStock = Math.max(0, target.stock + stockDelta);

        const updated = [...prev];
        updated[randomIndex] = { ...target, stock: newStock };
        setLastLiveUpdate({
          title: target.title,
          oldStock: target.stock,
          newStock: newStock,
          time: new Date().toLocaleTimeString()
        });
        return updated;
      });
    }, 3500);

    return () => clearInterval(interval);
  }, [isLiveSimulation, products.length]);

  const toggleLiveSimulation = useCallback(() => {
    setIsLiveSimulation((prev) => !prev);
  }, []);

  const value = useMemo(() => ({
    products: enrichedProducts,
    loading,
    error,
    categories,
    columns,
    isLiveSimulation,
    lastLiveUpdate,
    toggleProductPublished,
    toggleColumnVisibility,
    moveColumn,
    resetColumns,
    toggleLiveSimulation
  }), [
    enrichedProducts, loading, error, categories, columns,
    isLiveSimulation, lastLiveUpdate, toggleProductPublished,
    toggleColumnVisibility, moveColumn, resetColumns, toggleLiveSimulation
  ]);

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
}
