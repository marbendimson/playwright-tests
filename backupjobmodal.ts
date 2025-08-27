import { expect, Page,Locator } from '@playwright/test';

export class CreateBackupJobModal {
  constructor(private page: Page) {}

  /** Open modal */
  async open() {
    await this.page.locator('a.modal-btn:has-text("Create Backup Job")').click();
    await expect(this.page.locator('#data-center-submit')).toBeVisible({ timeout: 10000 });
  }

  /** Fill required fields on Step 1 (Basic Info + Schedule) */
  async fillBasicInfoAndSchedule({
    name,
    enabled,
    storage,
    mode,
    schedule,
  }: {
    name: string;
    enabled: boolean;
    storage?: string;
    mode?: string;
    schedule?: string;
  }) {
    // Job name
    await this.page.locator('input[name="ScheduledBackup[name]"]').fill(name);

    // Enable toggle
    const toggle = this.page.locator('#customSwitchsizelg');
    await expect(toggle).toBeVisible({ timeout: 10000 });
    const isChecked = await toggle.isChecked();
    if (enabled !== isChecked) {
      await toggle.click();
    }

    // Backup storage
    if (storage) {
      await this.page.locator('#scheduledbackup-backup_storage_id').selectOption(storage);
    }

    // Mode
    if (mode) {
      await this.page.locator('#scheduledbackup-mode').selectOption(mode);
    }

    // Schedule
    if (schedule) {
      await this.page.locator('#schedule-select').selectOption(schedule);
    }

    // Click Next Step
    await this.page.locator('#data-center-submit').click();
  }

  /** Select VMs for backup (requires at least 1) */
  async selectVMs(vmNames: string[]) {
    for (const name of vmNames) {
      const vmLocator = this.page.locator(`.non-selected-wrapper .item:has-text("${name}")`).first();
      await expect(vmLocator).toBeVisible({ timeout: 5000 });
      await vmLocator.click();
    }

    // Click Next Step
    await this.page.locator('#iso-selection-submit').click();
  }

  /** Fill retention fields */
  async setRetention({ last, hourly, daily, weekly, monthly, yearly }: 
  { last?: number; hourly?: number; daily?: number; weekly?: number; monthly?: number; yearly?: number }) {

  if (last !== undefined) {
    const lastInput = this.page.locator('#scheduledbackup-keep_last');
    await expect(lastInput).toBeVisible({ timeout: 10000 });
    await lastInput.fill(last.toString());
  }

  if (hourly !== undefined) {
    const hourlyInput = this.page.locator('#scheduledbackup-keep_hourly');
    await expect(hourlyInput).toBeVisible({ timeout: 10000 });
    await hourlyInput.fill(hourly.toString());
  }

  if (daily !== undefined) {
    const dailyInput = this.page.locator('#scheduledbackup-keep_daily');
    await expect(dailyInput).toBeVisible({ timeout: 10000 });
    await dailyInput.fill(daily.toString());
  }

  if (weekly !== undefined) {
    const weeklyInput = this.page.locator('#scheduledbackup-keep_weekly');
    await expect(weeklyInput).toBeVisible({ timeout: 10000 });
    await weeklyInput.fill(weekly.toString());
  }

  if (monthly !== undefined) {
    const monthlyInput = this.page.locator('#scheduledbackup-keep_monthly');
    await expect(monthlyInput).toBeVisible({ timeout: 10000 });
    await monthlyInput.fill(monthly.toString());
  }

  if (yearly !== undefined) {
    const yearlyInput = this.page.locator('#scheduledbackup-keep_yearly');
    await expect(yearlyInput).toBeVisible({ timeout: 10000 });
    await yearlyInput.fill(yearly.toString());
  }
}


  /** Toggle Keep All Backups */
  async toggleKeepAllBackups(keep: boolean) {
    const checkbox = this.page.locator('#scheduledbackup-keep_all');
    const isChecked = await checkbox.isChecked();
    if (isChecked !== keep) {
      await checkbox.click();
    }
  }

