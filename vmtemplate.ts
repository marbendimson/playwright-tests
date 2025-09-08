import { Page, expect } from '@playwright/test';

/**
 * Step 0: Navigate to VDC and open "New VM from Template"
 */
export async function navigateToVDC(page: Page, vdcName: string) {
  const vdcNav = page.locator('a.nav-link.menu-link:has(span[data-key="t-Virtual Data Centers"])');
  await expect(vdcNav).toBeVisible({ timeout: 10000 });
  await vdcNav.scrollIntoViewIfNeeded();
  await vdcNav.click();

  await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

  const vdcLink = page.locator(`a:has-text("${vdcName}")`).first();
  await vdcLink.waitFor({ state: 'visible', timeout: 60000 });
  await vdcLink.scrollIntoViewIfNeeded();
  await vdcLink.click();

  const newVmBtn = page.locator('button:has-text("New Virtual Machine")');
  await newVmBtn.waitFor({ state: 'visible', timeout: 30000 });
  await newVmBtn.click();

  const fromTemplateLink = page.locator('a:has-text("From Template")');
  await fromTemplateLink.waitFor({ state: 'visible', timeout: 30000 });
  await fromTemplateLink.click();
}

/**
 * Step 1: General Configuration
 */
export async function fillGeneralConfig(page: Page, vmName: string, osType: 'windows' | 'linux' | 'unix' | 'other') {
  await expect(page.locator('h5:has-text("General Configuration")')).toBeVisible();

  await page.fill('input[name="VMCloneForm[name]"]', vmName);

  const osLabelSelector = `label[for="os_family${osType}"]`;
  const osLabel = page.locator(osLabelSelector);
  await expect(osLabel).toBeVisible();
  await osLabel.click();

  const nextButton = page.locator('button[data-nexttab="steparrow-template-tab"]');
  await expect(nextButton).toBeVisible();
  await nextButton.click();
}

/**
 * Step 2: Template Selection
 */
export async function selectTemplate(page: Page, templateName: string) {
  // Wait for the table container to render
  const tableContainer = page.locator('#template-container');
  await expect(tableContainer).toBeVisible({ timeout: 15000 });

  // Locate the row containing the template name
  const templateRow = page.locator(`table tbody tr:has(td:text("${templateName}"))`).first();

  // Scroll and click
  await templateRow.scrollIntoViewIfNeeded();
  await templateRow.click({ timeout: 10000 });

  // Wait until the "Next Step" button is enabled (indicates template selected)
  const nextButton = page.locator('button[data-nexttab="steparrow-system-tab"]');
  await expect(nextButton).toBeEnabled({ timeout: 10000 });
  await nextButton.click();

  // Wait for System Setup section
  await expect(page.locator('h5:has-text("System Setup")')).toBeVisible({ timeout: 15000 });
}



/**
 * Step 3: System Setup
 */
export async function configureSystemSetup(
  page: Page,
  storagePolicyValue?: string,
  // cloudInit?: { username?: string; password?: string; sshKeys?: string }
) {
  await expect(page.locator('h5:has-text("System Setup")')).toBeVisible();

  const storagePolicySelect = page.locator('#vmcloneform-storage_policy_id');
  await expect(storagePolicySelect).toBeEnabled();

  if (storagePolicyValue) {
    await storagePolicySelect.selectOption(storagePolicyValue);
  } else {
    const options = await storagePolicySelect.locator('option').all();
    for (const option of options) {
      const value = await option.getAttribute('value');
      if (value && value.trim() !== '') {
        await storagePolicySelect.selectOption(value);
        break;
      }
    }
  }

  // Optional: fill Cloud Init (currently commented out)
  /*
  const cloudInitSection = page.locator('#cloud-init-settings');
  if (await cloudInitSection.isVisible() && cloudInit) {
    if (cloudInit.username) await page.fill('#vmcloneform-ciuser', cloudInit.username);
    if (cloudInit.password) await page.fill('#vmcloneform-cipassword', cloudInit.password);
    if (cloudInit.sshKeys) await page.fill('#vmcloneform-sshkeys', cloudInit.sshKeys);
  }
  */

  const createBtn = page.locator('#submitBtn');
  await expect(createBtn).toBeVisible();
  await createBtn.click();

  await page.waitForSelector('.alert-success', { timeout: 20000 }).catch(() => {});
}

/**
 * Full end-to-end VM creation from template
 */
export async function createVMFromTemplate(
  page: Page,
  vdcName: string,
  vmName: string,
  osType: 'windows' | 'linux' | 'unix' | 'other',
  templateName: string,
  storagePolicyValue?: string
  // cloudInit?: { username?: string; password?: string; sshKeys?: string }
) {
  await navigateToVDC(page, vdcName);
  await fillGeneralConfig(page, vmName, osType);
  await selectTemplate(page, templateName);
  await configureSystemSetup(page, storagePolicyValue /*, cloudInit */);
}

