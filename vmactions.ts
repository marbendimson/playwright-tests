import { expect, Locator, Page } from '@playwright/test';

export async function openActionsDropdown(vmRow: Locator) {
  const actionsBtn = vmRow.locator('button#btnGroupDrop1').first();

  // ✅ First wait until row is visible
  await expect(vmRow).toBeVisible({ timeout: 60000 });

  // ✅ Then scroll into view
  await vmRow.scrollIntoViewIfNeeded();

  // Hover to reveal the actions menu
  await vmRow.hover();

  // Wait for the actions button
  await expect(actionsBtn).toBeVisible({ timeout: 10000 });
  await expect(actionsBtn).toBeEnabled();

  // Click the actions button
  await actionsBtn.click();

  // Wait for dropdown to be visible
  const dropdown = vmRow.locator('ul.dropdown-menu[aria-labelledby="btnGroupDrop1"].show');
  await expect(dropdown).toBeVisible();

  return dropdown;
}

// export async function waitForVMStatus(page: Page, vmName: string, expected: 'Powered On' | 'Powered Off', timeout = 180000) {
//   const start = Date.now();
//   const end = start + timeout;
//   let lastStatus = '';

//   while (Date.now() < end) {
//     // Reload to ensure latest status
//     await page.reload();
//     const vmRow = page.locator('tr', { has: page.locator(`a[title="${vmName}"]`) }).first();
//     const badge = vmRow.locator('td .badge');

//     try {
//       await expect(badge).toBeVisible({ timeout: 5000 });
//       const text = (await badge.textContent())?.trim() ?? '';
//       lastStatus = text;

//       console.log(`ℹ️ VM "${vmName}" current status: "${text}"`);

//       if (new RegExp(expected, 'i').test(text)) {
//         console.log(`✅ VM "${vmName}" reached status "${expected}"`);
//         return;
//       }
//     } catch (err) {
//       console.log(`⚠️ Could not read status badge this round`);
//     }

//     // wait 5s before retry
//     await page.waitForTimeout(5000);
//   }

//   throw new Error(`❌ Timeout: VM "${vmName}" did not reach status "${expected}". Last seen: "${lastStatus}"`);
// }

// export async function startVMByName(page: Page, vmName: string) {
//   // 1️⃣ Locate the VM row by exact link text
//   const vmRow = page.locator('tr', { has: page.locator(`a[title="${vmName}"]`) }).first();
//   await expect(vmRow).toBeVisible({ timeout: 10000 });

//   // 2️⃣ Open Actions dropdown
//   const actionsBtn = vmRow.locator('button#btnGroupDrop1');
//   await vmRow.scrollIntoViewIfNeeded();
//   await vmRow.hover();
//   await expect(actionsBtn).toBeVisible({ timeout: 5000 });
//   await actionsBtn.click();

//   // 3️⃣ Click Start
//   const startBtn = vmRow.locator('ul.dropdown-menu[aria-labelledby="btnGroupDrop1"] >> a.start-btn');
//   await expect(startBtn).toBeVisible({ timeout: 5000 });
//   await startBtn.click();

//   // 4️⃣ Wait for status to change using a polling loop
//   const statusBadge = vmRow.locator('td .badge');
//   await expect(statusBadge).toHaveText(/Powered On/i, { timeout: 120000 });

//   // 5️⃣ Optionally, re-locate the badge and assert visibility
//   const newVmRow = page.locator('tr', { has: page.locator(`a[title="${vmName}"]`) }).first();
//   // const statusBadge = newVmRow.locator('div.badge', { hasText: 'Powered On' });
//   // await expect(statusBadge).toBeVisible({ timeout: 5000 });
// }




// // Stop VM (if visible)
// // export async function clickStopAction(vmRow: Locator) {
// //   const dropdown = await openActionsDropdown(vmRow);
// //   const stopBtn = dropdown.locator('a:has-text("Stop")');
// //   await expect(stopBtn).toBeVisible();
// //   await stopBtn.click();
// //   // Add wait/assertion for stop effect if needed
// // }
// export async function stopVM(page: Page, vmRow: Locator) {
//   // 1. Get status badge inside VM row
//   const statusBadge = vmRow.locator('td .badge');
//   await expect(statusBadge).toBeVisible({ timeout: 15000 });
//   const statusText = (await statusBadge.textContent())?.trim();

