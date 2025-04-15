import { test, expect } from '@playwright/test';

test.describe('Freqtrade Connection Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard
    await page.goto('/dashboard');
  });

  test('shows Freqtrade status widget', async ({ page }) => {
    // Check if the Freqtrade status widget is visible
    await expect(page.getByText('Freqtrade Status')).toBeVisible();
    
    // Check if the connection status is initially shown
    await expect(page.getByText('Connection:')).toBeVisible();
  });

  test('test connection button works', async ({ page }) => {
    // Find and click the test connection button
    const testButton = page.getByRole('button', { name: 'Test Connection' });
    await expect(testButton).toBeVisible();
    await testButton.click();

    // Check that it changes to Checking... status (although this might be too fast to capture)
    // Instead we'll look for either Connected or error message
    await page.waitForSelector('text="Connected" >> visible=true, text="Connection Error" >> visible=true', { timeout: 10000 });
    
    // Verify that either:
    // 1. We have a successful connection (badge shows Connected)
    // 2. We have an error message
    const connectedElement = await page.$('text="Connected"');
    const errorElement = await page.$('text="Connection Error"');
    
    expect(connectedElement !== null || errorElement !== null).toBeTruthy();
  });

  test('updates UI based on connection result', async ({ page }) => {
    // Click test connection
    await page.getByRole('button', { name: 'Test Connection' }).click();
    
    // Wait for result
    await page.waitForLoadState('networkidle');
    
    // Check if we have either:
    // - Connected badge and additional UI elements (Start/Stop bot button)
    // - Error message with suggestions
    const isConnected = await page.$('text="Connected"') !== null;
    
    if (isConnected) {
      // If connected, check for additional UI elements
      await expect(page.getByText('Status:')).toBeVisible({ timeout: 5000 });
      
      // Check for either Start Bot or Stop Bot button
      const hasActionButton = 
        (await page.$('button:has-text("Start Bot")') !== null) || 
        (await page.$('button:has-text("Stop Bot")') !== null);
      
      expect(hasActionButton).toBeTruthy();
    } else {
      // If not connected, check for error message
      await expect(page.getByText('Connection Error:')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText(/Make sure Freqtrade is running/)).toBeVisible();
    }
  });
}); 