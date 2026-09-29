import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useTheme } from '../hooks/useTheme';

const PALETTE = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
  '#f97316', // Orange
  '#14b8a6', // Teal
  '#64748b', // Slate
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-slate-900/95 dark:bg-black/90 border border-slate-700 dark:border-white/10 rounded-xl px-3.5 py-2 shadow-xl backdrop-blur-md text-xs">
        <p className="font-semibold text-white mb-1">{data.name}</p>
        <div className="flex items-center gap-3 text-slate-300">
          <span>{data.value} votes</span>
          <span className="font-bold text-indigo-400">{data.payload.percentage}%</span>
        </div>
      </div>
    );
  }
  return null;
};

export const ResultsChart = ({ options = [], totalVotes = 0 }) => {
  const { isDark } = useTheme();

  // If no votes have been cast yet
  if (totalVotes === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        <span>No votes recorded yet</span>
      </div>
    );
  }

  const chartData = options
    .filter((opt) => (opt.voteCount || 0) > 0)
    .map((opt) => ({
      name: opt.text,
      value: opt.voteCount || 0,
      percentage: opt.percentage || 0,
    }));

  // If all vote counts are 0
  if (chartData.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
        <span>No votes recorded yet</span>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full h-64 sm:h-72 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="value"
              stroke={isDark ? '#090a0f' : '#ffffff'}
              strokeWidth={3}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PALETTE[index % PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label inside donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
            {totalVotes}
          </span>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            Total Votes
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="w-full mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-4 border-t border-slate-100 dark:border-white/[0.05]">
        {chartData.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
            />
            <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
              {item.name}
            </span>
            <span className="ml-auto text-slate-400 tabular-nums font-semibold">
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsChart;
