import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';
import path from 'path';

test.describe('Verify select small logo ', () => {
  test('should be able to successfully select and display small logo ', async ({ page }) => {
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

  const brandingTab = page.locator('a.nav-link', { hasText: 'Branding' });
await expect(brandingTab).toBeVisible();
await expect(brandingTab).toBeEnabled();
await brandingTab.click();

      const logoPath = path.join(__dirname, '../fixtures/testsmalllogo.png');
  await page.locator('#profile-img-file-input-logo_small').setInputFiles(logoPath);

  // Click Save
  await page.getByRole('button', { name: 'Save' }).click();

  // ✅ Verify success alert is visible
  const successAlert = page.locator('.alert-success', { hasText: 'Settings Saved!' });
  await expect(successAlert).toBeVisible();

  });

});