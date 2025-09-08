// import { Page, Locator, expect } from '@playwright/test';

// export class VirtualDataCenterForm {
//   private page: Page;
//   private dataCenterSelect: Locator;
//   private vdcNameInput: Locator;
//   private allocationTypeSelect: Locator;
//   private storagePolicySelect: Locator;
//   private allocationSettingsCard: Locator;
//   private cpuInput: Locator;
//   private cpuAlert: Locator;
//   private memoryInput: Locator;
//   private memoryAlert: Locator;
//   private overcommitmentDropdown: Locator;
//   private primaryStorageInput: Locator;
//   private primaryAddButton: Locator;
//   private backupStorageSelect: Locator;
//   private backupAddButton: Locator;
//   private backupStorageInput: Locator;

//   constructor(page: Page) {
//     this.page = page;
//     this.dataCenterSelect = page.locator('#virtualdatacenter-data_center_id');
//     this.vdcNameInput = page.locator('#virtualdatacenter-vdc_name');
//     this.allocationTypeSelect = page.locator('#virtualdatacenter-allocation_type');
//     this.storagePolicySelect = page.locator('select#virtualdatacenter-storage_policy_id:not([disabled])');
//     this.allocationSettingsCard = page.locator('div.allocation-limits.card.bg-dark-subtle');
//     this.cpuInput = page.locator('#virtualdatacenter-core_count');
//     this.cpuAlert = page.locator('#total-cpu-alert');
//     this.memoryInput = page.locator('#virtualdatacenter-memory_in_mb');
//     this.memoryAlert = page.locator('#total-memory-alert');
//     this.overcommitmentDropdown = page.locator('#virtualdatacenter-enable_overcommitment');
//     this.primaryStorageInput = page.locator('input[name="VirtualDataCenter[storage_sizes][1][capacity]"]');
//     this.backupStorageSelect = page.locator('select#virtualdatacenter-backup_storage_id:not([disabled])');
//     this.backupStorageInput =  page.locator('input[name="VirtualDataCenter[backup_storage_sizes][1][capacity]"]');
//     // this.primaryAddButton = this.page.locator('#primary-storage-container button:has-text("Add")');
//     // this.backupStorageSelect = page.locator('select#backup-storage-dropdown-id');
//     // this.backupAddButton = this.page.locator('#backup-storage-container button:has-text("Add")');
//     // this.backupStorageInput = page.locator('input[name="backup_storage_names[1]"]');
//   }

// async fillForm({
//   dataCenter ,
//   vdcName ,
//   allocationType,
//   cpuCores ,
//   memoryGiB ,
//   overcommitment ,
//   storagePolicyValue ,
//   StorageInput,
//   backStorageValue,
//   backInput,
//   //expectedStorageLabel = ,
// //   primaryStorageLabel ,
// //   backupStorageValue ,
// }:{
//     dataCenter : string,
//     vdcName : string,
//     allocationType: string,
//     cpuCores : string,
//     memoryGiB : string,
//     overcommitment : string,
//     storagePolicyValue : string,
//     StorageInput : string,
//     backStorageValue : string,
//     backInput : string,
//     // primaryStorageLabel: string
//     // backupStorageValue : string
// }) 
// {
//   // Data Center
//   await expect(this.dataCenterSelect).toBeVisible();
//   await this.dataCenterSelect.selectOption(dataCenter);

//   // VDC Name
//   await this.vdcNameInput.fill(vdcName);

//   // Allocation Type
//   await this.allocationTypeSelect.selectOption(allocationType);

//   if (allocationType === '1') {
//     await expect(this.allocationSettingsCard).toBeVisible();
//     await this.cpuInput.fill(cpuCores);
//     await expect(this.cpuInput).toHaveValue(cpuCores);
//     await expect(this.cpuAlert).toContainText('Provisioned CPU Cores');

//     await this.memoryInput.fill(memoryGiB);
//     await expect(this.memoryInput).toHaveValue(memoryGiB);
//     await expect(this.memoryAlert).toContainText('Provisioned Memory');

//     await this.overcommitmentDropdown.selectOption(overcommitment);
//     await expect(this.overcommitmentDropdown).toHaveValue(overcommitment);

//   }

//   // Storage Policy (with Add)
//   await expect(this.storagePolicySelect).toBeVisible();
//   await expect(this.storagePolicySelect).toBeEnabled();
//   await this.storagePolicySelect.selectOption(storagePolicyValue);

//  const storageAddButton = this.page.getByRole('button', { name: 'Add' }).first();
// await expect(storageAddButton).toBeEnabled();
// await storageAddButton.click();

// await this.primaryStorageInput.fill(StorageInput);


// // Step 1: Ensure backup storage dropdown is visible & enabled
// await expect(this.backupStorageSelect).toBeVisible();
// await expect(this.backupStorageSelect).toBeEnabled();

// // Step 2: Select the backup storage option (this triggers the Add button to show)
// await this.backupStorageSelect.selectOption(backStorageValue);

// // Step 3: Locate the backup Add button (we wait for it to become visible)
// const backStoreButton = this.page.locator('#with-content button.add-backup-storage-option');

// // Step 4: Wait until it's visible
// await backStoreButton.waitFor({ state: 'visible', timeout: 10000 });

// // Step 5: Now proceed with the click
// await expect(backStoreButton).toBeEnabled();
// await backStoreButton.click();

// await this.backupStorageInput.fill(backInput);





// // Storage Policy (with Add)
// //   await expect(this.storagePolicySelect).toBeVisible();
// //   await expect(this.storagePolicySelect).toBeEnabled();
// //   await this.storagePolicySelect.selectOption(storagePolicyValue);

