import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import { searchVirtualMachineBackup } from '../../backupjobmodal';

test('Update Backup Job modal - full workflow with verification', async ({ page }) => {

    const user = getUserByRole('Service Provider');

  // Go to login page and login
  await page.goto(env.baseURL + '/login');
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);

  await page.waitForLoadState('networkidle');
  await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

  // Navigate to Virtual Data Centers
  const VDCNav = page.locator('span[data-key="t-Virtual Data Centers"]');
  await expect(VDCNav).toBeVisible({ timeout: 10000 });
  await expect(VDCNav).toBeEnabled();
  await VDCNav.click();

  // Confirm VDC page loaded
  await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

  // Click the first link matching the VDC name
  await page.locator(`a:has-text("VDC Autotest")`).first().click();

   //Verify display Task log section 
  const backupTab = page.locator('a.nav-link[data-tab="backups"]');

  await expect(backupTab).toBeVisible();
  await expect(backupTab).toBeEnabled();
  await backupTab.click();

// Card is visible
const backupStoragesCard = page.locator('.card:has(.card-title:has-text("Backup Storages"))');
await expect(backupStoragesCard).toBeVisible();

// Target header cells, not the row
const headerCells = backupStoragesCard.locator('thead th');

// Ensure we have 4 headers
await expect(headerCells).toHaveCount(4);

// Assert exact texts in order
await expect(headerCells).toHaveText(['Name', 'Capacity', 'Total Usage', 'Free Space']);

const result1 = await searchVirtualMachineBackup(page, 'Testt');
expect(result1).toBe('not_found');

await page.reload()
const result = await searchVirtualMachineBackup(page, 'AutoVM-001');
expect(result).toBe('found');



});