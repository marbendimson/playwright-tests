import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import { UpdateBackupJobModal } from '../../backupjobmodal';

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
  const modal = new UpdateBackupJobModal(page);

  // Open the modal and update values
  await modal.open();
  await modal.fillBasicInfoAndSchedule({
    name: 'Updated Backup Job',
    enabled: true,
    storage: '4',
    mode: 'snapshot',
    schedule: 'hourly',
  });
  await modal.selectVMs(['AutoVM-001', 'AutoVM-001-Clone']);
  await modal.setRetention({ hourly: 2 });
  await modal.toggleKeepAllBackups(false);
  await modal.saveJob();

  // Re-open the modal to verify the values are persisted
  const verifyModal = new UpdateBackupJobModal(page);
  await verifyModal.open();

  // Verify basic info
  const nameValue = await page.locator('input[name="ScheduledBackup[name]"]').inputValue();
  expect(nameValue).toBe('Updated Backup Job');

  const storageValue = await page.locator('#scheduledbackup-backup_storage_id').inputValue();
  expect(storageValue).toBe('4');

  const modeValue = await page.locator('#scheduledbackup-mode').inputValue();
  expect(modeValue).toBe('snapshot');

  const scheduleValue = await page.locator('#schedule-select').inputValue();
  expect(scheduleValue).toBe('hourly');

  const enabledChecked = await page.locator('#customSwitchsizelg').isChecked();
  expect(enabledChecked).toBe(true);

  // Verify retention
  const hourlyValue = await page.locator('#scheduledbackup-keep_hourly').inputValue();
  expect(hourlyValue).toBe('2');

  const keepAllChecked = await page.locator('#scheduledbackup-keep_all').isChecked();
  expect(keepAllChecked).toBe(false);

  // Optionally, verify selected VMs
  const selectedVMs = await page.locator('.non-selected-wrapper .item.selected').allTextContents();
  expect(selectedVMs).toEqual(expect.arrayContaining(['AutoVM-001', 'AutoVM-001-Clone']));
});
