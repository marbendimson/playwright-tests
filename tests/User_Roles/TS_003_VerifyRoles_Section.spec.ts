import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage } from '../../UserRole';

test.describe('Verify User Role page  ', () => {
  test('Should successfully display list of roles, search bar, Create Role, Edit, Delete button on roles section page  ', async ({ page }) => {
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
 await userManagement.verifyRolesTable();
 await userManagement.verifyRoleExists('Service Provider Administrator');
 await userManagement.searchRole('Staging-Role');

  });

});