import React, { useState, useMemo } from 'react';
import { Stock, ScreenerTab, TableViewMode } from '../types/market';
import {
  Star,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Download,
  Search,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface StockScreenerTableProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  watchlist: string[];
  onToggleWatchlist: (symbol: string) => void;
  selectedSector: string | null;
  onSelectSector: (sector: string | null) => void;
}

type SortField = 'symbol' | 'price' | 'changePercent' | 'volume' | 'marketCap' | 'peRatio';
type SortOrder = 'asc' | 'desc';

export const StockScreenerTable: React.FC<StockScreenerTableProps> = ({
  stocks,
  onSelectStock,
  watchlist,
  onToggleWatchlist,
  selectedSector,
  onSelectSector,
}) => {
  const [activeTab, setActiveTab] = useState<ScreenerTab>('most-active');
  const [viewMode, setViewMode] = useState<TableViewMode>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [exchangeFilter, setExchangeFilter] = useState<'ALL' | 'NASDAQ' | 'NYSE'>('ALL');
  const [sortField, setSortField] = useState<SortField>('volume');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Screener tab definitions
  const tabs: { id: ScreenerTab; label: string }[] = [
    { id: 'most-active', label: 'Most Active' },
    { id: 'top-gainers', label: 'Top Gainers' },
    { id: 'top-losers', label: 'Top Losers' },
    { id: 'large-cap', label: 'Large Cap' },
    { id: '52w-high', label: '52-Week High' },
    { id: 'high-dividend', label: 'High Dividend' },
    { id: 'all', label: 'All Equities' },
  ];

  // Unique sectors for dropdown
  const allSectors = useMemo(() => {
    const set = new Set<string>();
    stocks.forEach((s) => set.add(s.sector));
    return Array.from(set).sort();
  }, [stocks]);

  // Filter & Sort stocks
  const filteredStocks = useMemo(() => {
    let result = [...stocks];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) => s.symbol.toLowerCase().includes(q) || s.name.toLowerCase().includes(q)
      );
    }

    // Sector filter
    if (selectedSector) {
      result = result.filter((s) => s.sector === selectedSector);
    }

    // Exchange filter
    if (exchangeFilter !== 'ALL') {
      result = result.filter((s) => s.exchange === exchangeFilter);
    }

    // Tab filter
    switch (activeTab) {
      case 'most-active':
        // sort by volume
        result.sort((a, b) => b.volume - a.volume);
        break;
      case 'top-gainers':
        result = result.filter((s) => s.changePercent > 0);
        result.sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'top-losers':
        result = result.filter((s) => s.changePercent < 0);
        result.sort((a, b) => a.changePercent - b.changePercent);
        break;
      case 'large-cap':
        result = result.filter((s) => s.marketCap >= 300);
        result.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case '52w-high':
        result = result.filter((s) => s.price >= s.high52W * 0.94);
        result.sort((a, b) => b.price / b.high52W - a.price / a.high52W);
        break;
      case 'high-dividend':
        result = result.filter((s) => s.dividendYield > 0.5);
        result.sort((a, b) => b.dividendYield - a.dividendYield);
        break;
      default:
        break;
    }

    // User manual sort override
    if (sortField) {
      result.sort((a, b) => {
        let valA = a[sortField] ?? 0;
        let valB = b[sortField] ?? 0;
        if (typeof valA === 'string') {
          return sortOrder === 'asc'
            ? (valA as string).localeCompare(valB as string)
            : (valB as string).localeCompare(valA as string);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
    }

    return result;
  }, [stocks, searchQuery, selectedSector, exchangeFilter, activeTab, sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const exportCSV = () => {
    const headers = ['Symbol,Name,Exchange,Price,Change,Change%,Volume,MarketCap,PE,Rating'];
    const rows = filteredStocks.map(
      (s) =>
        `"${s.symbol}","${s.name}","${s.exchange}",${s.price},${s.change},${s.changePercent}%,${s.volume},${s.marketCap}B,${s.peRatio ?? 'N/A'},"${s.technicalRating}"`
    );
    const blob = new Blob([[...headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tradingview_stocks_${activeTab}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getRatingBadge = (rating: string) => {
    switch (rating) {
      case 'Strong Buy':
        return 'text-emerald-700 dark:text-[#089981] bg-emerald-100 dark:bg-[#089981]/20 font-bold';
      case 'Buy':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 font-semibold';
      case 'Neutral':
        return 'text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 font-medium';
      case 'Sell':
        return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 font-semibold';
      case 'Strong Sell':
        return 'text-rose-700 dark:text-[#f23645] bg-rose-100 dark:bg-[#f23645]/20 font-bold';
      default:
        return 'text-neutral-500 bg-neutral-100 dark:bg-neutral-800';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800/80 overflow-hidden shadow-xs">
      {/* Top Screener Subtabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 px-4 pt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-2.5">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* View Mode Tabs (Overview, Performance, Valuation, Technicals) */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/60 rounded-md mb-2">
          {(['overview', 'performance', 'valuation', 'technical'] as TableViewMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-2.5 py-1 text-xs font-medium rounded capitalize transition-colors ${
                viewMode === mode
                  ? 'bg-white dark:bg-[#131722] text-neutral-900 dark:text-white shadow-xs font-semibold'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-neutral-50 dark:bg-[#181c27] border-b border-neutral-200 dark:border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Real-time search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by symbol or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-700/80 rounded-md text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#2962ff] w-48 sm:w-60"
            />
          </div>

          {/* Sector Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedSector || 'ALL'}
              onChange={(e) => onSelectSector(e.target.value === 'ALL' ? null : e.target.value)}
              className="text-xs py-1.5 px-2 bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-700/80 rounded-md text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-[#2962ff]"
            >
              <option value="ALL">All Sectors</option>
              {allSectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Exchange Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-700/80 rounded-md p-0.5">
            {(['ALL', 'NASDAQ', 'NYSE'] as const).map((ex) => (
              <button
                key={ex}
                onClick={() => setExchangeFilter(ex)}
                className={`px-2 py-0.5 text-[11px] font-medium rounded ${
                  exchangeFilter === ex
                    ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        {/* Export CSV & Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            {filteredStocks.length} {filteredStocks.length === 1 ? 'match' : 'matches'}
          </span>
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-700/80 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-[#181c27]/50 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <th className="py-2.5 px-3 w-8 text-center">
                <span className="sr-only">Watchlist</span>
              </th>
              <th
                onClick={() => handleSort('symbol')}
                className="py-2.5 px-3 cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Ticker &amp; Company</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('price')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Price (USD)</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('changePercent')}
                className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              {/* Dynamic columns based on View Mode */}
              {viewMode === 'overview' && (
                <>
                  <th className="py-2.5 px-3 text-center">Technical Rating</th>
                  <th
                    onClick={() => handleSort('volume')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Volume</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('marketCap')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>Market Cap</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-center hidden md:table-cell">52-Week Range</th>
                  <th className="py-2.5 px-3 text-center hidden lg:table-cell">Sparkline</th>
                </>
              )}

              {viewMode === 'performance' && (
                <>
                  <th className="py-2.5 px-3 text-right">Rel Volume</th>
                  <th className="py-2.5 px-3 text-right">Beta</th>
                  <th className="py-2.5 px-3 text-right">Day High</th>
                  <th className="py-2.5 px-3 text-right">Day Low</th>
                  <th className="py-2.5 px-3 text-right">52W High</th>
                </>
              )}

              {viewMode === 'valuation' && (
                <>
                  <th
                    onClick={() => handleSort('peRatio')}
                    className="py-2.5 px-3 text-right cursor-pointer hover:text-neutral-900 dark:hover:text-white transition-colors"
                  >
                    <div className="flex items-center justify-end gap-1">
                      <span>P/E (TTM)</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-2.5 px-3 text-right">Forward P/E</th>
                  <th className="py-2.5 px-3 text-right">EPS</th>
                  <th className="py-2.5 px-3 text-right">Div Yield</th>
                  <th className="py-2.5 px-3 text-right">Market Cap</th>
                </>
              )}

              {viewMode === 'technical' && (
                <>
                  <th className="py-2.5 px-3 text-center">Summary Rating</th>
                  <th className="py-2.5 px-3 text-center">Oscillators</th>
                  <th className="py-2.5 px-3 text-center">Moving Averages</th>
                  <th className="py-2.5 px-3 text-right">Analyst Target</th>
                  <th className="py-2.5 px-3 text-center">Consensus</th>
                </>
              )}

              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
            {filteredStocks.length === 0 ? (
              <tr>
                <td colSpan={10} className="py-12 text-center text-neutral-500 dark:text-neutral-400">
                  <div className="max-w-sm mx-auto space-y-2">
                    <p className="font-semibold text-sm">No stocks matching current filters</p>
                    <p className="text-xs">
                      Try resetting your search query or selecting &quot;All Sectors&quot;.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        onSelectSector(null);
                        setExchangeFilter('ALL');
                        setActiveTab('all');
                      }}
                      className="mt-2 px-3 py-1.5 text-xs font-semibold bg-[#2962ff] text-white rounded-md hover:bg-[#1e4bd8]"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStocks.map((stock) => {
                const isPositive = stock.changePercent >= 0;
                const isWatchlisted = watchlist.includes(stock.symbol);

                // 52-week position percentage (0 to 100%)
                const range52 = stock.high52W - stock.low52W || 1;
                const pct52 = Math.min(
                  100,
                  Math.max(0, ((stock.price - stock.low52W) / range52) * 100)
                );

                return (
                  <tr
                    key={stock.symbol}
                    className="hover:bg-neutral-50/80 dark:hover:bg-[#242936] transition-colors group cursor-pointer"
                    onClick={() => onSelectStock(stock)}
                  >
                    {/* Watchlist Star */}
                    <td
                      className="py-3 px-3 text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWatchlist(stock.symbol);
                      }}
                    >
                      <Star
                        className={`w-3.5 h-3.5 mx-auto transition-colors ${
                          isWatchlisted
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-neutral-300 dark:text-neutral-600 hover:text-amber-400'
                        }`}
                      />
                    </td>

                    {/* Symbol & Name */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[11px] text-white shrink-0 shadow-2xs"
                          style={{ backgroundColor: stock.color }}
                        >
                          {stock.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white group-hover:text-[#2962ff] transition-colors flex items-center gap-1.5">
                            <span>{stock.symbol}</span>
                            <span className="text-[10px] font-normal text-neutral-400">
                              {stock.exchange}
                            </span>
                          </div>
                          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate max-w-[140px] sm:max-w-[200px]">
                            {stock.name}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Price */}
                    <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                      ${stock.price.toFixed(2)}
                    </td>

                    {/* Change % & Amount */}
                    <td className="py-3 px-3 text-right font-mono tabular-nums">
                      <div
                        className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded ${
                          isPositive
                            ? 'text-emerald-700 dark:text-[#089981] bg-emerald-50 dark:bg-[#089981]/10'
                            : 'text-rose-700 dark:text-[#f23645] bg-rose-50 dark:bg-[#f23645]/10'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </div>
                      <div className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                        {isPositive ? '+' : ''}${stock.change.toFixed(2)}
                      </div>
                    </td>

                    {/* Dynamic view columns */}
                    {viewMode === 'overview' && (
                      <>
                        {/* Technical Rating */}
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] rounded-md ${getRatingBadge(
                              stock.technicalRating
                            )}`}
                          >
                            {stock.technicalRating}
                          </span>
                        </td>

                        {/* Volume */}
                        <td className="py-3 px-3 text-right font-mono text-neutral-700 dark:text-neutral-300 tabular-nums">
                          {(stock.volume / 1000000).toFixed(1)}M
                        </td>

                        {/* Market Cap */}
                        <td className="py-3 px-3 text-right font-mono font-medium text-neutral-700 dark:text-neutral-300 tabular-nums">
                          ${(stock.marketCap / 1).toFixed(1)}B
                        </td>

                        {/* 52-Week Range Bar */}
                        <td className="py-3 px-3 text-center hidden md:table-cell">
                          <div className="w-24 mx-auto">
                            <div className="flex justify-between text-[9px] text-neutral-400 font-mono mb-1">
                              <span>${stock.low52W.toFixed(0)}</span>
                              <span>${stock.high52W.toFixed(0)}</span>
                            </div>
                            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden relative">
                              <div
                                className="bg-[#2962ff] h-full rounded-full"
                                style={{ width: `${pct52}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Sparkline */}
                        <td className="py-3 px-3 text-center hidden lg:table-cell">
                          <div className="w-20 h-5 mx-auto">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 60 16">
                              {(() => {
                                const min = Math.min(...stock.sparkline);
                                const max = Math.max(...stock.sparkline);
                                const range = max - min || 1;
                                const points = stock.sparkline
                                  .map((val, i) => {
                                    const x = (i / (stock.sparkline.length - 1)) * 60;
                                    const y = 16 - ((val - min) / range) * 14 - 1;
                                    return `${x},${y}`;
                                  })
                                  .join(' ');
                                return (
                                  <polyline
                                    fill="none"
                                    stroke={isPositive ? '#089981' : '#f23645'}
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    points={points}
                                  />
                                );
                              })()}
                            </svg>
                          </div>
                        </td>
                      </>
                    )}

                    {viewMode === 'performance' && (
                      <>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {stock.relativeVolume.toFixed(2)}x
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {stock.beta.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-600 dark:text-emerald-400">
                          ${stock.high.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-rose-600 dark:text-rose-400">
                          ${stock.low.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          ${stock.high52W.toFixed(2)}
                        </td>
                      </>
                    )}

                    {viewMode === 'valuation' && (
                      <>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {stock.peRatio ? stock.peRatio.toFixed(1) : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {stock.forwardPe ? stock.forwardPe.toFixed(1) : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          ${stock.eps.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums">
                          {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '—'}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-medium tabular-nums">
                          ${stock.marketCap.toFixed(1)}B
                        </td>
                      </>
                    )}

                    {viewMode === 'technical' && (
                      <>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-2 py-0.5 text-[10px] rounded-md ${getRatingBadge(
                              stock.technicalRating
                            )}`}
                          >
                            {stock.technicalRating}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 text-[10px] rounded ${getRatingBadge(
                              stock.oscillatorsScore
                            )}`}
                          >
                            {stock.oscillatorsScore}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`inline-block px-1.5 py-0.5 text-[10px] rounded ${getRatingBadge(
                              stock.movingAveragesScore
                            )}`}
                          >
                            {stock.movingAveragesScore}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-neutral-900 dark:text-white tabular-nums">
                          ${stock.targetPrice.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="text-[10px] font-semibold text-neutral-700 dark:text-neutral-300">
                            {stock.analystRating}
                          </span>
                        </td>
                      </>
                    )}

                    {/* Action button */}
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStock(stock);
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#2962ff] hover:bg-[#2962ff]/10 rounded transition-colors inline-flex items-center gap-1"
                      >
                        <span>Chart</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