  /** Save backup job */
 async saveJob() {
  const saveBtn = this.page.locator('#submit-button');
  await expect(saveBtn).toBeVisible({ timeout: 10000 });
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  // Wait for spinner to disappear after save
//   const spinner = this.page.locator('#loading-icon');
//   await spinner.waitFor({ state: 'hidden', timeout: 15000 });
}


  /** Assert validation error */
  async expectValidationError(message: string) {
    await expect(this.page.locator('.invalid-feedback, .error-message')).toContainText(message);
  }
}


export class UpdateBackupJobModal {
  constructor(private page: Page) {}

  modalLocator() {
    return this.page.locator('.modal-content', { has: this.page.locator('h5:has-text("Update Backup Job")') });
  }

  /** Open modal */
  async open() {
    await this.page.locator('a.modal-btn[title="Update Backup Job"]').click();
    const modal = this.modalLocator();
    await expect(modal).toBeVisible({ timeout: 10000 });
    return modal;
  }

  /** Fill basic info and schedule */
  async fillBasicInfoAndSchedule({
    name,
    enabled,
    storage,
    mode,
    schedule,
  }: {
    name: string;
    enabled: boolean;
    storage?: string;
    mode?: string;
    schedule?: string;
  }) {
    // Name
    await this.page.locator('#scheduledbackup-name').fill(name);

    // Enable toggle
    const toggle = this.page.locator('#customSwitchsizelg');
    const isChecked = await toggle.isChecked();
    if (enabled !== isChecked) {
      await toggle.click();
    }

    // Backup Storage
    if (storage) {
      await this.page.locator('#scheduledbackup-backup_storage_id').selectOption(storage);
    }

    // Mode
    if (mode) {
      await this.page.locator('#scheduledbackup-mode').selectOption(mode);
    }

    // Schedule
    if (schedule) {
      await this.page.locator('#schedule-select').selectOption(schedule);
    }
  }

  /** Select VMs for backup */
  async selectVMs(vmNames: string[]) {
  const modal = this.modalLocator();

  for (const name of vmNames) {
    const vmLocator = modal.locator(`.non-selected-wrapper .item:has-text("${name}")`).first();

    // Skip if already selected
    if ((await vmLocator.getAttribute('class'))?.includes('selected')) {
      console.log(`VM "${name}" is already selected. Skipping.`);
      continue;
    }

    await expect(vmLocator).toBeVisible({ timeout: 5000 });
    await vmLocator.click();
  }
  }

  /** Fill retention fields */
  async setRetention({
    last,
    hourly,
    daily,
    weekly,
    monthly,
    yearly,
  }: {
    last?: number;
    hourly?: number;
    daily?: number;
    weekly?: number;
    monthly?: number;
    yearly?: number;
  }) {
    const fields: Record<string, number | undefined> = {
      '#scheduledbackup-keep_last': last,
      '#scheduledbackup-keep_hourly': hourly,
      '#scheduledbackup-keep_daily': daily,
      '#scheduledbackup-keep_weekly': weekly,
      '#scheduledbackup-keep_monthly': monthly,
      '#scheduledbackup-keep_yearly': yearly,
    };

    for (const [selector, value] of Object.entries(fields)) {
      if (value !== undefined) {
        const input = this.page.locator(selector);
        await expect(input).toBeVisible({ timeout: 10000 });
        await input.fill(value.toString());
      }
    }
  }

  /** Toggle Keep All Backups */
  async toggleKeepAllBackups(keep: boolean) {
    const checkbox = this.page.locator('#scheduledbackup-keep_all');
    const isChecked = await checkbox.isChecked();
    if (isChecked !== keep) {
      await checkbox.click();
    }
  }

  /** Save backup job */
  async saveJob() {
    const saveBtn = this.page.locator('#submitBtn');
    await expect(saveBtn).toBeVisible({ timeout: 10000 });
    await expect(saveBtn).toBeEnabled();
    await saveBtn.click();

    // Optionally wait for loader/spinner if present
    // const loader = this.page.locator('#loader');
    // await loader.waitFor({ state: 'hidden', timeout: 15000 });
  }

