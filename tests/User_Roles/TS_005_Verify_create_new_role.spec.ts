import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage, Permissions } from '../../UserRole';

test.describe('Verify User Role page', () => {
  test('Should create a new role with all permissions and verify it exists', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    // Login
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

    // Navigate to User Roles page
    const userManagement = new UserManagementPage(page);
    await userManagement.openRolesTab();
    await userManagement.verifyRoleSearchAndCreateUI();
    await userManagement.verifyRolesTable();

    // Define permissions: select ALL for every group
    const permissions :Permissions = {
      General: 'all',
      Data_Center: 'all',
      ISO_Management: 'all',
      VM_Management: 'all',
      Reseller_Management: 'all',
      Tenant_Management: 'all',
      Administration: 'all',
      Network_Management: 'all'
    };

    // Create a new role with all permissions
    const roleName = `AutoRole`;
    const description = 'Automated test role with all permissions';
    await userManagement.createRole( roleName, description, permissions);

    // Verify the new role exists in the table
    const roleExists = await userManagement.verifyRoleExists(roleName);
    expect(roleExists).toBe(true);
  });
});
