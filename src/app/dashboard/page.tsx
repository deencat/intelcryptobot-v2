import { SystemStatus } from "@/components/dashboard/system-status";
import { KPI } from "@/components/dashboard/kpi";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { ActivePositions } from "@/components/dashboard/active-positions";
import { RiskMetrics } from "@/components/dashboard/risk-metrics";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { FreqtradeStatus } from "@/components/dashboard/freqtrade-status";

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <KPI />
      
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <PerformanceChart />
        
        <div className="col-span-2 space-y-6">
          <ActivePositions />
          <RiskMetrics />
        </div>
        
        <div className="space-y-6">
          <SystemStatus />
          <FreqtradeStatus />
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
} 