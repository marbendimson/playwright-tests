import { Page, expect, Locator } from '@playwright/test';

/**
 * Handles navigation to Catalogue > Templates page
 */
export class CataloguePage {
  constructor(private page: Page) {}

  async goToTemplatesPage() {
  const catalogueLink = this.page.locator('a.nav-link.menu-link:has(span[data-key="t-catalogue"])');
  await expect(catalogueLink).toBeVisible({ timeout: 10000 });
  await catalogueLink.click();

  const templatesLink = this.page.getByRole('link', { name: 'Templates', exact: true });
await expect(templatesLink).toBeVisible({ timeout: 10000 });
await templatesLink.click();

    await expect(
      this.page.getByRole('heading', { level: 4, name: 'Virtual Machine Templates' })
    ).toBeVisible();
  }
}

/**
 * Handles viewing a specific template and opening its actions
 */
export class VmTemplatePage {
  constructor(private page: Page) {}

  async viewTemplate(templateName: string) {
    const templateLink = this.page.locator('a', { hasText: new RegExp(`^${templateName}`, 'i') });
    await expect(templateLink).toBeVisible({ timeout: 10000 });
    await templateLink.click();
    await expect(
      this.page.locator('h4', { hasText: templateName })
    ).toBeVisible();
  }

  async openDeleteModal(templateName: string) {
  // Find the card containing the VM template
  const card = this.page.locator('.card-body.card-vm', {
    has: this.page.locator('h2 a', { hasText: new RegExp(`^${templateName}`, 'i') }),
  });

  await expect(card).toBeVisible({ timeout: 15000 });

  // Find the Delete button inside this card
  const deleteBtn = card.locator('a.modal-btn.btn-danger', {
    hasText: 'Delete'
  });

  await expect(deleteBtn).toBeVisible({ timeout: 10000 });
  await deleteBtn.click();
}



}

/**
 * Handles importing VM templates from Proxmox
 */
export class VmTemplateImportPage {
  constructor(private page: Page) {}

  async openImport() {
    await this.page.getByRole('link', { name: 'Import VM Template from Proxmox' }).click();
    await expect(this.page.getByRole('heading', { level: 4, name: 'VM Template Import ' }))
      .toBeVisible();
    await this.page.waitForSelector('#isosync-form-pjax');
  }

  async selectDataCenter(dcName: string) {
    await this.page
      .locator('[aria-labelledby="select2-virtualmachinecataloguesyncform-data_center_id-container"]')
      .click();
    const option = this.page.locator('.select2-results__option', {
      hasText: new RegExp(`^${dcName}$`)
    });
    await expect(option).toBeVisible();
    await option.click();
    await expect(
      this.page.locator('#select2-virtualmachinecataloguesyncform-data_center_id-container')
    ).toHaveText(dcName);
    await this.page.click('#data-center-submit');
    await expect(this.page.locator('h5.mb-1', { hasText: 'VM Templates' })).toBeVisible();
  }

  async chooseVmTemplate(templateName?: string) {
    let vmOption: Locator;
    if (templateName) {
      vmOption = this.page.getByRole('button', { name: new RegExp(templateName, 'i') }).first();
    } else {
      vmOption = this.page.getByRole('button', { name: /^\[\d+\]/ }).first();
    }
    await expect(vmOption).toBeVisible({ timeout: 10000 });
    await vmOption.click();
    await this.page.click('#vm-selection-submit');
  }

  async assign({ isPublic, tenant, vdc }: { isPublic: boolean; tenant?: string; vdc?: string }) {
    await expect(this.page.locator('h5.mb-1', { hasText: 'Virtual Data Center' })).toBeVisible();

    const publicCheckbox = this.page.locator('#virtualmachinecataloguesyncform-is_public');
    await expect(publicCheckbox).toBeVisible();

    if (isPublic) {
      await publicCheckbox.check();
      await expect(
        this.page.locator('#select2-virtualmachinecataloguesyncform-company_id-container')
      ).not.toBeVisible();
    } else {
      await publicCheckbox.uncheck();

      if (!tenant) throw new Error('❌ Tenant name is required when importing non-public template.');
      await this.page.locator('#select2-virtualmachinecataloguesyncform-company_id-container').click();
      await this.page.locator('.select2-results__option', { hasText: tenant }).click();

      if (!vdc) throw new Error('❌ VDC name is required when importing non-public template.');
      await this.page
        .locator('#select2-virtualmachinecataloguesyncform-virtual_data_center_id-container')
        .click();
      const vdcOption = this.page.locator('li.select2-results__option', { hasText: vdc });
      await expect(vdcOption).toBeVisible();
      await vdcOption.click();
    }
  }

  async importTemplate() {
    await this.page.getByRole('button', { name: 'Import VM Templates' }).click();
    await expect(this.page.locator('div.alert-success')).toHaveText(
      /VM Template imported successfully/
    );
  }
}

/**
 * Handles Delete Modal actions
 */
export class DeleteModal {
  readonly modalTitle: Locator;
  readonly inputField: Locator;
  readonly proxmoxCheckbox: Locator;
  readonly deleteBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(private page: Page) {
    this.modalTitle = page.locator('.modal-title');
    this.inputField = page.locator('#cataloguedeleteform-name');
    this.proxmoxCheckbox = page.locator('#cataloguedeleteform-include_proxmox');
    this.deleteBtn = page.locator('button.btn.btn-danger[type="submit"]');
    this.cancelBtn = page.locator('button.btn.btn-secondary', { hasText: 'Cancel' });
  }

  async expectVisible(templateName: string) {
  // check modal title dynamically
  await expect(this.modalTitle.first()).toContainText(new RegExp(`Delete: ${templateName}`, 'i'));

  // check modal components
  await expect(this.inputField).toBeVisible();
  await expect(this.proxmoxCheckbox).toBeVisible();
  await expect(this.deleteBtn).toBeVisible();
  await expect(this.cancelBtn).toBeVisible();
}

async confirmDelete(templateName: string, includeProxmox = false) {
  // Fill only the predictable part of the VM name
  await this.inputField.fill(templateName);

  if (includeProxmox) {
    await this.proxmoxCheckbox.check();
    await expect(this.proxmoxCheckbox).toBeChecked();
  }

  await this.deleteBtn.click();
}

}
