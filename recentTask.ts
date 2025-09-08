import { expect, Page } from '@playwright/test';

export async function verifyTenantDeletionCompleted(
  page: Page,
  timeoutMs = 120000
): Promise<void> {
  const taskPanel = page.locator('#fixedTaskList');
  const toggleIcon = page.locator('#taskListToggleIcon');

  async function ensurePanelExpanded() {
    const iconClass = await toggleIcon.getAttribute('class');
    if (iconClass?.includes('ri-add-line')) {
      await toggleIcon.click();
    }
    await expect(taskPanel).toBeVisible({ timeout: 5000 });
  }

  await ensurePanelExpanded();

  const tenantDeletionRow = taskPanel.locator('table tr', {
    has: page.locator('td', { hasText: 'Tenant Deletion' }),
  }).first();

  await expect(tenantDeletionRow).toBeVisible({ timeout: timeoutMs });
  const statusCell = tenantDeletionRow.locator('span.badge');

  // Wait for status to become COMPLETED
  await expect(statusCell).toHaveText('completed', { timeout: timeoutMs });
}

/**
 * Ensures the Recent Tasks panel is expanded and visible.
 */
export async function ensureRecentTasksVisible(page: Page, timeoutMs = 5000): Promise<void> {
  const taskPanel = page.locator('#fixedTaskList');
  const toggleIcon = page.locator('#taskListToggleIcon');

  // Expand panel if collapsed
  const iconClass = await toggleIcon.getAttribute('class');
  if (iconClass?.includes('ri-add-line')) {
    await toggleIcon.click();
  }

  // Ensure panel and first row visible
  await expect(taskPanel).toBeVisible({ timeout: timeoutMs });
  await expect(taskPanel.locator('table tr').first()).toBeVisible({ timeout: timeoutMs });
}

export async function viewAndCloseCompletedTask(page: Page, taskName = 'Virtual Machine Creation') {
  // Ensure the Recent Tasks panel is visible
  const taskPanel = page.locator('#fixedTaskList');
  if (!(await taskPanel.isVisible())) {
    const toggleBtn = page.locator('#taskListToggleIcon');
    await toggleBtn.click();
    await expect(taskPanel).toBeVisible({ timeout: 5000 });
  }

  // 1. Find the first completed "Virtual Machine Creation" task
  const taskRow = page
    .locator('#taskListTableBody tr')
    .filter({ hasText: taskName })
    .filter({ hasText: 'completed' })
    .first();

  await expect(taskRow).toBeVisible({ timeout: 10000 });
  await taskRow.click();

  // 2. Verify the task details modal appears (wait for the specific modal, not all .modal-body)
  const modal = page.locator('.modal.show .modal-body');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // 3. Click Close button
  const closeBtn = page.locator('.modal.show button.btn.btn-secondary', { hasText: 'Close' });
  await expect(closeBtn).toBeVisible({ timeout: 5000 });
  await closeBtn.click();

  // 4. Verify modal is closed
  await expect(modal).toBeHidden({ timeout: 10000 });
}
export async function verifyAndRemoveCompletedTask(page: Page, taskName: string, confirm = true) {
  // 1. Find the first completed task row with the given name
  const taskRow = page
    .locator('#taskListTableBody tr')
    .filter({ hasText: taskName })
    .filter({ hasText: 'completed' })
    .first();

  await expect(taskRow).toBeVisible({ timeout: 10000 });
  await taskRow.click();

  // 2. Verify the task details modal appears
  const modal = page.locator('.modal.show .modal-content');
  await expect(modal).toBeVisible({ timeout: 10000 });

  // 3. Click "Remove Task" button inside task modal
  const removeBtn = modal.locator('.modal-footer button.btn.btn-danger', { hasText: 'Remove Task' });
  await expect(removeBtn).toBeVisible();
  await expect(removeBtn).toBeEnabled();
  await removeBtn.click();

  // 4. Handle SweetAlert2 confirmation modal
  const swalWarning = page.locator('.swal2-popup.swal2-modal.swal2-icon-warning');
  await expect(swalWarning).toBeVisible({ timeout: 10000 });

  if (confirm) {
    // ✅ Confirm removal
    const confirmBtn = swalWarning.locator('button.swal2-confirm', { hasText: 'Yes, remove it!' });
    await expect(confirmBtn).toBeVisible();
    await confirmBtn.click();

    // 5. Handle success modal
    const swalSuccess = page.locator('.swal2-popup.swal2-modal.swal2-icon-success');
    await expect(swalSuccess).toBeVisible({ timeout: 10000 });

    const okBtn = swalSuccess.locator('button.swal2-confirm', { hasText: 'OK' });
    await expect(okBtn).toBeVisible();
    await okBtn.click();

    // ✅ Verify the success modal disappears
    await expect(swalSuccess).toBeHidden({ timeout: 10000 });

    // ✅ Verify the task details modal also closes
    await expect(modal).toBeHidden({ timeout: 10000 });

    // ✅ Ensure the task row is no longer in the table
    await expect(taskRow).toHaveCount(0, { timeout: 10000 });

  } else {
    // ❌ Cancel removal
    const cancelBtn = swalWarning.locator('button.swal2-cancel', { hasText: 'Cancel' });
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // ✅ Verify the warning modal disappears
    await expect(swalWarning).toBeHidden({ timeout: 10000 });

    // ✅ Ensure the task is still visible in the table
    await expect(taskRow).toBeVisible();
  }
}


