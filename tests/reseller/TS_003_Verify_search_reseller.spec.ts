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

  // 🔍 First search: "QA_Resell"
  const searchInput = page.locator('#companysearch-name'); // replace with correct selector
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeEnabled();
  await searchInput.fill('finaltest');

  const searchButton = page.locator('button:has-text("Search")'); // replace with correct selector
  await expect(searchButton).toBeVisible();
  await expect(searchButton).toBeEnabled();
  await searchButton.click();

  const resultsRow = page.locator('div.summary');
 await expect(resultsRow).toBeVisible();
 await expect(resultsRow).toHaveText(/Showing 1-1 of 1 item/);

  const nameHeader = page.locator('a:has-text("Name")');
  await expect(nameHeader).toBeVisible();
  await expect(nameHeader).toHaveText('Name');

  const resultCell = page.locator('td:has-text("finaltest")'); // replace with actual td selector if needed
  await expect(resultCell).toBeVisible();

  // 🔄 Refresh and wait for page to reload
  await page.reload();
  await page.waitForLoadState('load');

  await expect(resellersNav).toBeVisible();
  await expect(resellersNav).toBeEnabled();

  // 🔍 Second search: "abcdetest"
  await expect(searchInput).toBeVisible();
  await expect(searchInput).toBeEnabled();
  await searchInput.fill('abcdetest');

  await expect(searchButton).toBeVisible();
  await expect(searchButton).toBeEnabled();
  await searchButton.click();

  const noResultsContainer = page.locator('.empty');
  await expect(noResultsContainer).toBeVisible();
  await expect(noResultsContainer).toHaveText(/No results found./);

  const nameHeaderAfter = page.locator('a:has-text("Name")'); // may be same as before
  await expect(nameHeaderAfter).toHaveText('Name');

   });
  });