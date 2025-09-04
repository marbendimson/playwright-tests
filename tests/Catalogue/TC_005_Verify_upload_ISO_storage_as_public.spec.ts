import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { IsoUploadForm } from '../../ISOupload';
import path from 'path';

test.describe('Virtual Machine Template Page — ISO Upload Flow', () => {
  test('Should upload ISO via local file successfully @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

    // Navigate directly using page object
    const form = new IsoUploadForm(page);
    await form.goToIsoUploadForm();

    // Step 1: Data center + visibility
    await form.selectDataCenter('MainDC');
    await form.setVisibility(true, 'TenantCreate', 'VDC Autotest');
    await form.nextFromStep1();

    // Step 2: Upload method
    const isoPath = path.resolve(__dirname, '../fixtures/TinyCore-current.iso');
    await form.chooseUploadMethod('local', isoPath);
    await form.nextFromStep2();

    // Step 3: Metadata
    await form.fillIsoMetadata('Test only-public', 'Test upload ISO storage via automation');
    await form.nextFromStep3();

    // Step 4: Confirmation
    await form.verifyConfirmation({
      dataCenter: 'MainDC',
      uploadMethod: 'Upload via local computer',
      fileName: 'TinyCore-current.iso',
      isoName: 'Test only-public',
      description: 'Test upload ISO storage via automation',
    });

    await form.confirmUpload();

    // Verify success
    const successAlert = page.locator('div.alert-success');
    await expect(successAlert).toContainText('ISO Uploaded');

    // Verify ISO is listed
    const td = page.getByRole('cell', { name: 'Test only-public', exact: true });
    await expect(td).toBeVisible({ timeout: 30000 });

    // Reload and confirm persistence
    await page.reload();
    await expect(td).toBeVisible({ timeout: 30000 });
  });
});
