import React from 'react';
import { PaperTradePosition, Stock } from '../types/market';
import { Briefcase, X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface PaperPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  positions: PaperTradePosition[];
  cashBalance: number;
  onClosePosition: (id: string) => void;
  onResetPortfolio: () => void;
  allStocks: Stock[];
  onSelectStock: (stock: Stock) => void;
}

export const PaperPortfolioModal: React.FC<PaperPortfolioModalProps> = ({
  isOpen,
  onClose,
  positions,
  cashBalance,
  onClosePosition,
  onResetPortfolio,
  allStocks,
  onSelectStock,
}) => {
  if (!isOpen) return null;

  // Compute portfolio value
  const stockMap = new Map(allStocks.map((s) => [s.symbol, s]));

  let totalHoldingsValue = 0;
  let totalUnrealizedPnL = 0;

  positions.forEach((pos) => {
    const liveStock = stockMap.get(pos.symbol);
    const curPrice = liveStock ? liveStock.price : pos.currentPrice;
    const value = pos.shares * curPrice;
    const cost = pos.shares * pos.entryPrice;
    const pnl = pos.type === 'buy' ? value - cost : cost - value;

    totalHoldingsValue += value;
    totalUnrealizedPnL += pnl;
  });

  const totalPortfolioValue = cashBalance + totalHoldingsValue;
  const initialCapital = 100000;
  const totalReturn = totalPortfolioValue - initialCapital;
  const totalReturnPct = (totalReturn / initialCapital) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1e222d] w-full max-w-3xl rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#2962ff]" />
            <div>
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-white">
                Paper Trading Portfolio
              </h2>
              <span className="text-xs text-neutral-500">
                Simulated execution with zero market risk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onResetPortfolio}
              className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300 font-medium px-2 py-1 rounded border border-neutral-200 dark:border-neutral-700"
            >
              Reset ($100k)
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Portfolio Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-neutral-50 dark:bg-[#181c27] border-b border-neutral-200 dark:border-neutral-800 text-xs font-mono">
          <div>
            <span className="text-[10px] text-neutral-400 font-sans block">Total Equity</span>
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              ${totalPortfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 font-sans block">Available Cash</span>
            <span className="text-base font-bold text-neutral-900 dark:text-white">
              ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 font-sans block">Open Positions P&amp;L</span>
            <span
              className={`text-base font-bold ${
                totalUnrealizedPnL >= 0
                  ? 'text-emerald-600 dark:text-[#089981]'
                  : 'text-rose-600 dark:text-[#f23645]'
              }`}
            >
              {totalUnrealizedPnL >= 0 ? '+' : ''}
              ${totalUnrealizedPnL.toFixed(2)}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-neutral-400 font-sans block">Overall Return</span>
            <span
              className={`text-base font-bold ${
                totalReturn >= 0
                  ? 'text-emerald-600 dark:text-[#089981]'
                  : 'text-rose-600 dark:text-[#f23645]'
              }`}
            >
              {totalReturn >= 0 ? '+' : ''}
              {totalReturnPct.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Open Positions Table */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
            Open Positions ({positions.length})
          </h3>

          {positions.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs space-y-2">
              <p className="font-semibold text-neutral-600 dark:text-neutral-300">No active positions</p>
              <p>Click on any stock in the screener to place a simulated paper trade.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 uppercase">
                    <th className="py-2 px-2">Ticker</th>
                    <th className="py-2 px-2">Side</th>
                    <th className="py-2 px-2 text-right">Shares</th>
                    <th className="py-2 px-2 text-right">Entry Price</th>
                    <th className="py-2 px-2 text-right">Live Price</th>
                    <th className="py-2 px-2 text-right">Unrealized P&amp;L</th>
                    <th className="py-2 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {positions.map((pos) => {
                    const liveStock = stockMap.get(pos.symbol);
                    const curPrice = liveStock ? liveStock.price : pos.currentPrice;
                    const value = pos.shares * curPrice;
                    const cost = pos.shares * pos.entryPrice;
                    const pnl = pos.type === 'buy' ? value - cost : cost - value;
                    const pnlPct = (pnl / cost) * 100;
                    const isUp = pnl >= 0;

                    return (
                      <tr key={pos.id} className="hover:bg-neutral-50 dark:hover:bg-[#202534]">
                        <td className="py-2.5 px-2 font-bold font-sans">
                          <button
                            onClick={() => {
                              if (liveStock) onSelectStock(liveStock);
                              onClose();
                            }}
                            className="hover:text-[#2962ff] transition-colors"
                          >
                            {pos.symbol}
                          </button>
                        </td>
                        <td className="py-2.5 px-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              pos.type === 'buy'
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-[#089981]'
                                : 'bg-rose-500/10 text-rose-600 dark:text-[#f23645]'
                            }`}
                          >
                            {pos.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-2 text-right">{pos.shares}</td>
                        <td className="py-2.5 px-2 text-right">${pos.entryPrice.toFixed(2)}</td>
                        <td className="py-2.5 px-2 text-right font-bold">${curPrice.toFixed(2)}</td>
                        <td
                          className={`py-2.5 px-2 text-right font-bold ${
                            isUp ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
                          }`}
                        >
                          {isUp ? '+' : ''}${pnl.toFixed(2)} ({isUp ? '+' : ''}
                          {pnlPct.toFixed(2)}%)
                        </td>
                        <td className="py-2.5 px-2 text-right">
                          <button
                            onClick={() => onClosePosition(pos.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-sans font-semibold px-2 py-0.5 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          >
                            Close
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
