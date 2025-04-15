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
      
      // Use environment variable for API URL - now includes the full path with /api/v1
      const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
      console.log('Using API URL:', apiUrl);
      console.log('Username:', process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader');
      // Don't log the actual password, just indicate if it's being used
      console.log('Using password from ENV?', !!process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD);
      
      // Generate auth header
      const authString = `${process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader'}:${process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T'}`;
      const base64Auth = btoa(authString);
      console.log('Auth string length:', authString.length);
      console.log('Base64 auth string:', base64Auth);
      
      // Ensure we don't double-append /api/v1
      const pingUrl = apiUrl.endsWith('/ping') ? apiUrl : 
                     apiUrl.endsWith('/') ? `${apiUrl}ping` : `${apiUrl}/ping`;
      console.log('Making request to:', pingUrl);
      
      // Use direct fetch for testing connection to the real server
      const response = await fetch(pingUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + base64Auth,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }
      
      // Debug the raw response
      const rawText = await response.text();
      console.log('Raw response:', rawText);
      
      let data;
      try {
        data = JSON.parse(rawText);
        console.log('Parsed JSON:', data);
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr);
        throw new Error(`Failed to parse JSON response: ${rawText.substring(0, 100)}...`);
      }
      
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
        const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
        errorMessage = `Cannot reach Freqtrade server. Make sure it's running at ${apiUrl}`;
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
      
      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
      
      // Generate auth header
      const authString = `${process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader'}:${process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T'}`;
      const base64Auth = btoa(authString);
      
      // Ensure we don't double-append paths
      const configUrl = apiUrl.endsWith('/show_config') ? apiUrl : 
                       apiUrl.endsWith('/') ? `${apiUrl}show_config` : `${apiUrl}/show_config`;
      console.log('Making config request to:', configUrl);
      
      // Use direct fetch for more reliable connection
      const configResponse = await fetch(configUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + base64Auth,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'include'
      });
      
      if (!configResponse.ok) {
        throw new Error(`Server responded with status: ${configResponse.status}`);
      }
      
      const config = await configResponse.json();
      
      // Ensure we don't double-append paths
      const balanceUrl = apiUrl.endsWith('/balance') ? apiUrl : 
                        apiUrl.endsWith('/') ? `${apiUrl}balance` : `${apiUrl}/balance`;
      console.log('Making balance request to:', balanceUrl);
      
      const balanceResponse = await fetch(balanceUrl, {
        method: 'GET',
        headers: {
          'Authorization': 'Basic ' + base64Auth,
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'include'
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
      
      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
      
      // Generate auth header
      const authString = `${process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader'}:${process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T'}`;
      const base64Auth = btoa(authString);
      
      // Ensure we don't double-append paths
      const startUrl = apiUrl.endsWith('/start') ? apiUrl : 
                      apiUrl.endsWith('/') ? `${apiUrl}start` : `${apiUrl}/start`;
      console.log('Making start request to:', startUrl);
      
      const response = await fetch(startUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64Auth,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'include'
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
      
      // Use environment variable for API URL
      const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
      
      // Generate auth header
      const authString = `${process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader'}:${process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T'}`;
      const base64Auth = btoa(authString);
      
      // Ensure we don't double-append paths
      const stopUrl = apiUrl.endsWith('/stop') ? apiUrl : 
                     apiUrl.endsWith('/') ? `${apiUrl}stop` : `${apiUrl}/stop`;
      console.log('Making stop request to:', stopUrl);
      
      const response = await fetch(stopUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Basic ' + base64Auth,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        mode: 'cors',
        credentials: 'include'
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
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
            <p className="font-medium">Connection Error:</p>
            <p>{error}</p>
            <p className="text-sm mt-2">
              Make sure Freqtrade is running and accessible at: {process.env.NEXT_PUBLIC_FREQTRADE_API_URL || "http://localhost:8080"}
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