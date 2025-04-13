"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, TrendingUp } from "lucide-react";
import { kpiData } from "@/mock-data/dashboard-data";

export function KPI() {
  const { dailyPnL, totalPnL, accountEquity, drawdown } = kpiData;
  const drawdownPercentage = Math.round(drawdown.current * 100);
  const drawdownMaxPercentage = Math.round(drawdown.max * 100);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Daily P&L</CardTitle>
          {dailyPnL >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {dailyPnL >= 0 ? '+' : ''}{dailyPnL.toFixed(2)} USDC
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
          {totalPnL >= 0 ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {totalPnL >= 0 ? '+' : ''}{totalPnL.toFixed(2)} USDC
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Account Equity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {accountEquity.toFixed(2)} USDC
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Drawdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2">
            <div className="text-2xl font-bold">
              {drawdownPercentage}%
            </div>
            <Progress value={drawdownPercentage} max={drawdownMaxPercentage} className="h-2" />
            <div className="text-xs text-muted-foreground">
              Max: {drawdownMaxPercentage}%
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 