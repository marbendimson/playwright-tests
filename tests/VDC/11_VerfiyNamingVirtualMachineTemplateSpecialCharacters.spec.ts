import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import {fillGeneralConfig,navigateToVDC,selectTemplate,configureSystemSetup} from '../../vmtemplate';




test('Create VM Template naming with special characters ', async ({ page }) => {
  const user = getUserByRole('Service Provider');

  // Login
  await page.goto(`${env.baseURL}/login`);
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);

  await page.waitForLoadState('networkidle');
    // Wait for dashboard or success indicator
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

 await navigateToVDC(page, 'VDC Autotest');
  // Navigate to VDC
 await fillGeneralConfig(page, 'test~!@#$%^&*()_+-={}|[]\:";', 'linux');

 const invalidFeedback = page.locator('.invalid-feedback', {
    hasText: 'Only alphanumeric characters and hyphens are allowed. It cannot start or end with a hyphen.'
  });

  await expect(invalidFeedback).toBeVisible({ timeout: 5000 });

// await selectTemplate(page, 'stagingnewVM');
// await configureSystemSetup(page, '1');


// await expect(page.locator('h2 > a:has-text("TestVM-Template")')).toBeVisible({ timeout: 10000 });

//  await page.reload()
// await expect(page.locator('h2 > a:has-text("TestVM-Template")')).toBeVisible({ timeout: 10000 });


  });