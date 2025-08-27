import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import { searchVirtualMachineBackup } from '../../backupjobmodal';
import {VirtualDataCenterForm} from '../../virtualDataCenterForm';

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
//Verify Click edit VDC form 
 const editBtn = page.getByRole('link', { name: 'Edit' });
await expect(editBtn).toBeVisible();
await expect(editBtn).toBeEnabled();
await editBtn.click();

  const vdcForm = new VirtualDataCenterForm(page);
  
  await vdcForm.fillForm({
  
  dataCenter:'1',
  vdcName : 'Update_VDC Autotest',
  allocationType : '1',
  cpuCores :'50',
  memoryGiB : '50',
  overcommitment : '1',
  storagePolicyValue : '3',
  StorageInput : '200',
  backStorageValue : '4',
  backInput : '200',
  
  // primaryStorageLabel : 'updateautoStorage',
  // //expectedStorageLabel : '100',
  // backupStorageValue : 'Backupstore',
  
  });

const VdcsaveButton = page.locator('#submitBtn');
await expect(VdcsaveButton).toBeEnabled();
await VdcsaveButton.click();
  await expect(page.getByRole('heading', { level: 4, name: 'Update_VDC Autotest' })).toBeVisible();

});