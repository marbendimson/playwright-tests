import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoUploadForm } from '../../ISOupload';
import path from 'path';

test.describe('Virtual Machine Template Page — ISO Upload Flow', () => {
  test('Should display the ISO Upload form and allow uploading via URL @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
  await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

    // Navigate to ISO Upload
    const catalogueNav = page.locator('span:has-text("Catalogue")');
    await expect(catalogueNav, 'Catalogue navigation should be visible').toBeVisible();
    await catalogueNav.click();

    const isoNav = page.getByRole('link', { name: 'ISOs' });
    await expect(isoNav, 'ISOs link should be visible').toBeVisible();
    await isoNav.click();

    // Validate ISO Storage page
    await expect(page.getByRole('heading', { level: 4, name: 'ISO Storage' }), 'ISO Storage heading should be visible').toBeVisible();
     
    //await page.reload()
    const uploadLink = page.getByRole('link', { name: /upload/i });
    await expect(uploadLink).toBeVisible();
    await uploadLink.click();
    //wait expect(page.locator('css=selector-for-upload-modal')).toBeVisible();


    await expect(page.getByRole('link', { name: /Import ISO from Proxmox/i }), 'Import from Proxmox link should be visible').toBeVisible();

    // Fill the upload form
    const form = new IsoUploadForm(page);

    await form.selectDataCenter('MainDC');
    await form.setVisibility(true, 'TenantCreate', 'VDC Autotest');

    const nextButton = page.locator('#data-center-submit');
    await expect(nextButton, 'Next Step button should be visible and enabled').toBeVisible();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Validate upload method step
     const isoHeading = page.getByRole('heading', { level: 4, name: 'ISO Storage' });
     await isoHeading.waitFor({ state: 'visible', timeout: 60000 });
     await expect(isoHeading).toBeVisible();

    // Perform upload via URL (replace with actual URL string as needed)
    const isoPath = path.resolve(__dirname, '../fixtures/TinyCore-current.iso');
    await form.chooseUploadMethod('local', isoPath);

    //await form.chooseUploadMethod('url', 'https://ubuntu.mirror.serversaustralia.com.au/ubuntu-releases/24.10/ubuntu-24.10-live-server-amd64.iso');

    const nextStepButton = page.locator('#iso-selection-submit');
    await expect(nextStepButton).toBeVisible();
    await nextStepButton.click();

    //input name and ISO description
    await form.fillIsoMetadata('Test only-public ', 'Test upload ISO storage via automation');
    const nextButton1 = page.locator('#iso-name-submit');
    await expect(nextButton1, 'Next Step button should be visible and enabled').toBeVisible();
    await expect(nextButton1).toBeEnabled();
    await nextButton1.click();


    // Confirm upload details :s
    await expect(page.locator('.c-data_center_id')).toHaveText('MainDC');
    await expect(page.locator('.c-upload_method')).toContainText('Upload via local computer');
    await expect(page.locator('.c-upload_method')).toContainText('TinyCore-current.iso');
    await expect(page.locator('.c-iso_name')).toHaveText('Test only-public');

    const confirmButton = page.locator('#submit-button');
    await expect(confirmButton, 'Upload ISO button should be visible and enabled').toBeVisible();
    await expect(confirmButton).toBeEnabled();
    // double clicking uploaidng ISO 
    await confirmButton.click({ clickCount: 5 });


    const successAlert = page.locator('div.alert-success', {hasText: 'ISO Uploaded Succesfully',});
    await expect(successAlert, 'Success message should appear after upload').toBeVisible();
    await expect(successAlert).toHaveText('ISO Uploaded Succesfully');

const td = page.locator('td', { hasText: 'Test only-public' });
await td.waitFor({ state: 'visible' });
await expect(td).toBeVisible();

await page.reload()

await td.waitFor({ state: 'visible' });
await expect(td).toBeVisible();





  });
});
