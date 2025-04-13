"use client";

import { CardContent } from "@/components/ui/card";
import { alertsData } from "@/mock-data/dashboard-data";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { CollapsibleWidget } from "./collapsible-widget";

export function AlertsPanel() {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "RiskLimit":
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case "APIError":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "TradeAlert":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <CollapsibleWidget title="Recent Alerts">
      <div className="space-y-4">
        {alertsData.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3">
            {getAlertIcon(alert.type)}
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium leading-none">
                  {alert.type}
                </p>
                <time className="text-xs text-muted-foreground">
                  {formatTimestamp(alert.timestamp)}
                </time>
              </div>
              <p className="text-sm text-muted-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleWidget>
  );
} 