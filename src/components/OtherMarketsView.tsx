import React from 'react';
import { MarketCategory } from '../types/market';
import { TrendingUp, TrendingDown, Layers, Globe, ShieldAlert, Cpu } from 'lucide-react';

interface OtherMarketsViewProps {
  category: MarketCategory;
  onOpenStockBySymbol: (symbol: string) => void;
}

export const OtherMarketsView: React.FC<OtherMarketsViewProps> = ({
  category,
  onOpenStockBySymbol,
}) => {
  if (category === 'stocks') return null;

  // Domain content based on category
  const getCategoryData = () => {
    switch (category) {
      case 'crypto':
        return {
          title: 'Cryptocurrency Markets',
          subtitle: 'Real-time cryptocurrency quotes, 24h market volume, DeFi TVL, and blockchain asset metrics.',
          stats: [
            { label: 'Total Crypto Cap', value: '$3.18T (+3.4%)' },
            { label: '24h Volume', value: '$112.4B' },
            { label: 'Bitcoin Dominance', value: '58.4%' },
            { label: 'Ethereum Gas', value: '14 Gwei' },
          ],
          items: [
            { symbol: 'BTCUSD', name: 'Bitcoin', price: 88450.00, change: 3.80, vol: '$48.2B', cap: '$1,740B', color: '#f7931a' },
            { symbol: 'ETHUSD', name: 'Ethereum', price: 3410.20, change: 4.15, vol: '$22.8B', cap: '$410B', color: '#627eea' },
            { symbol: 'SOLUSD', name: 'Solana', price: 218.40, change: 6.82, vol: '$9.4B', cap: '$102B', color: '#14f195' },
            { symbol: 'XRPUSD', name: 'XRP', price: 1.14, change: 8.40, vol: '$6.1B', cap: '$64B', color: '#23292f' },
            { symbol: 'BNBUSD', name: 'BNB', price: 654.80, change: 1.95, vol: '$1.8B', cap: '$95B', color: '#f3ba2f' },
            { symbol: 'ADAUSD', name: 'Cardano', price: 0.78, change: 5.10, vol: '$1.2B', cap: '$28B', color: '#0033ad' },
            { symbol: 'AVAXUSD', name: 'Avalanche', price: 38.60, change: 3.90, vol: '$840M', cap: '$15B', color: '#e84142' },
            { symbol: 'DOGEUSD', name: 'Dogecoin', price: 0.39, change: 12.40, vol: '$8.2B', cap: '$57B', color: '#c2a633' },
          ],
        };
      case 'forex':
        return {
          title: 'Forex Currencies & FX Rates',
          subtitle: 'Live foreign exchange major, minor, and exotic currency pairs with central bank policy rates.',
          stats: [
            { label: 'Most Traded', value: 'EUR / USD' },
            { label: 'Fed Funds Rate', value: '4.50% - 4.75%' },
            { label: 'ECB Deposit Rate', value: '3.25%' },
            { label: 'BoJ Policy Rate', value: '0.25%' },
          ],
          items: [
            { symbol: 'EURUSD', name: 'Euro / US Dollar', price: 1.0542, change: 0.28, vol: 'High', cap: 'Major', color: '#003399' },
            { symbol: 'GBPUSD', name: 'British Pound / US Dollar', price: 1.2618, change: 0.45, vol: 'High', cap: 'Major', color: '#c8102e' },
            { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', price: 154.20, change: -0.32, vol: 'High', cap: 'Major', color: '#bc002d' },
            { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', price: 0.8872, change: -0.15, vol: 'Medium', cap: 'Major', color: '#d52b1e' },
            { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', price: 0.6520, change: 0.64, vol: 'High', cap: 'Major', color: '#002b7f' },
            { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', price: 1.3980, change: -0.22, vol: 'Medium', cap: 'Major', color: '#ff0000' },
            { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', price: 0.5890, change: 0.52, vol: 'Medium', cap: 'Major', color: '#00247d' },
          ],
        };
      case 'indices':
        return {
          title: 'Global Stock Market Indices',
          subtitle: 'Benchmark equity indices across the Americas, Europe, and Asia-Pacific tracking global economic performance.',
          stats: [
            { label: 'S&P 500 P/E', value: '25.8x' },
            { label: 'Global Breadth', value: '62% Advancing' },
            { label: 'World GDP Coverage', value: '88%' },
            { label: 'VIX Volatility', value: '14.85 (-4.0%)' },
          ],
          items: [
            { symbol: 'SPX', name: 'S&P 500 (US)', price: 5864.67, change: 0.74, vol: '$4.2B', cap: '$50.2T', color: '#2962ff' },
            { symbol: 'NDX', name: 'Nasdaq 100 (Tech)', price: 20412.30, change: 1.12, vol: '$6.8B', cap: '$22.8T', color: '#00a4ef' },
            { symbol: 'DJI', name: 'Dow Jones Industrial (30)', price: 43729.34, change: 0.32, vol: '$1.4B', cap: '$14.1T', color: '#d11a2a' },
            { symbol: 'RUT', name: 'Russell 2000 (Small Cap)', price: 2289.40, change: 0.80, vol: '$920M', cap: '$3.4T', color: '#10b981' },
            { symbol: 'DAX', name: 'DAX 40 (Germany)', price: 19280.50, change: 0.58, vol: '€1.8B', cap: '€1.9T', color: '#ffcc00' },
            { symbol: 'FTSE', name: 'FTSE 100 (UK)', price: 8140.20, change: 0.42, vol: '£1.1B', cap: '£2.1T', color: '#00247d' },
            { symbol: 'N225', name: 'Nikkei 225 (Japan)', price: 38720.00, change: 0.94, vol: '¥2.4T', cap: '¥720T', color: '#bc002d' },
            { symbol: 'HSI', name: 'Hang Seng (Hong Kong)', price: 19680.00, change: -0.45, vol: 'HK$88B', cap: 'HK$32T', color: '#de2910' },
          ],
        };
      case 'futures':
        return {
          title: 'Commodities & Financial Futures',
          subtitle: 'Energy, precious metals, agriculture, and interest rate futures contracts.',
          stats: [
            { label: 'WTI Crude', value: '$70.38 (+1.18%)' },
            { label: 'Gold (1oz)', value: '$2,684.20 (-0.24%)' },
            { label: 'Silver', value: '$31.40 (+1.05%)' },
            { label: 'Natural Gas', value: '$2.92 (+3.20%)' },
          ],
          items: [
            { symbol: 'CL', name: 'Crude Oil WTI', price: 70.38, change: 1.18, vol: '380K contracts', cap: 'Energy', color: '#000000' },
            { symbol: 'BZ', name: 'Brent Crude Oil', price: 74.20, change: 1.05, vol: '290K contracts', cap: 'Energy', color: '#1e293b' },
            { symbol: 'GC', name: 'Gold Futures', price: 2684.20, change: -0.24, vol: '210K contracts', cap: 'Metals', color: '#f59e0b' },
            { symbol: 'SI', name: 'Silver Futures', price: 31.42, change: 1.05, vol: '84K contracts', cap: 'Metals', color: '#94a3b8' },
            { symbol: 'NG', name: 'Natural Gas', price: 2.92, change: 3.20, vol: '140K contracts', cap: 'Energy', color: '#0ea5e9' },
            { symbol: 'HG', name: 'Copper', price: 4.18, change: 0.85, vol: '72K contracts', cap: 'Metals', color: '#b45309' },
            { symbol: 'ZC', name: 'Corn Futures', price: 428.50, change: -0.40, vol: '95K contracts', cap: 'Grains', color: '#eab308' },
          ],
        };
      case 'bonds':
        return {
          title: 'Sovereign Bonds & Yield Curve',
          subtitle: 'Government debt instruments, benchmark yields, and treasury curve dynamics.',
          stats: [
            { label: 'US 10Y Benchmark', value: '4.432% (-1.8 bps)' },
            { label: 'US 2Y Benchmark', value: '4.285% (-2.1 bps)' },
            { label: '10Y - 2Y Spread', value: '+14.7 bps (Normal)' },
            { label: 'Germany 10Y Bund', value: '2.340% (-1.2 bps)' },
          ],
          items: [
            { symbol: 'US10Y', name: 'US 10-Year Treasury Note', price: 4.432, change: -0.40, vol: 'High', cap: 'Sovereign', color: '#2962ff' },
            { symbol: 'US02Y', name: 'US 2-Year Treasury Note', price: 4.285, change: -0.48, vol: 'High', cap: 'Sovereign', color: '#0284c7' },
            { symbol: 'US30Y', name: 'US 30-Year Treasury Bond', price: 4.620, change: -0.25, vol: 'High', cap: 'Sovereign', color: '#1d4ed8' },
            { symbol: 'US05Y', name: 'US 5-Year Treasury Note', price: 4.310, change: -0.42, vol: 'High', cap: 'Sovereign', color: '#2563eb' },
            { symbol: 'DE10Y', name: 'Germany 10Y Bund', price: 2.340, change: -0.51, vol: 'High', cap: 'Eurozone', color: '#000000' },
            { symbol: 'GB10Y', name: 'UK 10Y Gilt', price: 4.410, change: -0.15, vol: 'Medium', cap: 'UK Debt', color: '#c8102e' },
            { symbol: 'JP10Y', name: 'Japan 10Y JGB', price: 1.050, change: 0.95, vol: 'Medium', cap: 'Asia', color: '#bc002d' },
          ],
        };
      default: // overview
        return {
          title: 'Global Markets Overview',
          subtitle: 'Cross-asset radar scanning equities, crypto, commodities, forex, and sovereign debt in one unified dashboard.',
          stats: [
            { label: 'Global Equities', value: 'Broadly Bullish' },
            { label: 'Oil Market', value: '$70.38 (+1.18%)' },
            { label: 'Bitcoin', value: '$88,450 (+3.8%)' },
            { label: 'US 10Y Yield', value: '4.432% (-1.8 bps)' },
          ],
          items: [
            { symbol: 'SPX', name: 'S&P 500 Index', price: 5864.67, change: 0.74, vol: '$4.2B', cap: 'Equities', color: '#2962ff' },
            { symbol: 'BTCUSD', name: 'Bitcoin / USD', price: 88450.00, change: 3.80, vol: '$48.2B', cap: 'Crypto', color: '#f7931a' },
            { symbol: 'CL', name: 'Crude Oil WTI', price: 70.38, change: 1.18, vol: 'High', cap: 'Commodities', color: '#000000' },
            { symbol: 'GC', name: 'Gold Futures', price: 2684.20, change: -0.24, vol: 'High', cap: 'Metals', color: '#f59e0b' },
            { symbol: 'EURUSD', name: 'EUR / USD', price: 1.0542, change: 0.28, vol: 'High', cap: 'Forex', color: '#003399' },
            { symbol: 'US10Y', name: 'US 10Y Benchmark', price: 4.432, change: -0.40, vol: 'High', cap: 'Bonds', color: '#2563eb' },
          ],
        };
    }
  };

  const data = getCategoryData();

  return (
    <div className="space-y-6 pt-2 pb-6">
      {/* Title & Stats */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
            <span>Markets</span>
            <span aria-hidden="true">/</span>
            <span className="text-neutral-900 dark:text-neutral-200 font-semibold capitalize">
              {category}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-white">
            {data.title}
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-2xl mt-1">
            {data.subtitle}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="flex flex-wrap items-center gap-3 p-2 bg-neutral-100 dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800 text-xs">
          {data.stats.map((st, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block" />}
              <div className="flex flex-col px-2">
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400">{st.label}</span>
                <span className="font-mono font-bold text-neutral-900 dark:text-white">{st.value}</span>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800/80 overflow-hidden shadow-xs">
        <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            {category.toUpperCase()} Assets &amp; Rates
          </span>
          <span className="text-xs text-neutral-500 font-mono">
            {data.items.length} instruments
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-[#181c27] text-[11px] font-semibold text-neutral-400 uppercase">
                <th className="py-2.5 px-3">Symbol &amp; Name</th>
                <th className="py-2.5 px-3 text-right">Price / Rate</th>
                <th className="py-2.5 px-3 text-right">24h Change %</th>
                <th className="py-2.5 px-3 text-right">Volume</th>
                <th className="py-2.5 px-3 text-right">Market Class</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono">
              {data.items.map((it) => {
                const isUp = it.change >= 0;
                return (
                  <tr
                    key={it.symbol}
                    className="hover:bg-neutral-50 dark:hover:bg-[#202534] transition-colors cursor-pointer"
                  >
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-[10px] text-white"
                          style={{ backgroundColor: it.color }}
                        >
                          {it.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-neutral-900 dark:text-white">
                            {it.symbol}
                          </div>
                          <div className="text-[11px] text-neutral-500">{it.name}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-right font-bold text-neutral-900 dark:text-white tabular-nums">
                      {it.price > 1000
                        ? it.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : it.price.toFixed(category === 'forex' ? 4 : category === 'bonds' ? 3 : 2)}
                    </td>

                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={`inline-flex items-center gap-0.5 font-bold px-1.5 py-0.5 rounded ${
                          isUp
                            ? 'text-emerald-700 dark:text-[#089981] bg-emerald-50 dark:bg-[#089981]/10'
                            : 'text-rose-700 dark:text-[#f23645] bg-rose-50 dark:bg-[#f23645]/10'
                        }`}
                      >
                        {isUp ? '+' : ''}
                        {it.change.toFixed(2)}%
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right text-neutral-600 dark:text-neutral-400">
                      {it.vol}
                    </td>

                    <td className="py-3 px-3 text-right font-sans text-neutral-500 font-medium">
                      {it.cap}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
