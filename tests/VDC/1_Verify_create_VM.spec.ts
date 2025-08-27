import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import vmPage from '../../vm-page';
import { verifyVMCreation } from '../../recentTask';



test('Create VM - All in One Flow', async ({ page }) =>  {
  const user = getUserByRole('Service Provider');

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
  'My Network',      // label from network dropdown
  'e1000e',    // NIC model
  true,        // firewall toggle
  true,        // connected checkbox
  5            // preferred VLAN
);

if (!networkConfigured) {
  // Skip to next step since no network available
  await page.locator('button[data-nexttab="steparrow-discdrive-tab"]').click();
}


  await vmPage.configureDiscDrive(page);

  const desiredOrder = [ 'cdrom0', 'disk0'];
await vmPage.configureBootOrder(page, desiredOrder);

const card = page.locator('div.card.card-animate.bg-primary');
  await expect(card).toBeVisible({ timeout: 10000 });

  // Option 2: also ensure specific text is inside (extra check)
  await expect(card.locator('p', { hasText: 'Allocation' })).toBeVisible();
  await expect(card.locator('a', { hasText: 'VDC Autotest' })).toBeVisible();

 await verifyVMCreation(page);

  // Wait for the row containing the VM name to be visible
await expect(
  page.locator('tr:has(td a[title="AutoVM-001"])')
).toBeVisible({ timeout: 60000 });

// Optional: Verify the "Powered Off" status text
await expect(
  page.locator('tr:has(td a[title="AutoVM-001"]) td .badge')
).toHaveText(/Powered Off/i);

await page.reload()

await expect(
  page.locator('tr:has(td a[title="AutoVM-001"])')
).toBeVisible({ timeout: 30000 });

// Optional: Verify the "Powered Off" status text
await expect(
  page.locator('tr:has(td a[title="AutoVM-001"]) td .badge')
).toHaveText(/Powered Off/i);

});
