export type MarketCategory = 'overview' | 'stocks' | 'crypto' | 'forex' | 'indices' | 'futures' | 'bonds';

export type ScreenerTab = 'most-active' | 'top-gainers' | 'top-losers' | 'large-cap' | '52w-high' | 'high-dividend' | 'all';

export type TableViewMode = 'overview' | 'performance' | 'valuation' | 'technical';

export type ChartType = 'candles' | 'area' | 'line';

export type Timeframe = '1D' | '5D' | '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface Candle {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  open: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
  avgVolume: number;
  relativeVolume: number;
  marketCap: number; // in billions
  peRatio: number | null;
  forwardPe: number | null;
  eps: number;
  dividendYield: number; // percentage
  beta: number;
  high52W: number;
  low52W: number;
  technicalRating: TechnicalRating;
  ratingScore: number; // -100 to +100
  oscillatorsScore: TechnicalRating;
  movingAveragesScore: TechnicalRating;
  sector: string;
  industry: string;
  exchange: 'NASDAQ' | 'NYSE';
  description: string;
  ceo: string;
  headquarters: string;
  employees: number;
  founded: number;
  targetPrice: number;
  analystRating: 'Strong Buy' | 'Buy' | 'Hold' | 'Underperform';
  sparkline: number[];
  color: string;
  logoBg: string;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  sparkline: number[];
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: number;
  topStock: string;
  topStockChange: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: 'Equities' | 'Fed' | 'Earnings' | 'Tech' | 'Economy';
  url: string;
  tickers: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

export interface EconomicEvent {
  time: string;
  country: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface PaperTradePosition {
  id: string;
  symbol: string;
  name: string;
  type: 'buy' | 'sell';
  shares: number;
  entryPrice: number;
  currentPrice: number;
  date: string;
}
