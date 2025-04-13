"use client";

import { CardContent } from "@/components/ui/card";
import { AlertCircle, CheckCircle } from "lucide-react";
import { systemStatus } from "@/mock-data/dashboard-data";
import { CollapsibleWidget } from "./collapsible-widget";

export function SystemStatus() {
  const { botStatus, connections } = systemStatus;

  const getStatusColor = (status: string) => {
    if (status === "Running" || status === "OK") return "text-green-500";
    if (status === "Paused") return "text-amber-500";
    return "text-red-500";
  };

  const getStatusIcon = (status: string) => {
    if (status === "Running" || status === "OK") {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
    return <AlertCircle className="h-5 w-5 text-red-500" />;
  };

  return (
    <CollapsibleWidget title="System Status">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Bot Status:</span>
          <div className="flex items-center">
            {getStatusIcon(botStatus)}
            <span className={`ml-2 ${getStatusColor(botStatus)}`}>
              {botStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">DeepSeek API:</span>
          <div className="flex items-center">
            {getStatusIcon(connections.deepseek)}
            <span className={`ml-2 ${getStatusColor(connections.deepseek)}`}>
              {connections.deepseek}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Broker Connection:</span>
          <div className="flex items-center">
            {getStatusIcon(connections.broker)}
            <span className={`ml-2 ${getStatusColor(connections.broker)}`}>
              {connections.broker}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Data Feed:</span>
          <div className="flex items-center">
            {getStatusIcon(connections.dataFeed)}
            <span className={`ml-2 ${getStatusColor(connections.dataFeed)}`}>
              {connections.dataFeed}
            </span>
          </div>
        </div>
      </div>
    </CollapsibleWidget>
  );
} 