import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage } from '../../UserRole';

test.describe('Verify User Role page  ', () => {
  test('Should successfully search roles by name  and display "No results found" if not available   ', async ({ page }) => {
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
const exists = await userManagement.verifyRoleExists('Service Provider Administrator');
    expect(exists).toBe(true);

    // Search for a specific role
    await userManagement.searchRole('Staging-Role');

    // Search for a non-existent role and handle "No results found"
    await page.reload();
    const notFound = await userManagement.searchRole('Testtttt'); 
    expect(notFound).toBe(false); // Will pass if "No results found" is displayed

});
});