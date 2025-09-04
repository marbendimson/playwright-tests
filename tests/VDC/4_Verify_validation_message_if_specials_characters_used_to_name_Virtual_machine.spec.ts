import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import vmPage from '../../vm-page';



test('Create VM - All in One Flow', async ({ page }) => {
  const user = getUserByRole('Service Provider');

  // Login
  await page.goto(`${env.baseURL}/login`);
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);

  await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });



  // Confirm VDC page is loaded
  await expect(page.locator('h4.pb-2:has-text("Virtual Data Centers")')).toBeVisible({ timeout: 10000 });

  // Navigate to VDC
  await vmPage.navigateToVDC(page, 'VDC Autotest');

  // Step 1: Basic Info
  await vmPage.fillBasicInfo(page, 'VMtemp', 'linux', 'l26');

  const invalidFeedback = page.locator('.invalid-feedback', {
    hasText: 'Only alphanumeric characters, hyphens, and full stops are allowed. It cannot start or end with a hyphen or full stop.'
  });

  await expect(invalidFeedback).toBeVisible({ timeout: 5000 });

  });