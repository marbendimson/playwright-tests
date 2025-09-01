import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';

test.describe('Verify update support email ', () => {
  test('Should be able to successfully update support email', async ({ page }) => {
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


  //🔹 Tabs 
  await expect(page.locator('a.nav-link', { hasText: 'Site Information' })).toBeVisible(); 
  const emailNameLabel = page.locator('label',{hasText:'Support Email'});
  await expect(emailNameLabel).toBeVisible();
const supportEmailDescription = page.locator('p.text-muted', { hasText: ' Enter the email address customers can use to reach out for support and inquiries.' });
  await expect(supportEmailDescription).toBeVisible();

  const EmailInput = page.locator('input[name="Setting[support_email]"]');
  await expect(EmailInput).toBeVisible();
  await expect(EmailInput).toBeEnabled();
 await EmailInput.click();
  await EmailInput.fill('support_test@multiportal.io');


 await page.getByRole('button', { name: 'Save' }).click();

   // ✅ Verify success alert is visible
  const successAlert = page.locator('.alert-success', { hasText: 'Settings Saved!' });
  await expect(successAlert).toBeVisible()

  const Emailcell=page.locator('td.text-white',{hasText:'support_test@multiportal.io'});
  await expect(Emailcell).toBeVisible();

  await page.reload();

 await expect(Emailcell).toBeVisible({timeout:5000});
  
  });

});
