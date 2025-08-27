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
    // await page.waitForTimeout(2000); // 2-second delay
    // await expect(page.locator(loginSelectors.success)).toBeVisible();
await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const TenantsNav = page.locator('span:has-text("Tenants")');
  await expect(TenantsNav).toBeVisible();
  await expect(TenantsNav).toBeEnabled();

  // Click 'Resellers' menu link
  await TenantsNav.click();

  await expect(page.locator('h4.mb-sm-0')).toHaveText('Tenants');

  // Step 2: Click the visible Select2 dropdown
  const select2Container = page.locator('.select2-selection--single');
  await select2Container.click();

  // Step 3: Search and select reseller
  const searchInput = page.locator('input.select2-search__field');
  await searchInput.fill('QA_testingCreate');

  const resellerOption = page.locator('.select2-results__option', { hasText: 'QA_testingCreate' });
  await resellerOption.waitFor({ state: 'visible' });
  await resellerOption.click();

  // Optional: Step 4 - Search tenant name
  //await page.locator('#companysearch-name').fill('Tenant1');

  // Step 5: Click Search button
  await page.click('button[type="submit"]');

  // Step 6: Validate search result (e.g., tenant name is listed)
  await expect(page.getByRole('cell', { name: 'QA_testingCreate' })).toBeVisible();
  await expect(page.getByRole('cell', { name: 'TenantCreate' })).toBeVisible();


  await select2Container.click();
  
  await searchInput.fill('abcde123');

  const noResultsMessage = page.locator('li.select2-results__message', { hasText: 'No results found' });
await expect(noResultsMessage).toBeVisible();

  //await page.locator('button.btn-close >> span[aria-hidden="true"]').click();

  const searchInput2 = page.locator('#companysearch-name');
await expect(searchInput2).toBeVisible();
await searchInput2.fill('TenantCreate');
await page.click('button[type="submit"]');

await expect(page.getByRole('cell', { name: 'QA_testingCreate' })).toBeVisible();
await expect(page.getByRole('cell', { name: 'TenantCreate' })).toBeVisible();


await searchInput2.fill('Test-Your-Name');
await page.click('button[type="submit"]');

const emptyMessage = page.locator('div.empty');

await expect(emptyMessage).toBeVisible();
await expect(emptyMessage).toHaveText('No results found.');




});
 });