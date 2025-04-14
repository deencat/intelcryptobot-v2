"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { freqtradeService } from "@/services/freqtradeService";

export default function TestFreqtradePage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testGetStatus() {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching Freqtrade status...");
      const data = await freqtradeService.getStatus();
      console.log("Status result:", data);
      setStatus(data);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
      console.error("Error fetching status:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Auto-test when the page loads
    testGetStatus();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Freqtrade Connection Test</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <span>Status Test</span>
            <Button 
              size="sm" 
              onClick={testGetStatus} 
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Connection"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="p-4 mb-4 bg-destructive/10 text-destructive rounded-md">
              <h3 className="font-semibold">Error:</h3>
              <p>{error}</p>
            </div>
          )}
          
          {status && (
            <div className="space-y-4">
              <h3 className="font-semibold">Connection Successful!</h3>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Status:</span> {status.status}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Version:</span> {status.version}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Strategy:</span> {status.strategy}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Exchange:</span> {status.exchange}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Trading Mode:</span> {status.trading_mode}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Timeframe:</span> {status.timeframe}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Balance:</span> {status.balance}
                </div>
                <div className="p-2 bg-muted/50 rounded">
                  <span className="font-medium">Dry Run:</span> {status.dry_run ? "Yes" : "No"}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mt-4 mb-2">Raw Response:</h3>
                <pre className="p-2 bg-muted/50 rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(status, null, 2)}
                </pre>
              </div>
            </div>
          )}
          
          {!status && !error && !loading && (
            <p>No status data available. Click "Test Connection" to try again.</p>
          )}
        </CardContent>
      </Card>
      
      <p className="text-sm text-muted-foreground">
        This page tests the connection to your Freqtrade instance.
        Make sure Freqtrade is running with the API server enabled.
      </p>
    </div>
  );
} 