import React, { useState, useEffect } from 'react';
import { Stock } from '../types/market';
import { Search, X, TrendingUp, TrendingDown, Clock, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  stocks,
  onSelectStock,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape or open on Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const results = query.trim()
    ? stocks.filter(
        (s) =>
          s.symbol.toLowerCase().includes(query.toLowerCase()) ||
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.sector.toLowerCase().includes(query.toLowerCase())
      )
    : stocks.slice(0, 8); // default trending

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      onSelectStock(results[selectedIndex]);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e222d] w-full max-w-xl rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search symbol, company, or sector (e.g. AAPL, NVDA, Semiconductors)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full text-sm bg-transparent text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60 p-1">
          <div className="px-3 py-1.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
            {query.trim() ? `Search Results (${results.length})` : 'Popular & Trending Equities'}
          </div>

          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-neutral-400">
              No matching symbols found for &quot;{query}&quot;
            </div>
          ) : (
            results.map((stock, idx) => {
              const isSelected = idx === selectedIndex;
              const isUp = stock.changePercent >= 0;

              return (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    onSelectStock(stock);
                    onClose();
                  }}
                  className={`px-3 py-2.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-neutral-100 dark:bg-[#252b3b]'
                      : 'hover:bg-neutral-50 dark:hover:bg-[#202534]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] text-white"
                      style={{ backgroundColor: stock.color }}
                    >
                      {stock.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-neutral-900 dark:text-white">
                          {stock.symbol}
                        </span>
                        <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
                          {stock.exchange}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[240px]">
                        {stock.name} · {stock.sector}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right font-mono tabular-nums">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        ${stock.price.toFixed(2)}
                      </div>
                      <div
                        className={`text-[10px] font-bold ${
                          isUp ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 opacity-60" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-2.5 bg-neutral-50 dark:bg-[#181c27] border-t border-neutral-200 dark:border-neutral-800 text-[11px] text-neutral-500 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>↑↓ Navigate</span>
            <span>·</span>
            <span>↵ Select</span>
            <span>·</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono text-[10px]">Real-time quotes</span>
        </div>
      </div>
    </div>
  );
};
