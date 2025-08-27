import { test, expect, Page } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

async function loginAndVerify(page: Page, role: string) {
  const user = getUserByRole(role);
  await page.goto(`${env.baseURL}/login`);
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);

  // Wait for redirect to dashboard or visible success element
  await page.waitForURL('**/dashboard', { timeout: 15000 }).catch(async () => {
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 10000 });
  });
}

test.describe('Login Success Tests', () => {
  const roles = ['Service Provider', 'Administrator', 'Manager'];

  for (const role of roles) {
    test(`should login successfully with ${role} @dev @staging @preprod`, async ({ page }) => {
      await loginAndVerify(page, role);
    });
  }
});
