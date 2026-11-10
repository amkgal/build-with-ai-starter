import React, { useState } from 'react';
import { NewsArticle, EconomicEvent, Stock } from '../types/market';
import { Newspaper, Calendar, ExternalLink, ArrowUpRight, TrendingUp, TrendingDown } from 'lucide-react';

interface MarketNewsSectionProps {
  news: NewsArticle[];
  calendar: EconomicEvent[];
  allStocks: Stock[];
  onSelectStockBySymbol: (symbol: string) => void;
}

export const MarketNewsSection: React.FC<MarketNewsSectionProps> = ({
  news,
  calendar,
  allStocks,
  onSelectStockBySymbol,
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'calendar'>('news');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const categories = ['All', 'Tech', 'Fed', 'Earnings', 'Economy', 'Equities'];

  const filteredNews = categoryFilter === 'All'
    ? news
    : news.filter((n) => n.category === categoryFilter);

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800/80 p-4 shadow-xs">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Market News &amp; Economic Calendar
          </h2>
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-md">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'news'
                ? 'bg-white dark:bg-[#131722] text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Latest News
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-[#131722] text-neutral-900 dark:text-white shadow-2xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Economic Calendar
          </button>
        </div>
      </div>

      {/* News Stream View */}
      {activeTab === 'news' && (
        <div className="pt-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-3 text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  categoryFilter === cat
                    ? 'bg-neutral-900 dark:bg-neutral-700 text-white'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {filteredNews.map((article) => {
              return (
                <div
                  key={article.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 hover:bg-neutral-50/50 dark:hover:bg-[#202534]/50 rounded-md px-2 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500">
                      <span className="font-semibold text-neutral-800 dark:text-neutral-300">
                        {article.source}
                      </span>
                      <span>·</span>
                      <span>{article.timeAgo}</span>
                      <span>·</span>
                      <span className="px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400 font-mono">
                        {article.category}
                      </span>
                    </div>

                    <a
                      href={article.url}
                      onClick={(e) => e.preventDefault()}
                      className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-neutral-100 hover:text-[#2962ff] dark:hover:text-[#2962ff] transition-colors leading-snug block"
                    >
                      {article.title}
                    </a>
                  </div>

                  {/* Impacted Tickers */}
                  <div className="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
                    {article.tickers.map((sym) => {
                      return (
                        <button
                          key={sym}
                          onClick={() => onSelectStockBySymbol(sym)}
                          className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-neutral-100 dark:bg-neutral-800 text-[#2962ff] hover:bg-[#2962ff] hover:text-white transition-colors border border-neutral-200 dark:border-neutral-700"
                        >
                          ${sym}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Economic Calendar View */}
      {activeTab === 'calendar' && (
        <div className="pt-3 overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[11px] font-semibold text-neutral-400 uppercase">
                <th className="py-2 px-3">Time</th>
                <th className="py-2 px-3">Country</th>
                <th className="py-2 px-3">Event</th>
                <th className="py-2 px-3 text-center">Impact</th>
                <th className="py-2 px-3 text-right">Actual</th>
                <th className="py-2 px-3 text-right">Forecast</th>
                <th className="py-2 px-3 text-right">Previous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
              {calendar.map((ev, i) => (
                <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-[#202534]">
                  <td className="py-2.5 px-3 text-neutral-500">{ev.time}</td>
                  <td className="py-2.5 px-3 font-bold text-neutral-800 dark:text-neutral-200">
                    {ev.country}
                  </td>
                  <td className="py-2.5 px-3 font-sans font-medium text-neutral-900 dark:text-white">
                    {ev.event}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-bold capitalize ${
                        ev.impact === 'high'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          : ev.impact === 'medium'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {ev.impact}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-neutral-900 dark:text-white">
                    {ev.actual ?? '—'}
                  </td>
                  <td className="py-2.5 px-3 text-right text-neutral-500">{ev.forecast}</td>
                  <td className="py-2.5 px-3 text-right text-neutral-400">{ev.previous}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
