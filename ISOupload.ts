// import { Page, Locator, expect } from '@playwright/test';
// import path from 'path';
// import fs from 'fs';

// export class IsoUploadForm {
//   private dataCenterSelect: Locator;
//   private privateRadioLabel: Locator;
//   private publicRadioLabel: Locator;
//   private tenantDropdown: Locator;
//   private vdcDropdown: Locator;
//   private uploadLocalLabel: Locator;
//   private uploadUrlLabel: Locator;
//   private fileInput: Locator;
//   private urlInput: Locator;
//   private checkMetadataButton: Locator;
//   private nameInput: Locator;
//   private descriptionTextarea: Locator;
//   private backButton: Locator;
//   private nextStepButton: Locator;
//   private confirmButton: Locator;

//   constructor(private page: Page) {
//     this.dataCenterSelect = page.locator('#isouploadform-data_center_id');
//     this.privateRadioLabel = page.locator('label[for="private-outlined"]');
//     this.publicRadioLabel = page.locator('label[for="public-outlined"]');
//     this.tenantDropdown = page.locator('#select2-isouploadform-tenant_id-container');
//     this.vdcDropdown = page.locator(
//       '.select2-selection--single[aria-labelledby="select2-isouploadform-virtual_data_center_id-container"]'
//     );
//     this.uploadLocalLabel = page.locator('label[for="upload via local computer-outlined"]');
//     this.uploadUrlLabel = page.locator('label[for="upload via url-outlined"]');
//     this.fileInput = page.locator('#isouploadform-file_upload');
//     this.urlInput = page.locator('#isouploadform-url');
//     this.checkMetadataButton = page.getByRole('button', { name: 'Check URL Metadata' });
//     this.nameInput = page.locator('#isouploadform-name');
//     this.descriptionTextarea = page.locator('#isouploadform-description');

//     // Navigation buttons
//     this.backButton = page.getByRole('button', { name: 'Back' });
//     this.nextStepButton = page.getByRole('button', { name: 'Next Step' });
//     this.confirmButton = page.locator('#submit-button');
//   }

//   // =========================
//   // Step 1 — Data Center & Visibility
//   // =========================
//   async selectDataCenter(dataCenterName: string) {
//     await this.dataCenterSelect.selectOption({ label: dataCenterName });
//   }

//   async setVisibility(isPublic: boolean, tenantName?: string, vdcName?: string) {
//     if (isPublic) {
//       await this.publicRadioLabel.click();
//     } else {
//       await this.privateRadioLabel.click();
//       if (!tenantName || !vdcName) {
//         throw new Error('Tenant and VDC names are required for private ISO.');
//       }
//       await this.selectFromSelect2(this.tenantDropdown, tenantName);
//       await this.selectFromSelect2(this.vdcDropdown, vdcName);
//     }
//   }

//   async nextFromStep1() {
//     await this.goNextStep();
//   }

//   // =========================
//   // Step 2 — Upload Method
//   // =========================
//   async chooseUploadMethod(method: 'local' | 'url', fileOrUrl: string) {
//     if (method === 'local') {
//       const filePath =
//         process.env.ISO_PATH || path.isAbsolute(fileOrUrl)
//           ? fileOrUrl
//           : path.resolve(__dirname, '..', 'test-data', fileOrUrl);

//       if (!fs.existsSync(filePath)) {
//         throw new Error(`❌ File not found at: ${filePath}`);
//       }

//       await this.uploadLocalLabel.click();
//       await this.fileInput.setInputFiles(filePath);
//     } else if (method === 'url') {
//       await this.uploadUrlLabel.click();
//       await this.urlInput.fill(fileOrUrl);

//       await this.checkMetadataButton.click();
//     } else {
//       throw new Error(`Unsupported upload method: ${method}`);
//     }
//   }

//   async nextFromStep2() {
//     await this.goNextStep();
//   }

//   // =========================
//   // Step 3 — ISO Metadata
//   // =========================
//   async fillIsoMetadata(name: string, description?: string) {
//     await this.nameInput.fill(name);
//     if (description) {
//       await this.descriptionTextarea.fill(description);
//     }
//   }

//   async nextFromStep3() {
//     await this.goNextStep();
//   }

