import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import {
openActionsDropdown,startVMByName} from '../../vmactions';

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
  const vdcNav = page.locator('a.nav-link.menu-link:has(span[data-key="t-Virtual Data Centers"])');
await expect(vdcNav).toBeVisible({ timeout: 10000 });
await vdcNav.scrollIntoViewIfNeeded();
await vdcNav.click();

  // Confirm VDC page loaded
  await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

  // Click the first link matching the VDC name
  await page.locator(`a:has-text("VDC Autotest")`).first().click();

  //const vmRow = page.locator('tr', { hasText: 'AutoVM-001' });

  //await openActionsDropdown(vmRow);
  await startVMByName(page, 'AutoVM-001');



});