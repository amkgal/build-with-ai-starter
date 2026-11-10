import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Stock, Candle, Timeframe, ChartType } from '../types/market';
import { generateCandles } from '../data/mockMarketData';
import {
  CandlestickChart,
  AreaChart as AreaChartIcon,
  TrendingUp,
  Sliders,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface InteractiveChartProps {
  stock: Stock;
  height?: number;
}

export const InteractiveChart: React.FC<InteractiveChartProps> = ({ stock, height = 380 }) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [chartType, setChartType] = useState<ChartType>('candles');
  const [showSMA20, setShowSMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [showRSI, setShowRSI] = useState(false);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(700);

  // Resize observer for responsive canvas/SVG
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setChartWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Generate candles for current stock and timeframe
  const candles: Candle[] = useMemo(() => {
    return generateCandles(stock, timeframe);
  }, [stock, timeframe]);

  // Compute Moving Averages
  const { sma20, ema50, rsiValues } = useMemo(() => {
    const closes = candles.map((c) => c.close);

    // SMA 20
    const sma: (number | null)[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 5) {
        sma.push(null);
      } else {
        const slice = closes.slice(Math.max(0, i - 19), i + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        sma.push(avg);
      }
    }

    // EMA 50 (or smoothed MA)
    const ema: (number | null)[] = [];
    let prevEma = closes[0];
    const k = 2 / (Math.min(50, closes.length) + 1);
    for (let i = 0; i < closes.length; i++) {
      if (i === 0) {
        ema.push(prevEma);
      } else {
        const curr = closes[i] * k + prevEma * (1 - k);
        ema.push(curr);
        prevEma = curr;
      }
    }

    // Simple RSI 14 simulation
    const rsi: number[] = [];
    for (let i = 0; i < closes.length; i++) {
      if (i < 14) {
        rsi.push(50);
      } else {
        let gains = 0;
        let losses = 0;
        for (let j = i - 13; j <= i; j++) {
          const diff = closes[j] - closes[j - 1];
          if (diff >= 0) gains += diff;
          else losses += Math.abs(diff);
        }
        const avgGain = gains / 14;
        const avgLoss = losses / 14;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        const val = 100 - 100 / (1 + rs);
        rsi.push(Math.round(val));
      }
    }

    return { sma20: sma, ema50: ema, rsiValues: rsi };
  }, [candles]);

  // Chart bounds & layout
  const padding = { top: 20, right: 65, bottom: showRSI ? 80 : 35, left: 10 };
  const rsiHeight = showRSI ? 60 : 0;
  const mainHeight = height - padding.top - padding.bottom;

  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map((c) => c.volume)) || 1;

  const getY = (price: number) => {
    return padding.top + mainHeight - ((price - minPrice) / priceRange) * mainHeight;
  };

  const getX = (index: number) => {
    const usableWidth = chartWidth - padding.left - padding.right;
    const step = usableWidth / (candles.length - 1 || 1);
    return padding.left + index * step;
  };

  // Hovered candle or last candle
  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  // Mouse move handler for crosshair
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const usableWidth = chartWidth - padding.left - padding.right;
    const relativeX = mouseX - padding.left;
    const index = Math.round((relativeX / usableWidth) * (candles.length - 1));
    if (index >= 0 && index < candles.length) {
      setHoverIndex(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
  };

  // Path generators for Area/Line
  const linePoints = useMemo(() => {
    return candles.map((c, i) => `${getX(i)},${getY(c.close)}`).join(' ');
  }, [candles, chartWidth, minPrice, maxPrice]);

  const areaPath = useMemo(() => {
    if (!candles.length) return '';
    const firstX = getX(0);
    const lastX = getX(candles.length - 1);
    const bottomY = padding.top + mainHeight;
    return `M ${firstX},${bottomY} L ${candles
      .map((c, i) => `${getX(i)},${getY(c.close)}`)
      .join(' L ')} L ${lastX},${bottomY} Z`;
  }, [candles, chartWidth, minPrice, maxPrice]);

  // Price ticks for Y axis
  const priceTicks = useMemo(() => {
    const ticks: number[] = [];
    const count = 5;
    for (let i = 0; i <= count; i++) {
      ticks.push(minPrice + (priceRange / count) * i);
    }
    return ticks;
  }, [minPrice, priceRange]);

  const isBullishCandle = activeCandle ? activeCandle.close >= activeCandle.open : true;

  return (
    <div className="bg-white dark:bg-[#131722] rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 select-none">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/80">
        {/* Timeframes */}
        <div className="flex items-center gap-1">
          {(['1D', '5D', '1M', '3M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-2 py-1 text-xs font-semibold rounded transition-colors ${
                timeframe === tf
                  ? 'bg-[#2962ff] text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Chart Style & Indicators */}
        <div className="flex items-center gap-2">
          {/* Chart Type Toggle */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded p-0.5">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1 rounded text-xs font-medium ${
                chartType === 'candles'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Candlestick Chart"
            >
              <CandlestickChart className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`p-1 rounded text-xs font-medium ${
                chartType === 'area'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Area Chart"
            >
              <AreaChartIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1 rounded text-xs font-medium ${
                chartType === 'line'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-2xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title="Line Chart"
            >
              <TrendingUp className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Indicator toggles */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setShowSMA20(!showSMA20)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors border ${
                showSMA20
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              SMA 20
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors border ${
                showEMA50
                  ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              EMA 50
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors border ${
                showVolume
                  ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              Vol
            </button>
            <button
              onClick={() => setShowRSI(!showRSI)}
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-colors border ${
                showRSI
                  ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30'
                  : 'text-neutral-400 border-transparent hover:text-neutral-700'
              }`}
            >
              RSI (14)
            </button>
          </div>
        </div>
      </div>

      {/* Real-time OHLCV Bar */}
      {activeCandle && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 py-2 text-[11px] font-mono border-b border-neutral-100 dark:border-neutral-800/60 text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {activeCandle.time}
          </span>
          <div>
            <span>O: </span>
            <span className="text-neutral-900 dark:text-white font-bold">${activeCandle.open.toFixed(2)}</span>
          </div>
          <div>
            <span>H: </span>
            <span className="text-neutral-900 dark:text-white font-bold">${activeCandle.high.toFixed(2)}</span>
          </div>
          <div>
            <span>L: </span>
            <span className="text-neutral-900 dark:text-white font-bold">${activeCandle.low.toFixed(2)}</span>
          </div>
          <div>
            <span>C: </span>
            <span
              className={`font-bold ${
                isBullishCandle ? 'text-emerald-600 dark:text-[#089981]' : 'text-rose-600 dark:text-[#f23645]'
              }`}
            >
              ${activeCandle.close.toFixed(2)}
            </span>
          </div>
          <div>
            <span>Vol: </span>
            <span className="text-neutral-900 dark:text-white">
              {(activeCandle.volume / 1000).toFixed(0)}k
            </span>
          </div>
          {showSMA20 && hoverIndex !== null && sma20[hoverIndex] && (
            <div className="text-amber-500 font-semibold">
              SMA 20: ${sma20[hoverIndex]?.toFixed(2)}
            </div>
          )}
          {showEMA50 && hoverIndex !== null && ema50[hoverIndex] && (
            <div className="text-cyan-400 font-semibold">
              EMA 50: ${ema50[hoverIndex]?.toFixed(2)}
            </div>
          )}
        </div>
      )}

      {/* SVG Canvas Chart */}
      <div ref={containerRef} className="relative w-full mt-2 cursor-crosshair">
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${chartWidth} ${height}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2962ff" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#2962ff" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {priceTicks.map((price, i) => {
            const y = getY(price);
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800/80"
                  strokeDasharray="2,3"
                />
                <text
                  x={chartWidth - padding.right + 8}
                  y={y + 4}
                  className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[10px]"
                >
                  ${price.toFixed(2)}
                </text>
              </g>
            );
          })}

          {/* Volume Histogram (bottom 25% of main area) */}
          {showVolume &&
            candles.map((c, i) => {
              const x = getX(i);
              const barWidth = Math.max(2, (chartWidth - padding.left - padding.right) / candles.length - 2);
              const volHeight = (c.volume / maxVolume) * (mainHeight * 0.22);
              const y = padding.top + mainHeight - volHeight;
              const isUp = c.close >= c.open;

              return (
                <rect
                  key={`vol-${i}`}
                  x={x - barWidth / 2}
                  y={y}
                  width={barWidth}
                  height={volHeight}
                  fill={isUp ? '#089981' : '#f23645'}
                  opacity={hoverIndex === i ? 0.75 : 0.28}
                />
              );
            })}

          {/* Area Chart Mode */}
          {chartType === 'area' && (
            <>
              <path d={areaPath} fill="url(#areaGrad)" />
              <polyline
                fill="none"
                stroke="#2962ff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={linePoints}
              />
            </>
          )}

          {/* Line Chart Mode */}
          {chartType === 'line' && (
            <polyline
              fill="none"
              stroke="#2962ff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={linePoints}
            />
          )}

          {/* Candlestick Mode */}
          {chartType === 'candles' &&
            candles.map((c, i) => {
              const x = getX(i);
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const isUp = c.close >= c.open;
              const candleColor = isUp ? '#089981' : '#f23645';

              const barWidth = Math.max(3, Math.min(10, (chartWidth - padding.left - padding.right) / candles.length - 2));
              const topY = Math.min(openY, closeY);
              const bodyHeight = Math.max(1.5, Math.abs(closeY - openY));

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={x - barWidth / 2}
                    y={topY}
                    width={barWidth}
                    height={bodyHeight}
                    fill={candleColor}
                    rx="0.5"
                  />
                </g>
              );
            })}

          {/* SMA 20 Overlay */}
          {showSMA20 && (
            <polyline
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeLinejoin="round"
              points={candles
                .map((_, i) => (sma20[i] !== null ? `${getX(i)},${getY(sma20[i]!)}` : null))
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* EMA 50 Overlay */}
          {showEMA50 && (
            <polyline
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1.5"
              strokeLinejoin="round"
              points={candles
                .map((_, i) => (ema50[i] !== null ? `${getX(i)},${getY(ema50[i]!)}` : null))
                .filter(Boolean)
                .join(' ')}
            />
          )}

          {/* RSI Sub-indicator Pane */}
          {showRSI && (
            <g>
              {/* Divider */}
              <line
                x1={padding.left}
                y1={padding.top + mainHeight + 15}
                x2={chartWidth - padding.right}
                y2={padding.top + mainHeight + 15}
                stroke="currentColor"
                className="text-neutral-300 dark:text-neutral-700"
              />
              {/* 70 & 30 Lines */}
              {(() => {
                const rsiBaseY = padding.top + mainHeight + 15;
                const rsiY70 = rsiBaseY + rsiHeight * 0.3;
                const rsiY30 = rsiBaseY + rsiHeight * 0.7;
                return (
                  <>
                    <line
                      x1={padding.left}
                      y1={rsiY70}
                      x2={chartWidth - padding.right}
                      y2={rsiY70}
                      stroke="#f23645"
                      strokeDasharray="2,2"
                      opacity="0.4"
                    />
                    <line
                      x1={padding.left}
                      y1={rsiY30}
                      x2={chartWidth - padding.right}
                      y2={rsiY30}
                      stroke="#089981"
                      strokeDasharray="2,2"
                      opacity="0.4"
                    />
                    <text
                      x={chartWidth - padding.right + 8}
                      y={rsiY70 + 3}
                      className="fill-rose-400 font-mono text-[9px]"
                    >
                      70
                    </text>
                    <text
                      x={chartWidth - padding.right + 8}
                      y={rsiY30 + 3}
                      className="fill-emerald-400 font-mono text-[9px]"
                    >
                      30
                    </text>
                    <polyline
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                      points={candles
                        .map((_, i) => {
                          const rsiVal = rsiValues[i];
                          const y = rsiBaseY + rsiHeight * (1 - rsiVal / 100);
                          return `${getX(i)},${y}`;
                        })
                        .join(' ')}
                    />
                  </>
                );
              })()}
            </g>
          )}

          {/* Interactive Crosshair Cursor */}
          {hoverIndex !== null && (
            <g>
              {/* Vertical line */}
              <line
                x1={getX(hoverIndex)}
                y1={padding.top}
                x2={getX(hoverIndex)}
                y2={padding.top + mainHeight}
                stroke="#2962ff"
                strokeDasharray="3,3"
                strokeWidth="1"
              />
              {/* Horizontal line at close price */}
              <line
                x1={padding.left}
                y1={getY(candles[hoverIndex].close)}
                x2={chartWidth - padding.right}
                y2={getY(candles[hoverIndex].close)}
                stroke="#2962ff"
                strokeDasharray="3,3"
                strokeWidth="1"
              />
              {/* Highlight circle */}
              <circle
                cx={getX(hoverIndex)}
                cy={getY(candles[hoverIndex].close)}
                r="4"
                fill="#2962ff"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
              {/* Price badge on right axis */}
              <rect
                x={chartWidth - padding.right + 2}
                y={getY(candles[hoverIndex].close) - 9}
                width={58}
                height={18}
                fill="#2962ff"
                rx="2"
              />
              <text
                x={chartWidth - padding.right + 6}
                y={getY(candles[hoverIndex].close) + 3}
                fill="#ffffff"
                className="font-mono text-[10px] font-bold"
              >
                ${candles[hoverIndex].close.toFixed(2)}
              </text>
            </g>
          )}

          {/* Time axis labels */}
          {candles
            .filter((_, idx) => idx % Math.ceil(candles.length / 6) === 0)
            .map((c, i) => {
              const originalIndex = candles.indexOf(c);
              return (
                <text
                  key={`time-${i}`}
                  x={getX(originalIndex)}
                  y={padding.top + mainHeight + (showRSI ? rsiHeight + 30 : 20)}
                  textAnchor="middle"
                  className="fill-neutral-400 dark:fill-neutral-500 font-mono text-[9px]"
                >
                  {c.time}
                </text>
              );
            })}
        </svg>
      </div>
    </div>
  );
};