// export async function verifyVMCreation(
//   page: Page,
//   timeoutMs = 300000
// ): Promise<void> {
//   const taskPanel = page.locator('#fixedTaskList');
//   const toggleIcon = page.locator('#taskListToggleIcon');

//   async function ensurePanelExpanded() {
//     const iconClass = await toggleIcon.getAttribute('class');
//     if (iconClass?.includes('ri-add-line')) {
//       await toggleIcon.click();
//     }
//     await expect(taskPanel).toBeVisible({ timeout: 5000 });
//   }

//   await ensurePanelExpanded();

//   // Locate the VM creation row
//   const vmCreationRow = taskPanel.locator('table tr', {
//     has: page.locator('td', { hasText: 'Virtual Machine Creation' }),
//   }).first();

//   await expect(vmCreationRow).toBeVisible({ timeout: timeoutMs });

//   // Status cell (badge)
//   const statusCell = vmCreationRow.locator('span.badge');

// //   // Wait for status to contain "completed" (case-insensitive)
// //   await expect(statusCell).toHaveText(/completed/i, { timeout: timeoutMs });

//   const start = Date.now();
// while (Date.now() - start < timeoutMs) {
//   const text = await statusCell.textContent();
//   if (text?.toLowerCase().includes('completed')) break;
//   await page.waitForTimeout(5000); // wait 5s before retry
// }
// const finalText = await statusCell.textContent();
// expect(finalText?.toLowerCase()).toContain('completed');

// }


export async function verifyVMCreation(
  page: Page,
  timeoutMs = 320000 // 5 minutes
): Promise<void> {
  const taskPanel = page.locator('#fixedTaskList');
  const toggleIcon = page.locator('#taskListToggleIcon');

  // Ensure task panel is expanded
  const iconClass = await toggleIcon.getAttribute('class');
  if (iconClass?.includes('ri-add-line')) {
    await toggleIcon.click();
  }
  await expect(taskPanel).toBeVisible({ timeout: 5000 });

  // Polling loop for VM status
  const start = Date.now();
  let statusText = '';
  while (Date.now() - start < timeoutMs) {
    // Always get fresh locator
    const vmRow = taskPanel.locator('table tr', {
      has: page.locator('td', { hasText: 'Virtual Machine Creation' }),
    }).first();
    const statusCell = vmRow.locator('span.badge');

    // Get current status text
    statusText = (await statusCell.textContent())?.trim() || '';

    if (/completed/i.test(statusText)) {
      // Success
      return;
    }

    // Optional: log progress
    console.log(`Current VM status: "${statusText}", waiting...`);

    // Wait a short interval before retrying
    await page.waitForTimeout(6000); // 3s
  }

  // Timeout reached
  throw new Error(`VM creation did not complete within ${timeoutMs / 1000}s. Last status: "${statusText}"`);
}


export async function verifyVDCDeletionCompleted(
  page: Page,
  timeoutMs = 120000
): Promise<void> {
  const taskPanel = page.locator('#fixedTaskList');
  const toggleIcon = page.locator('#taskListToggleIcon');

  async function ensurePanelExpanded() {
    const iconClass = await toggleIcon.getAttribute('class');
    if (iconClass?.includes('ri-add-line')) {
      await toggleIcon.click();
    }
    await expect(taskPanel).toBeVisible({ timeout: 5000 });
  }

  await ensurePanelExpanded();

  const vdcDeletionRow = taskPanel.locator('table tr', {
    has: page.locator('td', { hasText: 'Tenant Deletion' }),
  }).first();

  await expect(vdcDeletionRow).toBeVisible({ timeout: timeoutMs });
  const statusCell = vdcDeletionRow.locator('span.badge');

  // Wait for status to become COMPLETED
  await expect(statusCell).toHaveText('completed', { timeout: timeoutMs });
}