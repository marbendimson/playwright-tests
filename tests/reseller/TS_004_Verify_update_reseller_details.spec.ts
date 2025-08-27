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

  const svgIcon = page.locator('a', { hasText: 'QA_testingCreate' }); // Adjust selector if needed
  await expect(svgIcon).toBeVisible();
  await expect(svgIcon).toBeEnabled();
  await svgIcon.click();

  // Wait for reseller details section
  const header = page.locator('h4', { hasText: 'QA_testingCreate' });
  await expect(header).toHaveText(/QA_testingCreate/i);

  // Click Edit
  const editLink = page.locator('a:has-text("Edit")');
  await expect(editLink).toBeVisible();
  await expect(editLink).toBeEnabled();
  await editLink.click();

  // Fill Edit Form
  await expect(page.locator('h5', { hasText: 'Edit' })).toHaveText('Edit');

  const nameInput = page.locator('input[name="Company[name]"]');
  await expect(nameInput).toBeEnabled();
  await nameInput.fill('QA_testingCreate');

  const addressInput = page.locator('input[name="Company[address]"]');
  await expect(addressInput).toBeEnabled();
  await addressInput.fill('Test Address');

  const contactPersonInput = page.locator('input[name="Company[primary_contact_person]"]');
  await expect(contactPersonInput).toBeEnabled();
  await contactPersonInput.fill('Test Contact');

  const contactNumberInput = page.locator('input[name="Company[contact_number]"]');
  await expect(contactNumberInput).toBeEnabled();
  await contactNumberInput.fill('test number');

  // Save
  const saveBtn = page.locator('button:has-text("Save")');
  await expect(saveBtn).toBeVisible();
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  // Wait and verify updated view
  const updatedDetails = page.locator('h4.mb-sm-0', { hasText: 'QA_testingCreate' });
await expect(updatedDetails).toBeVisible();

  // Click Edit again and close
  await editLink.click();

  const closeButton = page.getByRole('button', { name: 'Close' }).first();
await expect(closeButton).toBeVisible();
await closeButton.click();


  // Refresh and final validations
  await page.reload();
  await page.waitForLoadState('networkidle');

  const companyHeader = page.locator('th:has-text("Company Name")');
  await expect(companyHeader).toHaveText('Company Name');

  const updatedRow = page.locator('td:has-text("QA_testingCreate")');
  await expect(updatedRow).toHaveText('QA_testingCreate');

  });
  });