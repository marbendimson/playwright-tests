import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';
import path from 'path';

test.describe('Verify logo upload more than 5mb size (small) ', () => {
  test('Should not be able to successfully upload image and display prompt message', async ({ page }) => {
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

      const logoPath = path.join(__dirname, '../fixtures/img-5mb.jpg');
  await page.locator('#profile-img-file-input-logo_small').setInputFiles(logoPath);

  const errorPopup = page.locator('.swal2-popup.swal2-modal.swal2-icon-error');
  await expect(errorPopup).toBeVisible();

  await expect(page.locator('#swal2-title')).toHaveText('File Size Exceeded');
  await expect(page.locator('#swal2-html-container')).toHaveText(
    'The file size must not exceed 2 MB.'
  );

  const okButton = page.getByRole('button', { name: 'OK' });
  await expect(okButton).toBeVisible();
  await okButton.click();

  await page.reload();


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
