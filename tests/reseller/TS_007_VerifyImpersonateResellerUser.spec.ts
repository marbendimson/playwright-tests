import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
   // await expect(page.locator(loginSelectors.success)).toBeVisible();

    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });
    const resellersNav = page.locator('span[data-key="t-Resellers"]');
  await expect(resellersNav).toBeVisible();
  await expect(resellersNav).toBeEnabled();

  // Click 'Resellers' menu link
  await resellersNav.click();

    // Wait for and click the SVG icon
  //const svgIcon = page.locator('svg');
  //await expect(svgIcon).toBeVisible();
  //await expect(svgIcon).toBeEnabled();
  //await svgIcon.click();

  const svgIcon = page.locator('a', { hasText: 'QA_testingCreate' }); // Adjust selector if needed
  await expect(svgIcon).toBeVisible();
  await expect(svgIcon).toBeEnabled();
  await svgIcon.click();

  // Wait for the "UpdateQAreselltest" header
  const header = page.locator('h4', { hasText: 'QA_testingCreate' });
  await expect(header).toHaveText(/QA_testingCreate/i);

   const row = page.locator('tr', { hasText: 'jdoe@example.com' });
  // await row.locator('a[title="Impersonate"]').click();
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    row.locator('a[title="Impersonate"]').click(),
  ]);
await expect(page.locator('h4.mb-sm-0')).toHaveText('Dashboard', { timeout: 10000 });


  await expect(page.locator('h4.mb-sm-0')).toHaveText('Dashboard');
  await page.reload()
  await expect(page.locator('span.user-name-sub-text')).toHaveText('Reseller');

  const dashboardLink = page.locator('a.nav-link.menu-link.active', { hasText: 'Dashboard' });
  await expect(dashboardLink).toBeVisible();

  const TenantLink = page.getByRole('link', { name: 'Tenants' });
  await expect(TenantLink).toBeVisible();

  const VDCLink = page.getByRole('link', { name: 'Virtual Data Centers' });
  await expect(VDCLink).toBeVisible();

  const UserRoleLink = page.getByRole('link', { name: 'User Roles' });
  await expect(UserRoleLink).toBeVisible();

  await page.getByRole('link', { name: 'Return to My Account' }).click();

  await expect(page.locator('h4.mb-sm-0')).toHaveText('Dashboard');
   });
  });