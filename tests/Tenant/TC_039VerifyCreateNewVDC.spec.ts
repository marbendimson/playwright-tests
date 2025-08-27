import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import {VirtualDataCenterForm} from '../../virtualDataCenterForm';


test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
  

    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    // await page.waitForTimeout(2000); // 2-second delay
    // await expect(page.locator(loginSelectors.success)).toBeVisible();
await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const TenantsNav = page.locator('span:has-text("Tenants")');
  await expect(TenantsNav).toBeVisible();
  await expect(TenantsNav).toBeEnabled();

  // Click 'Tenant' menu link
  await TenantsNav.click();

  const tenantView = page.getByRole('row', { name: /TenantCreate/ });
 await tenantView.getByRole('link', { name: 'View' }).click();

 await expect(page.locator('h4.mb-sm-0')).toHaveText('TenantCreate');

 await expect(page.getByRole('heading', { name: 'Virtual Data Centers' })).toBeVisible();
 await expect(page.getByRole('link', { name: 'New Virtual Data Center' })).toBeVisible();

 const newVDCButton = page.getByRole('link', { name: 'New Virtual Data Center' });
await expect(newVDCButton).toBeEnabled();
await newVDCButton.click();

const vdcForm = new VirtualDataCenterForm(page);

await vdcForm.fillForm({

dataCenter:'6',
vdcName : 'VDC Autotest',
allocationType : '1',
cpuCores :'4',
memoryGiB : '16',
overcommitment : '1',
storagePolicyValue : '9',
StorageInput : '100',
backStorageValue : '6',
backInput : '100',

// primaryStorageLabel : 'updateautoStorage',
// //expectedStorageLabel : '100',
// backupStorageValue : 'Backupstore',

});

const VdcsaveButton = page.locator('#submitBtn');
await expect(VdcsaveButton).toBeEnabled();
await VdcsaveButton.click();

await expect(page.getByRole('heading', { level: 4, name: 'VDC Autotest' })).toBeVisible();



 });
 });