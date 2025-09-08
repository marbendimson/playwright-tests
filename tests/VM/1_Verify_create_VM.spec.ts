import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import vmPage from '../../vm-page';
import { verifyVMCreation } from '../../recentTask';


test('Create VM - All in One Flow', async ({ page }) => {
  const user = getUserByRole('Service Provider');
  test.setTimeout(360000); // 6 minutes

  // Login
  await page.goto(`${env.baseURL}/login`);
  await page.fill(loginSelectors.username, user.username);
  await page.fill(loginSelectors.password, user.password);
  await page.click(loginSelectors.submit);
  await page.waitForLoadState('networkidle');
  await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

  // Confirm VDC page is loaded
  await expect(page.locator('h4.pb-2:has-text("Virtual Data Centers")')).toBeVisible({ timeout: 10000 });

  // Navigate to VDC
  await vmPage.navigateToVDC(page, 'VDC Autotest');

  // Step 1: Basic Info
  await vmPage.fillBasicInfo(page, 'AutoVM-001', 'linux', 'l26');

  // Step 2: System Settings
  await vmPage.configureSystemSettings(page, 'ovmf', true, true, true, true, 'v2.0');

  // Step 3: Hardware Settings
  await vmPage.configureHardware(page, {
    sockets: 2,
    cores: 2,
    memory: 5,
    cpuVendor: 'default',
    cpuType: 'x86-64-v2'
  });

  // Step 4: Storage
  const storageConfigured = await vmPage.configureStorage(page, 5);
  if (!storageConfigured) return;

  // Step 5: Network
  const networkConfigured = await vmPage.configureNetwork(
    page,
    'My Network',
    'e1000e',
    true, // firewall toggle
    true, // connected checkbox
    5     // preferred VLAN
  );
  if (!networkConfigured) {
    await page.locator('button[data-nexttab="steparrow-discdrive-tab"]').click();
  }

  // Step 6: Disc drive + boot order
  await vmPage.configureDiscDrive(page);
  const desiredOrder = ['cdrom0', 'disk0'];
  await vmPage.configureBootOrder(page, desiredOrder);

  // Allocation card check
  const card = page.locator('div.card.card-animate.bg-primary');
  await expect(card).toBeVisible({ timeout: 10000 });
  await expect(card.locator('p', { hasText: 'Allocation' })).toBeVisible();
  await expect(card.locator('a', { hasText: 'VDC Autotest' })).toBeVisible();

  // Verify VM creation task completes (give it enough time!)
  await verifyVMCreation(page, 320000);

  await page.reload();
  // Verify the VM row exists in table
  const vmRow = page.locator('tr:has(td a[title="AutoVM-001"])').first();
  await expect(vmRow).toBeVisible({ timeout: 60000 });
});
