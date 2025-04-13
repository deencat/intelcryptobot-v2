"use client";

import { useState, useEffect, useMemo } from "react";
import { LogFilter } from "./log-filter";
import { LogTable } from "./log-table";
import { logsData, LogEntry } from "@/mock-data/logs-data";

export function LogViewer() {
  const [filters, setFilters] = useState({
    type: [] as string[],
    search: "",
    timeRange: "all",
  });

  const filteredLogs = useMemo(() => {
    return logsData.filter((log) => {
      // Filter by type if any types are selected
      if (filters.type.length > 0 && !filters.type.includes(log.type)) {
        return false;
      }

      // Filter by search term
      if (
        filters.search &&
        !log.message.toLowerCase().includes(filters.search.toLowerCase()) &&
        !(log.details?.toLowerCase().includes(filters.search.toLowerCase()) ?? false)
      ) {
        return false;
      }

      // Filter by time range
      if (filters.timeRange !== "all") {
        const logTime = new Date(log.timestamp).getTime();
        const now = Date.now();
        let timeLimit: number;

        switch (filters.timeRange) {
          case "1h":
            timeLimit = now - 1000 * 60 * 60;
            break;
          case "6h":
            timeLimit = now - 1000 * 60 * 60 * 6;
            break;
          case "24h":
            timeLimit = now - 1000 * 60 * 60 * 24;
            break;
          case "7d":
            timeLimit = now - 1000 * 60 * 60 * 24 * 7;
            break;
          case "30d":
            timeLimit = now - 1000 * 60 * 60 * 24 * 30;
            break;
          default:
            timeLimit = 0;
        }

        if (logTime < timeLimit) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      // Sort by timestamp, newest first
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }, [filters]);

  const handleFilterChange = (newFilters: {
    type: string[];
    search: string;
    timeRange: string;
  }) => {
    setFilters(newFilters);
  };

  return (
    <div>
      <LogFilter onFilterChange={handleFilterChange} />
      <LogTable logs={filteredLogs} />
    </div>
  );
} 