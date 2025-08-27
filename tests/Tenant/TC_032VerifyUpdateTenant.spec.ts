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

 const tenantRow = page.getByRole('row', { name: /TenantCreate/i }); // Target the row
await tenantRow.getByRole('link').nth(3).click(); // Click the edit (pencil) icon


   // Wait for modal to be visible
 await expect(page.locator('.modal-content:has-text("Update Reseller User")')).toBeVisible();


  // Fill form fields
  await page.fill('#company-name', 'TenantCreate');
  await page.fill('#company-address', '123 New Address');
  await page.fill('#company-primary_contact_person', 'Jane Doe');
  await page.fill('#company-contact_number', '09171234567');

  // await page.locator('.modal-content:has-text("Update Reseller User")').getByRole('button', { name: 'Close' }).click();
const saveButton = page.getByRole('button', { name: 'Save' });
await expect(saveButton).toBeVisible({ timeout: 10000 });
await saveButton.click();

  // Confirm modal is hidden
  await expect(page.locator('.modal-content:has-text("Update Reseller User")')).toBeHidden();

  await page.reload()

  await tenantRow.getByRole('link').nth(3).click();

   // Wait for modal to be visible
  await expect(page.locator('.modal-content:has-text("Update Reseller User")')).toBeVisible();

  // Fill form fields
  await page.fill('#company-name', 'TenantCreate');
  await page.fill('#company-address', '123 New Address');
  await page.fill('#company-primary_contact_person', 'Jane Doe');
  await page.fill('#company-contact_number', '09171234567');
  // Submit the form
  await page.click('#submitBtn');

  await page.reload()
  await tenantRow.getByRole('link').nth(3).click(); // Click the edit (pencil) icon
  await expect(page.locator('.modal-content:has-text("Update Reseller User")')).toBeVisible();
  await expect(page.locator('#company-name')).toHaveValue('TenantCreate');
  await expect(page.locator('#company-address')).toHaveValue('123 New Address');
  await expect(page.locator('#company-primary_contact_person')).toHaveValue('Jane Doe');
  await expect(page.locator('#company-contact_number')).toHaveValue('09171234567');

  await page.locator('.modal-content:has-text("Update Reseller User")').getByRole('button', { name: 'Close' }).click();
  await expect(page.locator('.modal-content:has-text("Update Reseller User")')).toBeHidden();


 //edit Tenant details from Actual Tenant View details page 

 await expect(page.locator('h4.mb-sm-0')).toHaveText('Tenants');

 const tenantView = page.getByRole('row', { name: /TenantCreate/ });
 await tenantView.getByRole('link', { name: 'View' }).click();

 await page.click('a.modal-btn.btn.btn-primary[data-modal-title="Edit"]');

 await expect(page.locator('.modal-content:has-text("Edit")')).toBeVisible();

 await expect(page.locator('#company-name')).toBeVisible();
 // Fill form fields
  await page.fill('#company-name', 'TenantCreate');
  await page.fill('#company-address', '123 New Address');
  await page.fill('#company-primary_contact_person', 'Jane Doe');
  await page.fill('#company-contact_number', '09171234567');
  // Submit the form
  await page.click('#submitBtn');

  await page.click('a.modal-btn.btn.btn-primary[data-modal-title="Edit"]');
  await expect(page.locator('#company-name')).toHaveValue('TenantCreate');
  await expect(page.locator('#company-address')).toHaveValue('123 New Address');
  await expect(page.locator('#company-primary_contact_person')).toHaveValue('Jane Doe');
  await expect(page.locator('#company-contact_number')).toHaveValue('09171234567');
  //close modal form 
  await page.locator('.modal-content:has-text("Edit")').getByRole('button', { name: 'Close' }).click();


});
 });