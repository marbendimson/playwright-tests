import { Page, Locator, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

export class IsoUploadForm {
  private dataCenterSelect: Locator;
  private privateRadioLabel: Locator;
  private publicRadioLabel: Locator;
  private privateIsoAlert: Locator;
  private tenantDropdown: Locator;
  private vdcDropdown: Locator;
  private uploadLocalLabel: Locator;
  private uploadUrlLabel: Locator;
  private fileInput: Locator;
  private urlInput: Locator;
  private checkMetadataButton: Locator;
  private nameInput: Locator;
  private descriptionTextarea: Locator;
  private nextStepButton: Locator;

  constructor(private page: Page) {
    this.dataCenterSelect = page.locator('#isouploadform-data_center_id');
    this.privateRadioLabel = page.locator('label[for="private-outlined"]');
    this.publicRadioLabel = page.locator('label[for="public-outlined"]');
    this.privateIsoAlert = page.locator('#private-iso-alert');
    this.tenantDropdown = page.locator('#select2-isouploadform-tenant_id-container');
    this.vdcDropdown = page.locator('.select2-selection--single[aria-labelledby="select2-isouploadform-virtual_data_center_id-container"]');
    this.uploadLocalLabel = page.locator('label[for="upload via local computer-outlined"]');
    this.uploadUrlLabel = page.locator('label[for="upload via url-outlined"]');
    this.fileInput = page.locator('#isouploadform-file_upload');
    this.urlInput = page.locator('#isouploadform-url');
    this.checkMetadataButton = page.locator('button', { hasText: 'Check URL Metadata' });
    this.nameInput = page.locator('#isouploadform-name');
    this.descriptionTextarea = page.locator('#isouploadform-description');
    this.nextStepButton = page.locator('#iso-selection-submit');
  }

  async selectDataCenter(dataCenterName: string) {
    await this.dataCenterSelect.selectOption({ label: dataCenterName });
  }

  async setVisibility(isPublic: boolean, tenantName: string, vdcName: string) {
    if (isPublic) {
      await this.publicRadioLabel.click();
    } else {
      await this.privateRadioLabel.click();

      //await expect(this.privateIsoAlert, 'Private ISO alert should be visible').toBeVisible();
      await this.tenantDropdown.waitFor({ state: 'visible' });
      await expect(this.tenantDropdown).toBeVisible();

      await this.selectFromSelect2(this.tenantDropdown, tenantName);
      await this.selectFromSelect2(this.vdcDropdown, vdcName);
    }
  }

  async chooseUploadMethod(method: 'local' | 'url', fileOrUrl: string) {
  if (method === 'local') {
    // If it's an absolute path, use it directly; otherwise, resolve it
    const filePath = path.isAbsolute(fileOrUrl)
      ? fileOrUrl
      : path.resolve(__dirname, '..', 'test-data', fileOrUrl);

      console.log('Resolved file path:', filePath); // 🔍 Optional debug log

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at: ${filePath}`);
    }

    await this.uploadLocalLabel.click();
    await expect(this.fileInput).toBeVisible();
    await this.fileInput.setInputFiles(filePath);
  } else if (method === 'url') {
    await this.uploadUrlLabel.click();
    await expect(this.urlInput).toBeVisible();
    await this.urlInput.fill(fileOrUrl);
    await expect(this.checkMetadataButton).toBeVisible();
    await this.checkMetadataButton.click();
  } else {
    throw new Error(`Unsupported upload method: ${method}`);
  }
}

  private async selectFromSelect2(dropdown: Locator, optionText: string) {
    await dropdown.click();

    const searchInput = this.page.locator('.select2-search__field');
    await expect(searchInput).toBeVisible();
    await searchInput.fill(optionText);

    const option = this.page.locator('.select2-results__option', { hasText: optionText });
    await option.waitFor({ state: 'visible' });
    await option.click();
  }

  async fillIsoMetadata(name: string, description?: string) {
  await this.page.locator('#isouploadform-name').fill(name);
  if (description) {
    await this.page.locator('#isouploadform-description').fill(description);
  }
}

}
