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
    // await page.waitForTimeout(2000); // 2-second delay
    // await expect(page.locator(loginSelectors.success)).toBeVisible();
await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const TenantsNav = page.locator('span:has-text("Tenants")');
  await expect(TenantsNav).toBeVisible();
  await expect(TenantsNav).toBeEnabled();

  // Click 'Resellers' menu link
  await TenantsNav.click();

  await expect(page.locator('h4.mb-sm-0')).toHaveText('Tenants');

  const tenantRow = page.getByRole('row', { name: /TenantCreate/ });
 await tenantRow.getByRole('link', { name: 'View' }).click();

 await expect(page.locator('h4.mb-sm-0')).toHaveText('TenantCreate');

 const companyNameCell = page.locator('table.detail-view tr:has(th:has-text("Company Name")) td');
 await expect(companyNameCell).toHaveText('TenantCreate');


  });
 });