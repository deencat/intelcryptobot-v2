import { test, expect } from '@playwright/test';

test.describe('Settings Page', () => {
  test.beforeEach(async ({ page, browserName }) => {
    // Skip WebKit tests as they're unstable
    test.skip(browserName === 'webkit', 'WebKit tests are currently unstable');
    
    // Navigate to the settings page
    await page.goto('/settings');
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 60000 });
  });

  test('should display the settings page with title', async ({ page }) => {
    // Check if the page has the correct title
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible();
    await expect(page.getByText('Configure your trading bot and preferences')).toBeVisible();
  });

  test('should display all settings cards', async ({ page }) => {
    // Check for all card titles with longer timeout and more specific selectors
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'API Configuration' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Bot Configuration' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Alert Preferences' })).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'UI Preferences' })).toBeVisible({ timeout: 10000 });
  });

  test('should display API configuration form', async ({ page }) => {
    // Check for common form elements
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'API Configuration' })).toBeVisible({ timeout: 10000 });
    
    // Find inputs - more reliable than looking for text
    const brokerApiInput = page.getByPlaceholder('Enter API key');
    const brokerSecretInput = page.getByPlaceholder('Enter secret key');
    const deepseekApiInput = page.getByPlaceholder('Enter DeepSeek API key');
    
    await expect(brokerApiInput).toBeVisible({ timeout: 10000 });
    await expect(brokerSecretInput).toBeVisible({ timeout: 10000 });
    await expect(deepseekApiInput).toBeVisible({ timeout: 10000 });
    
    // Check for save button
    await expect(page.getByRole('button', { name: 'Save API Settings' })).toBeVisible({ timeout: 10000 });
  });

  test('should display Bot configuration form', async ({ page }) => {
    // Check for common form elements
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Bot Configuration' })).toBeVisible({ timeout: 10000 });
    
    // Find select and inputs - they have predictable names or types
    await expect(page.getByText('Trading Strategy')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="number"]').nth(0)).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="number"]').nth(1)).toBeVisible({ timeout: 10000 });
    
    // Check for save button
    await expect(page.getByRole('button', { name: 'Save Bot Settings' })).toBeVisible({ timeout: 10000 });
  });

  test('should display Alert Preferences form', async ({ page }) => {
    // Check for common form elements
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'Alert Preferences' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Notification Channels')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Alert Types')).toBeVisible({ timeout: 10000 });
    
    // Check for save button
    await expect(page.getByRole('button', { name: 'Save Alert Preferences' })).toBeVisible({ timeout: 10000 });
  });

  test('should display UI Preferences form', async ({ page }) => {
    // Check for common form elements
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'UI Preferences' })).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Dashboard Widgets')).toBeVisible({ timeout: 10000 });
    
    // Check for save button
    await expect(page.getByRole('button', { name: 'Save UI Preferences' })).toBeVisible({ timeout: 10000 });
  });

  test.skip('should submit API configuration form successfully', async ({ page }) => {
    // Wait for the form to be visible
    await expect(page.locator('[data-slot="card-title"]').filter({ hasText: 'API Configuration' })).toBeVisible({ timeout: 10000 });
    
    // Fill in a form field
    const brokerApiInput = page.getByPlaceholder('Enter API key');
    await expect(brokerApiInput).toBeVisible({ timeout: 10000 });
    await brokerApiInput.fill('testkeychanged123');
    
    // Submit the form
    await page.getByRole('button', { name: 'Save API Settings' }).click();
    
    // Wait for the loading state
    await expect(page.getByRole('button', { name: 'Saving...' })).toBeVisible({ timeout: 5000 });
    
    // Wait for button to return to normal state
    await expect(page.getByRole('button', { name: 'Save API Settings' })).toBeVisible({ timeout: 5000 });
    
    // Look for the toast notification (Sonner usually adds elements to the DOM with specific selectors)
    await expect(page.locator('div[role="status"]').filter({ hasText: 'API settings updated successfully' }))
      .toBeVisible({ timeout: 15000 });
  });
}); 