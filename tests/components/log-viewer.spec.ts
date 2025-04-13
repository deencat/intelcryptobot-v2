import { test, expect } from '@playwright/test';

test.describe('Log Viewer Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the logs page
    await page.goto('/logs');
  });

  test('should display the log viewer page with title', async ({ page }) => {
    // Check if the page has the correct title
    await expect(page.getByRole('heading', { name: 'System Logs' })).toBeVisible();
    
    // Check for the description text
    await expect(page.getByText('View and filter system logs')).toBeVisible();
  });

  test('should display log table with data', async ({ page }) => {
    // The table should be present
    const table = page.locator('table');
    await expect(table).toBeVisible();
    
    // Check for table headers
    await expect(page.getByRole('columnheader', { name: 'Timestamp' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Type' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Message' })).toBeVisible();
    
    // Verify we have some log entries (rows)
    const rows = page.locator('table tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should filter logs by type', async ({ page }) => {
    // Open the Type filter dropdown
    await page.getByRole('combobox', { name: 'Log Type' }).click();
    
    // Select the "Error" type - be more specific to avoid ambiguity
    await page.locator('div[role="dialog"]').getByText('Error').click();
    
    // Wait for the table to update
    await page.waitForTimeout(300);
    
    // Verify that only Error type logs are displayed
    const errorBadges = page.locator('table tbody tr span:has-text("Error")').filter({ hasText: /^Error$/ });
    const errorCount = await errorBadges.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // Count all visible rows to compare
    const visibleRows = page.locator('table tbody tr:visible');
    const visibleRowsCount = await visibleRows.count();
    
    // Each row should have one Error badge
    expect(visibleRowsCount).toEqual(errorCount);
  });

  test('should search logs by text', async ({ page }) => {
    // Use the search input
    await page.getByPlaceholder('Search logs...').fill('API');
    
    // Wait for the table to update with the filtered results
    await page.waitForTimeout(300);
    
    // Check that all visible entries contain the search term
    const rows = page.locator('table tbody tr:visible');
    const count = await rows.count();
    
    // Verify we have some results
    expect(count).toBeGreaterThan(0);
    
    // Check for at least one row with the API text
    await expect(page.locator('table tbody').getByText(/API/i)).toBeVisible();
  });

  test('should filter logs by time range', async ({ page }) => {
    // Open the time range dropdown
    await page.getByRole('combobox', { name: 'Time Range' }).click();
    
    // Select "Last Hour" - be more specific
    await page.locator('div[role="dialog"]').getByText('Last Hour').click();
    
    // Wait for the table to update
    await page.waitForTimeout(300);
    
    // Verify that some logs are displayed (we have logs within the last hour in our mock data)
    const rows = page.locator('table tbody tr:visible');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should expand log details when clicked', async ({ page }) => {
    // Click on the first log entry
    await page.locator('table tbody tr').first().click();
    
    // Check that the details panel is visible
    const detailsPanel = page.locator('div').filter({ hasText: /^Details/ }).first();
    await expect(detailsPanel).toBeVisible();
    
    // Check that clicking again collapses the details
    await page.locator('table tbody tr').first().click();
    await expect(detailsPanel).not.toBeVisible();
  });

  test('should paginate logs', async ({ page }) => {
    // Check if pagination controls are visible
    const paginationControls = page.locator('div').filter({ hasText: /Page 1 of/ }).first();
    await expect(paginationControls).toBeVisible();
    
    // Get the first set of logs
    const firstPageRows = await page.locator('table tbody tr').allTextContents();
    
    // Click next page button - find button with the right icon
    await page.locator('button').last().click();
    
    // Wait for the table to update
    await page.waitForTimeout(300);
    
    // Check that we're on page 2
    await expect(page.locator('text=Page 2 of')).toBeVisible();
    
    // Get the second set of logs
    const secondPageRows = await page.locator('table tbody tr').allTextContents();
    
    // Verify the logs are different between pages
    expect(firstPageRows).not.toEqual(secondPageRows);
  });
}); 