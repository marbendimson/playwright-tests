import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';

test.describe('Verify create site name ', () => {
  test('Should successfully create and display the site name ', async ({ page }) => {
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

const brandingTab = page.locator('a.nav-link', { hasText: 'Branding' });
await expect(brandingTab).toBeVisible();
await expect(brandingTab).toBeEnabled();
await brandingTab.click();

//Verify Site name  field visble 
const siteNameLabel = page.locator('label[for="Setting[site_name]"]');
  await expect(siteNameLabel).toBeVisible();
const siteDescription = page.locator('p.text-muted', { hasText: 'This is the name displayed in the title bar and throughout the platform.' });
  await expect(siteDescription).toBeVisible();

const siteNameInput = page.locator('input[name="Setting[site_name]"]');
  await expect(siteNameInput).toBeVisible();
  await expect(siteNameInput).toBeEnabled();
 await siteNameInput.click();
  await siteNameInput.fill('Test-Site name');

   await page.getByRole('button', { name: 'Save' }).click();

   // ✅ Verify success alert is visible
  const successAlert = page.locator('.alert-success', { hasText: 'Settings Saved!' });
  await expect(successAlert).toBeVisible()

  const brandingParagraph = page.locator('p.fw-medium.text-white-50.mb-0', { hasText: 'Test-Site name' });
  await expect(brandingParagraph).toBeVisible();

 await page.reload();
  await expect(brandingParagraph).toBeVisible({timeout:5000});

  });


});
