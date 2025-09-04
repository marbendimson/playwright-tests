import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { TenantDeleteModal } from '../../deleteTenant';
import { verifyTenantDeletionCompleted } from '../../recentTask';

test('should verify modal contents and delete tenant', async ({ page }) => {
  const user = getUserByRole('Service Provider');

  // --- Login ---
  await page.goto(env.baseURL + '/login');
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);

  // Wait for login success message
  await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

  // --- Navigate to Tenants ---
  const tenantsNav = page.locator('span:has-text("Tenants")');
  await expect(tenantsNav).toBeVisible({ timeout: 10000 });
  await expect(tenantsNav).toBeEnabled();
  await tenantsNav.click();

  // Confirm we're on the Tenants page
  await expect(page.locator('h4.mb-sm-0')).toHaveText('Tenants', { timeout: 10000 });

  // --- Locate and open Tenant details ---
  await page.getByRole('row', { name: /TenantCreate/ }).waitFor({ timeout: 10000 });
  const tenantRow = page.getByRole('row', { name: /TenantCreate/ });
  await tenantRow.getByRole('link', { name: 'View' }).click();

  // Confirm tenant details loaded
  await expect(page.locator('h4.mb-sm-0')).toHaveText('TenantCreate', { timeout: 10000 });

  // --- Trigger Delete ---
  const deleteLink = page.getByRole('link', { name: 'Delete' });
  await expect(deleteLink).toBeVisible({ timeout: 10000 });
  await deleteLink.click();

  // --- Modal Interaction ---
  const deleteModal = new TenantDeleteModal(page);
  await deleteModal.deleteTenant('TenantCreate');

  // --- Verify deletion success ---
  // Expect the info alert to be visible with the correct text
await expect(
  page.locator('.alert-info')
).toHaveText(
  /Tenant deletion has been queued for processing\. You will be notified when it's complete\./,
  { timeout: 10000 }
);

await verifyTenantDeletionCompleted(page);

const tenantLocator = page.locator('td >> a', { hasText: 'TenantCreate' });

await expect(async () => {
  await page.reload();
  await expect(tenantLocator).toHaveCount(0, { timeout: 1000 });
}).toPass({ timeout: 60000 }); // will retry until tenant disappears

});
