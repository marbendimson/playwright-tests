import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoStoragePage } from '../../ISOupload';

test.describe.skip('Virtual Machine Template Page — ISO Upload Flow', () => {
  test('Should display the ISO Upload form and allow uploading via URL @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    // Navigate to ISO Upload
    const catalogueNav = page.locator('span:has-text("Catalogue")');
    await expect(catalogueNav, 'Catalogue navigation should be visible').toBeVisible();
    await catalogueNav.click();

    const isoNav = page.getByRole('link', { name: 'ISOs' });
    await expect(isoNav, 'ISOs link should be visible').toBeVisible();
    await isoNav.click();

    // Validate ISO Storage page
    await expect(page.getByRole('heading', { level: 4, name: 'ISO Storage' }), 'ISO Storage heading should be visible').toBeVisible();

    const uploadLink = page.getByRole('link', { name: /upload/i });
    await expect(uploadLink, 'Upload ISO link should be visible').toBeVisible();

    await expect(page.getByRole('link', { name: /Import ISO from Proxmox/i }), 'Import from Proxmox link should be visible').toBeVisible();

    const isoPage = new IsoStoragePage(page);

  await isoPage.verifyIsoVisible('Test URL-public');
  await isoPage.deleteIso('Test URL-public', { includeProxmox: false });

  await isoPage.verifyIsoDeleted('Test URL-public');





  });
});
