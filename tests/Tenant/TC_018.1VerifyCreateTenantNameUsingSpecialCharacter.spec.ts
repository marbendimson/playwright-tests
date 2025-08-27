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
    const resellersNav = page.locator('span:has-text("Resellers")');
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

   // Scroll to "Tenants" section
  const tenantsSection = page.locator('h4.card-title', { hasText: 'Tenants' });
  await tenantsSection.scrollIntoViewIfNeeded();

  // Assert heading is visible
  await expect(tenantsSection).toHaveText('Tenants');

  // Verify and click "Create Tenant" button
  const createTenantBtn = page.locator('a.modal-btn', { hasText: 'Create Tenant' });
  await expect(createTenantBtn).toBeVisible();
  await expect(createTenantBtn).toBeEnabled();
  await createTenantBtn.click();

  // Wait for modal to appear
  const modalTitle = page.locator('h5.modal-title', { hasText: 'Create Tenant' });
  await expect(modalTitle).toBeVisible();

  // Fill in tenant name
  const tenantInput = page.locator('#company-name');
  await expect(tenantInput).toBeVisible();
  await tenantInput.fill('~!@#$%^&*()_+-={}|[]\:"<>?,./'); // or GlobalVariable.createTenant equivalent

  // Click "Save"
  const saveBtn = page.locator('button#submitBtn', { hasText: 'Save' });
  await expect(saveBtn).toBeEnabled();
  await saveBtn.click();

  const error = page.locator('div.invalid-feedback');
await expect(error).toBeVisible();
await expect(error).toHaveText(
  'The name can only contain letters, numbers, spaces, dashes (-), and underscores (_).'
);


  // Wait and verify success message
  //const successMessage = page.locator('div.alert-success', { hasText: 'Tenant Successfully Created.' });
  // await expect(successMessage).toBeVisible();


  // Refresh and verify tenant appears in list
  //await page.reload();

  //await expect(page.locator('tr:has(th:text("Company Name")) td')).toHaveText('TenantCreate');

//   // Verify the Details title is visible
//   await expect(page.locator('h4.card-title', { hasText: 'Details' })).toBeVisible();

//   // Verify and click the Edit button
//   const editButton = page.locator('a.modal-btn.btn.btn-primary', {
//     hasText: 'Edit',
//   });
//   await expect(editButton).toBeVisible();
//   await expect(editButton).toBeEnabled();
//   await editButton.click();

//   // Optionally: wait for modal if triggered
//   await expect(page.locator('.modal-title')).toHaveText(/Edit/i); // Adjust if modal loads dynamically

//   // Verify and click the Delete button
//   const deleteButton = page.locator('a.modal-btn.btn.btn-danger', {
//     hasText: 'Delete',
//   });
//   await expect(deleteButton).toBeVisible();
//   await expect(deleteButton).toBeEnabled();
//   await deleteButton.click();

//   // Optionally: wait for delete modal confirmation to appear
//   await expect(page.locator('.modal-title')).toContainText('Delete');
});
 });