//   if (!/powered on/i.test(statusText || '')) {
//     console.log('ℹ️ VM is not powered on, skipping stop action.');
//     return false; // nothing to do
//   }

//   // 2. Open dropdown & click Stop
//   const dropdown = await openActionsDropdown(vmRow);
//   const stopBtn = dropdown.locator('a:has-text("Stop")');
//   await expect(stopBtn).toBeVisible();
//   await stopBtn.click();

//   // 3. Handle confirmation modal
//   const modal = page.locator('div.swal2-popup.swal2-modal.swal2-show');
//   await expect(modal).toBeVisible({ timeout: 12000 });

//   const yesBtn = modal.locator('button.swal2-confirm');
//   await expect(yesBtn).toBeVisible();
//   await yesBtn.click();

//   // 4. Wait for status badge to update → Powered Off
//   await expect(statusBadge).toHaveText(/Powered Off/i, { timeout: 180000 });

//   console.log('✅ VM successfully stopped.');
//   return true;
// }

/**
 * Wait until a VM reaches the expected status (Powered On / Powered Off).
 */
export async function waitForVMStatus(
  page: Page,
  vmName: string,
  expected: string,
  timeout = 180_000
) {
  const start = Date.now();
  let lastStatus = '';

  while (Date.now() - start < timeout) {
    await page.reload({ waitUntil: 'networkidle' });

    const badge = page
      .locator(`tr:has(td a[title="${vmName}"])`)
      .locator('td .badge');

    const text = (await badge.textContent())?.trim() ?? '';
    lastStatus = text;

    if (/in progress/i.test(text)) {
      console.log(`⏳ VM "${vmName}" is still "in progress"...`);
    } else if (new RegExp(expected, 'i').test(text)) {
      console.log(`✅ VM "${vmName}" reached status "${expected}"`);
      return true;
    } else {
      console.log(`ℹ️ VM "${vmName}" current status: "${text}", waiting...`);
    }

    // wait 5s before checking again
    await page.waitForTimeout(5000);
  }

  throw new Error(
    `❌ Timeout: VM "${vmName}" did not reach status "${expected}". Last seen: "${lastStatus}"`
  );
}

/**
 * Start a VM by name (idempotent: skips if already powered on).
 */
// export async function startVMByName(page: Page, vmName: string) {
//   const vmRow = page.locator('tr', {
//     has: page.locator(`a[title="${vmName}"]`),
//   }).first();
//   await expect(vmRow).toBeVisible({ timeout: 20_000 });

//   const badge = vmRow.locator('td .badge');
//   const currentStatus = (await badge.textContent())?.trim() ?? '';

//   if (/powered on/i.test(currentStatus)) {
//     console.log(`ℹ️ VM "${vmName}" already powered on. Skipping start.`);
//     return true;
//   }

//   const actionsBtn = vmRow.locator('button#btnGroupDrop1');
//   await vmRow.scrollIntoViewIfNeeded();
//   await expect(actionsBtn).toBeVisible({ timeout: 5000 });

//   // ✅ safer retry click
//   for (let i = 0; i < 2; i++) {
//     try {
//       await actionsBtn.click({ timeout: 3000 });
//       break;
//     } catch {
//       if (i === 0) {
//         console.log('⚠️ Retry clicking Actions button');
//         continue;
//       }
//       throw new Error(`❌ Could not click Actions button for VM "${vmName}"`);
//     }
//   }

//   const startBtn = vmRow.locator(
//     'ul.dropdown-menu[aria-labelledby="btnGroupDrop1"] >> a:has-text("Start")'
//   );
//   await expect(startBtn).toBeVisible({ timeout: 5000 });
//   await startBtn.click();

//   return waitForVMStatus(page, vmName, 'Powered On');
// }

