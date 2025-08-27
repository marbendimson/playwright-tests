import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import { runBackupJob } from '../../backupjobmodal';

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

  //Navigate to Backup Job Tab 
   const backupJobsTab = page.locator('a.nav-link', { hasText: 'Backup Jobs' });
  await expect(backupJobsTab).toBeVisible();
  await expect(backupJobsTab).toBeEnabled();
  await backupJobsTab.click();
  const backupJobsSection = page.locator('#nav-scheduled-jobs');
  await expect(backupJobsSection.locator('.card-header .card-title')).toHaveText('Backup Jobs');

  // Verify the "Create Backup Job" button is visible
  await expect(backupJobsSection.locator('a.modal-btn.btn.btn-primary', { hasText: 'Create Backup Job' })).toBeVisible();
  // Verify the table headers
  await expect(backupJobsSection.locator('thead tr th')).toHaveText([
    '', 
    'Schedule',
    'Next Run',
    'Last Run',
    'Backup Target',
     '' // action-column is empty

  ]);

  await runBackupJob(page, false);
  await page.reload()
  await runBackupJob(page, true);

  });