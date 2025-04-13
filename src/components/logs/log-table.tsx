"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogEntry } from "@/mock-data/logs-data";
import { 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  AlertTriangle, 
  Clock 
} from "lucide-react";

interface LogTableProps {
  logs: LogEntry[];
}

export function LogTable({ logs }: LogTableProps) {
  const [page, setPage] = useState(1);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const itemsPerPage = 10;

  const paginatedLogs = logs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );
  
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "TradeExecution":
        return <Clock className="h-5 w-5 text-blue-500" />;
      case "SystemEvent":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "Error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getTypeClass = (type: string) => {
    switch (type) {
      case "TradeExecution":
        return "bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300";
      case "SystemEvent":
        return "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300";
      case "Error":
        return "bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Timestamp</th>
                <th className="py-3 px-4 text-left font-medium">Type</th>
                <th className="py-3 px-4 text-left font-medium">Message</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.length > 0 ? (
                paginatedLogs.map((log) => (
                  <tr 
                    key={log.id} 
                    className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => setExpandedLogId(expandedLogId === log.id ? null : log.id)}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="mr-2">{getTypeIcon(log.type)}</span>
                        <span 
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeClass(log.type)}`}
                        >
                          {log.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{log.message}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="py-4 px-4 text-center text-muted-foreground">
                    No logs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Details panel for expanded log */}
        {expandedLogId && (
          <div className="bg-muted/30 p-4 border-t">
            <h3 className="font-medium mb-2">Details</h3>
            <p className="text-sm text-muted-foreground">
              {logs.find(log => log.id === expandedLogId)?.details || "No additional details available."}
            </p>
          </div>
        )}

        {/* Pagination controls */}
        {logs.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(page - 1) * itemsPerPage + 1} - {Math.min(page * itemsPerPage, logs.length)} of {logs.length} logs
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 