export async function startVMByName(page: Page, vmName: string) {
  const vmRow = page.locator(`tr:has(td a[title="${vmName}"])`).first();
  await expect(vmRow).toBeVisible({ timeout: 30_000 });

  const badge = vmRow.locator('td .badge');
  const statusText = (await badge.textContent())?.trim() ?? '';

  if (/powered on/i.test(statusText)) {
    console.log(`ℹ️ VM "${vmName}" already powered on. Skipping start.`);
    return false;
  }

  const dropdownBtn = vmRow.locator('button#btnGroupDrop1');
  await expect(dropdownBtn).toBeVisible({ timeout: 5000 });
  await dropdownBtn.click();

  const startBtn = vmRow.locator(
    'ul.dropdown-menu[aria-labelledby="btnGroupDrop1"] >> a:has-text("Start")'
  );

  await expect(startBtn).toBeVisible({ timeout: 5000 });

  try {
    await startBtn.click({ timeout: 5000 });
    console.log(`▶️ Clicked "Start" for VM "${vmName}"`);
  } catch {
    console.log(`⚠️ Retry clicking "Start" for VM "${vmName}"`);
    await startBtn.click();
  }

  // confirm modal
  const modal = page.locator('div.swal2-popup.swal2-modal.swal2-show');
  await expect(modal).toBeVisible({ timeout: 12_000 });
  await modal.locator('button.swal2-confirm').click();

  // wait until VM is powered on
  await waitForVMStatus(page, vmName, 'Powered On', 300_000); // default 5 min
  console.log(`✅ VM "${vmName}" successfully started.`);
  return true;
}


/**
 * Stop a VM by row + name (idempotent: skips if already off).
 */
export async function stopVM(page: Page, vmRow: Locator, vmName: string) {
  const badge = vmRow.locator('td .badge');
  await expect(badge).toBeVisible({ timeout: 15_000 });
  const statusText = (await badge.textContent())?.trim() ?? '';

  if (/powered off/i.test(statusText)) {
    console.log(`ℹ️ VM "${vmName}" already powered off. Skipping stop.`);
    return false;
  }

  const dropdownBtn = vmRow.locator('button#btnGroupDrop1');
  await expect(dropdownBtn).toBeVisible({ timeout: 5000 });
  await dropdownBtn.click();

  const stopBtn = vmRow.locator(
    'ul.dropdown-menu[aria-labelledby="btnGroupDrop1"] >> a:has-text("Stop")'
  );
  await expect(stopBtn).toBeVisible({ timeout: 5000 });
  await stopBtn.click();

  // confirm modal
  const modal = page.locator('div.swal2-popup.swal2-modal.swal2-show');
  await expect(modal).toBeVisible({ timeout: 12_000 });

  await modal.locator('button.swal2-confirm').click();

  await waitForVMStatus(page, vmName, 'Powered Off');
  console.log(`✅ VM "${vmName}" successfully stopped.`);
  return true;
}
export async function stopVMByName(page: Page, vmName: string) {
  const vmRow = page.locator('tr', {
    has: page.locator(`a[title="${vmName}"]`),
  }).first();

  await expect(vmRow).toBeVisible({ timeout: 20_000 });

  return stopVM(page, vmRow, vmName);
}

// Reboot VM (if visible)
export async function clickRebootAction(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const rebootBtn = dropdown.locator('a:has-text("Reboot")');
  await expect(rebootBtn).toBeVisible();
  await rebootBtn.click();
  // Add wait/assertion if needed
}

// Reset VM (if visible)
export async function clickResetAction(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const resetBtn = dropdown.locator('a:has-text("Reset")');
  await expect(resetBtn).toBeVisible();
  await resetBtn.click();
  // Add wait/assertion if needed
}

// Shutdown VM (if visible)
export async function clickShutdownAction(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const shutdownBtn = dropdown.locator('a:has-text("Shutdown")');
  await expect(shutdownBtn).toBeVisible();
  await shutdownBtn.click();
  // Add wait/assertion if needed
}

export async function openCloneVMModal(page: Page, vmRow: Locator) {
  const cloneModal = page.locator('div.modal-content:has(h5.modal-title:has-text("Clone VM"))');

  if (await cloneModal.isVisible()) {
    // Modal is already open - no need to click Actions button again
    return;
  }

  const actionsBtn = vmRow.locator('button#btnGroupDrop1');
  await expect(actionsBtn).toBeVisible();
  await expect(actionsBtn).toBeEnabled();

  // Wait for any blocking modal overlay to disappear before clicking
  await page.locator('#myModal').waitFor({ state: 'detached', timeout: 10000 }).catch(() => {
    // if modal doesn't disappear within timeout, test will proceed but may still fail
  });

  await actionsBtn.click();

  const dropdown = page.locator('ul.dropdown-menu[aria-labelledby="btnGroupDrop1"].show');
  await expect(dropdown).toBeVisible();

  const cloneBtn = dropdown.locator('a:has-text("Clone VM")');
  await expect(cloneBtn).toBeVisible();
  await expect(cloneBtn).toBeEnabled();
  await cloneBtn.click();

  await expect(cloneModal).toBeVisible({ timeout: 10000 });
}


