import { expect, Locator, Page } from '@playwright/test';

// Utility: Open Actions dropdown within a specific VM row
export async function openActionsDropdown(vmRow: Locator) {
  const actionsBtn = vmRow.locator('button#btnGroupDrop1').first();

  // Ensure row is visible
  await vmRow.scrollIntoViewIfNeeded();
  await expect(vmRow).toBeVisible({ timeout: 10000 });
  await vmRow.hover();

  await expect(actionsBtn).toBeVisible();
  await expect(actionsBtn).toBeEnabled();
  await actionsBtn.click();

  const dropdown = vmRow.locator('ul.dropdown-menu[aria-labelledby="btnGroupDrop1"].show');
  await expect(dropdown).toBeVisible();
  return dropdown;
}

export async function startVMByName(page: Page, vmName: string) {
  // 1️⃣ Locate the VM row by exact link text
  const vmRow = page.locator('tr', { has: page.locator(`a[title="${vmName}"]`) }).first();
  await expect(vmRow).toBeVisible({ timeout: 10000 });

  // 2️⃣ Open Actions dropdown
  const actionsBtn = vmRow.locator('button#btnGroupDrop1');
  await vmRow.scrollIntoViewIfNeeded();
  await vmRow.hover();
  await expect(actionsBtn).toBeVisible({ timeout: 5000 });
  await actionsBtn.click();

  // 3️⃣ Click Start
  const startBtn = vmRow.locator('ul.dropdown-menu[aria-labelledby="btnGroupDrop1"] >> a.start-btn');
  await expect(startBtn).toBeVisible({ timeout: 5000 });
  await startBtn.click();

  // 4️⃣ Wait for status to change using a polling loop
  await page.waitForFunction(
    (name) => {
      const row = Array.from(document.querySelectorAll('tr')).find(r => r.querySelector(`a[title="${name}"]`));
      if (!row) return false;
      return row.querySelector('div.badge')?.textContent?.includes('Powered On');
    },
    vmName,
    { timeout: 20000 } // wait up to 20s
  );

  // 5️⃣ Optionally, re-locate the badge and assert visibility
  const newVmRow = page.locator('tr', { has: page.locator(`a[title="${vmName}"]`) }).first();
  const statusBadge = newVmRow.locator('div.badge', { hasText: 'Powered On' });
  await expect(statusBadge).toBeVisible({ timeout: 5000 });
}




// Stop VM (if visible)
export async function clickStopAction(vmRow: Locator) {
  const dropdown = await openActionsDropdown(vmRow);
  const stopBtn = dropdown.locator('a:has-text("Stop")');
  await expect(stopBtn).toBeVisible();
  await stopBtn.click();
  // Add wait/assertion for stop effect if needed
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

