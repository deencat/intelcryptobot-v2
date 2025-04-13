"use client";

import { CardContent } from "@/components/ui/card";
import { performanceChartData } from "@/mock-data/dashboard-data";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useState } from "react";
import { CollapsibleWidget } from "./collapsible-widget";

type ChartType = "equity" | "pnl" | "drawdown";

export function PerformanceChart() {
  const [chartType, setChartType] = useState<ChartType>("equity");

  const chartData = performanceChartData[chartType];

  const chartConfig = {
    equity: {
      title: "Equity Curve",
      color: "#2563eb", // blue
      yAxisFormatter: (value: number) => `$${value.toFixed(0)}`,
      tooltipFormatter: (value: number) => `$${value.toFixed(2)}`,
    },
    pnl: {
      title: "Daily P&L",
      color: (value: number) => (value >= 0 ? "#22c55e" : "#ef4444"), // green or red
      yAxisFormatter: (value: number) => `$${value.toFixed(0)}`,
      tooltipFormatter: (value: number) => `$${value.toFixed(2)}`,
    },
    drawdown: {
      title: "Drawdown",
      color: "#f97316", // orange
      yAxisFormatter: (value: number) => `${(value * 100).toFixed(0)}%`,
      tooltipFormatter: (value: number) => `${(value * 100).toFixed(2)}%`,
    },
  };

  const currentConfig = chartConfig[chartType];

  const chartButtons = (
    <div className="flex space-x-2">
      <button
        className={`px-2 py-1 text-xs rounded-md ${
          chartType === "equity"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
        onClick={() => setChartType("equity")}
      >
        Equity
      </button>
      <button
        className={`px-2 py-1 text-xs rounded-md ${
          chartType === "pnl"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
        onClick={() => setChartType("pnl")}
      >
        P&L
      </button>
      <button
        className={`px-2 py-1 text-xs rounded-md ${
          chartType === "drawdown"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground"
        }`}
        onClick={() => setChartType("drawdown")}
      >
        Drawdown
      </button>
    </div>
  );

  return (
    <CollapsibleWidget
      title="Performance"
      className="col-span-full"
    >
      <div className="flex justify-end mb-2">
        {chartButtons}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={
                    typeof currentConfig.color === "function"
                      ? currentConfig.color(1)
                      : currentConfig.color
                  }
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={
                    typeof currentConfig.color === "function"
                      ? currentConfig.color(1)
                      : currentConfig.color
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getMonth() + 1}/${date.getDate()}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={currentConfig.yAxisFormatter}
            />
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <Tooltip
              formatter={currentConfig.tooltipFormatter}
              labelFormatter={(label) => {
                const date = new Date(label);
                return date.toLocaleDateString();
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={
                typeof currentConfig.color === "function"
                  ? "#2563eb"
                  : currentConfig.color
              }
              fillOpacity={1}
              fill="url(#colorValue)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </CollapsibleWidget>
  );
} 