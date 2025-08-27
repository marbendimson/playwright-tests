import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';
import { EditInternalNetworkForm } from '../../createInternal';

test.describe('Internal Networks Page', () => {
  test('should login and display Internal Networks page, then edit a network', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

     await page.waitForLoadState('networkidle');
    // Navigate to Internal Networks
    const networkingSpan = page.locator('span[data-key="t-networking"]');
    await expect(networkingSpan).toBeVisible();
    await networkingSpan.click();

    const internalNetworksSpan = page.locator('span[data-key="t-Internal Networks"]');
    await expect(internalNetworksSpan).toBeVisible();
    await internalNetworksSpan.click();

    // Verify page
    await verifyInternalNetworkPage(page);

    // Create form handler instance
    const internalNetworkForm = new EditInternalNetworkForm(page);

    // Open the edit form
    await internalNetworkForm.openEditForm('My Network');

    // Fill fields
    await internalNetworkForm.fillForm({
      name: 'Updated My Network',
      subnet: '192.168.10.0/24',
      gateway: '192.168.10.1',
      vdcNames: ['VDC Autotest (updatetestDC)'] // adjust if needed
    });

    // Submit
    await internalNetworkForm.submit();

    await verifyInternalNetworkPage(page);
  await expect(page.getByRole('cell', { name: 'Updated My Network', exact: true })).toBeVisible();
  await page.reload();
  await verifyInternalNetworkPage(page);
  await expect(page.getByRole('cell', { name: 'Updated My Network', exact: true })).toBeVisible();
  });
});
