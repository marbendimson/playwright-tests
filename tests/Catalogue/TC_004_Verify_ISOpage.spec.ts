import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Verify view virtual machine template page', () => {
  test('Should successfully display virtual machine Template page without UI or typo issues @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // -------------------------
    // Login
    // -------------------------
    await page.goto(`${env.baseURL}/login`);
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    // -------------------------
    // Navigate to Catalogue → ISOs
    // -------------------------
    const catalogueNav= page.locator('a.nav-link.menu-link:has(span[data-key="t-catalogue"])');
  await expect(catalogueNav).toBeVisible({ timeout: 10000 });
  await catalogueNav.click();

    const isoNav = page.getByRole('link', { name: 'ISOs', exact: true });
    await expect(isoNav).toBeVisible();
    await isoNav.click();

    // -------------------------
    // Verify ISO Storage Page
    // -------------------------
    await expect(page.getByRole('heading', { level: 4, name: 'ISO Storage' }))
      .toBeVisible({ timeout: 10000 });

    // -------------------------
    // Verify table headers
    // -------------------------
    const isoTable = page.locator('table:has(th:has-text("File Name"))');

    const headers = [
  '#',
  'Name',
  'Available on Proxmox',
  'File Name',
  'Data Center',
  'Virtual Data Center',
  'Size',
  'Storage',
  'Status',
  'Actions'
];

for (const header of headers) {
  let locator;

  // Headers wrapped in <a>
  if (['Name', 'File Name', 'Data Center', 'Virtual Data Center', 'Size', 'Storage'].includes(header)) {
    locator = isoTable.locator('thead th', {
      has: page.locator(`a:text-is("${header}")`)
    });
  } else {
    // Plain text headers (#, Available on Proxmox, Status, Actions)
    locator = isoTable.locator(`thead th:text-is("${header}")`);
  }

  await expect(locator).toBeVisible();
}

    // -------------------------
    // Verify at least one delete action exists
    // -------------------------
    await expect(isoTable.locator('a[data-modal-url*="/iso/delete"]').first())
      .toBeVisible();
  });
});