//   // =========================
//   // Step 4 — Confirmation
//   // =========================
//   async verifyConfirmation(details: {
//     dataCenter: string;
//     uploadMethod: string;
//     fileName: string;
//     isoName: string;
//     description?: string;
//   }) {
//     await expect(this.page.locator('.c-data_center_id')).toHaveText(details.dataCenter);
//     await expect(this.page.locator('.c-upload_method')).toContainText(details.uploadMethod);
//     await expect(this.page.locator('.c-upload_method')).toContainText(details.fileName);
//     await expect(this.page.locator('.c-iso_name')).toHaveText(details.isoName);

//     if (details.description) {
//       await expect(this.page.locator('.c-description')).toHaveText(details.description);
//     }
//   }

//   async confirmUpload() {
//     await expect(this.confirmButton).toBeVisible();
//     await this.confirmButton.click();
//   }

//   // =========================
//   // Navigation helpers
//   // =========================
//   private async goNextStep() {
//     await expect(this.nextStepButton).toBeVisible({ timeout: 15000 });
//     await expect(this.nextStepButton).toBeEnabled();
//     await this.nextStepButton.click();
//   }

//   private async selectFromSelect2(dropdown: Locator, optionText: string) {
//     await dropdown.click();
//     const searchInput = this.page.locator('.select2-search__field');
//     await searchInput.fill(optionText);
//     await this.page.locator('.select2-results__option', { hasText: optionText }).click();
//   }
// }
// export class IsoStoragePage {
//   constructor(private page: Page) {}

//   private deleteButton(isoName: string): Locator {
//     return this.page.locator('a.modal-btn.btn-danger', {
//       has: this.page.locator(`[data-modal-title*="Delete: ${isoName}"]`),
//     });
//   }

//   private deleteModal(): Locator {
//     return this.page.locator('.modal-content');
//   }

//   private proxmoxCheckbox(): Locator {
//     return this.page.locator('#isostorage-include_proxmox');
//   }

//   private confirmDeleteButton(): Locator {
//     return this.deleteModal().getByRole('button', { name: 'Delete' });
//   }

//   private successAlert(): Locator {
//     return this.page.locator('div.alert-success', { hasText: 'ISO Deleted' });
//   }

//   private isoRow(isoName: string): Locator {
//     return this.page.getByRole('cell', { name: isoName });
//   }

//   async deleteIso(name: string, options?: { includeProxmox?: boolean }) {
//     const deleteBtn = this.deleteButton(name);
//     await expect(deleteBtn).toBeVisible({ timeout: 10000 });
//     await expect(deleteBtn).toBeEnabled();
//     await deleteBtn.click();

//     const modal = this.deleteModal();
//     await expect(modal).toBeVisible({ timeout: 10000 });

//     if (options?.includeProxmox) {
//       const checkbox = this.proxmoxCheckbox();
//       await expect(checkbox).toBeVisible();
//       if (!(await checkbox.isChecked())) await checkbox.check();
//     }

//     const confirmBtn = this.confirmDeleteButton();
//     await expect(confirmBtn).toBeVisible();
//     await expect(confirmBtn).toBeEnabled();
//     await confirmBtn.click();

//     // Wait for modal to disappear
//     await expect(modal).toBeHidden({ timeout: 10000 });
//   }

//   async verifyIsoVisible(name: string) {
//     const row = this.isoRow(name);
//     await expect(row).toBeVisible({ timeout: 10000 });
//   }

//   async verifyIsoDeleted(name: string) {
//     const row = this.isoRow(name);
//     await expect(row).toHaveCount(0, { timeout: 10000 });
//   }
// }

import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// =======================================
// ISO Upload Form Page Object
// =======================================
export class IsoUploadForm {
  private dataCenterSelect: Locator;
  private privateRadioLabel: Locator;
  private publicRadioLabel: Locator;
  private tenantDropdown: Locator;
  private vdcDropdown: Locator;
  private uploadLocalLabel: Locator;
  private uploadUrlLabel: Locator;
  private fileInput: Locator;
  private urlInput: Locator;
  private checkMetadataButton: Locator;
  private nameInput: Locator;
  private descriptionTextarea: Locator;
  private backButton: Locator;
  private nextStepButton: Locator;
  private confirmButton: Locator;

