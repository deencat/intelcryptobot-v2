export const systemStatus = {
  botStatus: "Running",
  connections: {
    deepseek: "OK",
    broker: "OK",
    dataFeed: "OK",
  },
};

export const kpiData = {
  dailyPnL: 215.75,
  totalPnL: 1854.32,
  accountEquity: 12854.32,
  drawdown: {
    current: 0.05, // 5%
    max: 0.25, // 25%
  },
};

export const alertsData = [
  {
    id: "1",
    timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
    type: "RiskLimit",
    message: "Position size exceeds risk limit for SOL/USDC",
    isRead: false,
  },
  {
    id: "2",
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
    type: "APIError",
    message: "Temporary DeepSeek API connection issue",
    isRead: true,
  },
  {
    id: "3",
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    type: "TradeAlert",
    message: "Take-profit reached for BTC/USDC position",
    isRead: true,
  },
];

export const activePositionsData = [
  {
    id: "1",
    symbol: "SOL/USDC",
    direction: "Long",
    entryPrice: 138.45,
    size: 2.5,
    currentPnL: 125.5,
    stopLoss: 130.0,
    takeProfit: 150.0,
  },
  {
    id: "2",
    symbol: "BTC/USDC",
    direction: "Short",
    entryPrice: 62350.0,
    size: 0.15,
    currentPnL: -89.25,
    stopLoss: 63500.0,
    takeProfit: 60000.0,
  },
  {
    id: "3",
    symbol: "ETH/USDC",
    direction: "Long",
    entryPrice: 3245.75,
    size: 0.75,
    currentPnL: 45.25,
    stopLoss: 3100.0,
    takeProfit: 3500.0,
  },
];

export const riskMetricsData = {
  capitalDeployed: 0.35, // 35%
  exposure: {
    SOL: 0.15, // 15%
    BTC: 0.12, // 12%
    ETH: 0.08, // 8%
  },
  correlations: {
    pairwise: 0.65, // Average pairwise correlation
    toBTC: 0.82, // Correlation to BTC
  },
};

// Mock performance data for charts
export const performanceChartData = {
  equity: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (30 - i)).toISOString().split('T')[0],
    value: 10000 + Math.floor(Math.random() * 500) + i * 100,
  })),
  pnl: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (30 - i)).toISOString().split('T')[0],
    value: Math.floor(Math.random() * 200) - 100,
  })),
  drawdown: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * (30 - i)).toISOString().split('T')[0],
    value: Math.random() * 0.15,
  })),
}; 