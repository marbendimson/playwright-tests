import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoUploadForm } from '../../ISOupload';

test.describe('Virtual Machine Template Page — ISO Upload Flow', () => {
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
    await uploadLink.click();

    await expect(page.getByRole('link', { name: /Import ISO from Proxmox/i }), 'Import from Proxmox link should be visible').toBeVisible();

    // Fill the upload form
    const form = new IsoUploadForm(page);

    await form.selectDataCenter('DC');
    await form.setVisibility(false, 'TenantCreate', 'VDC Autotest');

    const nextButton = page.locator('#data-center-submit');
    await expect(nextButton, 'Next Step button should be visible and enabled').toBeVisible();
    await expect(nextButton).toBeEnabled();
    await nextButton.click();

    // Validate upload method step
    await expect(page.getByRole('heading', { name: 'Select ISO Upload Method' }), 'Upload method section should appear').toBeVisible();

    // Perform upload via URL (replace with actual URL string as needed)
    //await form.chooseUploadMethod('local', 'C:\\Users\\marben.dimson\\Desktop\\TinyCore-current.iso');
    await form.chooseUploadMethod('url', 'http://tinycorelinux.net/15.x/x86_64/release/TinyCorePure64-15.0.iso');

    const uploadedFileName = page.getByText('TinyCorePure64-15.0.iso', { exact: true });
    await expect(uploadedFileName).toBeVisible();
    await expect(uploadedFileName).toHaveText('TinyCorePure64-15.0.iso');

    const nextStepButton = page.locator('#iso-selection-submit');
    await expect(nextStepButton).toBeVisible();
    await expect(nextStepButton).toBeEnabled();
    await nextStepButton.click({ trial: true }); 
    await nextStepButton.click();


    //input name and ISO description
    await form.fillIsoMetadata('Test URL-private', 'Test upload ISO storage via automation');
    const nextButton1 = page.locator('#iso-name-submit');
    await expect(nextButton1, 'Next Step button should be visible and enabled').toBeVisible();
    await expect(nextButton1).toBeEnabled();
    await nextButton1.click();


    // Confirm upload details :
    await expect(page.locator('.c-data_center_id')).toHaveText('DC');
    await expect(page.locator('.c-upload_method')).toContainText('Upload via URL');
    await expect(page.locator('.c-upload_method')).toContainText('TinyCorePure64-15.0.iso');
    await expect(page.locator('.c-iso_name')).toHaveText('Test URL-private');

    const confirmButton = page.locator('#submit-button');
    await expect(confirmButton, 'Upload ISO button should be visible and enabled').toBeVisible();
    await expect(confirmButton).toBeEnabled();
    await confirmButton.click();


    const successAlert = page.locator('div.alert-success', {hasText: 'ISO Uploaded Succesfully',});
    await expect(successAlert, 'Success message should appear after upload').toBeVisible();
    await expect(successAlert).toHaveText('ISO Uploaded Succesfully');


     const td = page.locator('td', { hasText: 'Test URL-private' });
     await td.waitFor({ state: 'visible' });
     await expect(td).toBeVisible();

     await page.reload()

     await td.waitFor({ state: 'visible' });
     await expect(td).toBeVisible();





  });
});
