import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage, openUsersTab, searchUser } from '../../UserRole';

test.describe('Verify User Role page  ', () => {
  test('should be able to successfully display User role page ', async ({ page }) => {
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


 
 



  });

});