export async function cloneVM(page: Page, vmRow: Locator, newVMName: string, vdcValue: string, storagePolicyValue: string) {
  // Open modal first
  await openCloneVMModal(page, vmRow);

  // Fill required fields
  await page.fill('input[name="VMCloneForm[name]"]', newVMName);

  // Select dropdowns by value
  await page.selectOption('select[id="vmcloneform-virtual_data_center_id"]', vdcValue);
  await page.selectOption('select[id="vmcloneform-storage_policy_id"]', storagePolicyValue);

  // Submit form by clicking "Apply" button
  await page.click('button#submitBtn');

  // Wait for modal to close after submitting
  //await page.locator('div.modal-content:has(h5.modal-title:has-text("Clone VM"))').waitFor({ state: 'detached', timeout: 10000 });
}



// Open Rename VM modal
export async function openRenameModal(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const renameBtn = dropdown.locator('a:has-text("Rename")');
  await expect(renameBtn).toBeVisible();
  await renameBtn.click();

  const modal = vmRow.page().locator('div.modal-content:has(.modal-title:text("Rename Virtual Machine"))');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).toContainText('Rename Virtual Machine');
}
export async function renameVM(page: Page, newName: string) {
  const modal = page.locator('div.modal-content:has(h5.modal-title:has-text("Rename Virtual Machine"))');
  await expect(modal).toBeVisible();

  await page.fill('#virtualmachine-name', newName);
  await page.click('#submitBtn');

  //await modal.waitFor({ state: 'detached', timeout: 10000 });
}


// Open Edit Hardware modal
export async function openEditHardwareModal(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const editHardwareBtn = dropdown.locator('a:has-text("Edit Hardware")');
  await expect(editHardwareBtn).toBeVisible();
  await editHardwareBtn.click();

  const modal = vmRow.page().locator('div.modal-content');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).toContainText('Edit Virtual Machine Hardware');
}

// Open Set Boot Order modal
export async function openSetBootOrderModal(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const bootOrderBtn = dropdown.locator('a:has-text("Set Boot Order")');
  await expect(bootOrderBtn).toBeVisible();
  await bootOrderBtn.click();

  const modal = vmRow.page().locator('div.modal-content');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).toContainText('Set Boot Order');
}

// Open Create Snapshot modal
export async function openCreateSnapshotModal(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const snapshotBtn = dropdown.locator('a:has-text("Create Snapshot")');
  await expect(snapshotBtn).toBeVisible();
  await snapshotBtn.click();

  const modal = vmRow.page().locator('div.modal-content');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).toContainText('Create Snapshot');
}

// // Open Convert to Template modal
// export async function openConvertToTemplateModal(vmRow: Locator) {
//   const dropdown = await openActionsDropdown(vmRow);
//   const convertBtn = dropdown.locator('a:has-text("Convert to Template")');
//   await expect(convertBtn).toBeVisible();
//   await convertBtn.click();

//   const modal = vmRow.page().locator('div.modal-content');
//   await expect(modal).toBeVisible();
//   await expect(modal.locator('.modal-title')).toContainText('Convert');
// }

// Open Convert to Template modal and return its locator + useful controls
export async function openConvertToTemplateModal(vmRow: Locator) {
  // Step 1: open Actions dropdown & click Convert
  const dropdown = await openActionsDropdown(vmRow);
  const convertBtn = dropdown.locator('a:has-text("Convert to Template")');
  await expect(convertBtn).toBeVisible();
  await convertBtn.click();

  // Step 2: scope modal by its title
  const modal = vmRow.page().locator('div.modal-content', {
    has: vmRow.page().locator('h5.modal-title', { hasText: 'Convert to Template' })
  });

  await expect(modal).toBeVisible();

  // Step 3: return modal & controls
  return {
    modal,
    radioShared: modal.locator('#i0'),     // "Share across all VDCs"
    radioIsolated: modal.locator('#i1'),   // "Keep isolated to current VDC"
    noteField: modal.locator('#virtualmachinecatalogue-note'),
    saveButton: modal.locator('#submitBtn'),
    loader: modal.locator('#loader'),
  };
}

