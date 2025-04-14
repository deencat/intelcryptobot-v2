#!/usr/bin/env python3
"""
Script to check the Hyperliquid connection URL in Freqtrade
"""

import json
import requests
from requests.auth import HTTPBasicAuth

# Freqtrade API credentials
auth = HTTPBasicAuth('freqtrader', 'cA8mn49B@T')
base_url = 'http://localhost:8080/api/v1'

def check_hyperliquid_url():
    print("Checking Hyperliquid connection URL...")
    
    try:
        # Get exchange markets to see the URLs being used
        response = requests.get(f'{base_url}/show_config', auth=auth)
        config = response.json()
        
        # Extract exchange information
        exchange_name = config.get('exchange', '')
        
        print(f"Exchange: {exchange_name}")
        print(f"Trading mode: {config.get('trading_mode', '')}")
        print(f"Stake currency: {config.get('stake_currency', '')}")
        print(f"Dry run: {config.get('dry_run', '')}")
        
        # Check ping endpoint to get logs with connection info
        print("\nGetting ping response to check logs...")
        ping_response = requests.get(f'{base_url}/ping', auth=auth)
        print(f"Ping status: {ping_response.status_code}")
        print(f"Ping response: {ping_response.json()}")
        
        return config
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    config = check_hyperliquid_url()
    
    if config:
        print("\nTo check the actual URL, we need to look at the Freqtrade logs:")
        print("Run the following command to see the connection logs:")
        print("docker logs freqtrade | grep -i \"hyperliquid.*url\\|connecting to\\|testnet\"") 