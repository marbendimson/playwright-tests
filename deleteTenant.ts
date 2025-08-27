import { Page, Locator, expect } from '@playwright/test';

export class TenantDeleteModal {
  private readonly page: Page;
  readonly modalTitle: Locator;
  readonly confirmationHeader: Locator;
  readonly confirmationWarning: Locator;
  readonly whatHappensHeader: Locator;
  readonly removedFromSystemTitle: Locator;
  readonly removedFromSystemDesc: Locator;
  readonly infrastructureUnchangedTitle: Locator;
  readonly infrastructureUnchangedDesc: Locator;
  readonly tenantNameInput: Locator;
  readonly deleteButton: Locator;
  readonly loader: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.modalTitle = page.getByRole('heading', { name: /^Delete:/ });
    this.confirmationHeader = page.getByRole('heading', { name: 'Are you sure you want to delete this tenant?' });
    this.confirmationWarning = page.locator('p.text-muted', { hasText: 'This action cannot be undone. All tenant information will be permanently removed.' });
    this.whatHappensHeader = page.getByRole('heading', { name: /What happens when you delete this tenant\?/ });
    this.removedFromSystemTitle = page.locator('strong', { hasText: 'Removed from system' });
    this.removedFromSystemDesc = page.locator('p.text-muted.small', { hasText: 'The tenant and all associated information will be removed from the management system' });
    this.infrastructureUnchangedTitle = page.locator('strong', { hasText: 'Infrastructure unchanged' });
    this.infrastructureUnchangedDesc = page.locator('p.text-muted.small', { hasText: 'Virtual machines and network configurations remain in your infrastructure' });
    this.tenantNameInput = page.locator('#tenantdeleteform-name');
    this.deleteButton = page.getByRole('button', { name: /Delete Tenant/i });
    this.loader = page.locator('#loader');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
  }

  async verifyModalContents() {
    await expect(this.modalTitle).toBeVisible();
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationWarning).toBeVisible();
    await expect(this.whatHappensHeader).toBeVisible();
    await expect(this.removedFromSystemTitle).toBeVisible();
    await expect(this.removedFromSystemDesc).toBeVisible();
    await expect(this.infrastructureUnchangedTitle).toBeVisible();
    await expect(this.infrastructureUnchangedDesc).toBeVisible();
  }

  async deleteTenant(tenantName: string) {
    await this.verifyModalContents();
    await this.tenantNameInput.fill(tenantName);
    await this.deleteButton.click();
  }

  async cancelDelete() {
    await this.verifyModalContents();
    await this.cancelButton.click();
  }
}
