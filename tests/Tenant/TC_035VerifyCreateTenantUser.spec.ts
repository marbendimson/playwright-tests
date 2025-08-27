import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { TenantUserFormPage } from '../../TenantUserForm';

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

  const tenantView = page.getByRole('row', { name: /TenantCreate/ });
 await tenantView.getByRole('link', { name: 'View' }).click();

 await expect(page.locator('h4.mb-sm-0')).toHaveText('TenantCreate');

 const userEmail = 'tenant@sample.com';

  const userRow = page.locator('table tr', { hasText: userEmail });
   if (await userRow.count() > 0) {
    console.log('User already exists. Viewing user details.');

     await userRow.locator('a[title="View"]').click();

    const detailTable = page.locator('table.detail-view');

// Validate fields
    await expect(detailTable.locator('tr:has(th:text("Username")) td')).toHaveText('TestDoe');
    await expect(detailTable.locator('tr:has(th:text("Email")) td')).toHaveText('tenant@sample.com');
    await expect(detailTable.locator('tr:has(th:text("First Name")) td')).toHaveText('Test');
    await expect(detailTable.locator('tr:has(th:text("Last Name")) td')).toHaveText('Doe');
    await expect(detailTable.locator('tr:has(th:text("Status")) td')).toHaveText('Active');
    await expect(detailTable.locator('tr:has(th:text("Roles")) td')).toContainText('Tenant Administrator');


   }else {

   // Click the button that opens the modal
await page.click('a.modal-btn.btn.btn-primary[data-modal-title="Create Tenant User"]');

// Target the modal's title inside the opened dialog
const modalTitle = page.locator('div[role="dialog"] .modal-title');
await expect(modalTitle).toHaveText('Create Tenant User');


 
   const TenantUserForm = new TenantUserFormPage(page);

 await TenantUserForm.fillForm({
    firstName: 'Test',
    lastName: 'Doe',
    email: 'tenant@sample.com',
    username: 'TestDoe',
    role: 'Tenant Administrator',
    pass : 'Temp1234!!',
    confirmpass: 'Temp1234!!'
  });

  await TenantUserForm.submitForm();
  await TenantUserForm.expectSuccessMessage();

  await expect(page.getByRole('alert')).toHaveText(/Tenant User successfully Created/i);

  //Load the page 
  await page.reload()

  const row = page.locator('table tr', { hasText: 'tenant@sample.com' });
  await expect(row.locator('td').nth(0)).toHaveText('Test Doe');
  await expect(row.locator('td').nth(2)).toHaveText('tenant@sample.com');

  await userRow.locator('a[title="View"]').click();

    const detailTable = page.locator('table.detail-view');


  // Check if the Edit button is visible
await expect(page.locator('a.btn.btn-primary:has-text("Edit")')).toBeVisible();
// Check if the Delete button is visible
await expect(page.locator('a.btn.btn-danger:has-text("Delete")')).toBeVisible();

await page.reload()

// Validate fields
    await expect(detailTable.locator('tr:has(th:text("Username")) td')).toHaveText('TestDoe');
    await expect(detailTable.locator('tr:has(th:text("Email")) td')).toHaveText('tenant@sample.com');
    await expect(detailTable.locator('tr:has(th:text("First Name")) td')).toHaveText('Test');
    await expect(detailTable.locator('tr:has(th:text("Last Name")) td')).toHaveText('Doe');
    await expect(detailTable.locator('tr:has(th:text("Status")) td')).toHaveText('Active');
    await expect(detailTable.locator('tr:has(th:text("Roles")) td')).toContainText('Tenant Administrator');

   }

  });
 });