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
    //await expect(page.locator(loginSelectors.success)).toBeVisible();

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

  // const userEmail = 'jdoe@example.com';
  // const userRow = page.locator('table tr', { hasText: userEmail });

  //    await userRow.locator('a[title="View"]').click();
  const userRow = page.locator('tr', { hasText: 'jdoe@example.com' });
await expect(userRow).toBeVisible();
await userRow.locator('a[title="View"]').click();

    const detailTable = page.locator('table.detail-view');

// Validate fields
    await expect(detailTable.locator('tr:has(th:text("Username")) td')).toHaveText('jdoe');
    await expect(detailTable.locator('tr:has(th:text("Email")) td')).toHaveText('jdoe@example.com');
    await expect(detailTable.locator('tr:has(th:text("First Name")) td')).toHaveText('John');
    await expect(detailTable.locator('tr:has(th:text("Last Name")) td')).toHaveText('Doe');
    await expect(detailTable.locator('tr:has(th:text("Status")) td')).toHaveText('Active');
    await expect(detailTable.locator('tr:has(th:text("Roles")) td')).toContainText('Reseller');
   });
  });