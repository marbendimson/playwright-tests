import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { EditResellerUserFormPage } from '../../resellerUserFormPage';

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

 // await page.locator('a.modal-btn[data-modal-title="Update Reseller User"]').click();
 // await expect(page.locator('form#reseller-user-form')).toBeVisible(); // adjust selector if needed

const userRow = page.locator('tr', { hasText: 'jdoe@example.com' });
await expect(userRow).toBeVisible();

 const userExists = await userRow.locator('a.modal-btn[data-modal-title="Update Reseller User"]').count();

if (userExists > 0) {
  // User exists → proceed to edit
  await userRow.locator('a.modal-btn[data-modal-title="Update Reseller User"]').click();

  const resellerUserForm = new EditResellerUserFormPage(page);
  await resellerUserForm.fillForm({
    firstName: 'Johnedit',
    lastName: 'DoeEdit',
    email: 'jdoe@example.com',
    username: 'jdoe234',
    role: 'Reseller',
    status :'Inactive'
    // pass: 'Temp1234!!',
    // confirmpass: 'Temp1234!!'
  });

  await resellerUserForm.submitForm();
  await resellerUserForm.expectSuccessMessage();

  // Assert the success message is displayed
  await expect(page.locator('.alert-success')).toHaveText(/successfully/i);
} else {
  // User does not exist → proceed to create
  await page.click('a.btn-create-user'); // Replace with actual selector for "Create User"
  // Add your create user flow here...
}



  });
  });