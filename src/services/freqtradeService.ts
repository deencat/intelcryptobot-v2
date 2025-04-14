/**
 * FreqtradeService
 * 
 * This service provides an interface to the Freqtrade API.
 * In prototyping mode, it returns mock data.
 * In production, it would connect to the actual Freqtrade API.
 */

import axios, { AxiosInstance } from 'axios';

// Mock data for prototyping
const mockData = {
  status: {
    status: "running",
    version: "2023.11",
    strategy: "SampleStrategy",
    dry_run: true,
    trading_mode: "spot",
    state: "running",
    timeframe: "5m",
    exchange: "binance",
    balance: 1000.0,
    profit_total: 25.64,
    profit_ratio: 0.0256
  },
  profit: {
    profit_closed_coin: 0.00081063,
    profit_closed_percent_mean: 0.84,
    profit_closed_ratio_mean: 0.0084,
    profit_closed_percent_sum: 3.32,
    profit_closed_ratio_sum: 0.0332,
    profit_closed_fiat: 25.64,
    profit_all_coin: 0.00080969,
    profit_all_percent_mean: 0.76,
    profit_all_ratio_mean: 0.0076,
    profit_all_percent_sum: 3.31,
    profit_all_ratio_sum: 0.0331,
    profit_all_fiat: 25.61,
    trade_count: 4,
    closed_trade_count: 3,
    first_trade_date: "2023-06-05 12:15:03",
    first_trade_timestamp: 1685967303,
    latest_trade_date: "2023-06-05 14:20:45",
    latest_trade_timestamp: 1685974845,
    avg_duration: "1:15:35",
    best_pair: "BTC/USDT",
    best_rate: 2.23,
    winning_trades: 3,
    losing_trades: 0,
  },
  trades: [
    {
      trade_id: 1,
      pair: "BTC/USDT",
      base_currency: "BTC",
      quote_currency: "USDT",
      is_open: false,
      exchange: "binance",
      amount: 0.001,
      stake_amount: 30.0,
      strategy: "SampleStrategy",
      timeframe: "5m",
      open_date: "2023-06-05 12:15:03",
      open_timestamp: 1685967303,
      open_rate: 29876.34,
      close_date: "2023-06-05 13:05:15",
      close_timestamp: 1685970315,
      close_rate: 30092.45,
      profit_ratio: 0.0072,
      profit_pct: 0.72,
      profit_abs: 0.216,
      stake_currency: "USDT",
      fiat_currency: "USD",
      sell_reason: "roi",
      min_rate: 29800.12,
      max_rate: 30100.45,
    },
    {
      trade_id: 2,
      pair: "ETH/USDT",
      base_currency: "ETH",
      quote_currency: "USDT",
      is_open: false,
      exchange: "binance",
      amount: 0.015,
      stake_amount: 30.0,
      strategy: "SampleStrategy",
      timeframe: "5m",
      open_date: "2023-06-05 12:45:22",
      open_timestamp: 1685969122,
      open_rate: 1876.50,
      close_date: "2023-06-05 13:30:45",
      close_timestamp: 1685971845,
      close_rate: 1910.23,
      profit_ratio: 0.0179,
      profit_pct: 1.79,
      profit_abs: 0.537,
      stake_currency: "USDT",
      fiat_currency: "USD",
      sell_reason: "roi",
      min_rate: 1870.15,
      max_rate: 1915.78,
    },
    {
      trade_id: 3,
      pair: "SOL/USDT",
      base_currency: "SOL",
      quote_currency: "USDT",
      is_open: true,
      exchange: "binance",
      amount: 0.5,
      stake_amount: 30.0,
      strategy: "SampleStrategy",
      timeframe: "5m",
      open_date: "2023-06-05 14:15:12",
      open_timestamp: 1685974512,
      open_rate: 60.0,
      profit_ratio: -0.005,
      profit_pct: -0.5,
      profit_abs: -0.15,
      stake_currency: "USDT",
      fiat_currency: "USD",
      min_rate: 59.5,
      max_rate: 60.5,
    }
  ],
  whitelist: ["BTC/USDT", "ETH/USDT", "SOL/USDT", "ADA/USDT", "XRP/USDT"],
  blacklist: ["DOGE/USDT"],
  logs: [
    { date: "2023-06-05 12:15:03", level: "INFO", message: "Entering buy signal for BTC/USDT" },
    { date: "2023-06-05 12:15:04", level: "INFO", message: "Buy order placed for BTC/USDT" },
    { date: "2023-06-05 13:05:14", level: "INFO", message: "Entering sell signal for BTC/USDT" },
    { date: "2023-06-05 13:05:15", level: "INFO", message: "Sell order placed for BTC/USDT" },
  ],
};

