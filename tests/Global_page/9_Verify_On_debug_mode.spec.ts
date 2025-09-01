import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';


test.describe('Verify On Debug mode  ', () => {
  test('should be able to successfully On debug mode ', async ({ page }) => {
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

await expect(page.locator('td:has-text("Debug Mode")')).toBeVisible();

  // ✅ Click the visible Bootstrap Switch "label"
  const debugRow = page.getByRole('row', { name: /Debug Mode/i });
  await expect(debugRow).toBeVisible();

  // ✅ Locate the checkbox (actual state holder)
  const debugInput = debugRow.locator('input[name="Setting[debug_mode]"]');

  // ✅ If OFF, click only the Debug Mode toggle
  if (!(await debugInput.isChecked())) {
    const toggle = debugRow.locator('.bootstrap-switch-label');
    await toggle.click();
  }

  // ✅ Assert Debug Mode is ON
  await expect(debugInput).toBeChecked();

  // ✅ Verify Save button is clickable
  const saveBtn = page.getByRole('button', { name: 'Save' });
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();
 await expect(
  page.locator('div.alert.alert-success', { hasText: 'Settings Saved!' })
).toBeVisible();



  //🔹 Tabs 
  await expect(page.locator('a.nav-link', { hasText: 'Site Information' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Infrastructure Settings' })).toBeVisible(); 
  await expect(page.locator('a.nav-link', { hasText: 'Branding' })).toBeVisible(); 
   // 🔹 Configuration Labels 
  const siteNameLabel = page.locator('td.text-white', { hasText: 'Site Name' }).first();
  await expect(siteNameLabel).toBeVisible();
  await expect(page.locator('td.text-white', { hasText: 'Support Email' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'VLAN Starting Range' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'Debug Mode' })).toBeVisible(); 
  await expect(page.locator('td.text-white', { hasText: 'Maintenance Mode' })).toBeVisible(); });


});
