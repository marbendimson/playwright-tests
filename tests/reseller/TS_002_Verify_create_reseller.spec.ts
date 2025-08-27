import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Go to login page
    await page.goto(env.baseURL + '/login');

    // Fill login credentials
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);

    // Wait until we are redirected to dashboard or a known post-login element appears
    await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    // Use a stable locator based on data-key instead of visible text
    const resellersNav = page.locator('span[data-key="t-Resellers"]');

    // Wait for the element to be visible and enabled
    await expect(resellersNav).toBeVisible({ timeout: 10000 });
    await expect(resellersNav).toBeEnabled();

    // Click 'Resellers' menu link
    await resellersNav.click();



  const createResellerBtn = page.locator('a:has-text("Create Reseller")');
  await expect(createResellerBtn).toBeVisible();
  await expect(createResellerBtn).toBeEnabled();
  await createResellerBtn.click();

  // Verify "Create Reseller" modal/panel is present
  const createResellerHeader = page.locator('div.modal-dialog.modal-lg div.modal-header');
  await expect(createResellerHeader).toBeVisible();
  const headerText = await createResellerHeader.textContent();
  await expect(createResellerHeader).toHaveText('Create Reseller');

  // Verify form is displayed
  const modalBody = page.locator('div.modal-dialog.modal-lg >> div.modal-body');
  await expect(modalBody).toBeVisible();


  // Verify and fill the name input field
  const nameInput = page.locator('#company-name');
  await expect(nameInput).toBeEnabled();
  await nameInput.fill('QA_testingCreate');

  // Verify and click Save button
  const saveButton = page.locator('#submitBtn');
  await expect(saveButton).toBeEnabled();
  await saveButton.click();

  // Verify success toast/message
  // const alertBox = page.locator('div[role="alert"]');
  // await expect(alertBox).toBeVisible();
  // const alertText = await alertBox.textContent();
  // await expect(alertBox).toHaveText('Reseller Successfully Created.');
  const alertBox = page.locator('div[role="alert"]');
  await alertBox.waitFor({ state: 'visible', timeout: 10000 }); // wait up to 10s
  await expect(alertBox).toHaveText('Reseller Successfully Created.');


  // Refresh the page
  await page.reload();

  // Verify that the table contains the new reseller name
  const tableCell = page.locator('td:has-text("QA_testingCreate")');
  await expect(tableCell).toHaveText('QA_testingCreate');

  // Verify that the header contains the name in uppercase (as shown in UI)
   const header = page.locator('h4', { hasText: 'QA_testingCreate' });
   await expect(header).toHaveText(/QA_testingCreate/i);

 });
  });