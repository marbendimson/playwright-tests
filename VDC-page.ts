import { expect, Page } from '@playwright/test';

export async function verifyVDCDetailsVisible(page: Page) {
  // Verify Allocation text
  await expect(page.locator('p.fw-medium:text("Allocation")')).toBeVisible();

  // Verify the Virtual Data Center name link (e.g. "test")
  await expect(page.locator('h2 > a.mt-4.ff-secondary.fw-semibold.text-white')).toBeVisible();

  // Verify the New Virtual Machine dropdown button
  await expect(page.locator('button:has-text("New Virtual Machine")')).toBeVisible();

  // Verify Edit button for VDC
  await expect(page.locator('a.btn-success:has-text("Edit")')).toBeVisible();

  // Verify Delete button for VDC
  await expect(page.locator('a.btn-danger:has-text("Delete")')).toBeVisible();

  // Verify Total VMs badge and count
  await expect(page.locator('#totalVmsBadge')).toBeVisible();
  await expect(page.locator('#totalVmsBadge b')).toHaveText('Total VMs:');

  // Verify Running VMs badge and count
  await expect(page.locator('#runningVmsBadge')).toBeVisible();
  await expect(page.locator('#runningVmsBadge b')).toHaveText('Running VMs:');

 // Verify Tenant label and value row
await expect(page.locator('table tbody tr >> nth=0 >> td.fw-medium')).toHaveText('Tenant');
await expect(page.locator('table tbody tr >> nth=0 >> td >> nth=1')).not.toHaveText('');

// Verify Reseller label and value row
await expect(page.locator('table tbody tr >> nth=1 >> td.fw-medium')).toHaveText('Reseller');
await expect(page.locator('table tbody tr >> nth=1 >> td >> nth=1')).not.toHaveText('');

}

export async function verifyStoragePolicySection(page: Page) {
  const storagePolicyTab = page.locator('a.nav-link[data-tab="storage-policy"]');
  await expect(storagePolicyTab).toBeVisible();
  await expect(storagePolicyTab).toBeEnabled();
  await storagePolicyTab.click();

  const tabPanel = page.locator('div[role="tabpanel"]:has-text("Storage Policy")');

  const headers = [
    'Storage Policy',
    'Capacity',
    'VM Usage',
    'Catalogue Usage',
    'Free Space'
  ];

  for (const header of headers) {
    await expect(tabPanel.locator(`table thead tr th:has-text("${header}")`)).toBeVisible();
  }
}

export async function openBackupTab(page: Page): Promise<void> {
  // Click Usage tab
  const tab = page.locator('a.nav-link[data-tab="usage"]');
  await expect(tab).toBeVisible();
  await tab.click();

  // Date range filter
  await expect(page.locator('label.form-label', { hasText: 'Select date range:' })).toBeVisible();

  // CPU usage chart
  const cpuCard = page.locator('.card', { has: page.getByRole('heading', { name: 'CPU usage over time' }) });
  await expect(cpuCard.locator('#cpu-usage-chart')).toBeVisible();

  // Memory usage chart
  const memoryCard = page.locator('.card', { has: page.getByRole('heading', { name: 'Memory usage over time' }) });
  await expect(memoryCard.locator('#memory-usage-chart')).toBeVisible();

  // Storage Policy usage chart
  await expect(page.getByRole('heading', { name: 'Storage Policy usage over time' })).toBeVisible();

  // Backup Storage usage chart
  await expect(page.getByRole('heading', { name: 'Backup Storage usage over time' })).toBeVisible();
}


export async function handleDeleteVDC(page: Page, vdcName: string, action: 'confirm' | 'cancel' = 'confirm'): Promise<void> {
  // Open modal (scope to first matching Delete link to avoid ambiguity)
  const deleteLink = page.getByRole('link', { name: 'Delete' }).first();
  await expect(deleteLink).toBeVisible();
  await expect(deleteLink).toBeEnabled();
  await deleteLink.click();

  // Narrow to the specific dialog by accessible name (strict — resolves to a single dialog)
  // const dialog = page.getByRole('dialog', { name: `Delete: ${vdcName}` });
  // await expect(dialog).toBeVisible();
  const dialog = page.getByRole('dialog', { name: new RegExp(`Delete:.*${vdcName}`) });
await expect(dialog).toBeVisible({ timeout: 10000 });


  // Verify key contents inside the dialog (scoped)
  // Verify key contents inside the dialog (scoped)
const heading = dialog.locator('h5.modal-title', { hasText: `Delete: ${vdcName}` });
await expect(heading).toBeVisible();
await expect(dialog.getByText('Are you sure you want to delete this Virtual Data Center?')).toBeVisible();
await expect(dialog.locator('.badge', { hasText: vdcName })).toBeVisible();


  if (action === 'confirm') {
    const nameInput = dialog.locator('#virtualdatacenterdeleteform-name');
  await expect(nameInput).toBeVisible();
  await nameInput.fill(vdcName);
    // Confirm delete using the button inside the dialog
    const confirmBtn = dialog.getByRole('button', { name: /Delete VDC|Delete/i });
    await expect(confirmBtn).toBeVisible();
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    // Wait for expected post-delete behaviour - prefer navigation to index OR success toast.
    // Try navigation first (adjust path if your app redirects elsewhere)
    await page.waitForURL(/\/virtual-data-center(\/index)?/, { timeout: 10000 });

    // Optionally, assert a success notification if your app shows one:
    
  } else {
    // Cancel flow: click cancel inside the dialog and ensure the dialog is hidden


    const cancelBtn = dialog.getByRole('button', { name: 'Cancel' });
    await expect(cancelBtn).toBeVisible();
    await expect(cancelBtn).toBeEnabled();
    await cancelBtn.click();

    // Wait for the same dialog to go away
    await expect(dialog).toBeHidden();
  }
}
