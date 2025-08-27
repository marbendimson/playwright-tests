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

  // Click 'Tenant' menu link
  await TenantsNav.click();

  const tenantView = page.getByRole('row', { name: /TenantCreate/ });
 await tenantView.getByRole('link', { name: 'View' }).click();

 await expect(page.locator('h4.mb-sm-0')).toHaveText('TenantCreate');

 await expect(page.getByRole('heading', { name: 'Tenant Users' })).toBeVisible();
 const impersonateButton = page.locator('td >> a[title="Impersonate"]');
 await impersonateButton.first().click();

 const roleCell = page.getByRole('row', { name: /tenant@sample.com/i }).getByRole('cell', { name: 'Tenant User' });
 await expect(roleCell).toBeVisible();

 await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

 const returnLink = page.getByRole('link', { name: 'Return to My Account' });
 await expect(returnLink).toBeVisible();
 await expect(returnLink).toBeEnabled();
 await returnLink.dblclick();

 // Expected Should be able to successfully return to Service Provider account 
 await expect(page.locator('.user-name-sub-text')).toHaveText('Service Provider Administrator', { timeout: 5000 });
 await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

  });
 });