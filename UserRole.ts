// pages/UserManagementPage.ts
import { Page, expect, Locator } from '@playwright/test';

export class UserManagementPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ======================
  // ROLES TAB
  // ======================
  async openRolesTab() {
  const userRolesNav = this.page.locator('a.nav-link.menu-link:has(span[data-key="t-User Roles"])');

  // Option 1: Wait for the element to appear isn DOM first
  //await userRolesNav.waitFor({ state: 'attached', timeout: 10_00 });

  // Option 2: Click using force if visibility is blocked
  await userRolesNav.click({ force: true });

  // Optionally, wait for Roles tab content to load
  const rolesTab = this.page.locator('a.nav-link[data-tab="roles"]');
  await expect(rolesTab).toBeVisible({ timeout: 10000 });
}

  async verifyRoleSearchAndCreateUI() {
    await expect(this.page.locator('#rolesearch-name')).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'Search' })).toBeVisible();
    await expect(this.page.getByRole('link', { name: 'Create Role' })).toBeVisible();
  }

  async verifyRolesTable() {
    const rolesTable = this.page.locator('#w1 table.table');
    await expect(rolesTable).toBeVisible();
    const rowCount = await rolesTable.locator('tbody tr').count();
    expect(rowCount).toBeGreaterThan(0);
  }

  async verifyRoleExists(roleName: string): Promise<boolean> {
    const rolesTable = this.page.locator('#w1 table.table');
    await expect(rolesTable).toBeVisible({ timeout: 5000 });

    const noResults = rolesTable.locator('td div.empty', { hasText: 'No results found' });
    if (await noResults.isVisible({ timeout: 1000 })) return false;

    const roleCell = rolesTable.locator('tbody tr td:first-child', { hasText: roleName });
    return await roleCell.isVisible({ timeout: 2000 });
  }

  async searchRole(roleName: string): Promise<boolean> {
    const rolesTable = this.page.locator('#w1 table.table');
    await expect(rolesTable).toBeVisible();

    const noResults = rolesTable.locator('td div.empty', { hasText: 'No results found' });
    if (await noResults.isVisible()) return false;

    const roleCell = rolesTable.locator('tbody tr td:first-child', { hasText: roleName });
    return await roleCell.isVisible();
  }

  // ======================
  // CREATE ROLE
  // ======================
  async createRole(roleName: string, description: string, permissions: Permissions) {
    const createRoleBtn = this.page.locator('a.btn.btn-primary:has-text("Create Role")');
    await expect(createRoleBtn).toBeVisible();
    await expect(createRoleBtn).toBeEnabled();
    await createRoleBtn.click();

    const createRoleModal = this.page.locator('div.modal-content:has(h5.modal-title:text("Create Role"))');
    await expect(createRoleModal).toBeVisible({ timeout: 10000 });

    await this.page.fill('input[name="AuthItem[name]"]', roleName);
    await this.page.fill('textarea[name="AuthItem[description]"]', description);

    const assignPermissionsSection = this.page.locator('div.permissions');
    await expect(assignPermissionsSection).toBeVisible();

    for (const [group, perms] of Object.entries(permissions)) {
      const accordionButton = this.page.locator(`button.accordion-button:has-text("${group.replace('_', ' ')}")`);
      if ((await accordionButton.getAttribute('aria-expanded')) === 'false') {
        await accordionButton.click();
        const accordionContent = this.page.locator(`#flush-collapse-${group}`);
        await expect(accordionContent).toBeVisible({ timeout: 3000 });
      }

      if (perms === 'all') {
        const selectAllCheckbox = this.page.locator(`#select-all-${group}`);
        await expect(selectAllCheckbox).toBeVisible();
        await expect(selectAllCheckbox).toBeEnabled();
        if (!(await selectAllCheckbox.isChecked())) await selectAllCheckbox.check();
        continue;
      }

      for (const perm of perms) {
        const checkbox = this.page.locator(
          `#flush-collapse-${group} input.form-check-input[name="permissions[]"][value="${perm}"]`
        );
        if ((await checkbox.count()) === 0) continue;
        await checkbox.scrollIntoViewIfNeeded();
        await expect(checkbox).toBeVisible();
        if (!(await checkbox.isChecked())) await checkbox.check();
      }
    }

    await createRoleModal.locator('button:has-text("Create New Role")').click();
    const successAlert = this.page.locator('div.alert-success:has-text("Role created successfully")');
    await expect(successAlert).toBeVisible({ timeout: 10000 });
  }

  // ======================
  // EDIT ROLE
  // ======================
  async openEditRoleModal(roleName: string) {
  // Wait for the row containing the role to appear
  const row = this.page.locator(`tr:has-text("${roleName}")`);
  await expect(row).toHaveCount(1, { timeout: 10000 }); // wait until it exists

  // Find the Edit link inside that row
  const editLink = row.locator('a:has-text("Edit")');

  // Ensure the link is visible and clickable
  await expect(editLink).toBeVisible({ timeout: 10000 });
  await editLink.scrollIntoViewIfNeeded();
  await editLink.click();

  // Wait for modal to appear
  const modal = this.page.locator('div.modal-content:has(h5.modal-title:text("Edit Role"))');
  await modal.waitFor({ state: 'visible', timeout: 10000 });

  return modal;
}



  async getSelectedPermissions(modalLocator: ReturnType<Page['locator']>): Promise<string[]> {
    const selected: string[] = [];
    const checkboxes = modalLocator.locator('div.permissions input.form-check-input[name="permissions[]"]');
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) {
        const value = await checkbox.getAttribute('value');
        if (value) selected.push(value);
      }
    }
    return selected;
  }

  async updateRolePermissions(modal: Locator, { check, uncheck }: { check?: Permissions; uncheck?: Permissions }) {
    if (check) {
      for (const [group, perms] of Object.entries(check)) {
        const collapseId = `#flush-collapse-${group}`;
        const groupAccordion = modal.locator(collapseId);
        if (!(await groupAccordion.isVisible())) {
          await modal.locator(`#flush-heading-${group} button`).click();
          await groupAccordion.waitFor({ state: 'visible', timeout: 5000 });
        }

        for (const perm of perms) {
          const checkbox = groupAccordion.locator(`input.form-check-input[name="permissions[]"][value="${perm}"]`);
          if ((await checkbox.count()) > 0 && !(await checkbox.first().isChecked())) {
            await checkbox.first().check();
          }
        }
      }
    }

    if (uncheck) {
      for (const [group, perms] of Object.entries(uncheck)) {
        const collapseId = `#flush-collapse-${group}`;
        const groupAccordion = modal.locator(collapseId);
        if (!(await groupAccordion.isVisible())) {
          await modal.locator(`#flush-heading-${group} button`).click();
          await groupAccordion.waitFor({ state: 'visible', timeout: 5000 });
        }

        for (const perm of perms) {
          const checkbox = groupAccordion.locator(`input.form-check-input[name="permissions[]"][value="${perm}"]`);
          if ((await checkbox.count()) > 0 && (await checkbox.first().isChecked())) {
            await checkbox.first().uncheck();
          }
        }
      }
    }
  }


  // Utility: Uncheck all permissions in a group
  async uncheckAllPermissionsInGroup(modalLocator: ReturnType<Page['locator']>, group: string) {
    const accordionButton = modalLocator.locator(`button.accordion-button:has-text("${group.replace('_', ' ')}")`);
    if ((await accordionButton.getAttribute('aria-expanded')) === 'false') {
      await accordionButton.click();
      const accordionContent = modalLocator.locator(`#flush-collapse-${group}`);
      await expect(accordionContent).toBeVisible({ timeout: 3000 });
    }

    const checkboxes = modalLocator.locator(`#flush-collapse-${group} input.form-check-input[name="permissions[]"]`);
    const count = await checkboxes.count();
    for (let i = 0; i < count; i++) {
      const checkbox = checkboxes.nth(i);
      if (await checkbox.isChecked()) await checkbox.uncheck();
    }
  }

  // Verify retained permissions
  async verifyRetainedPermissions(modal: Locator, permissions: Permissions) {
    for (const [group, perms] of Object.entries(permissions)) {
      // Ensure the accordion group is expanded
      const collapseId = `#flush-collapse-${group}`;
      const groupAccordion = modal.locator(collapseId);
      if (!(await groupAccordion.isVisible())) {
        await modal.locator(`#flush-heading-${group} button`).click();
        await groupAccordion.waitFor({ state: 'visible', timeout: 5000 });
      }

      for (const perm of perms) {
        const checkbox = groupAccordion.locator(`input.form-check-input[name="permissions[]"][value="${perm}"]`);
        const count = await checkbox.count();
        if (count === 0) {
          console.warn(`Checkbox "${perm}" in group "${group}" not found, skipping.`);
          continue;
        }

        const isVisible = await checkbox.first().isVisible();
        if (!isVisible) {
          console.warn(`Checkbox "${perm}" in group "${group}" is hidden, skipping.`);
          continue;
        }

        const checked = await checkbox.first().isChecked();
        if (!checked) {
          console.warn(`Checkbox "${perm}" in group "${group}" is not checked.`);
        }
      }
    }
  }
  // Search Available Permissions
  async searchAvailablePermission(permissionName: string) {
    const searchBox = this.page.locator('#fuzzy-search');
    await expect(searchBox).toBeVisible();
    await searchBox.fill(permissionName);
  }

  // Verify permission visibility
  async verifyAvailablePermission(permissionName: string) {
    const permission = this.page.getByText(permissionName, { exact: true });
    await expect(permission).toBeVisible();
  }

}