  /** Assert validation error */
  async expectValidationError(message: string) {
    await expect(this.page.locator('.invalid-feedback, .error-message')).toContainText(message);
  }
}

export async function runBackupJob(page: Page, confirm: boolean = true) {
  // 1️⃣ Click the Run Backup Job button
  const runBtn = page.locator('a.btn.btn-warning[title="Run Backup Job"]');
  await expect(runBtn).toBeVisible();
  await expect(runBtn).toBeEnabled();
  await runBtn.click();

  // 2️⃣ Wait for the SweetAlert2 confirmation modal
  const swalModal = page.locator('.swal2-popup.swal2-show');
  await expect(swalModal).toBeVisible();

  if (confirm) {
    // 3a️⃣ Click 'Yes' to confirm
    const yesBtn = swalModal.locator('.swal2-confirm');
    await expect(yesBtn).toBeVisible();
    await yesBtn.click();

    // 4a️⃣ Verify success alert appears
    const successAlert = page.locator('.alert-success:has-text("Backup Job has been successfully run")');
    await expect(successAlert).toBeVisible({ timeout: 10000 });
  } else {
    // 3b️⃣ Click 'Cancel' to abort
    const cancelBtn = swalModal.locator('.swal2-cancel');
    await expect(cancelBtn).toBeVisible();
    await cancelBtn.click();

    // 4b️⃣ Verify modal disappears
    await expect(swalModal).toHaveCount(0);

    // 5b️⃣ Verify success alert does NOT appear
    const successAlert = page.locator('.alert-success:has-text("Backup Job has been successfully run")');
    await expect(successAlert).toHaveCount(0);
  }
}

export class BackupJobActions {
  private page: Page;
  private deleteBtn: Locator;
  private modal: Locator;
  private yesButton: Locator;
  private cancelButton: Locator;
  private successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.deleteBtn = page.locator('a[title="Delete Backup Job"]');
    this.modal = page.locator('.swal2-popup.swal2-modal');
    this.yesButton = page.locator('button.swal2-confirm');
    this.cancelButton = page.locator('button.swal2-cancel');
    this.successAlert = page.locator('.alert.alert-success');
  }

  async openDeleteModal() {
    await expect(this.deleteBtn).toBeVisible();
    await expect(this.deleteBtn).toBeEnabled();
    await this.deleteBtn.click();
    await expect(this.modal).toBeVisible();
  }

  async verifyDeleteModal() {
    await expect(this.page.locator('#swal2-title')).toHaveText('Are you sure?');
    await expect(this.page.locator('#swal2-html-container')).toHaveText(
      'Are you sure you want to delete this item?'
    );
    await expect(this.yesButton).toBeVisible();
    await expect(this.cancelButton).toBeVisible();
  }

  async confirmDelete() {
    await this.yesButton.click();
    await expect(this.successAlert).toBeVisible();
    await expect(this.successAlert).toContainText('Backup Job has been successfully deleted.');
  }

  async cancelDelete() {
    await this.cancelButton.click();
    await expect(this.modal).toBeHidden();
  }
}

// Search Virtual MAchine Backup 
export async function searchVirtualMachineBackup(page: Page, vmName: string) {
  const searchInput = page.locator('#virtualmachinebackupsearch-query');
  const searchButton = page.locator('button.createTask');

  // Fill search input
  await searchInput.fill(vmName);
  await searchButton.click();

  // Wait for table refresh
  const backupTable = page.locator('h3:has-text("Virtual Machine Backups")')
  .locator('xpath=following::div[@id="w1"][1]');
  await expect(backupTable).toBeVisible();

  // Handle both outcomes
  if (await page.locator(`#w1 tbody tr td >> text=${vmName}`).count() > 0) {
    // Backup found
    await expect(page.locator(`#w1 tbody tr td >> text=${vmName}`)).toBeVisible();
    return 'found';
  } else {
    // Backup not found
    await expect(page.locator('#w1 .empty')).toHaveText('No results found.');
    return 'not_found';
  }
}
