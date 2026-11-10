import React from 'react';
import { Search, Sun, Moon, Bookmark, Briefcase, Activity } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface HeaderProps {
  currentCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  onOpenPortfolio: () => void;
  openPositionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  onSelectCategory,
  isDark,
  onToggleTheme,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  onOpenPortfolio,
  openPositionsCount,
}) => {
  const categories: { id: MarketCategory; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'stocks', label: 'Stocks' },
    { id: 'crypto', label: 'Crypto' },
    { id: 'forex', label: 'Forex' },
    { id: 'indices', label: 'Indices' },
    { id: 'futures', label: 'Futures' },
    { id: 'bonds', label: 'Bonds' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4 md:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onSelectCategory('stocks')}>
            {/* TradingView signature icon styling */}
            <div className="w-8 h-8 rounded-md bg-[#2962ff] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm">
              TV
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                TradingView
              </span>
              <span className="text-xs font-semibold text-[#2962ff] uppercase tracking-wider hidden sm:inline-block">
                Markets
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isActive = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 rounded-md transition-colors border border-transparent dark:border-neutral-700/50"
            title="Search symbols (Ctrl+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search markets</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded text-neutral-500 dark:text-neutral-400">
              ⌘K
            </kbd>
          </button>

          {/* Market Status pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>US Markets Open</span>
          </div>

          {/* Paper Trading / Portfolio */}
          <button
            onClick={onOpenPortfolio}
            className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Paper Trading Portfolio"
          >
            <Briefcase className="w-4 h-4" />
            {openPositionsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#2962ff] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                {openPositionsCount}
              </span>
            )}
          </button>

          {/* Watchlist toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title="Watchlist"
          >
            <Bookmark className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle color theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={onOpenPortfolio}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e4bd8] rounded-md transition-colors whitespace-nowrap shadow-sm"
          >
            Paper Trade
          </button>
        </div>
      </div>
    </header>
  );
};