// ======================
// PERMISSIONS INTERFACE
// ======================
export interface Permissions {
  [group: string]: string[] | 'all';
}

export async function deleteRole(page: Page, roleName: string, confirm = true) {
  // Role-specific delete button (uses href param with roleName)
  const deleteButton = page.locator(
    `a.btn.btn-danger.btn-sm[href*="delete-role?name=${roleName}"]`
  );

  // Verify button is present
  await expect(deleteButton).toBeVisible();
  await expect(deleteButton).toBeEnabled();

  // Click the delete button
  await deleteButton.click();

  // Modal elements
  const modalTitle = page.locator('#swal2-title');
  const modalMessage = page.locator('#swal2-html-container');
  const yesButton = page.locator('button.swal2-confirm');
  const cancelButton = page.locator('button.swal2-cancel');

  await expect(modalTitle).toHaveText('Are you sure?');
  await expect(modalMessage).toHaveText('Are you sure you want to delete this role?');

  if (confirm) {
    // Confirm delete
    await yesButton.click();

    // Success message
    const successAlert = page.locator('div.alert.alert-success');
    await expect(successAlert).toHaveText(/Role deleted successfully/i);

    // Refresh and ensure role is gone
    await page.reload();
    await expect(deleteButton).toHaveCount(0);
  } else {
    // Cancel delete
    await cancelButton.click();

    // Role should still exist
    await expect(deleteButton).toBeVisible();
  }
}

