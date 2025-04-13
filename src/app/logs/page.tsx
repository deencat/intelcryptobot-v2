import { LogViewer } from "@/components/logs/log-viewer";

export default function LogsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">System Logs</h1>
      <p className="text-muted-foreground">
        View and filter system logs including trade executions, system events, and errors.
      </p>
      
      <LogViewer />
    </div>
  );
} 