// Submit form & wait until loader disappears
export async function submitConvertToTemplate(modalHandles: {
  saveButton: Locator;
  loader: Locator;
  modal: Locator;
}) {
  await modalHandles.saveButton.click();

  // Loader should appear then disappear
  await expect(modalHandles.loader).toBeVisible({ timeout: 5000 });
  await expect(modalHandles.loader).toBeHidden({ timeout: 15000 });

  // Optional: wait for modal to close
  await expect(modalHandles.modal).toBeHidden({ timeout: 15000 });
}
// Open Delete VM modal
export async function openDeleteModal(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const deleteBtn = dropdown.locator('a:has-text("Delete")');
  await expect(deleteBtn).toBeVisible();
  await deleteBtn.click();

  const modal = vmRow.page().locator('div.modal-content');
  await expect(modal).toBeVisible();
  await expect(modal.locator('.modal-title')).toContainText('Delete');
}

export interface BackupOptions {
  storageLabel?: string;   // Label to select in Storage dropdown
  mode?: 'snapshot' | 'suspend' | 'stop';  // Mode to select
  protected?: boolean;     // Whether to check the Protected checkbox
  timeout?: number;        // Optional timeout for modal visibility and actions
}

export interface BackupOptions {
  storageLabel?: string;
  mode?: 'snapshot' | 'suspend' | 'stop';
  protected?: boolean;
  timeout?: number;
}

export interface BackupOptions {
  storageLabel?: string;   // Label to select in Storage dropdown
  mode?: 'snapshot' | 'suspend' | 'stop';  // Mode to select
  protected?: boolean;     // Whether to check the Protected checkbox
  timeout?: number;        // Optional timeout for modal visibility and actions
}

export async function takeBackup(page: Page, vmRow: Locator, options: BackupOptions = {}) {
  const {
    storageLabel = 'Backupstorage',
    mode = 'snapshot',
    protected: isProtected = false,
    timeout = 10000,
  } = options;

  // Click the "Actions" button inside the vmRow
  const actionsBtn = vmRow.locator('button:has-text("Actions")');
  await expect(actionsBtn).toBeVisible();
  await actionsBtn.click();

  // Wait a short time to allow dropdown menu to render
  await page.waitForTimeout(300);

  // Locate the "Take Backup" link by its unique attributes anywhere visible on the page
  const takeBackupLink = vmRow.locator('a[data-modal-title="Take Backup"]');
  await expect(takeBackupLink).toBeVisible({ timeout: 7000 });
  await takeBackupLink.click();

  // Wait for the modal to appear
  const modal = page.locator('div.modal-content:has-text("Take Backup")');
  await expect(modal).toBeVisible({ timeout: 7000  });

  // Select storage from dropdown
  const storageSelect = modal.locator('select#virtualmachinebackup-backup_storage_id');
  await expect(storageSelect).toBeVisible({ timeout });
  await storageSelect.selectOption({ label: storageLabel });

  // Select mode from dropdown
  const modeSelect = modal.locator('select#virtualmachinebackup-mode');
  await expect(modeSelect).toBeVisible({ timeout });
  await modeSelect.selectOption(mode);

  // Set or unset the protected checkbox
  const protectedCheckbox = modal.locator('input#virtualmachinebackup-protected');
  if (isProtected) {
    await protectedCheckbox.check();
  } else {
    await protectedCheckbox.uncheck();
  }

  // Click submit button
  const submitButton = modal.locator('button#submitBtn');
  await expect(submitButton).toBeEnabled({ timeout });
  await submitButton.click();

  const backupAlert = page.locator('div.alert-success:has-text("Backup generation in progress")');
await expect(backupAlert).toBeVisible({ timeout: 5000 });
//await expect(backupAlert).toBeHidden({ timeout: 60000 }); // adjust timeout as needed


  // Locate the Backups tab initially and check visibility
let backupsTab = page.locator('a.nav-link[href="#nav-backups"]');
await expect(backupsTab).toBeVisible({ timeout: 7000 });

// Reload the page to refresh state
await page.reload();

// Re-define after reload
backupsTab = page.locator('a.nav-link[href="#nav-backups"]');
await expect(backupsTab).toBeVisible({ timeout: 7000 });

// Check if tab is already active (has 'active' class)
const isActive = await backupsTab.evaluate(el => el.classList.contains('active'));
if (!isActive) {
  await backupsTab.click();
} else {
  // Already active, no click needed
  console.log('Backups tab is already active, skipping click.');
}


// Wait for the backup table or at least the "Manual Backup" row to appear
const manualBackupRow = page.locator('table >> tr:has(td:has-text("Manual Backup"))');
await expect(manualBackupRow).toBeVisible({ timeout: 30000 });


  
}

