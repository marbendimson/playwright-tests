import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { openConvertToTemplateModal, submitConvertToTemplate } from '../../vmactions';

test.describe('Clone Virtual Machine', () => {
  test('Should be able to successfully Convert Virtual Machine to Template - Service Provider @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);

    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    // Navigate to VDC
    const VDCNav = page.locator('span[data-key="t-Virtual Data Centers"]');
    await expect(VDCNav).toBeVisible({ timeout: 10000 });
    await VDCNav.click();
    await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

    // Click specific VDC
    await page.locator('a:has-text("VDC Autotest")').first().click();

    // Locate the VM row (scoped to table)
    const vmRow = page.locator('table tbody tr').filter({
      has: page.locator('td:has-text("MyNewVMName")')
    }).first();

    // Open modal & get elements
    const modalHandles = await openConvertToTemplateModal(vmRow);

    // Fill form
    await modalHandles.radioIsolated.check();
    await modalHandles.noteField.fill('Testing VM to Template conversion');

    // Save & wait for completion
    await submitConvertToTemplate(modalHandles);

    // Verify modal closes
    await expect(modalHandles.modal).toBeHidden({ timeout: 5000 });
  });
});
