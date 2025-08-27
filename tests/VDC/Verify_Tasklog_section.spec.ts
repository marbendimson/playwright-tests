import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyVDCDetailsVisible } from '../../VDC-page';
import { CreateBackupJobModal } from '../../backupjobmodal';



test('Should be able to successfully Clone Virtual Machine - Service Provider @dev @staging @preprod', async ({ page }) => {
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
  const taskLogTab = page.locator('a.nav-link[data-tab="event-log"]');

  await expect(taskLogTab).toBeVisible();
  await expect(taskLogTab).toBeEnabled();
  await taskLogTab.click();

  // Display this field 
  const eventLogsContainer = page.locator('#pjax-event-logs-list');
  await expect(eventLogsContainer).toBeVisible();

  // 4. Verify summary text appears
  await expect(eventLogsContainer.locator('.summary')).toContainText('Showing');

  // 5. Verify at least one row exists in table
  const firstRow = eventLogsContainer.locator('table tbody tr').first();
  await expect(firstRow).toBeVisible();


  const viewButton = page.locator('a.btn.btn-sm.py-0.modal-btn.btn-primary', { hasText: 'View' }).first();

  // 1. Verify button is visible and clickable
  await expect(viewButton).toBeVisible();
  await expect(viewButton).toBeEnabled();

  // 2. Click button
  await viewButton.click();

  
  const modal = page.locator('.modal-content:has(h5:has-text("View Event Log"))');
  await expect(modal).toBeVisible();

  const rows = modal.locator('table tbody tr');
  const rowCount = await rows.count();
  expect(rowCount).toBeGreaterThan(0);  // requires Playwright v1.49+

  // 6. Verify each row has label + value (non-empty)
  const labels = await rows.allTextContents();
  for (const label of labels) {
    expect(label.trim().length).toBeGreaterThan(0);
  }

  // 7. Close modal
//   await modal.locator('button.btn-close').click();
//   await expect(modal).toBeHidden();

});