import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage, openUsersTab} from '../../UserRole';
import {UserPage} from '../../CreateUser';


test.describe('Verify create new user  ', () => {
  test('Should successfully create new user  ', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
     await page.click(loginSelectors.submit);
     await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });


//User role page 
 const userManagement = new UserManagementPage(page);
 await userManagement.openRolesTab();
 await userManagement.verifyRoleSearchAndCreateUI();

 // Step 1: Open Users tab
  await openUsersTab(page);

  // Step 2: Verify users list exists
const userRows = page.locator('tbody tr');
const rowCount = await userRows.count();
expect(rowCount).toBeGreaterThan(0);


const userPage = new UserPage(page);

  await userPage.openCreateUserModal();
  await userPage.verifyFormFieldsVisible();

  await userPage.fillCreateUserForm({
    username: 'Autouser01',
    email: 'autouser01@example.com',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'Service Provider Administrator',
  });

  await userPage.saveUser();
});
});