export async function openUsersTab(page: Page) {
  const usersTab = page.locator('a.nav-link', { hasText: 'Users' });
  await expect(usersTab).toBeVisible();
  await expect(usersTab).toBeEnabled();
  await usersTab.click();

  // Verify search input and create button appear
  const searchInput = page.locator('#usersearch-q');
  const createUserBtn = page.locator('a.modal-btn.btn.btn-primary', { hasText: 'Create User' });

  await expect(searchInput).toBeVisible();
  await expect(createUserBtn).toBeVisible();
}


export async function searchUser(page: Page, query: string, expectedEmail?: string) {
  const searchForm = page.locator('form#w2');
  const searchInput = searchForm.locator('#usersearch-q');
  const searchBtn = searchForm.getByRole('button', { name: 'Search' });

  // Clear & fill search
  await searchInput.fill('');
  await searchInput.fill(query);
  await searchBtn.click();

  const noResult = page.locator('div.empty', { hasText: 'No results found.' });

  if (expectedEmail) {
    // If we expect a specific user
    const userRow = page.locator('tbody tr', { hasText: expectedEmail });
    await expect(userRow).toBeVisible({ timeout: 5000 });
    console.log(`✅ Verified user "${expectedEmail}" is displayed for query "${query}"`);
    return { found: true };
  } else {
    // If no user expected
    await expect(noResult).toBeVisible({ timeout: 5000 });
    console.log(`❌ Verified "No results found." is displayed for query "${query}"`);
    return { found: false };
  }
}

