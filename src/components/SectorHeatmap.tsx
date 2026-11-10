import React from 'react';
import { SectorPerformance } from '../types/market';
import { Layers } from 'lucide-react';

interface SectorHeatmapProps {
  sectors: SectorPerformance[];
  selectedSector: string | null;
  onSelectSector: (sectorName: string | null) => void;
}

export const SectorHeatmap: React.FC<SectorHeatmapProps> = ({
  sectors,
  selectedSector,
  onSelectSector,
}) => {
  return (
    <div className="bg-white dark:bg-[#1e222d] rounded-lg border border-neutral-200 dark:border-neutral-800/80 p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2962ff]" />
          <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
            Sector Performance &amp; Heatmap
          </h2>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            (Weighted by Market Breadth)
          </span>
        </div>

        {selectedSector && (
          <button
            onClick={() => onSelectSector(null)}
            className="text-xs text-[#2962ff] hover:underline font-semibold"
          >
            Clear Filter ({selectedSector})
          </button>
        )}
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {sectors.map((sec) => {
          const isUp = sec.changePercent >= 0;
          const isSelected = selectedSector === sec.name;

          // Color intensity based on return
          let bgClass = '';
          if (sec.changePercent >= 2.0) bgClass = 'bg-emerald-600/90 text-white dark:bg-[#089981]';
          else if (sec.changePercent > 0.8) bgClass = 'bg-emerald-500/80 text-white dark:bg-[#089981]/80';
          else if (sec.changePercent > 0) bgClass = 'bg-emerald-500/60 text-white dark:bg-[#089981]/50';
          else if (sec.changePercent > -0.5) bgClass = 'bg-rose-500/50 text-white dark:bg-[#f23645]/50';
          else if (sec.changePercent > -1.5) bgClass = 'bg-rose-500/80 text-white dark:bg-[#f23645]/80';
          else bgClass = 'bg-rose-600/90 text-white dark:bg-[#f23645]';

          return (
            <div
              key={sec.name}
              onClick={() => onSelectSector(isSelected ? null : sec.name)}
              className={`p-2.5 rounded-md cursor-pointer transition-all border ${
                isSelected
                  ? 'ring-2 ring-[#2962ff] border-[#2962ff]'
                  : 'border-transparent hover:brightness-110'
              } ${bgClass}`}
            >
              <div className="flex justify-between items-start gap-1">
                <span className="text-xs font-bold leading-tight truncate">
                  {sec.name}
                </span>
                <span className="text-xs font-mono font-extrabold tabular-nums">
                  {isUp ? '+' : ''}
                  {sec.changePercent.toFixed(2)}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] mt-1.5 opacity-90 font-mono">
                <span>Cap: ${(sec.marketCap / 1000).toFixed(1)}T</span>
                <span className="underline underline-offset-2">Top: {sec.topStock}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
