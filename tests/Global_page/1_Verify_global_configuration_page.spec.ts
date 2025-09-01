import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';

test.describe('Verify Global Configuration Page ', () => {
  test('should be able to successfully view Global config page', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
     await page.click(loginSelectors.submit);
     await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

  const settingsLink = page.locator('a.nav-link.menu-link[href="#Settings"]');
  await expect(settingsLink).toBeVisible();
  await expect(settingsLink).toBeEnabled();
  await settingsLink.click();
  await expect(page.locator('#Settings')).toBeVisible();

  const globalConfig = page.locator('span[data-key="t-Global Configurations"]');
  await expect(globalConfig).toBeVisible();
  await globalConfig.click();


  //🔹 Tabs 
  await expect(page.locator('a.nav-link', { hasText: 'Site Information' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Infrastructure Settings' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Branding' })).toBeVisible(); 
   // 🔹 Configuration Labels 
  const siteNameLabel = page.locator('td.text-white', { hasText: 'Site Name' }).first();
  await expect(siteNameLabel).toBeVisible();
  await expect(page.locator('td.text-white', { hasText: 'Support Email' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'VLAN Starting Range' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'Debug Mode' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'Maintenance Mode' })).toBeVisible(); });


});
