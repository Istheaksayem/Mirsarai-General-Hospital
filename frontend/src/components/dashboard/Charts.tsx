"use client";

import React, { useState } from "react";

// Area Chart component using custom SVG paths
interface AreaChartProps {
  data: { month: string; value: number }[];
  title?: string;
  color?: "blue" | "green" | "cyan" | "purple";
}

export function AreaChart({ data, title = "Monthly Trend", color = "blue" }: AreaChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // SVG dimensions
  const width = 500;
  const height = 200;
  const padding = 30;

  // Max value for scaling
  const maxValue = Math.max(...data.map((d) => d.value), 100);

  // Calculate coordinates
  const points = data.map((d, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (d.value / maxValue) * (height - padding * 2);
    return { x, y, ...d };
  });

  // SVG Path Strings
  const pathD = points.reduce(
    (acc, p, idx) => (idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
    ""
  );

  const fillD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  // Color mappings
  const themeColors = {
    blue: {
      stroke: "stroke-blue-600 dark:stroke-blue-400",
      fill: "url(#blue-gradient)",
      dot: "fill-blue-600 dark:fill-blue-400",
      gradStart: "#2563eb",
      gradStop: "#60a5fa",
    },
    green: {
      stroke: "stroke-emerald-600 dark:stroke-emerald-400",
      fill: "url(#green-gradient)",
      dot: "fill-emerald-600 dark:fill-emerald-400",
      gradStart: "#059669",
      gradStop: "#34d399",
    },
    cyan: {
      stroke: "stroke-cyan-600 dark:stroke-cyan-400",
      fill: "url(#cyan-gradient)",
      dot: "fill-cyan-600 dark:fill-cyan-400",
      gradStart: "#0891b2",
      gradStop: "#22d3ee",
    },
    purple: {
      stroke: "stroke-purple-600 dark:stroke-purple-400",
      fill: "url(#purple-gradient)",
      dot: "fill-purple-600 dark:fill-purple-400",
      gradStart: "#7c3aed",
      gradStop: "#a78bfa",
    },
  };

  const selectedColor = themeColors[color];

  return (
    <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </h3>
          <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">
            {activeIdx !== null ? `$${data[activeIdx].value.toLocaleString()}` : `$${data[data.length - 1].value.toLocaleString()}`}
            <span className="text-xs text-gray-400 dark:text-slate-500 font-semibold ml-2">
              {activeIdx !== null ? data[activeIdx].month : "Current Month"}
            </span>
          </p>
        </div>
      </div>

      <div className="relative w-full h-[220px]">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`${color}-gradient`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={selectedColor.gradStart} stopOpacity="0.4" />
              <stop offset="100%" stopColor={selectedColor.gradStop} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding + ratio * (height - padding * 2);
            return (
              <line
                key={idx}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                className="stroke-gray-100 dark:stroke-slate-700/50"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={fillD} fill={selectedColor.fill} className="transition-all duration-300" />

          {/* Line Stroke */}
          <path
            d={pathD}
            fill="none"
            className={`${selectedColor.stroke} transition-all duration-300`}
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Interactive Dots & Bars */}
          {points.map((p, idx) => (
            <g key={idx}>
              {/* Invisible interactive vertical bar */}
              <rect
                x={p.x - 15}
                y={padding}
                width={30}
                height={height - padding * 2}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseLeave={() => setActiveIdx(null)}
              />

              {/* Active hover vertical line */}
              {activeIdx === idx && (
                <line
                  x1={p.x}
                  y1={padding}
                  x2={p.x}
                  y2={height - padding}
                  className="stroke-primary/20 dark:stroke-tertiary/20"
                  strokeWidth={1.5}
                />
              )}

              {/* Data dot */}
              <circle
                cx={p.x}
                cy={p.y}
                r={activeIdx === idx ? 6 : 4}
                className={`${selectedColor.dot} transition-all duration-150 pointer-events-none`}
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, idx) => (
            <text
              key={idx}
              x={p.x}
              y={height - 8}
              textAnchor="middle"
              className="text-[9px] font-bold fill-gray-400 dark:fill-slate-500 font-sans"
            >
              {p.month}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}

// Donut Chart for role or test distribution
interface DonutChartProps {
  data: { label: string; value: number; colorClass: string }[];
  title?: string;
}

export function DonutChart({ data, title = "Distribution" }: DonutChartProps) {
  const total = data.reduce((acc, d) => acc + d.value, 0);

  // SVG parameters
  const size = 200;
  const radius = 70;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedPercent = 0;

  return (
    <div className="bg-white dark:bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm transition-all duration-300">
      <h3 className="text-sm font-bold text-gray-400 dark:text-slate-400 uppercase tracking-wider mb-6">
        {title}
      </h3>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="relative w-[150px] h-[150px]">
          <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* Background Circle */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              fill="transparent"
              className="stroke-gray-100 dark:stroke-slate-700/30"
              strokeWidth={strokeWidth}
            />

            {/* Slices */}
            {data.map((item, idx) => {
              const percentage = (item.value / total) * 100;
              const strokeDashoffset = circumference - (percentage / 100) * circumference;
              const rotation = (accumulatedPercent / 100) * circumference;
              accumulatedPercent += percentage;

              return (
                <circle
                  key={idx}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="transparent"
                  className={item.colorClass}
                  strokeWidth={strokeWidth}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transform: `rotate(${(rotation / circumference) * 360}deg)`,
                    transformOrigin: "center",
                    transition: "stroke-dashoffset 0.5s ease",
                  }}
                />
              );
            })}
          </svg>

          {/* Center Info text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">
              Total Users
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-3.5 w-full">
          {data.map((item, idx) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            return (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-3.5 h-3.5 rounded-full ${item.colorClass.replace("stroke", "bg")}`} />
                  <span className="font-bold text-gray-600 dark:text-slate-300">
                    {item.label}
                  </span>
                </div>
                <span className="font-extrabold text-gray-900 dark:text-white">
                  {item.value} ({percentage}%)
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