class FreqtradeService {
  private client: AxiosInstance | null = null;
  private isProduction: boolean = true;

  constructor() {
    // In production mode, initialize a real API client
    if (this.isProduction) {
      console.log('Initializing Freqtrade API client in production mode...');
      this.client = axios.create({
        baseURL: process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1',
        headers: {
          'Content-Type': 'application/json',
        },
        auth: {
          username: process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader',
          password: process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T'
        }
      });
    }
  }

  /**
   * Get the current status of the bot
   */
  async getStatus() {
    if (this.isProduction && this.client) {
      try {
        console.log('Fetching Freqtrade status...');
        // First try to get show_config which contains all necessary status information
        const configResponse = await this.client.get('/show_config');
        
        // Get balance information
        const balanceResponse = await this.client.get('/balance');
        
        // Combine data into a format matching our UI expectations
        return {
          status: configResponse.data.state || 'unknown',
          version: configResponse.data.version || 'unknown',
          strategy: configResponse.data.strategy || 'unknown',
          dry_run: configResponse.data.dry_run || true,
          trading_mode: configResponse.data.trading_mode || 'spot',
          state: configResponse.data.state || 'unknown',
          timeframe: configResponse.data.timeframe || 'unknown',
          exchange: configResponse.data.exchange || 'unknown',
          balance: balanceResponse.data.total || 0,
          profit_total: 0, // Not directly available, would need to fetch from /profit
          profit_ratio: 0  // Not directly available, would need to fetch from /profit
        };
      } catch (error) {
        console.error('Error fetching Freqtrade status:', error);
        throw error;
      }
    }
    return mockData.status;
  }

  /**
   * Get profit information
   */
  async getProfit() {
    if (this.isProduction && this.client) {
      const response = await this.client.get('/profit');
      return response.data;
    }
    return mockData.profit;
  }

  /**
   * Get all trades (open and closed)
   */
  async getTrades(limit = 50) {
    if (this.isProduction && this.client) {
      const response = await this.client.get('/trades', {
        params: { limit }
      });
      return response.data;
    }
    return mockData.trades;
  }

  /**
   * Get open trades
   */
  async getOpenTrades() {
    if (this.isProduction && this.client) {
      const response = await this.client.get('/status');
      return response.data.open_trades;
    }
    return mockData.trades.filter(trade => trade.is_open);
  }

  /**
   * Get whitelist
   */
  async getWhitelist() {
    if (this.isProduction && this.client) {
      const response = await this.client.get('/whitelist');
      return response.data;
    }
    return mockData.whitelist;
  }

  /**
   * Get logs
   */
  async getLogs(limit = 50) {
    if (this.isProduction && this.client) {
      const response = await this.client.get('/logs', {
        params: { limit }
      });
      return response.data;
    }
    return mockData.logs;
  }

  /**
   * Start the bot
   */
  async startBot() {
    if (this.isProduction && this.client) {
      const response = await this.client.post('/start');
      return response.data;
    }
    return { status: "success", message: "Bot started" };
  }

  /**
   * Stop the bot
   */
  async stopBot() {
    if (this.isProduction && this.client) {
      const response = await this.client.post('/stop');
      return response.data;
    }
    return { status: "success", message: "Bot stopped" };
  }

  /**
   * Force buy a pair
   */
  async forceBuy(pair: string, price?: number) {
    if (this.isProduction && this.client) {
      const response = await this.client.post('/forcebuy', {
        pair,
        price
      });
      return response.data;
    }
    return { 
      status: "success",
      message: `Force buy for ${pair} successful`,
      trade_id: 4
    };
  }

  /**
   * Force sell a trade
   */
  async forceSell(tradeId: number) {
    if (this.isProduction && this.client) {
      const response = await this.client.post('/forcesell', {
        tradeid: tradeId
      });
      return response.data;
    }
    return {
      status: "success",
      message: `Force sell for trade ${tradeId} successful`
    };
  }
}

export const freqtradeService = new FreqtradeService(); 