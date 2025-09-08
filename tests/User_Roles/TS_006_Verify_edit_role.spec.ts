import { test, expect, Page } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { UserManagementPage, Permissions } from '../../UserRole';

test.describe('Edit Role - Verify Permissions Retention and Update', () => {
  let userPage: UserManagementPage;
  let page: Page;

  const user = getUserByRole('Service Provider');

  const permissions: Permissions = {
    General: [/* ... */],
    Network_Management: ["External Network","Internal Network","Network Admin","Network View"],
    VM_Management: [
      "Virtual Machine Admin Permission",
      "Virtual Machine Backup Permission",
      "Virtual Machine Template Delete",
      "Virtual Machine User Permission",
      "Virtual Machine View Permission",
      "VM Import",
      "VM Template Import",
    ],
    Data_Center: ["Data Center Management","Data Center Pool","Data Center VNET","Database Backup and Restore Permission","Storage Policy"],
    ISO_Management: ["ISO", "ISO Import"],
    Reseller_Management: ["Reseller Company","Reseller Management","Reseller Permission","Service Provider"],
    Tenant_Management: ["Tenant Company","Tenant Management","Tenant View Permission","Tenants"],
    Administration: ["Company User Management","RBAC Admin","Role Permission","Updater","User Management"],
  };

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    userPage = new UserManagementPage(page);

    // Login
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

    // Navigate to User Roles
    await page.goto(env.baseURL + '/user/role');
    await userPage.openRolesTab();
    await userPage.verifyRoleSearchAndCreateUI();
    await userPage.verifyRolesTable();
  });

  test('Should verify retained permissions and update role description and permissions', async () => {
    const roleName = 'AutoRole';

    // Open edit modal
    const editModal = await userPage.openEditRoleModal(roleName);

    // Verify retained permissions
    await userPage.verifyRetainedPermissions(editModal, permissions);

    // Update VM_Management permissions
    await userPage.updateRolePermissions(editModal, {
      check: { VM_Management: ["VM Import"] },
      uncheck: { VM_Management: ["Virtual Machine Template Delete"] },
    });

    // Update description
    const newDesc = 'Updated via Playwright';
    const descField = editModal.locator('textarea[name="AuthItem[description]"]');
    await descField.scrollIntoViewIfNeeded();
    await descField.fill(newDesc);

    // Save changes

    const saveBtn = editModal.locator('button:has-text("Update Role")');
await expect(saveBtn).toBeEnabled({ timeout: 10000 });
await saveBtn.click();

    // Verify success
    const successAlert = page.locator('div.alert-success:has-text("Role updated successfully")');
    await expect(successAlert).toBeVisible({ timeout: 10000 });

    // Re-open edit modal to verify updates
    const updatedModal = await userPage.openEditRoleModal(roleName);
    const updatedDesc = await updatedModal.locator('textarea[name="AuthItem[description]"]').inputValue();
    expect(updatedDesc).toBe(newDesc);

    // Verify permissions retention
    await userPage.verifyRetainedPermissions(updatedModal, permissions);
  });

  test.afterEach(async () => {
    await page.close();
  });
});
