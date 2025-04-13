type LogType = "TradeExecution" | "SystemEvent" | "Error";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogType;
  message: string;
  details?: string;
}

// Generate a large set of mock logs for testing filtering
export const logsData: LogEntry[] = [
  // Trade Execution Logs
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    type: "TradeExecution",
    message: "Buy order executed: SOL/USDC",
    details: "Order #12345 | Price: 138.45 | Size: 2.5 | Fee: 0.25 USDC",
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: "TradeExecution",
    message: "Sell order executed: BTC/USDC",
    details: "Order #12344 | Price: 62350.00 | Size: 0.15 | Fee: 4.21 USDC",
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: "TradeExecution",
    message: "Buy order executed: ETH/USDC",
    details: "Order #12343 | Price: 3245.75 | Size: 0.75 | Fee: 1.64 USDC",
  },
  {
    id: "4",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: "TradeExecution",
    message: "Buy order cancelled: AVAX/USDC",
    details: "Order #12342 | Reason: Timeout",
  },
  {
    id: "5",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: "TradeExecution",
    message: "Take-Profit hit: BTC/USDC",
    details: "Order #12341 | Entry: 61200.00 | Exit: 62500.00 | P&L: +195.00 USDC",
  },
  {
    id: "6",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    type: "TradeExecution",
    message: "Stop-Loss hit: ETH/USDC",
    details: "Order #12340 | Entry: 3300.00 | Exit: 3180.00 | P&L: -90.00 USDC",
  },
  
  // System Event Logs
  {
    id: "7",
    timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    type: "SystemEvent",
    message: "DeepSeek API analysis completed",
    details: "Analysis ID: DS-123456 | Assets: BTC, ETH, SOL | Execution Time: 2.3s",
  },
  {
    id: "8",
    timestamp: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    type: "SystemEvent",
    message: "Risk check performed",
    details: "Capital deployed: 35% | Max drawdown: 5% | Within limits: Yes",
  },
  {
    id: "9",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5).toISOString(),
    type: "SystemEvent",
    message: "System startup completed",
    details: "Version: 1.2.0 | Initialization time: 4.5s",
  },
  {
    id: "10",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    type: "SystemEvent",
    message: "Daily performance snapshot",
    details: "P&L: +215.75 USDC | Win rate: 62% | Trades: 8",
  },
  {
    id: "11",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    type: "SystemEvent",
    message: "Market data feed refreshed",
    details: "Assets: 25 | Timeframes: 4 | Data points: 12,500",
  },
  {
    id: "12",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: "SystemEvent",
    message: "Configuration updated",
    details: "Parameter: Max risk per trade | Old: 1.0% | New: 1.2%",
  },
  
  // Error Logs
  {
    id: "13",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    type: "Error",
    message: "Temporary DeepSeek API connection issue",
    details: "HTTP Error 503 | Retrying in 30s | Attempt: 1/3",
  },
  {
    id: "14",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: "Error",
    message: "Order validation failed",
    details: "Asset: XRP/USDC | Reason: Insufficient liquidity",
  },
  {
    id: "15",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    type: "Error",
    message: "Model prediction timeout",
    details: "Asset: DOGE/USDC | Model: Price Direction | Timeout: 5000ms",
  },
  {
    id: "16",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    type: "Error",
    message: "Data feed interruption",
    details: "Source: Exchange websocket | Duration: 15s | Recovery: Automatic",
  },
  {
    id: "17",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
    type: "Error",
    message: "Position size exceeds risk limit",
    details: "Asset: SOL/USDC | Calculated size: 5.2 | Max allowed: 4.8",
  },
];

// Generate 30 more random logs for pagination testing
for (let i = 18; i < 48; i++) {
  const types: LogType[] = ["TradeExecution", "SystemEvent", "Error"];
  const randomType = types[Math.floor(Math.random() * types.length)];
  const hoursAgo = Math.floor(Math.random() * 48) + 1;
  
  let message = "";
  let details = "";
  
  if (randomType === "TradeExecution") {
    const assets = ["BTC/USDC", "ETH/USDC", "SOL/USDC", "AVAX/USDC", "ADA/USDC"];
    const actions = ["Buy order executed", "Sell order executed", "Buy order cancelled", "Sell order cancelled", "Take-Profit hit", "Stop-Loss hit"];
    
    message = `${actions[Math.floor(Math.random() * actions.length)]}: ${assets[Math.floor(Math.random() * assets.length)]}`;
    details = `Order #${10000 + i} | Price: ${(Math.random() * 1000).toFixed(2)} | Size: ${(Math.random() * 5).toFixed(2)}`;
  } else if (randomType === "SystemEvent") {
    const events = ["Configuration updated", "Market data refreshed", "Risk check performed", "Performance snapshot", "DeepSeek API analysis completed"];
    message = events[Math.floor(Math.random() * events.length)];
    details = `Event ID: SYS-${1000 + i} | Time: ${(Math.random() * 10).toFixed(2)}s`;
  } else {
    const errors = ["API connection issue", "Order validation failed", "Model prediction timeout", "Data feed interruption", "Rate limit exceeded"];
    message = errors[Math.floor(Math.random() * errors.length)];
    details = `Error ID: ERR-${2000 + i} | Severity: ${Math.floor(Math.random() * 5) + 1}`;
  }
  
  logsData.push({
    id: i.toString(),
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * hoursAgo).toISOString(),
    type: randomType,
    message,
    details,
  });
} 