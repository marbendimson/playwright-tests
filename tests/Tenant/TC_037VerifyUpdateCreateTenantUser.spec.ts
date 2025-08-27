import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { EditTenantUser_Form } from '../../TenantUserForm';

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

 const userRow = page.locator('tr', { hasText: 'tenant@sample.com' });
 await expect(userRow).toBeVisible();
 
  const userExists = await userRow.locator('a.modal-btn[data-modal-title="Update Tenant User"]').count();
 
 if (userExists > 0) {
   // User exists → proceed to edit
   await userRow.locator('a.modal-btn[data-modal-title="Update Tenant User"]').click();
 
   const TenantUserForm = new EditTenantUser_Form(page);
   await TenantUserForm.fillForm({
     firstName: 'Testedit',
     lastName: 'DoeEdit',
     email: 'tenant@sample.com',
     username: 'TestDoe',
     role: 'Tenant User',
     status :'Active'
     // pass: 'Temp1234!!',
     // confirmpass: 'Temp1234!!'

   });
 
   await TenantUserForm.submitForm();
   await TenantUserForm.expectSuccessMessage();
 
   // Assert the success message is displayed
   await expect(page.locator('.alert-success')).toHaveText(/successfully/i);
   await userRow.locator('a[title="View"]').click();
  const detailTable = page.locator('table.detail-view');
   await page.reload()
  // Check if the Edit button is visible
await expect(page.locator('a.btn.btn-primary:has-text("Edit")')).toBeVisible();
// Check if the Delete button is visible
await expect(page.locator('a.btn.btn-danger:has-text("Delete")')).toBeVisible();

// Validate fields
    await expect(detailTable.locator('tr:has(th:text("Username")) td')).toHaveText('TestDoe');
    await expect(detailTable.locator('tr:has(th:text("Email")) td')).toHaveText('tenant@sample.com');
    await expect(detailTable.locator('tr:has(th:text("First Name")) td')).toHaveText('Testedit');
    await expect(detailTable.locator('tr:has(th:text("Last Name")) td')).toHaveText('DoeEdit');
    await expect(detailTable.locator('tr:has(th:text("Status")) td')).toHaveText('Active');
    await expect(detailTable.locator('tr:has(th:text("Roles")) td')).toContainText('Tenant User');
 } else {
   // User does not exist → proceed to create
   await page.click('a.btn-create-user'); // Replace with actual selector for "Create User"
   // Add your create user flow here...
 }

  });
 });