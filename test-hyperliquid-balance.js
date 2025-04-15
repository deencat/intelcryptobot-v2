// Test script to fetch Hyperliquid balance information via Freqtrade
const axios = require('axios');

async function testHyperliquidBalance() {
  console.log('Testing Hyperliquid balance via Freqtrade...');
  
  const callFreqtradeApi = async (endpoint) => {
    try {
      const auth = {
        username: 'freqtrader',
        password: 'cA8mn49B@T'
      };
      
      const apiUrl = process.env.NEXT_PUBLIC_FREQTRADE_API_URL || 'http://localhost:8080/api/v1';
      const response = await axios.get(`${apiUrl}/${endpoint}`, { auth });
      
      return response.data;
    } catch (error) {
      console.error(`Error calling Freqtrade API (${endpoint}):`, error.message);
      return null;
    }
  };
  
  try {
    // Get Freqtrade configuration
    const config = await callFreqtradeApi('show_config');
    
    if (config) {
      console.log('\nExchange configuration:');
      console.log('-----------------------');
      console.log(`Exchange: ${config.exchange}`);
      console.log(`Trading mode: ${config.trading_mode}`);
      console.log(`Stake currency: ${config.stake_currency}`);
      console.log(`Dry run: ${config.dry_run ? 'Yes' : 'No'}`);
      
      if (config.exchange === 'hyperliquid') {
        console.log('\n✅ Confirmed connected to Hyperliquid exchange');
        
        // Get balance information
        const balance = await callFreqtradeApi('balance');
        
        if (balance) {
          console.log('\nBalance information:');
          console.log('-------------------');
          console.log(JSON.stringify(balance, null, 2));
          
          // Display more detailed balance information
          if (balance.currencies && balance.currencies.length > 0) {
            console.log('\nDetailed balance breakdown:');
            console.log('--------------------------');
            balance.currencies.forEach(currency => {
              console.log(`${currency.currency}: ${currency.free} (Free) / ${currency.used} (In Use) / ${currency.balance} (Total)`);
            });
            
            console.log(`\nTotal balance value: ${balance.total} ${balance.symbol}`);
            if (balance.note) {
              console.log(`Note: ${balance.note}`);
            }
          }
          
          // Try to get whitelist pairs 
          const whitelist = await callFreqtradeApi('whitelist');
          
          if (whitelist && whitelist.whitelist) {
            console.log('\nAvailable trading pairs:');
            console.log('----------------------');
            whitelist.whitelist.forEach(pair => {
              console.log(`- ${pair}`);
            });
          }
          
          // Try to get current open trades
          const openTrades = await callFreqtradeApi('status');
          if (openTrades && openTrades.length > 0) {
            console.log('\nCurrent open trades:');
            console.log('-------------------');
            openTrades.forEach(trade => {
              console.log(`Trade ID: ${trade.trade_id}, Pair: ${trade.pair}, Amount: ${trade.amount}, Open rate: ${trade.open_rate}`);
            });
          } else {
            console.log('\nNo open trades found.');
          }
          
          // Get specific market data for BTC/USDC
          const marketData = await callFreqtradeApi('pair_candles?pair=BTC/USDC&timeframe=1h&limit=1');
          if (marketData) {
            console.log('\nLatest BTC/USDC market data:');
            console.log('--------------------------');
            console.log(JSON.stringify(marketData, null, 2));
          }
        }
      } else {
        console.log('\n❌ Freqtrade is not connected to Hyperliquid!');
        console.log(`Current exchange: ${config.exchange}`);
      }
    }
  } catch (error) {
    console.log('❌ Error during testing:');
    console.log('Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Freqtrade Docker container is running');
    console.log('2. API server is enabled in config.json');
    console.log('3. Freqtrade is properly connected to Hyperliquid');
    console.log('4. Your Hyperliquid API keys are correctly configured');
  }
}

// Execute the test
testHyperliquidBalance(); 