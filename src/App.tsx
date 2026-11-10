/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MarketCategory, Stock, PaperTradePosition } from './types/market';
import {
  INITIAL_STOCKS,
  MARKET_INDICES,
  SECTOR_PERFORMANCE,
  MARKET_NEWS,
  ECONOMIC_CALENDAR,
} from './data/mockMarketData';
import { Header } from './components/Header';
import { TickerMarquee } from './components/TickerMarquee';
import { MarketHero } from './components/MarketHero';
import { SectorHeatmap } from './components/SectorHeatmap';
import { StockScreenerTable } from './components/StockScreenerTable';
import { StockDetailModal } from './components/StockDetailModal';
import { WatchlistSidebar } from './components/WatchlistSidebar';
import { SearchModal } from './components/SearchModal';
import { MarketNewsSection } from './components/MarketNewsSection';
import { PaperPortfolioModal } from './components/PaperPortfolioModal';
import { OtherMarketsView } from './components/OtherMarketsView';

export default function App() {
  // Theme state: TradingView defaults to its iconic Dark Mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    return true;
  });

  // Current market category (defaults to 'stocks' as requested by /markets/#stocks)
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('stocks');

  // Market data states with live tick simulation
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [indices, setIndices] = useState(MARKET_INDICES);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

  // Active modal and drawer states
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isPortfolioOpen, setIsPortfolioOpen] = useState(false);

  // User Watchlist (pre-populated with top market leaders)
  const [watchlist, setWatchlist] = useState<string[]>([
    'NVDA',
    'AAPL',
    'MSFT',
    'TSLA',
    'PLTR',
  ]);

  // Paper Trading state
  const [cashBalance, setCashBalance] = useState<number>(100000);
  const [paperPositions, setPaperPositions] = useState<PaperTradePosition[]>([
    {
      id: 'pos-1',
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      type: 'buy',
      shares: 20,
      entryPrice: 138.50,
      currentPrice: 147.15,
      date: '2026-11-08',
    },
    {
      id: 'pos-2',
      symbol: 'TSLA',
      name: 'Tesla, Inc.',
      type: 'buy',
      shares: 15,
      entryPrice: 312.00,
      currentPrice: 328.50,
      date: '2026-11-08',
    },
  ]);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global Ctrl+K / Cmd+K listener for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Periodic subtle market ticks (simulating live financial quotes streaming)
  useEffect(() => {
    const interval = setInterval(() => {
      // Pick 1-2 random stocks to fluctuate slightly
      setStocks((prevStocks) => {
        return prevStocks.map((stock) => {
          if (Math.random() > 0.4) return stock; // 60% chance to skip

          const deltaPercent = (Math.random() - 0.49) * 0.25; // -0.12% to +0.13%
          const priceChange = (stock.price * deltaPercent) / 100;
          const newPrice = Number(Math.max(1, stock.price + priceChange).toFixed(2));
          const newTotalChange = Number((newPrice - stock.prevClose).toFixed(2));
          const newChangePercent = Number(((newTotalChange / stock.prevClose) * 100).toFixed(2));
          const newHigh = Math.max(stock.high, newPrice);
          const newLow = Math.min(stock.low, newPrice);

          // Update sparkline last point
          const newSparkline = [...stock.sparkline.slice(1), newPrice];

          return {
            ...stock,
            price: newPrice,
            change: newTotalChange,
            changePercent: newChangePercent,
            high: newHigh,
            low: newLow,
            volume: stock.volume + Math.floor(Math.random() * 500),
            sparkline: newSparkline,
          };
        });
      });

      // Update 1 index
      setIndices((prevIndices) => {
        return prevIndices.map((idx) => {
          if (Math.random() > 0.5) return idx;
          const delta = (Math.random() - 0.49) * 0.15;
          const newPrice = Number(Math.max(0.1, idx.price * (1 + delta / 100)).toFixed(2));
          const newChange = Number((idx.change + (newPrice - idx.price)).toFixed(2));
          const newPct = Number((idx.changePercent + delta).toFixed(2));
          return {
            ...idx,
            price: newPrice,
            change: newChange,
            changePercent: newPct,
            sparkline: [...idx.sparkline.slice(1), newPrice],
          };
        });
      });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Watchlist toggle handler
  const handleToggleWatchlist = (symbol: string) => {
    setWatchlist((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol]
    );
  };

  // Open stock detail by symbol
  const handleSelectStockBySymbol = (symbol: string) => {
    const found = stocks.find((s) => s.symbol === symbol);
    if (found) {
      setSelectedStock(found);
    }
  };

  // Paper Trade execution
  const handleExecuteTrade = (newPosition: Omit<PaperTradePosition, 'id' | 'date'>) => {
    const orderCost = newPosition.shares * newPosition.entryPrice;
    setCashBalance((prev) => prev - orderCost);

    const positionRecord: PaperTradePosition = {
      ...newPosition,
      id: `pos-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setPaperPositions((prev) => [positionRecord, ...prev]);
  };

  // Close paper position
  const handleClosePosition = (id: string) => {
    const pos = paperPositions.find((p) => p.id === id);
    if (!pos) return;

    const liveStock = stocks.find((s) => s.symbol === pos.symbol);
    const curPrice = liveStock ? liveStock.price : pos.currentPrice;
    const proceeds = pos.shares * curPrice;

    setCashBalance((prev) => prev + proceeds);
    setPaperPositions((prev) => prev.filter((p) => p.id !== id));
  };

  // Reset paper portfolio
  const handleResetPortfolio = () => {
    setCashBalance(100000);
    setPaperPositions([]);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fd] dark:bg-[#131722] text-neutral-900 dark:text-[#d1d4dc] transition-colors duration-150 flex flex-col font-sans">
      {/* Top Header Navigation */}
      <Header
        currentCategory={currentCategory}
        onSelectCategory={(cat) => setCurrentCategory(cat)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(!isWatchlistOpen)}
        watchlistCount={watchlist.length}
        onOpenPortfolio={() => setIsPortfolioOpen(true)}
        openPositionsCount={paperPositions.length}
      />

      {/* Marquee Ticker Strip */}
      <TickerMarquee
        indices={indices}
        onSelectIndex={(sym) => {
          const matched = stocks.find((s) => s.symbol === sym);
          if (matched) setSelectedStock(matched);
        }}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-6">
        {currentCategory === 'stocks' ? (
          <>
            {/* Stocks Market Hero Banner & Market Mover Highlights */}
            <MarketHero
              stocks={stocks}
              onSelectStock={(stk) => setSelectedStock(stk)}
            />

            {/* Interactive Sector Heatmap */}
            <SectorHeatmap
              sectors={SECTOR_PERFORMANCE}
              selectedSector={selectedSector}
              onSelectSector={(sec) => setSelectedSector(sec)}
            />

            {/* Flagship Stock Screener Table */}
            <StockScreenerTable
              stocks={stocks}
              onSelectStock={(stk) => setSelectedStock(stk)}
              watchlist={watchlist}
              onToggleWatchlist={handleToggleWatchlist}
              selectedSector={selectedSector}
              onSelectSector={(sec) => setSelectedSector(sec)}
            />

            {/* Financial News & Economic Calendar */}
            <MarketNewsSection
              news={MARKET_NEWS}
              calendar={ECONOMIC_CALENDAR}
              allStocks={stocks}
              onSelectStockBySymbol={handleSelectStockBySymbol}
            />
          </>
        ) : (
          /* View for Other Categories (Overview, Crypto, Forex, Indices, Futures, Bonds) */
          <OtherMarketsView
            category={currentCategory}
            onOpenStockBySymbol={handleSelectStockBySymbol}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#131722] py-6 mt-12 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-extrabold text-neutral-900 dark:text-white">TradingView Markets</span>
            <span>·</span>
            <span>Real-time Financial Intelligence &amp; Screener</span>
          </div>

          <div className="flex items-center gap-4 text-neutral-500">
            <span>Market Data: NASDAQ / NYSE</span>
            <span>·</span>
            <span>All quotes delayed 0s</span>
          </div>
        </div>
      </footer>

      {/* Interactive Stock Detail & Chart Modal */}
      <StockDetailModal
        stock={selectedStock}
        onClose={() => setSelectedStock(null)}
        isWatchlisted={selectedStock ? watchlist.includes(selectedStock.symbol) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onExecuteTrade={handleExecuteTrade}
      />

      {/* Watchlist Flyout Drawer */}
      <WatchlistSidebar
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlistSymbols={watchlist}
        allStocks={stocks}
        onSelectStock={(stk) => {
          setSelectedStock(stk);
          setIsWatchlistOpen(false);
        }}
        onToggleWatchlist={handleToggleWatchlist}
      />

      {/* Quick Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        stocks={stocks}
        onSelectStock={(stk) => {
          setSelectedStock(stk);
          setIsSearchOpen(false);
        }}
      />

      {/* Simulated Paper Trading Portfolio Modal */}
      <PaperPortfolioModal
        isOpen={isPortfolioOpen}
        onClose={() => setIsPortfolioOpen(false)}
        positions={paperPositions}
        cashBalance={cashBalance}
        onClosePosition={handleClosePosition}
        onResetPortfolio={handleResetPortfolio}
        allStocks={stocks}
        onSelectStock={(stk) => setSelectedStock(stk)}
      />
    </div>
  );
}
