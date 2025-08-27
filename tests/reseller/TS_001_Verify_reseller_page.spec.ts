import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    //await expect(page.locator(loginSelectors.success)).toBeVisible();
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });
    const resellersNav = page.locator('span[data-key="t-Resellers"]');
  await expect(resellersNav).toBeVisible();
  await expect(resellersNav).toBeEnabled();

  // Click 'Resellers' menu link
  await resellersNav.click();

  // Verify Resellers page title is present
  await expect(page.locator('h4.mb-sm-0')).toHaveText('Resellers');

  // Wait for specific div to be present (adjust selector as needed)
  await expect(
    page.locator('div:has-text("Resellers")').nth(0)
  ).toBeVisible();

  // Optionally verify second similar div (adjust if required)
  await expect(
    page.locator('div:has-text("Resellers")').nth(1)
  ).toBeVisible();
    });
  });