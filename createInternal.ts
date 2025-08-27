import { Page, Locator, expect } from '@playwright/test';

export class CreateInternalNetwork {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly tenantDropdown: Locator;
  readonly dataCenterDropdown: Locator;
  readonly virtualDataCentersSearchInput: Locator;
  readonly subnetInput: Locator;
  readonly gatewayInput: Locator;
  readonly createButton: Locator;
  readonly modalTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalTitle = page.locator('div.modal-header h5.modal-title', { hasText: 'Create Internal Network' });
    this.nameInput = page.locator('input#networkform-name');
    this.tenantDropdown = page.locator('select#networkform-tenant_id');
    this.dataCenterDropdown = page.locator('select#networkform-data_center_id');
    this.virtualDataCentersSearchInput = page.locator('textarea.select2-search__field');
    this.subnetInput = page.locator('input#networkform-subnet');
    this.gatewayInput = page.locator('input#networkform-gateway');
    this.createButton = page.locator('button#submitBtn.btn-success');
  }

  async fillForm({
    name,
    tenant,
    dataCenter,
    virtualDataCenters = [],
    subnet,
    gateway,
  }: {
    name?: string;
    tenant?: string;
    dataCenter?: string;
    virtualDataCenters?: string[];
    subnet?: string;
    gateway?: string;
  }) {
    if (name !== undefined) {
      await this.nameInput.fill(name);
    }

    if (tenant !== undefined) {
      await this.tenantDropdown.selectOption({ label: tenant });
    }

    if (dataCenter !== undefined) {
      await this.dataCenterDropdown.selectOption({ label: dataCenter });
    }

    if (virtualDataCenters.length > 0) {
      await this.virtualDataCentersSearchInput.click();
      for (const vdc of virtualDataCenters) {
        await this.virtualDataCentersSearchInput.fill(vdc);

        // Wait for matching option to appear in Select2 results
        const optionLocator = this.page.locator('.select2-results__option', { hasText: vdc });
        await expect(optionLocator.first()).toBeVisible({ timeout: 10000 });

        // Click the first match
        await optionLocator.first().click();
      }
    }

    if (subnet !== undefined) {
      await this.subnetInput.fill(subnet);
    }

    if (gateway !== undefined) {
      await this.gatewayInput.fill(gateway);
    }
  }

  async submitForm() {
  await this.createButton.waitFor({ state: 'visible' });
  await expect(this.createButton).toBeEnabled();
  await this.createButton.click();
}

  async expectModalVisible() {
    await this.modalTitle.waitFor({ state: 'visible' });
  }
}


export class EditInternalNetworkForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly tenantDropdown: Locator;
  readonly dataCenterDropdown: Locator;
  readonly vdcMultiSelect: Locator;
  readonly subnetInput: Locator;
  readonly gatewayInput: Locator;
  readonly saveButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#networkform-name');
    this.tenantDropdown = page.locator('#networkform-tenant_id');
    this.dataCenterDropdown = page.locator('#networkform-data_center_id');
    this.vdcMultiSelect = page.locator('#networkform-virtual_data_center_ids');
    this.subnetInput = page.locator('#networkform-subnet');
    this.gatewayInput = page.locator('#networkform-gateway');
    this.saveButton = page.locator('#submitBtn');
  }

  async openEditForm(networkName: string) {
    const row = this.page.locator('tr', { hasText: networkName });
    await expect(row).toBeVisible({ timeout: 15000 });

    const editButton = row.locator('a.modal-btn i.mdi-pencil');
    await editButton.click();

    await this.page
      .locator('div.modal-content', { has: this.page.getByRole('heading', { name: `Edit: ${networkName}` }) })
      .waitFor({ state: 'visible' });
  }

  async fillForm(data: {
    name?: string;
    subnet?: string;
    gateway?: string;
    tenantValue?: string;
    dataCenterValue?: string;
    vdcNames?: string[];
  }) {
    if (data.name) await this.nameInput.fill(data.name);
    if (data.tenantValue) await this.tenantDropdown.selectOption(data.tenantValue);
    if (data.dataCenterValue) await this.dataCenterDropdown.selectOption(data.dataCenterValue);

    if (data.vdcNames?.length) {
      const select2Trigger = this.page.locator('#select2-networkform-virtual_data_center_ids-container');
      await select2Trigger.click();

      for (const vdcName of data.vdcNames) {
        const searchBox = this.page.locator('.select2-search__field');
        await searchBox.fill(vdcName);

        // Only target options that are NOT already selected
        const option = this.page.locator(
          '.select2-results__option:not(.select2-results__option--selected)',
          { hasText: vdcName }
        );

        if (await option.first().isVisible({ timeout: 2000 })) {
          await option.first().click();
        } else {
          console.warn(`VDC "${vdcName}" not found or already selected — skipping.`);
        }
      }
    }
  }

  async submit() {
  await this.saveButton.click();

}


  }


export class DeleteInternalNetworkModal {
  readonly page: Page;
  readonly modalTitle: Locator;
  readonly nameInput: Locator;
  readonly proxmoxCheckbox: Locator;
  readonly deleteButton: Locator;
  readonly cancelButton: Locator;
  readonly successAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalTitle = page.getByRole('heading', { name: /Delete:/ });
    this.nameInput = page.locator('#networkdeleteform-name');
    this.proxmoxCheckbox = page.locator('#networkdeleteform-include_proxmox');
    this.deleteButton = page.getByRole('button', { name: 'Delete' });
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.successAlert = page.locator('.alert-success');
  }

  async openForNetwork(networkName: string) {
    const deleteIcon = this.page
      .locator('tr', { hasText: networkName })
      .locator('a.modal-btn i.mdi-delete');

    await deleteIcon.scrollIntoViewIfNeeded();
    await deleteIcon.click();
    await this.modalTitle.waitFor();
  }

  async deleteNetwork(networkName: string, includeProxmox = false) {
    await this.openForNetwork(networkName);
    await this.nameInput.fill(networkName);

    if (includeProxmox) {
      await this.proxmoxCheckbox.check();
    }

    await this.deleteButton.click();
    await this.successAlert
      .filter({ hasText: 'Network deleted successfully' })
      .waitFor();

    await this.modalTitle.waitFor({ state: 'detached' });
  }

  async cancelDeletion(networkName: string) {
    await this.openForNetwork(networkName);
    await this.cancelButton.click();
    await this.modalTitle.waitFor({ state: 'detached' });
  }
}