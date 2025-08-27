import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import {
openRenameModal,
renameVM
} from '../../vmactions';


test.describe('Clone ViMachinertual ', () => {
  test('Should be able to successfully Clone Virtual Machine - Service Provider @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Go to login page and login
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);

    await page.waitForLoadState('networkidle');
    // Wait for dashboard or success indicator
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });
     // Wait for Virtual Data Centers page header or any unique element on that page to confirm navigation
  
    // Locate and click Virtual Data Centers navigation
    const VDCNav = page.locator('span[data-key="t-Virtual Data Centers"]');
    await expect(VDCNav).toBeVisible({ timeout: 10000 });
    await expect(VDCNav).toBeEnabled();
    await VDCNav.click();

    // Optional: further verification or steps after landing on VDC page
    await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

   // Click only the link that matches the VDC name
    await page.locator(`a:has-text("VDC Autotest")`).first().click();

    const vmRow = page.locator('table tbody tr').filter({
  has: page.locator('td:has-text("AutoVM-001")')
}).first();

await openRenameModal(vmRow);
await renameVM(page, 'MyNewVMName');


     });
    });