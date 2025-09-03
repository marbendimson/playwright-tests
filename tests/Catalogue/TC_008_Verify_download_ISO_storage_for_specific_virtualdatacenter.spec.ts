
import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoUploadForm } from '../../ISOupload';

test.describe('Virtual Machine Template Page — ISO Upload Flow', () => {
  test('Should display the ISO Upload form and allow uploading via URL @dev @staging @preprod', async ({ page }) => {
    // =========================
    // Test data
    // =========================
    const user = getUserByRole('Service Provider');
    const isoUrl = 'http://tinycorelinux.net/15.x/x86_64/release/TinyCorePure64-15.0.iso';
    const isoFileName = 'TinyCorePure64-15.0.iso';
    const isoFriendlyName = 'Test URL-private';
    const isoDescription = 'Test upload ISO storage via automation';

    // =========================
    // Login
    // =========================
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    // =========================
    // Navigate to ISO Upload
    // =========================
    const catalogueNav = page.locator('span:has-text("Catalogue")');
    await expect(catalogueNav).toBeVisible();
    await catalogueNav.click();

    const isoNav = page.getByRole('link', { name: 'ISOs' });
    await expect(isoNav).toBeVisible();
    await isoNav.click();

    await expect(page.getByRole('heading', { level: 4, name: 'ISO Storage' })).toBeVisible();

    const uploadLink = page.getByRole('link', { name: /upload/i });
    await expect(uploadLink).toBeVisible();
    await uploadLink.click();

    await expect(page.getByRole('link', { name: /Import ISO from Proxmox/i })).toBeVisible();

    // =========================
    // Step 1 — Data Center & Visibility
    // =========================
    const form = new IsoUploadForm(page);

    await form.selectDataCenter('MainDC');
    await form.setVisibility(false, 'TenantCreate', 'VDC Autotest');
    await form.nextFromStep1();

    // =========================
    // Step 2 — Upload Method
    // =========================
    await expect(page.getByRole('heading', { name: 'Select ISO Upload Method' })).toBeVisible();
    await form.chooseUploadMethod('url', isoUrl);

    // Verify uploaded filename is displayed
    // const uploadedFileName = page.getByText(isoFileName, { exact: true });
    // await expect(uploadedFileName).toBeVisible();
    // await expect(uploadedFileName).toHaveText(isoFileName);

    const uploadedFileName = page.locator('.file-name-container').getByText(isoFileName, { exact: true });
await expect(uploadedFileName).toBeVisible();
await expect(uploadedFileName).toHaveText(isoFileName);


    await form.nextFromStep2();

    // =========================
    // Step 3 — ISO Metadata
    // =========================
    await expect(page.getByRole('heading', { level: 5, name: 'Give Your ISO a Friendly Name' })).toBeVisible();
    await form.fillIsoMetadata(isoFriendlyName, isoDescription);
    await form.nextFromStep3();

    // =========================
    // Step 4 — Confirmation
    // =========================
    await form.verifyConfirmation({
      dataCenter: 'MainDC',
      uploadMethod: 'Upload via URL',
      fileName: isoFileName,
      isoName: isoFriendlyName,
      description: isoDescription,
    });

    await form.confirmUpload();

    // =========================
    // Success confirmation
    // =========================
    const successAlert = page.locator('div.alert-success', { hasText: 'ISO Uploaded' });
    await expect(successAlert).toBeVisible();
    await expect(successAlert).toContainText('ISO Uploaded');

    // =========================
    // Verify ISO appears in list
    // =========================
    const td = page.locator('td', { hasText: isoFriendlyName });
    await expect(td).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(td).toBeVisible({ timeout: 10000 });
  });
});
