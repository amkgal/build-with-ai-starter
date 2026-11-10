import React from 'react';
import { MarketIndex } from '../types/market';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerMarqueeProps {
  indices: MarketIndex[];
  onSelectIndex: (symbol: string) => void;
}

export const TickerMarquee: React.FC<TickerMarqueeProps> = ({ indices, onSelectIndex }) => {
  return (
    <div className="w-full bg-neutral-50 dark:bg-[#181c27] border-b border-neutral-200 dark:border-neutral-800/80 overflow-x-auto no-scrollbar py-1.5 px-4">
      <div className="flex items-center gap-3 sm:gap-6 min-w-max">
        {indices.map((item) => {
          const isUp = item.change >= 0;
          return (
            <div
              key={item.symbol}
              onClick={() => onSelectIndex(item.symbol)}
              className="flex items-center gap-2 cursor-pointer group py-0.5 px-2 rounded hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 transition-colors"
            >
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-[#2962ff] transition-colors">
                {item.name}
              </span>
              <span className="text-xs font-mono font-medium text-neutral-900 dark:text-white tabular-nums">
                {item.price > 1000 ? item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price.toFixed(item.symbol === 'US10Y' ? 3 : 2)}
              </span>
              <div
                className={`flex items-center gap-0.5 text-[11px] font-mono font-semibold tabular-nums ${
                  isUp ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
                }`}
              >
                {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>
                  {isUp ? '+' : ''}
                  {item.changePercent.toFixed(2)}%
                </span>
              </div>

              {/* Mini Sparkline SVG */}
              <div className="w-12 h-4 hidden sm:block">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 50 16">
                  {(() => {
                    const min = Math.min(...item.sparkline);
                    const max = Math.max(...item.sparkline);
                    const range = max - min || 1;
                    const points = item.sparkline
                      .map((val, idx) => {
                        const x = (idx / (item.sparkline.length - 1)) * 50;
                        const y = 16 - ((val - min) / range) * 14 - 1;
                        return `${x},${y}`;
                      })
                      .join(' ');
                    return (
                      <polyline
                        fill="none"
                        stroke={isUp ? '#089981' : '#f23645'}
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
          );
        })}
      </div>
    </div>
  );
};
