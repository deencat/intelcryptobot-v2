// Simple test script to check if Freqtrade is running and can connect to Hyperliquid
const axios = require('axios');

async function testFreqtradeConnection() {
  console.log('Testing Freqtrade connection to Hyperliquid...');
  
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
    // Test different endpoints
    await callFreqtradeApi('ping');
    await callFreqtradeApi('version');
    await callFreqtradeApi('status');
    await callFreqtradeApi('show_config');
    await callFreqtradeApi('balance');
    
    console.log('\n✅ API test completed!');
    console.log('If any of the tests succeeded, Freqtrade is running and the API is accessible.');
    console.log('Check if the exchange is configured as Hyperliquid in the configuration.');
    
  } catch (error) {
    console.log('❌ Could not connect to Freqtrade API:');
    console.log('Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Freqtrade Docker container is running');
    console.log('2. API server is enabled in config.json');
    console.log('3. Correct username and password are set');
    console.log('4. Port 8080 is accessible');
  }
}

testFreqtradeConnection(); 