import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoStoragePage } from '../../ISOupload';

test.describe('Virtual Machine Template Page — ISO Storage Management', () => {
  test('Should delete a public ISO from storage @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // =========================
    // Login
    // =========================
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);

    await expect(page.locator(loginSelectors.success), 'Login should succeed').toBeVisible({ timeout: 20000 });


     // Navigate to Catalogue → ISOs
    const CatalogueNav = page.locator('span[data-key="t-catalogue"]');
    await expect(CatalogueNav).toBeVisible();
    await CatalogueNav.click();

   const isoNav = page.getByRole('link', { name: 'ISOs', exact: true });
await expect(isoNav).toBeVisible();
await Promise.all([
  page.waitForLoadState('networkidle'),
  isoNav.click(),
]);

    // =========================
    // Verify & Delete ISO
    // =========================
    const isoPage = new IsoStoragePage(page);
    const isoName = 'Test only-public';

    await isoPage.verifyIsoVisible(isoName);
    await isoPage.deleteIso(isoName, { includeProxmox: true });
    await isoPage.verifyIsoDeleted(isoName);
  });
});
