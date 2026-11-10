import React, { useState } from 'react';
import { Stock } from '../types/market';
import { X, Plus, Bookmark, Trash2, ExternalLink } from 'lucide-react';

interface WatchlistSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistSymbols: string[];
  allStocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  onToggleWatchlist: (symbol: string) => void;
}

export const WatchlistSidebar: React.FC<WatchlistSidebarProps> = ({
  isOpen,
  onClose,
  watchlistSymbols,
  allStocks,
  onSelectStock,
  onToggleWatchlist,
}) => {
  const [addQuery, setAddQuery] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);

  if (!isOpen) return null;

  // Filtered stocks in watchlist
  const watchedStocks = allStocks.filter((s) => watchlistSymbols.includes(s.symbol));

  // Available stocks to add
  const availableToAdd = allStocks.filter(
    (s) =>
      !watchlistSymbols.includes(s.symbol) &&
      (s.symbol.toLowerCase().includes(addQuery.toLowerCase()) ||
        s.name.toLowerCase().includes(addQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 sm:w-96 bg-white dark:bg-[#181c27] border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-[#2962ff]" />
          <h2 className="font-bold text-sm text-neutral-900 dark:text-white">
            Watchlist
          </h2>
          <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500">
            {watchedStocks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Add Symbol"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Add Symbol Dropdown */}
      {showAddMenu && (
        <div className="p-3 bg-neutral-50 dark:bg-[#131722] border-b border-neutral-200 dark:border-neutral-800">
          <input
            type="text"
            placeholder="Search symbol to add..."
            value={addQuery}
            onChange={(e) => setAddQuery(e.target.value)}
            className="w-full text-xs py-1.5 px-3 bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#2962ff]"
            autoFocus
          />

          <div className="mt-2 max-h-40 overflow-y-auto space-y-1">
            {availableToAdd.length === 0 ? (
              <div className="text-[11px] text-neutral-400 p-2 text-center">
                No matching symbols available
              </div>
            ) : (
              availableToAdd.slice(0, 6).map((s) => (
                <div
                  key={s.symbol}
                  onClick={() => {
                    onToggleWatchlist(s.symbol);
                    setAddQuery('');
                    setShowAddMenu(false);
                  }}
                  className="flex items-center justify-between p-1.5 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800 cursor-pointer text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900 dark:text-white">{s.symbol}</span>
                    <span className="text-[10px] text-neutral-500 truncate max-w-[120px]">{s.name}</span>
                  </div>
                  <span className="text-[#2962ff] text-[11px] font-semibold">+ Add</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Stock list */}
      <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
        {watchedStocks.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 space-y-3">
            <Bookmark className="w-8 h-8 mx-auto opacity-30" />
            <p className="text-xs">Your watchlist is currently empty.</p>
            <p className="text-[11px] text-neutral-500">
              Click the star icon next to any ticker in the screener to track it here.
            </p>
          </div>
        ) : (
          watchedStocks.map((stock) => {
            const isUp = stock.changePercent >= 0;
            return (
              <div
                key={stock.symbol}
                onClick={() => onSelectStock(stock)}
                className="p-3 hover:bg-neutral-50 dark:hover:bg-[#202534] transition-colors cursor-pointer group flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] text-white shrink-0"
                    style={{ backgroundColor: stock.color }}
                  >
                    {stock.symbol.slice(0, 2)}
                  </div>

                  <div>
                    <div className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-[#2962ff] transition-colors">
                      {stock.symbol}
                    </div>
                    <div className="text-[10px] text-neutral-500 truncate max-w-[100px]">
                      {stock.name}
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

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(stock.symbol);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-500 rounded transition-opacity"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
