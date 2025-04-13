"use client";

import { CardContent } from "@/components/ui/card";
import { activePositionsData } from "@/mock-data/dashboard-data";
import { TrendingDown, TrendingUp } from "lucide-react";
import { CollapsibleWidget } from "./collapsible-widget";

export function ActivePositions() {
  return (
    <CollapsibleWidget title="Active Positions">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium py-2">Symbol</th>
              <th className="text-left font-medium py-2">Direction</th>
              <th className="text-right font-medium py-2">Entry</th>
              <th className="text-right font-medium py-2">Size</th>
              <th className="text-right font-medium py-2">P&L</th>
              <th className="text-right font-medium py-2">SL</th>
              <th className="text-right font-medium py-2">TP</th>
            </tr>
          </thead>
          <tbody>
            {activePositionsData.map((position) => (
              <tr key={position.id} className="border-b hover:bg-muted/50">
                <td className="py-2">{position.symbol}</td>
                <td className="py-2">
                  <div className="flex items-center">
                    {position.direction === "Long" ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    {position.direction}
                  </div>
                </td>
                <td className="text-right py-2">{position.entryPrice.toFixed(2)}</td>
                <td className="text-right py-2">{position.size.toFixed(2)}</td>
                <td className={`text-right py-2 ${position.currentPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {position.currentPnL >= 0 ? '+' : ''}{position.currentPnL.toFixed(2)}
                </td>
                <td className="text-right py-2">{position.stopLoss.toFixed(2)}</td>
                <td className="text-right py-2">{position.takeProfit.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CollapsibleWidget>
  );
} 