  constructor(private page: Page) {
    this.dataCenterSelect = page.locator('#isouploadform-data_center_id');
    this.privateRadioLabel = page.locator('label[for="private-outlined"]');
    this.publicRadioLabel = page.locator('label[for="public-outlined"]');
    this.tenantDropdown = page.locator('#select2-isouploadform-tenant_id-container');
    this.vdcDropdown = page.locator(
      '.select2-selection--single[aria-labelledby="select2-isouploadform-virtual_data_center_id-container"]'
    );
    this.uploadLocalLabel = page.locator('label[for="upload via local computer-outlined"]');
    this.uploadUrlLabel = page.locator('label[for="upload via url-outlined"]');
    this.fileInput = page.locator('#isouploadform-file_upload');
    this.urlInput = page.locator('#isouploadform-url');
    this.checkMetadataButton = page.getByRole('button', { name: 'Check URL Metadata' });
    this.nameInput = page.locator('#isouploadform-name');
    this.descriptionTextarea = page.locator('#isouploadform-description');
    this.backButton = page.getByRole('button', { name: 'Back' });
    this.nextStepButton = page.getByRole('button', { name: 'Next Step' });
    this.confirmButton = page.locator('#submit-button');
  }

  // =========================
  // Navigation Helper
  // =========================
  async goToIsoUploadForm() {
    const catalogueNav = this.page.locator('span[data-key="t-catalogue"]');
    await expect(catalogueNav).toBeVisible();
    await catalogueNav.click();

    const isoNav = this.page.getByRole('link', { name: 'ISOs', exact: true });
    await expect(isoNav).toBeVisible();
    await isoNav.click();

    const uploadLink = this.page.getByRole('link', { name: /^Upload$/i });
    await expect(uploadLink).toBeVisible({ timeout: 10000 });
    await uploadLink.click();

// Verify modal opened
   await expect(this.page.getByRole('heading', { level: 5, name: /Upload ISO/i }))
  .toBeVisible({ timeout: 10000 });

  }

  // =========================
  // Step 1 — Data Center & Visibility
  // =========================
  async selectDataCenter(dataCenterName: string) {
    await expect(this.dataCenterSelect).toBeVisible({ timeout: 10000 });
    await this.dataCenterSelect.selectOption({ label: dataCenterName });
  }

  async setVisibility(isPublic: boolean, tenantName?: string, vdcName?: string) {
    if (isPublic) {
      await this.publicRadioLabel.click();
    } else {
      await this.privateRadioLabel.click();
      if (!tenantName || !vdcName) {
        throw new Error('❌ Tenant and VDC names are required for private ISO.');
      }
      await this.selectFromSelect2(this.tenantDropdown, tenantName);
      await this.selectFromSelect2(this.vdcDropdown, vdcName);
    }
  }

  async nextFromStep1() {
    await this.goNextStep();
  }

  // =========================
  // Step 2 — Upload Method
  // =========================
  async chooseUploadMethod(method: 'local' | 'url', fileOrUrl: string) {
    if (method === 'local') {
      const filePath =
        process.env.ISO_PATH && fs.existsSync(process.env.ISO_PATH)
          ? process.env.ISO_PATH
          : path.isAbsolute(fileOrUrl)
          ? fileOrUrl
          : path.resolve(__dirname, '..', 'test-data', fileOrUrl);

      if (!fs.existsSync(filePath)) {
        throw new Error(`❌ ISO file not found at: ${filePath}`);
      }

      await this.uploadLocalLabel.click();
      await this.fileInput.setInputFiles(filePath);
    } else {
      await this.uploadUrlLabel.click();
      await this.urlInput.fill(fileOrUrl);
      await this.checkMetadataButton.click();
    }
  }

  async nextFromStep2() {
    await this.goNextStep();
  }

  // =========================
  // Step 3 — ISO Metadata
  // =========================
  async fillIsoMetadata(name: string, description?: string) {
    await expect(this.nameInput).toBeVisible();
    await this.nameInput.fill(name);
    if (description) {
      await this.descriptionTextarea.fill(description);
    }
  }

