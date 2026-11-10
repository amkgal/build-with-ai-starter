import React from 'react';
import { Stock, TechnicalRating } from '../types/market';

interface TechnicalGaugeProps {
  stock: Stock;
}

export const TechnicalGauge: React.FC<TechnicalGaugeProps> = ({ stock }) => {
  // Angle for the needle:
  // -100 (Strong Sell) -> -70 deg
  // -50 (Sell) -> -35 deg
  // 0 (Neutral) -> 0 deg
  // +50 (Buy) -> +35 deg
  // +100 (Strong Buy) -> +70 deg
  const needleAngle = Math.max(-75, Math.min(75, (stock.ratingScore / 100) * 75));

  const getRatingColor = (rating: TechnicalRating) => {
    switch (rating) {
      case 'Strong Buy':
        return '#089981';
      case 'Buy':
        return '#22c55e';
      case 'Neutral':
        return '#94a3b8';
      case 'Sell':
        return '#f97316';
      case 'Strong Sell':
        return '#f23645';
      default:
        return '#94a3b8';
    }
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
          Technical Analysis Summary
        </h3>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded"
          style={{
            backgroundColor: `${getRatingColor(stock.technicalRating)}20`,
            color: getRatingColor(stock.technicalRating),
          }}
        >
          {stock.technicalRating}
        </span>
      </div>

      {/* Main Speedometer Arc */}
      <div className="flex flex-col items-center justify-center pt-2">
        <div className="relative w-48 h-26 overflow-hidden flex items-end justify-center">
          <svg className="w-48 h-48 overflow-visible" viewBox="0 0 200 200">
            {/* Background Arch Track */}
            <path
              d="M 30,100 A 70,70 0 0,1 170,100"
              fill="none"
              stroke="currentColor"
              className="text-neutral-200 dark:text-neutral-800"
              strokeWidth="14"
              strokeLinecap="round"
            />

            {/* Colored Segments */}
            {/* Strong Sell */}
            <path
              d="M 30,100 A 70,70 0 0,1 48,55"
              fill="none"
              stroke="#f23645"
              strokeWidth="14"
            />
            {/* Sell */}
            <path
              d="M 48,55 A 70,70 0 0,1 82,34"
              fill="none"
              stroke="#f97316"
              strokeWidth="14"
            />
            {/* Neutral */}
            <path
              d="M 82,34 A 70,70 0 0,1 118,34"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="14"
            />
            {/* Buy */}
            <path
              d="M 118,34 A 70,70 0 0,1 152,55"
              fill="none"
              stroke="#22c55e"
              strokeWidth="14"
            />
            {/* Strong Buy */}
            <path
              d="M 152,55 A 70,70 0 0,1 170,100"
              fill="none"
              stroke="#089981"
              strokeWidth="14"
            />

            {/* Pivot & Needle */}
            <g transform={`rotate(${needleAngle}, 100, 100)`}>
              <line
                x1="100"
                y1="100"
                x2="100"
                y2="38"
                stroke="currentColor"
                className="text-neutral-900 dark:text-white"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx="100"
                cy="100"
                r="7"
                fill="currentColor"
                className="text-neutral-900 dark:text-white"
              />
            </g>
          </svg>
        </div>

        {/* Legend labels */}
        <div className="flex justify-between w-full max-w-[210px] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 mt-1">
          <span className="text-rose-500">Strong Sell</span>
          <span>Neutral</span>
          <span className="text-emerald-500">Strong Buy</span>
        </div>
      </div>

      {/* Breakdown: Oscillators vs Summary vs Moving Averages */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 text-center text-xs">
        <div className="p-2 rounded bg-neutral-50 dark:bg-[#131722]/50">
          <span className="text-[10px] text-neutral-400 block mb-0.5">Oscillators</span>
          <span
            className="font-bold text-[11px]"
            style={{ color: getRatingColor(stock.oscillatorsScore) }}
          >
            {stock.oscillatorsScore}
          </span>
        </div>
        <div className="p-2 rounded bg-neutral-100 dark:bg-[#131722] ring-1 ring-[#2962ff]/30">
          <span className="text-[10px] text-[#2962ff] font-semibold block mb-0.5">Summary</span>
          <span
            className="font-extrabold text-[11px]"
            style={{ color: getRatingColor(stock.technicalRating) }}
          >
            {stock.technicalRating}
          </span>
        </div>
        <div className="p-2 rounded bg-neutral-50 dark:bg-[#131722]/50">
          <span className="text-[10px] text-neutral-400 block mb-0.5">Moving Avg</span>
          <span
            className="font-bold text-[11px]"
            style={{ color: getRatingColor(stock.movingAveragesScore) }}
          >
            {stock.movingAveragesScore}
          </span>
        </div>
      </div>
    </div>
  );
};
