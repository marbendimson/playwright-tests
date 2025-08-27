import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Verify view virtual machine template page', () => {
  test('Should successfully display virtual machine Template page without any UI and Typo issues  @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const CatalogueNav = page.locator('span:has-text("Catalogue")');
  await expect(CatalogueNav).toBeVisible();
  await expect(CatalogueNav).toBeEnabled();

  // Click 'Tenant' menu link
  await CatalogueNav.click();

  const ISONav = page.getByRole('link', { name: 'ISOs' });
  await expect(ISONav).toBeVisible();
  await ISONav.click();
  
  await expect(page.getByRole('heading', { level: 4, name: 'ISO Storage' })).toBeVisible();
  await expect(page.getByRole('link', { name: /upload/i })).toBeVisible();
  await expect(page.getByRole('link', { name: /import iso from proxmox/i })).toBeVisible();
  
  const headers = ['Name', 'Available on Proxmox', 'File Name', 'Data Center'];

for (const header of headers) {
  const th = page.locator('th').filter({ hasText: header }).first();
  await expect(th).toBeVisible();
}
await expect(page.locator('a[data-modal-url*="/iso/delete"]').first()).toBeVisible();




 });
 }); 