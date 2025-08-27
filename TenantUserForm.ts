import { Page, Locator } from '@playwright/test';

export class TenantUserFormPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly usernameInput: Locator;
  readonly roleDropdown: Locator;
  readonly saveButton: Locator;
  readonly successAlert: Locator;
  readonly password: Locator;
  readonly confirmpassword : Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('#tenantform-first_name');
    this.lastNameInput = page.locator('#tenantform-last_name');
    this.emailInput = page.locator('#tenantform-email');
    this.usernameInput = page.locator('#tenantform-username');
    this.roleDropdown = page.locator('#select2-tenantform-role-container');
    this.password = page.locator('#tenantform-password');
    this.confirmpassword = page.locator('#tenantform-confirmpassword');
    this.saveButton = page.locator('#submitBtn');
    this.successAlert = page.locator('.alert-success');
  }

  async fillForm({ firstName, lastName, email, username, role,confirmpass, pass }: {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    role: string,
    pass: string,
    confirmpass: string
  }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.usernameInput.fill(username);
    await this.roleDropdown.click();
    await this.password.fill(pass);
    await this.confirmpassword.fill(confirmpass);
    await this.page
  .getByRole('option', { name: role, exact: true }) // ensures exact text match
  .click();

  }

  async submitForm() {
    await this.saveButton.click();
  }

  async expectSuccessMessage() {
    await this.successAlert.waitFor({ state: 'visible' });
  }
}

export class EditTenantUser_Form {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly usernameInput: Locator;
  readonly roleDropdown: Locator;
  readonly saveButton: Locator;
  readonly successAlert: Locator;
  readonly statusDropdown: Locator;

  //readonly password: Locator;
  //readonly confirmpassword : Locator;

  constructor(page: Page) {
    this.page = page;
    this.statusDropdown = page.locator('#user-status');
    this.firstNameInput = page.locator('#userprofile-first_name');
    this.lastNameInput = page.locator('#userprofile-last_name');
    this.emailInput = page.locator('#user-email');
    this.usernameInput = page.locator('#user-username');
    this.roleDropdown = page.locator('#select2-user-role-container');
    //this.password = page.locator('#resellerform-password');
    //this.confirmpassword = page.locator('#resellerform-confirmpassword');
    this.saveButton = page.locator('#submitBtn');
    this.successAlert = page.locator('.alert-success');
  }

  async fillForm({ firstName, lastName, email, username, role, status}: {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    role: string,
    status: 'Active'| 'Inactive'
   // pass: string,
    //confirmpass: string
  }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.usernameInput.fill(username);
    await this.roleDropdown.click();
    await this.page.getByRole('option', { name: role, exact: true }).click();
    //await this.password.fill(pass);
    //await this.confirmpassword.fill(confirmpass);
    


  await this.statusDropdown.selectOption(status ==='Active'?'10' :'9');

  }

  async submitForm() {
    await this.saveButton.click();
  }

  async expectSuccessMessage() {
    await this.successAlert.waitFor({ state: 'visible' });
  }
}
