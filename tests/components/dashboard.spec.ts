import { test, expect } from '@playwright/test';

test.describe('Dashboard Components', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the dashboard page
    await page.goto('/dashboard');
    // Wait for dashboard to be fully loaded
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 60000 });
  });

  test('should display the dashboard page with title', async ({ page }) => {
    // Check if the page has the correct title
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('should display all KPI components', async ({ page }) => {
    // Check for all KPI cards
    await expect(page.getByText('Daily P&L').first()).toBeVisible({ timeout: 45000 });
    await expect(page.getByText('Total P&L').first()).toBeVisible();
    await expect(page.getByText('Account Equity').first()).toBeVisible();
    await expect(page.locator('div[data-slot="card-title"]').filter({ hasText: 'Drawdown' })).toBeVisible();
  });

  test('should display performance chart with tabs', async ({ page }) => {
    // Check for the performance chart
    await expect(page.locator('[data-testid="widget-performance"]')).toBeVisible({ timeout: 45000 });
    
    // Check for chart type buttons
    await expect(page.getByRole('button', { name: 'Equity' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'P&L' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Drawdown' })).toBeVisible();
    
    // First ensure we have default "Equity" active
    await expect(page.getByRole('button', { name: 'Equity' }))
      .toHaveClass(/bg-primary/);
    
    // Test switching to P&L
    await page.getByRole('button', { name: 'P&L' }).click();
    // Wait a moment for state to update
    await page.waitForTimeout(500);
    // After clicking P&L, the button should have a different appearance
    await expect(page.getByRole('button', { name: 'P&L' }))
      .toHaveClass(/bg-primary/);
  });

  test('should display active positions with data', async ({ page }) => {
    // Check for the active positions widget
    await expect(page.locator('[data-testid="widget-active-positions"]')).toBeVisible({ timeout: 45000 });
    
    // Check for some position data - be more specific with role selectors
    await expect(page.getByRole('cell', { name: 'SOL/USDC' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'BTC/USDC' })).toBeVisible();
  });

  test('should display risk metrics', async ({ page }) => {
    // Check for the risk metrics widget
    await expect(page.locator('[data-testid="widget-risk-metrics"]')).toBeVisible({ timeout: 45000 });
    
    // Check for key risk metrics
    await expect(page.getByText('Capital Deployed').first()).toBeVisible();
    await expect(page.getByText('Exposure by Asset').first()).toBeVisible();
    await expect(page.getByText('Correlations').first()).toBeVisible();
  });

  test('should display system status', async ({ page }) => {
    // Check for the system status widget
    await expect(page.locator('[data-testid="widget-system-status"]')).toBeVisible({ timeout: 45000 });
    
    // Check for status indicators
    await expect(page.getByText('Bot Status:').first()).toBeVisible();
    await expect(page.getByText('DeepSeek API:').first()).toBeVisible();
    await expect(page.getByText('Broker Connection:').first()).toBeVisible();
    await expect(page.getByText('Data Feed:').first()).toBeVisible();
  });

  test('should display recent alerts', async ({ page }) => {
    // Check for the alerts panel
    await expect(page.locator('[data-testid="widget-recent-alerts"]')).toBeVisible({ timeout: 45000 });
    
    // Check for alert entries - be more specific to avoid ambiguity
    await expect(page.getByText('Position size exceeds risk limit')).toBeVisible();
  });

  test('should collapse and expand widgets', async ({ page }) => {
    // Target a specific widget - Active Positions
    const positionsWidget = page.locator('[data-testid="widget-active-positions"]');
    
    // Verify widget content is initially visible
    const widgetContent = positionsWidget.locator('[data-testid="widget-content"]');
    await expect(widgetContent).toBeVisible({ timeout: 45000 });
    
    // Click the collapse button
    await positionsWidget.locator('[data-testid="collapse-button"]').click();
    
    // Wait for the animation to complete and content to be hidden
    await expect(widgetContent).not.toBeVisible({ timeout: 10000 });
    
    // Click again to expand
    await positionsWidget.locator('[data-testid="expand-button"]').click();
    
    // Wait for the animation to complete and content to be visible again
    await expect(widgetContent).toBeVisible({ timeout: 10000 });
  });

  test('should navigate to other pages', async ({ page }) => {
    // We need to wait for all initial rendering to complete
    await page.waitForLoadState('networkidle');
    
    // Check that navigation links are present
    await expect(page.getByRole('link', { name: 'Logs' })).toBeVisible({ timeout: 45000 });
    await expect(page.getByRole('link', { name: 'Settings' })).toBeVisible();
    
    // Navigate to Logs page - use more stable approach
    const logsLink = page.getByRole('link', { name: 'Logs' });
    await logsLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('/logs', { timeout: 60000 });
    await expect(page.getByRole('heading', { name: 'System Logs' })).toBeVisible({ timeout: 60000 });
    
    // Navigate to Settings page
    const settingsLink = page.getByRole('link', { name: 'Settings' });
    await settingsLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('/settings', { timeout: 60000 });
    await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible({ timeout: 60000 });
    
    // Navigate back to Dashboard
    const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    await dashboardLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('/dashboard', { timeout: 60000 });
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible({ timeout: 60000 });
  });
}); 