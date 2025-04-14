// Simple test script to check if Freqtrade is running and can connect to Hyperliquid
const axios = require('axios');

async function testFreqtradeConnection() {
  console.log('Testing Freqtrade connection to Hyperliquid...');
  
  // Freqtrade API credentials
  const auth = {
    username: 'freqtrader',
    password: 'cA8mn49B@T'
  };
  
  // Helper function to make API requests
  async function makeApiRequest(endpoint, description) {
    console.log(`\n${description}...`);
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/${endpoint}`, { auth });
      console.log('✅ Success!');
      console.log('Response:');
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log('Response data:', error.response.data);
      }
      return null;
    }
  }
  
  try {
    // Test different endpoints
    await makeApiRequest('ping', 'Testing basic connectivity (ping)');
    await makeApiRequest('version', 'Getting Freqtrade version');
    await makeApiRequest('status', 'Getting bot status');
    await makeApiRequest('show_config', 'Getting bot configuration');
    await makeApiRequest('balance', 'Getting account balance');
    
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