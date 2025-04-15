"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Play, Pause, Link } from "lucide-react";
import { freqtradeService } from "@/services/freqtradeService";
import { CollapsibleWidget } from "./collapsible-widget";
import { toast } from "sonner";

type FreqtradeStatusProps = {
  className?: string;
};

export function FreqtradeStatus({ className = "" }: FreqtradeStatusProps) {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'checking'>('disconnected');

  const testConnection = async () => {
    try {
      setConnectionStatus('checking');
      setLoading(true);
      setError(null);
      console.log('Testing Freqtrade connection...');
      
      // Use direct fetch for testing connection to the real server
      const response = await fetch('http://localhost:8080/api/v1/ping', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('freqtrader:cA8mn49B@T')
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Connection test result:', data);
      
      if (data && data.status === 'pong') {
        setConnectionStatus('connected');
        toast.success("Successfully connected to Freqtrade");
        await fetchStatus();
        return true;
      } else {
        setConnectionStatus('disconnected');
        setError("Unexpected response from server");
        toast.error("Failed to connect to Freqtrade");
        return false;
      }
    } catch (err: any) {
      console.error("Connection test error:", err);
      setConnectionStatus('disconnected');
      
      // Provide more specific error message
      let errorMessage = "Failed to connect to Freqtrade";
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = "Cannot reach Freqtrade server. Make sure it's running at http://localhost:8080";
      } else if (err.message.includes('status: 401')) {
        errorMessage = "Authentication failed. Check your username and password.";
      } else if (err.message.includes('status: 404')) {
        errorMessage = "API endpoint not found. Check your Freqtrade version.";
      } else {
        errorMessage += ": " + err.message;
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    if (connectionStatus !== 'connected') {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use direct fetch for more reliable connection
      const configResponse = await fetch('http://localhost:8080/api/v1/show_config', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('freqtrader:cA8mn49B@T')
        }
      });
      
      if (!configResponse.ok) {
        throw new Error(`Server responded with status: ${configResponse.status}`);
      }
      
      const config = await configResponse.json();
      
      const balanceResponse = await fetch('http://localhost:8080/api/v1/balance', {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + btoa('freqtrader:cA8mn49B@T')
        }
      });
      
      if (!balanceResponse.ok) {
        throw new Error(`Server responded with status: ${balanceResponse.status}`);
      }
      
      const balance = await balanceResponse.json();
      
      // Combine data
      const statusData = {
        status: config.state || 'unknown',
        version: config.version || 'unknown',
        strategy: config.strategy || 'unknown',
        dry_run: config.dry_run || true,
        trading_mode: config.trading_mode || 'spot',
        state: config.state || 'unknown',
        timeframe: config.timeframe || 'unknown',
        exchange: config.exchange || 'unknown',
        balance: balance.total || 0,
        profit_total: 0,
        profit_ratio: 0
      };
      
      setStatus(statusData);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Freqtrade status");
      console.error("Error fetching status:", err);
      if (err.message.includes('Failed to fetch')) {
        setConnectionStatus('disconnected');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStartBot = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8080/api/v1/start', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('freqtrader:cA8mn49B@T'),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Start bot response:', data);
      toast.success("Bot started successfully");
      
      await fetchStatus();
    } catch (err: any) {
      setError("Failed to start the bot: " + (err.message || "Unknown error"));
      console.error("Error starting bot:", err);
      toast.error("Failed to start bot");
    } finally {
      setLoading(false);
    }
  };

  const handleStopBot = async () => {
    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:8080/api/v1/stop', {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + btoa('freqtrader:cA8mn49B@T'),
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Stop bot response:', data);
      toast.success("Bot stopped successfully");
      
      await fetchStatus();
    } catch (err: any) {
      setError("Failed to stop the bot: " + (err.message || "Unknown error"));
      console.error("Error stopping bot:", err);
      toast.error("Failed to stop bot");
    } finally {
      setLoading(false);
    }
  };

  // Only attempt auto-connection on component mount if in dev environment
  useEffect(() => {
    const isDev = process.env.NODE_ENV === 'development';
    if (isDev) {
      testConnection();
    }
  }, []);

  return (
    <CollapsibleWidget title="Freqtrade Status" className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Connection:</span>
            <Badge 
              variant={
                connectionStatus === 'connected' 
                  ? "default" 
                  : connectionStatus === 'checking' 
                  ? "outline" 
                  : "destructive"
              }
            >
              {connectionStatus === 'connected' 
                ? 'Connected' 
                : connectionStatus === 'checking' 
                ? 'Checking...' 
                : 'Disconnected'}
            </Badge>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            onClick={testConnection}
            disabled={loading && connectionStatus === 'checking'}
          >
            <Link className="h-4 w-4 mr-1" />
            Test Connection
          </Button>
        </div>
        
        {loading && connectionStatus === 'checking' && (
          <div className="text-center py-4">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                Loading...
              </span>
            </div>
            <p className="mt-2">Connecting to Freqtrade...</p>
          </div>
        )}
        
        {error && (
          <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
            <p className="font-semibold">Connection Error:</p>
            <p>{error}</p>
            <p className="text-xs mt-1">
              Make sure Freqtrade is running and accessible at: http://localhost:8080
            </p>
          </div>
        )}
        
        {status && connectionStatus === 'connected' && !loading && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Status:</span>
                <Badge variant={status.status === "running" ? "default" : "outline"}>
                  {status.status}
                </Badge>
              </div>
              <Button size="sm" variant="outline" onClick={fetchStatus}>
                <RefreshCcw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="font-medium">Strategy:</span>{" "}
                {status.strategy}
              </div>
              <div>
                <span className="font-medium">Mode:</span>{" "}
                {status.dry_run ? "Dry Run" : "Live Trade"}
              </div>
              <div>
                <span className="font-medium">Exchange:</span>{" "}
                {status.exchange}
              </div>
              <div>
                <span className="font-medium">Timeframe:</span>{" "}
                {status.timeframe}
              </div>
              <div>
                <span className="font-medium">Balance:</span>{" "}
                {status.balance}
              </div>
              <div>
                <span className="font-medium">Profit:</span>{" "}
                {status.profit_total.toFixed(2)} ({(status.profit_ratio * 100).toFixed(2)}%)
              </div>
            </div>
            
            <div className="flex justify-around pt-2">
              {status.status === "running" ? (
                <Button size="sm" variant="destructive" onClick={handleStopBot}>
                  <Pause className="h-4 w-4 mr-1" />
                  Stop Bot
                </Button>
              ) : (
                <Button size="sm" variant="default" onClick={handleStartBot}>
                  <Play className="h-4 w-4 mr-1" />
                  Start Bot
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </CollapsibleWidget>
  );
} 