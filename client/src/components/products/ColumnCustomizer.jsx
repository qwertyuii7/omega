import React from 'react';

export const ColumnCustomizer = React.memo(function ColumnCustomizer({
  columns,
  toggleColumnVisibility,
  moveColumn,
  resetColumns,
  onClose
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 shadow-2xl border border-white/15 bg-surface-container-lowest/90 animate-fadeIn">
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-white text-xl">view_column</span>
            <h3 className="font-headline-lg text-lg font-bold text-white">Customize Table Columns</h3>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-white p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="font-body text-xs text-on-surface-variant mb-5 leading-relaxed">
          Show, hide, or reorder table columns. Changes are automatically saved to your session workspace.
        </p>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mb-6">
          {columns.map((col, index) => (
            <div
              key={col.id}
              className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-white/10 hover:border-white/20 transition-colors"
            >
              <label className="flex items-center gap-3 cursor-pointer flex-1">
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggleColumnVisibility(col.id)}
                  disabled={col.id === 'title'}
                  className="w-4 h-4 rounded border-white/30 bg-surface-container checked:bg-white checked:text-black focus:ring-0 cursor-pointer"
                />
                <span className={`font-body text-sm ${col.visible ? 'text-white font-medium' : 'text-on-surface-variant line-through'}`}>
                  {col.label}
                </span>
                {col.id === 'title' && (
                  <span className="text-[10px] uppercase font-label-sm px-1.5 py-0.5 rounded bg-white/10 text-on-surface-variant">Required</span>
                )}
              </label>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveColumn(index, index - 1)}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-20 text-on-surface-variant hover:text-white transition-colors"
                  title="Move Up"
                >
                  <span className="material-symbols-outlined text-sm">arrow_upward</span>
                </button>
                <button
                  type="button"
                  disabled={index === columns.length - 1}
                  onClick={() => moveColumn(index, index + 1)}
                  className="p-1 rounded bg-white/5 hover:bg-white/15 disabled:opacity-20 text-on-surface-variant hover:text-white transition-colors"
                  title="Move Down"
                >
                  <span className="material-symbols-outlined text-sm">arrow_downward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={resetColumns}
            className="px-4 py-2 rounded-lg bg-transparent hover:bg-white/5 text-on-surface-variant hover:text-white font-label-sm text-xs uppercase tracking-wider transition-colors"
          >
            Reset Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white text-black font-body text-xs font-bold uppercase tracking-wider hover:bg-white/90 shadow-[0_0_15px_rgba(255,255,255,0.15)] transition-all"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
});