  async nextFromStep3() {
    await this.goNextStep();
  }

  // =========================
  // Step 4 — Confirmation
  // =========================
  async verifyConfirmation(details: {
    dataCenter: string;
    uploadMethod: string;
    fileName: string;
    isoName: string;
    description?: string;
  }) {
    await expect(this.page.locator('.c-data_center_id')).toHaveText(details.dataCenter);
    await expect(this.page.locator('.c-upload_method')).toContainText(details.uploadMethod);
    await expect(this.page.locator('.c-upload_method')).toContainText(details.fileName);
    await expect(this.page.locator('.c-iso_name')).toHaveText(details.isoName);

    if (details.description) {
      await expect(this.page.locator('.c-description')).toHaveText(details.description);
    }
  }

  async confirmUpload() {
    await expect(this.confirmButton).toBeVisible();
    await this.confirmButton.click();
  }

  // =========================
  // Helpers
  // =========================
  private async goNextStep() {
    await expect(this.nextStepButton).toBeVisible({ timeout: 15000 });
    await expect(this.nextStepButton).toBeEnabled();
    await this.nextStepButton.click();
  }

  private async selectFromSelect2(dropdown: Locator, optionText: string) {
    await dropdown.click();
    const searchInput = this.page.locator('.select2-search__field');
    await searchInput.fill(optionText);
    await this.page.locator('.select2-results__option', { hasText: optionText }).click();
  }
}

// =======================================
// ISO Storage Page Object
// =======================================
export class IsoStoragePage {
  private proxmoxCheckbox: Locator;
  private successAlert: Locator;

  constructor(private page: Page) {
    this.proxmoxCheckbox = page.locator('#isostorage-include_proxmox');
    this.successAlert = page.locator('div.alert-success:has-text("ISO Deleted")');
  }

  // =========================
  // Navigation Helper
  // =========================
  async goToIsoStoragePage() {
    const catalogueNav = this.page.locator('span[data-key="t-catalogue"]');
    await expect(catalogueNav).toBeVisible();
    await catalogueNav.click();

    const isoNav = this.page.getByRole('link', { name: 'ISOs', exact: true });
    await expect(isoNav).toBeVisible();
    await isoNav.click();

    await expect(this.page.getByRole('heading', { level: 4, name: 'ISO Storage' })).toBeVisible({
      timeout: 10000,
    });
  }

  // Dynamic locators
  private deleteButton = (isoName: string) =>
    this.page.locator(`a.modal-btn.btn-danger[data-modal-title*="Delete: ${isoName}"]`);

  private deleteModal = (isoName: string) =>
    this.page.locator('.modal-content').filter({
      has: this.page.getByRole('heading', { name: new RegExp(`Delete: ${isoName}`, 'i') }),
    });

  private confirmDeleteButton = (isoName: string) =>
    this.deleteModal(isoName).getByRole('button', { name: 'Delete' });

  private isoRow = (isoName: string) =>
    this.page.locator(`td:has-text("${isoName}")`);

  // Methods
  async deleteIso(name: string, options?: { includeProxmox?: boolean }) {
    const deleteBtn = this.deleteButton(name);
    await expect(deleteBtn).toBeVisible({ timeout: 10000 });
    await deleteBtn.click();

    const modal = this.deleteModal(name);
    await expect(modal).toBeVisible({ timeout: 10000 });

    if (options?.includeProxmox) {
      await expect(this.proxmoxCheckbox).toBeVisible();
      if (!(await this.proxmoxCheckbox.isChecked())) {
        await this.proxmoxCheckbox.check();
      }
    }

    const confirmBtn = this.confirmDeleteButton(name);
    await expect(confirmBtn).toBeEnabled();
    await confirmBtn.click();

    await expect(modal).toBeHidden({ timeout: 10000 });
    await expect(this.successAlert).toBeVisible({ timeout: 10000 });
  }

  async verifyIsoVisible(name: string) {
    await expect(this.isoRow(name)).toBeVisible({ timeout: 10000 });
  }

  async verifyIsoDeleted(name: string) {
    await expect(this.isoRow(name)).toHaveCount(0, { timeout: 10000 });
  }
}
