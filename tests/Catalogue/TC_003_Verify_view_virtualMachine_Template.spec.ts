import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Verify view virtual machine template page', () => {
  test('Should successfully display virtual machine Template page without any UI and Typo issues  @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const CatalogueNav = page.locator('span:has-text("Catalogue")');
  await expect(CatalogueNav).toBeVisible();
  await expect(CatalogueNav).toBeEnabled();

  // Click 'Tenant' menu link
  await CatalogueNav.click();

  const templateNav = page.getByRole('link', { name: 'Templates' });
  await expect(templateNav).toBeVisible();
  await templateNav.click();

    await expect(page.getByRole('heading', { level: 4, name: 'Virtual Machine Templates' })).toBeVisible();

    const importVmTemplateButton = page.getByRole('link', { name: 'Import VM Template from Proxmox' });
    await expect(importVmTemplateButton).toBeVisible();

    await page.locator('a[href^="/catalogue/view?id="]').first().click({ timeout: 3000 });

    const vmCard = page.locator('.card-vm').first();

// Check if card exists before continuing
if (await vmCard.isVisible()) {
  console.log('✅ VM card found, verifying contents...');

  // Verify card is accessible and includes expected elements
  await expect(vmCard.getByRole('link', { name: /delete/i })).toBeVisible();
  await expect(vmCard.getByText('Data Center')).toBeVisible();
  await expect(vmCard.getByText('Tenant')).toBeVisible();
  await expect(vmCard.getByText('Virtual Data Center')).toBeVisible();

//   // Optional: check that their values are not empty
//   const textContent = await vmCard.textContent();
//   expect(textContent).toContain('MainDC');
//   expect(textContent).toContain('Test-Tenant');
//   expect(textContent).toContain('VDC-');
} else {
  console.warn('No VM Template card found. Skipping validation.');
}

await expect(page.getByRole('tab', { name: /information/i })).toBeVisible();
await page.getByRole('tab', { name: /information/i }).click();

await expect(page.getByRole('cell', { name: 'OS Family' })).toBeVisible();
await expect(page.getByRole('cell', { name: 'Proxmox Node ID' })).toBeVisible();
await expect(page.getByRole('cell', { name: 'Proxmox VM ID' })).toBeVisible();

await page.reload()
await expect(page.getByRole('tab', { name: /hardware attachments/i })).toBeVisible();
await page.getByRole('tab', { name: /hardware attachments/i }).click();

await expect(page.locator('th', { hasText: 'Tpmstate0' })).toBeVisible();
await expect(page.locator('th', { hasText: 'Scsihw' })).toBeVisible();
await expect(page.locator('th', { hasText: 'Scsi0' })).toBeVisible();

  });
 });    