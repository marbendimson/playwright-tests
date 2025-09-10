import { Page, expect, Locator } from '@playwright/test';

export class UserPage {
  readonly page: Page;
  readonly createUserBtn: Locator;
  readonly modalTitle: Locator;
  readonly usernameField: Locator;
  readonly emailField: Locator;
  readonly passwordField: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly roleDropdown: Locator;
  readonly saveBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createUserBtn = page.locator('a[data-modal-url="/user/create"]');
    this.modalTitle = page.locator('.modal-title', { hasText: 'Create User' });
    this.usernameField = page.locator('#user-username');
    this.emailField = page.locator('#user-email');
    this.passwordField = page.locator('#user-password');
    this.firstNameField = page.locator('#userprofile-first_name');
    this.lastNameField = page.locator('#userprofile-last_name');
    this.roleDropdown = page.locator('.select2-selection.select2-selection--single[role="combobox"]');
    this.saveBtn = page.locator('#submitBtn');
  }

  // Open the "Create User" modal
  async openCreateUserModal() {
    await expect(this.createUserBtn).toBeVisible();
    await this.createUserBtn.click();
    await expect(this.modalTitle).toBeVisible();
  }

  // Verify all form fields are visible
  async verifyFormFieldsVisible() {
    await expect(this.usernameField).toBeVisible();
    await expect(this.emailField).toBeVisible();
    await expect(this.passwordField).toBeVisible();
    await expect(this.firstNameField).toBeVisible();
    await expect(this.lastNameField).toBeVisible();
    
    // Ensure the Select2 role dropdown is expanded and visible
    await this.roleDropdown.click();  // Open the dropdown

    // Wait for the options list to appear and be visible
    await this.page.locator('.select2-results__options').waitFor({ state: 'visible' });
    
    await expect(this.roleDropdown).toBeVisible();
    await expect(this.saveBtn).toBeVisible();
    await expect(this.saveBtn).toBeEnabled();
  }

  // Fill the "Create User" form with user data
  async fillCreateUserForm(user: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: string;
  }) {
    await this.usernameField.fill(user.username);
    await this.emailField.fill(user.email);
    await this.passwordField.fill(user.password);

    if (user.firstName) {
      await this.firstNameField.fill(user.firstName);
    }
    if (user.lastName) {
      await this.lastNameField.fill(user.lastName);
    }

    // Open the role dropdown and wait for the options to be visible
    await this.roleDropdown.click();
    await this.page.locator('.select2-results__options[role="listbox"]').waitFor({ state: 'visible' });
    const roleOption = await this.page.locator(`.select2-results__option:has-text("${user.role}")`);
    await roleOption.click();  // Click the role option based on the role text
  }

  // Save the user
  async saveUser() {
    await expect(this.saveBtn).toBeEnabled();
    await this.saveBtn.click();
  }
}
