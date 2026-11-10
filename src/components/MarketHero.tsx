import React from 'react';
import { Stock } from '../types/market';
import { TrendingUp, TrendingDown, Flame, BarChart2, Zap, Award } from 'lucide-react';

interface MarketHeroProps {
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  onFilterCategory?: (filter: string) => void;
}

export const MarketHero: React.FC<MarketHeroProps> = ({ stocks, onSelectStock }) => {
  // Derive market movers
  const topGainer = [...stocks].sort((a, b) => b.changePercent - a.changePercent)[0];
  const topLoser = [...stocks].sort((a, b) => a.changePercent - b.changePercent)[0];
  const mostActive = [...stocks].sort((a, b) => b.volume - a.volume)[0];
  const near52High = [...stocks].sort(
    (a, b) => a.price / a.high52W - b.price / b.high52W
  ).reverse()[0];

  const moverCards = [
    {
      title: 'Top Gainer',
      icon: TrendingUp,
      color: 'text-emerald-500',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      stock: topGainer,
    },
    {
      title: 'Top Loser',
      icon: TrendingDown,
      color: 'text-rose-500',
      badgeBg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      stock: topLoser,
    },
    {
      title: 'Most Active',
      icon: Flame,
      color: 'text-amber-500',
      badgeBg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
      stock: mostActive,
    },
    {
      title: '52-Week High',
      icon: Award,
      color: 'text-[#2962ff]',
      badgeBg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
      stock: near52High,
    },
  ];

  return (
    <div className="space-y-6 pt-2 pb-4">
      {/* Title & Market Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span>Markets</span>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold">Stocks</span>
            <span aria-hidden="true">/</span>
            <span>United States</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            Stock Market Today
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
            Real-time equity quotes, technical indicators, sector performance, and market movers across NYSE and NASDAQ.
          </p>
        </div>

        {/* Market Breadth & Sentiment Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 p-2 bg-neutral-100 dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Total US Market Cap</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-white tabular-nums">$54.20 Trillion</span>
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Advancing / Declining</span>
            <div className="flex items-center gap-1.5 font-mono font-medium tabular-nums">
              <span className="text-emerald-600 dark:text-emerald-400">2,842</span>
              <span className="text-neutral-400">/</span>
              <span className="text-rose-600 dark:text-rose-400">1,120</span>
            </div>
          </div>
          <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />
          <div className="flex flex-col px-2">
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Market Mood</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">Greed (68)</span>
          </div>
        </div>
      </div>

      {/* 4 Market Mover Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {moverCards.map((card, idx) => {
          if (!card.stock) return null;
          const s = card.stock;
          const isPositive = s.changePercent >= 0;
          const Icon = card.icon;

          return (
            <div
              key={idx}
              onClick={() => onSelectStock(s)}
              className="p-3.5 rounded-lg bg-white dark:bg-[#1e222d] border border-neutral-200 dark:border-neutral-800/80 hover:border-[#2962ff]/50 dark:hover:border-[#2962ff]/50 transition-all cursor-pointer shadow-xs group"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                  <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                  {card.title}
                </span>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                  {s.exchange}
                </span>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-md flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: s.color }}
                  >
                    {s.symbol.slice(0, 2)}
                  </div>
                  <div className="truncate">
                    <div className="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-[#2962ff] transition-colors truncate">
                      {s.symbol}
                    </div>
                    <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                      {s.name}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-sm text-neutral-900 dark:text-white tabular-nums">
                    ${s.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-xs font-mono font-semibold tabular-nums ${
                      isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}
                    {s.changePercent.toFixed(2)}%
                  </div>
                </div>
              </div>

              {/* Sparkline in card */}
              <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px]">
                <span className="text-neutral-500 dark:text-neutral-400 text-[10px]">
                  Vol: {(s.volume / 1000000).toFixed(1)}M
                </span>
                <div className="w-24 h-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 60 16">
                    {(() => {
                      const min = Math.min(...s.sparkline);
                      const max = Math.max(...s.sparkline);
                      const range = max - min || 1;
                      const points = s.sparkline
                        .map((val, i) => {
                          const x = (i / (s.sparkline.length - 1)) * 60;
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
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
