"use client";

import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { riskMetricsData } from "@/mock-data/dashboard-data";
import { CollapsibleWidget } from "./collapsible-widget";

export function RiskMetrics() {
  const { capitalDeployed, exposure, correlations } = riskMetricsData;

  const getCorrelationLabel = (value: number) => {
    if (value < 0.3) return "Low";
    if (value < 0.7) return "Medium";
    return "High";
  };

  const getCorrelationColor = (value: number) => {
    if (value < 0.3) return "text-green-500";
    if (value < 0.7) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <CollapsibleWidget title="Risk Metrics">
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">Capital Deployed</span>
            <span className="text-sm">{Math.round(capitalDeployed * 100)}%</span>
          </div>
          <Progress value={capitalDeployed * 100} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Exposure by Asset</div>
          {Object.entries(exposure).map(([asset, value]) => (
            <div key={asset} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm">{asset}</span>
                <span className="text-sm">{Math.round(value * 100)}%</span>
              </div>
              <Progress value={value * 100} className="h-1.5" />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Correlations</div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">Average Pairwise</span>
            <span className={`text-sm font-medium ${getCorrelationColor(correlations.pairwise)}`}>
              {correlations.pairwise.toFixed(2)} ({getCorrelationLabel(correlations.pairwise)})
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm">To BTC</span>
            <span className={`text-sm font-medium ${getCorrelationColor(correlations.toBTC)}`}>
              {correlations.toBTC.toFixed(2)} ({getCorrelationLabel(correlations.toBTC)})
            </span>
          </div>
        </div>
      </div>
    </CollapsibleWidget>
  );
} 