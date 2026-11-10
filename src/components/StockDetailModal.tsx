import React, { useState } from 'react';
import { Stock, PaperTradePosition } from '../types/market';
import { InteractiveChart } from './InteractiveChart';
import { TechnicalGauge } from './TechnicalGauge';
import {
  X,
  Star,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  MapPin,
  Calendar,
  CheckCircle2,
  Share2,
} from 'lucide-react';

interface StockDetailModalProps {
  stock: Stock | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (symbol: string) => void;
  onExecuteTrade: (position: Omit<PaperTradePosition, 'id' | 'date'>) => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({
  stock,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onExecuteTrade,
}) => {
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [shares, setShares] = useState<number>(10);
  const [tradeSuccessMsg, setTradeSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!stock) return null;

  const isPositive = stock.changePercent >= 0;
  const totalCost = shares * stock.price;

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shares <= 0) return;

    onExecuteTrade({
      symbol: stock.symbol,
      name: stock.name,
      type: tradeType,
      shares,
      entryPrice: stock.price,
      currentPrice: stock.price,
    });

    setTradeSuccessMsg(
      `Paper order executed: ${tradeType.toUpperCase()} ${shares} shares of ${stock.symbol} at $${stock.price.toFixed(2)}`
    );

    setTimeout(() => {
      setTradeSuccessMsg(null);
    }, 4000);
  };

  const copySymbolLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div
        className="bg-white dark:bg-[#1e222d] w-full max-w-6xl max-h-[92vh] rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-[#181c27]/50">
          <div className="flex items-start gap-3.5">
            <div
              className="w-11 h-11 rounded-lg flex items-center justify-center font-extrabold text-base text-white shadow-xs shrink-0"
              style={{ backgroundColor: stock.color }}
            >
              {stock.symbol.slice(0, 2)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  {stock.symbol}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 font-mono text-neutral-700 dark:text-neutral-300">
                  {stock.exchange}
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {stock.sector} · {stock.industry}
                </span>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                {stock.name}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-mono font-extrabold text-neutral-900 dark:text-white tabular-nums">
                ${stock.price.toFixed(2)}
              </div>
              <div
                className={`text-xs font-mono font-bold tabular-nums flex items-center justify-end gap-1 ${
                  isPositive ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
                }`}
              >
                <span>
                  {isPositive ? '+' : ''}${stock.change.toFixed(2)}
                </span>
                <span>
                  ({isPositive ? '+' : ''}
                  {stock.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <button
                onClick={() => onToggleWatchlist(stock.symbol)}
                className={`p-2 rounded-lg border transition-colors ${
                  isWatchlisted
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 text-amber-500'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500'
                }`}
                title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                onClick={copySymbolLink}
                className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                title="Share ticker"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Body: Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Main Chart Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Interactive Market Chart
              </span>
              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span>Day Range: ${stock.low.toFixed(2)} - ${stock.high.toFixed(2)}</span>
                <span>·</span>
                <span>52W: ${stock.low52W.toFixed(2)} - ${stock.high52W.toFixed(2)}</span>
              </div>
            </div>
            <InteractiveChart stock={stock} height={360} />
          </div>

          {/* 3-Column Grid: Gauge & Paper Trade & Key Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* 1. Technical Speedometer */}
            <div>
              <TechnicalGauge stock={stock} />
            </div>

            {/* 2. Paper Trading Box */}
            <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-[#2962ff]" />
                    Simulated Paper Trading
                  </h3>
                  <span className="text-[10px] font-mono text-neutral-400">Zero Risk</span>
                </div>

                {tradeSuccessMsg && (
                  <div className="mb-3 p-2 text-xs rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{tradeSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handleOrderSubmit} className="space-y-3">
                  {/* Buy / Sell selector */}
                  <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-[#131722] rounded-md">
                    <button
                      type="button"
                      onClick={() => setTradeType('buy')}
                      className={`py-1.5 text-xs font-bold rounded transition-colors ${
                        tradeType === 'buy'
                          ? 'bg-[#089981] text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Buy / Long
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType('sell')}
                      className={`py-1.5 text-xs font-bold rounded transition-colors ${
                        tradeType === 'sell'
                          ? 'bg-[#f23645] text-white shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                      }`}
                    >
                      Sell / Short
                    </button>
                  </div>

                  {/* Quantity input */}
                  <div>
                    <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
                      Quantity (Shares)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10000"
                      value={shares}
                      onChange={(e) => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs font-mono py-2 px-3 bg-neutral-50 dark:bg-[#131722] border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-900 dark:text-white focus:outline-none focus:border-[#2962ff]"
                    />
                  </div>

                  {/* Total calculation */}
                  <div className="p-2.5 rounded bg-neutral-50 dark:bg-[#131722] text-xs space-y-1 font-mono">
                    <div className="flex justify-between text-neutral-500">
                      <span>Market Price:</span>
                      <span>${stock.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-neutral-900 dark:text-white pt-1 border-t border-neutral-200 dark:border-neutral-800">
                      <span>Order Value:</span>
                      <span>${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-2.5 rounded-md font-bold text-xs text-white transition-all shadow-xs ${
                      tradeType === 'buy'
                        ? 'bg-[#089981] hover:bg-[#078570]'
                        : 'bg-[#f23645] hover:bg-[#d62837]'
                    }`}
                  >
                    Execute {tradeType.toUpperCase()} Order
                  </button>
                </form>
              </div>
            </div>

            {/* 3. Valuation & Key Ratios */}
            <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
                Key Valuation &amp; Ratios
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Market Cap</span>
                  <span className="font-bold text-neutral-900 dark:text-white">${stock.marketCap.toFixed(1)}B</span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">P/E (TTM)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{stock.peRatio ?? 'N/A'}</span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Forward P/E</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{stock.forwardPe ?? 'N/A'}</span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">EPS (TTM)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">${stock.eps.toFixed(2)}</span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Dividend Yield</span>
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(2)}%` : '0.00%'}
                  </span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Beta (1Y)</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{stock.beta.toFixed(2)}</span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Analyst Target</span>
                  <span className="font-bold text-emerald-600 dark:text-[#089981]">
                    ${stock.targetPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex flex-col py-1 border-b border-neutral-100 dark:border-neutral-800/60">
                  <span className="text-[10px] text-neutral-400 font-sans">Analyst Consensus</span>
                  <span className="font-bold text-neutral-900 dark:text-white">{stock.analystRating}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Company Profile & Description */}
          <div className="bg-neutral-50 dark:bg-[#181c27] rounded-lg border border-neutral-200 dark:border-neutral-800/80 p-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-2">
              Company Profile &amp; Fundamentals
            </h3>
            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
              {stock.description}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs">
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Users className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <div className="text-[10px] text-neutral-400">CEO</div>
                  <div className="font-medium">{stock.ceo}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <div className="text-[10px] text-neutral-400">Headquarters</div>
                  <div className="font-medium">{stock.headquarters}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <div className="text-[10px] text-neutral-400">Employees</div>
                  <div className="font-medium font-mono">{stock.employees.toLocaleString()}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <div>
                  <div className="text-[10px] text-neutral-400">Founded</div>
                  <div className="font-medium font-mono">{stock.founded}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
