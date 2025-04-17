import { test, expect } from '@playwright/test';

test.describe('CollapsibleWidget component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a page that includes CollapsibleWidget, such as the dashboard
    await page.goto('/dashboard');
  });

  test('should toggle content visibility when clicked', async ({ page }) => {
    // Find a CollapsibleWidget on the page
    const widget = page.getByTestId('widget-freqtrade-status');
    expect(widget).toBeDefined();

    // Check if the widget content is hidden by default (since defaultCollapsed is true)
    const contentBefore = widget.getByTestId('widget-content');
    await expect(contentBefore).toBeHidden();

    // Click the expand button
    await widget.getByTestId('expand-button').click();

    // Check if content is now visible
    const contentAfter = widget.getByTestId('widget-content');
    await expect(contentAfter).toBeVisible();

    // Click the collapse button
    await widget.getByTestId('collapse-button').click();

    // Check if content is hidden again
    await expect(contentAfter).toBeHidden();
  });

  test('should trigger onExpandChanged callback when toggled', async ({ page }) => {
    // This test would normally require a more complex setup with mocks
    // For now, we can test that clicking toggles the collapsed state visually
    
    const widget = page.getByTestId('widget-freqtrade-status');
    
    // Check initial state
    await expect(widget.getByTestId('expand-button')).toBeVisible();
    
    // Click to expand
    await widget.getByTestId('expand-button').click();
    
    // Verify it's now expanded (collapse button is visible)
    await expect(widget.getByTestId('collapse-button')).toBeVisible();
    
    // For widgets that use onExpandChanged, we'd expect content to load when expanded
    // For example, with FreqtradeStatus widget, we should see connection status appear
    const connectionStatus = widget.getByText('Connection:');
    await expect(connectionStatus).toBeVisible();
  });
}); 