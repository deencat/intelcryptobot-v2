/**
 * Environment variable utility functions
 * 
 * This module provides centralized access to environment variables with proper
 * TypeScript typing and default values.
 */

/**
 * Freqtrade API configuration
 */
export const freqtradeConfig = {
  /**
   * The base URL for the Freqtrade API
   */
  apiUrl: process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1',
  
  /**
   * Username for Freqtrade API authentication
   */
  username: process.env.NEXT_PUBLIC_FREQTRADE_USERNAME || 'freqtrader',
  
  /**
   * Password for Freqtrade API authentication
   */
  password: process.env.NEXT_PUBLIC_FREQTRADE_PASSWORD || 'cA8mn49B@T',
  
  /**
   * Whether to auto-connect to Freqtrade on startup
   */
  autoConnect: process.env.NEXT_PUBLIC_FREQTRADE_AUTO_CONNECT === 'true' || false,
};

/**
 * Development configuration
 */
export const devConfig = {
  /**
   * Whether the application is running in development mode
   */
  isDevelopment: process.env.NODE_ENV === 'development',
};

/**
 * Application configuration
 */
export const appConfig = {
  /**
   * The name of the application
   */
  name: process.env.NEXT_PUBLIC_APP_NAME || 'IntelCryptoBot',
}; 