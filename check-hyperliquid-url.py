#!/usr/bin/env python3
"""
Script to check the Hyperliquid connection URL in Freqtrade
"""

import json
import requests
import os
from requests.auth import HTTPBasicAuth
import sys

def check_hyperliquid_status():
    print("Checking Hyperliquid integration with Freqtrade...")
    
    # Get API URL from environment or use default
    base_url = os.environ.get('NEXT_PUBLIC_FREQTRADE_API_URL', 'http://localhost:8080/api/v1')
    username = 'freqtrader'
    password = 'cA8mn49B@T'
    
    print(f"Using API URL: {base_url}")
    
    # Check Freqtrade connection
    try:
        # Get exchange markets to see the URLs being used
        response = requests.get(f'{base_url}/show_config', auth=HTTPBasicAuth(username, password))
        config = response.json()
        
        # Extract exchange information
        exchange_name = config.get('exchange', '')
        
        print(f"Exchange: {exchange_name}")
        print(f"Trading mode: {config.get('trading_mode', '')}")
        print(f"Stake currency: {config.get('stake_currency', '')}")
        print(f"Dry run: {config.get('dry_run', '')}")
        
        # Check ping endpoint to get logs with connection info
        print("\nGetting ping response to check logs...")
        ping_response = requests.get(f'{base_url}/ping', auth=HTTPBasicAuth(username, password))
        print(f"Ping status: {ping_response.status_code}")
        print(f"Ping response: {ping_response.json()}")
        
        return config
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

if __name__ == "__main__":
    config = check_hyperliquid_status()
    
    if config:
        print("\nTo check the actual URL, we need to look at the Freqtrade logs:")
        print("Run the following command to see the connection logs:")
        print("docker logs freqtrade | grep -i \"hyperliquid.*url\\|connecting to\\|testnet\"") 