// //  const storageAddButton = this.page.getByRole('button', { name: 'Add' }).first();
// // await expect(storageAddButton).toBeEnabled();
// // await storageAddButton.click();

  
// //   // Add Primary Storage (if available)
// //   if (await this.primaryStorageSelect.isVisible()) {
// //     await expect(this.primaryStorageSelect).toBeEnabled();
//   // await this.primaryStorageSelect.selectOption({ label: primaryStorageLabel });

// //     await expect(this.primaryAddButton).toBeEnabled();
// //     await this.primaryAddButton.click();
// //   } else {
// //     console.warn('Primary Storage dropdown not available, skipping.');
// //   }

// //   // Add Backup Storage
// //   if (await this.backupStorageSelect.isVisible()) {
// //     await expect(this.backupStorageSelect).toBeEnabled();
// //     await this.backupStorageSelect.selectOption({ label: backupStorageValue });

// //     await expect(this.backupAddButton).toBeEnabled();
// //     await this.backupAddButton.click();

// //     const backupInput = this.page.locator('input[name^="backup_storage_names"]');
// //     await expect(backupInput).toBeVisible();
// //     await expect(backupInput).toHaveValue(backupStorageValue);
// //   } else {
// //     console.warn('Backup Storage dropdown not visible, skipping.');
// //   }
// }

// }

import { Page, Locator, expect } from '@playwright/test';

export class VirtualDataCenterForm {
  private page: Page;
  private dataCenterSelect: Locator;
  private vdcNameInput: Locator;
  private allocationTypeSelect: Locator;
  private storagePolicySelect: Locator;
  private allocationSettingsCard: Locator;
  private cpuInput: Locator;
  private cpuAlert: Locator;
  private memoryInput: Locator;
  private memoryAlert: Locator;
  private overcommitmentDropdown: Locator;
  private primaryStorageInput: Locator;
  private backupStorageSelect: Locator;
  private backupStorageInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dataCenterSelect = page.locator('#virtualdatacenter-data_center_id');
    this.vdcNameInput = page.locator('#virtualdatacenter-vdc_name');
    this.allocationTypeSelect = page.locator('#virtualdatacenter-allocation_type');
    this.storagePolicySelect = page.locator('select#virtualdatacenter-storage_policy_id:not([disabled])');
    this.allocationSettingsCard = page.locator('div.allocation-limits.card.bg-dark-subtle');
    this.cpuInput = page.locator('#virtualdatacenter-core_count');
    this.cpuAlert = page.locator('#total-cpu-alert');
    this.memoryInput = page.locator('#virtualdatacenter-memory_in_mb');
    this.memoryAlert = page.locator('#total-memory-alert');
    this.overcommitmentDropdown = page.locator('#virtualdatacenter-enable_overcommitment');
    this.primaryStorageInput = page.locator('input[name="VirtualDataCenter[storage_sizes][1][capacity]"]');
    this.backupStorageSelect = page.locator('select#virtualdatacenter-backup_storage_id:not([disabled])');
    this.backupStorageInput = page.locator('input[name="VirtualDataCenter[backup_storage_sizes][1][capacity]"]');
  }

  async fillForm({
    dataCenter,
    vdcName,
    allocationType,
    cpuCores,
    memoryGiB,
    overcommitment,
    storagePolicyValue,
    StorageInput,
    backStorageValue,
    backInput,
  }: {
    dataCenter?: string;
    vdcName?: string;
    allocationType?: string;
    cpuCores?: string;
    memoryGiB?: string;
    overcommitment?: string;
    storagePolicyValue?: string;
    StorageInput?: string;
    backStorageValue?: string;
    backInput?: string;
  }) {
    // Data Center
    if (dataCenter) {
      await expect(this.dataCenterSelect).toBeVisible();
      await this.dataCenterSelect.selectOption(dataCenter);
    }

    // VDC Name
    if (vdcName) await this.vdcNameInput.fill(vdcName);

    // Allocation Type
    if (allocationType) {
      await this.allocationTypeSelect.selectOption(allocationType);

      if (allocationType === '1') {
        await expect(this.allocationSettingsCard).toBeVisible();

        if (cpuCores) {
          await this.cpuInput.fill(cpuCores);
          await expect(this.cpuInput).toHaveValue(cpuCores);
          await expect(this.cpuAlert).toContainText('Provisioned CPU Cores');
        }

        if (memoryGiB) {
          await this.memoryInput.fill(memoryGiB);
          await expect(this.memoryInput).toHaveValue(memoryGiB);
          await expect(this.memoryAlert).toContainText('Provisioned Memory');
        }

        if (overcommitment) {
          await this.overcommitmentDropdown.selectOption(overcommitment);
          await expect(this.overcommitmentDropdown).toHaveValue(overcommitment);
        }
      }
    }

    // Storage Policy
    if (storagePolicyValue) {
      await expect(this.storagePolicySelect).toBeVisible();
      await expect(this.storagePolicySelect).toBeEnabled();
      await this.storagePolicySelect.selectOption(storagePolicyValue);
    }

    // Primary Storage
    if (StorageInput) {
      const storageAddButton = this.page.getByRole('button', { name: 'Add' }).first();
      await expect(storageAddButton).toBeEnabled();
      await storageAddButton.click();
      await this.primaryStorageInput.fill(StorageInput);
    }

    // Backup Storage
    if (backStorageValue && backInput) {
      await expect(this.backupStorageSelect).toBeVisible();
      await expect(this.backupStorageSelect).toBeEnabled();
      await this.backupStorageSelect.selectOption(backStorageValue);

      const backStoreButton = this.page.locator('#with-content button.add-backup-storage-option');
      await backStoreButton.waitFor({ state: 'visible', timeout: 10000 });
      await expect(backStoreButton).toBeEnabled();
      await backStoreButton.click();

      await this.backupStorageInput.fill(backInput);
    }
  }
}



