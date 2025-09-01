import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';


test.describe('Verify OFF maintenance mode  ', () => {
  test('should be able to successfully Off and disabled maintenance mode ', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
     await page.click(loginSelectors.submit);
     await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

  const settingsLink = page.locator('a.nav-link.menu-link[href="#Settings"]');
  await expect(settingsLink).toBeVisible();
  await expect(settingsLink).toBeEnabled();
  await settingsLink.click();
  await expect(page.locator('#Settings')).toBeVisible();

  const globalConfig = page.locator('span[data-key="t-Global Configurations"]');
  await expect(globalConfig).toBeVisible();
  await globalConfig.click();

await expect(page.locator('td:has-text("Maintenance Mode")')).toBeVisible();

// Locate the Maintenance Mode row by text
const maintenanceRow = page.locator('tr:has(td.text-white:has-text("Maintenance Mode"))');

// Locate the visible toggle inside the row
const toggle = maintenanceRow.locator('.bootstrap-switch-label');

// Click the toggle (force click in case hidden input)
await toggle.click();

// Verify the hidden checkbox is checked
const mainInput = maintenanceRow.locator('input[name="Setting[maintenance_mode]"]');
await expect(mainInput).toHaveJSProperty('checked', false);

// Save settings
const saveBtn = page.getByRole('button', { name: 'Save' });
await saveBtn.click();

// Confirm settings saved
await expect(page.locator('div.alert.alert-success', { hasText: 'Settings Saved!' })).toBeVisible();

const maintenanceHeading = page.locator('h1', { hasText: 'MAINTENANCE MODE' });
  await expect(maintenanceHeading).toBeHidden();
  await expect(maintenanceHeading).toHaveCount(0);

  await page.reload({timeout:5000});
  await expect(maintenanceHeading).toBeHidden();
  await expect(maintenanceHeading).toHaveCount(0);

  //🔹 Tabs 
  await expect(page.locator('a.nav-link', { hasText: 'Site Information' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Infrastructure Settings' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Branding' })).toBeVisible(); 
   
 
});


});
