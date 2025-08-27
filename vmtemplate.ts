import { Page, expect } from '@playwright/test';

// --- Function Definitions First ---

export async function loginAsServiceProvider(page: Page, baseUrl: string, username: string, password: string) {
  await page.goto(baseUrl + '/login');
  await page.fill('#loginform-username', username);
  await page.fill('#loginform-password', password);
  await page.click('button[type="submit"]');
  await expect(page.locator('span:has-text("Virtual Data Centers")')).toBeVisible();
}
export async function navigateToVDC(page: Page, vdcName: string) {
  // Go to Virtual Data Centers menu
  await page.click('span:has-text("Virtual Data Centers")');
  
  // Wait until page heading appears
  await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();

  // Click only the link that matches the VDC name
  await page.locator(`a:has-text("${vdcName}")`).first().click();

  // Create VM flow
  const newVmBtn = page.locator('button:has-text("New Virtual Machine")');
  await newVmBtn.waitFor({ state: 'visible', timeout: 30000 });
  await newVmBtn.click();

const fromTemplateLink = page.locator('a:has-text("From Template")');
await fromTemplateLink.waitFor({ state: 'visible', timeout: 30000 });
await fromTemplateLink.click();

}
// ---------- Step 1: General Configuration ----------
export async function fillGeneralConfig(page: Page, vmName: string, osType: 'windows' | 'linux' | 'unix' | 'other') {
  await expect(page.locator('h5:has-text("General Configuration")')).toBeVisible();

  // Fill VM name
  await page.fill('input[name="VMCloneForm[name]"]', vmName);

  // Select OS type dynamically
  const osLabelSelector = `label[for="os_family${osType}"]`;
  const osLabel = page.locator(osLabelSelector);
  await expect(osLabel).toBeVisible();
  await osLabel.click();


  // Proceed to next section
  const nextButton = page.locator('button[data-nexttab="steparrow-template-tab"]');
  await expect(nextButton).toBeVisible();
  await nextButton.click();
}


// ---------- Step 2: Template Selection ----------
export async function selectTemplate(page: Page, partialTemplateName: string) {
  await expect(page.getByRole('heading', { name: 'Template', exact: true })).toBeVisible();

  // Wait for table rows to be present
  const rows = page.locator('table tbody tr');
  const count = await rows.count();
   expect(count).toBeGreaterThan(0);


  // Find first row containing the partialTemplateName (case-insensitive)
  const matchingRow = rows.filter({
    hasText: new RegExp(partialTemplateName, 'i')
  }).first();

  // Verify the row is visible and enabled
  await expect(matchingRow).toBeVisible();

  // Click the row to select template
  await matchingRow.click();

  // Proceed to next section
  const nextButton = page.locator('button[data-nexttab="steparrow-system-tab"]');
  await expect(nextButton).toBeVisible();
  await nextButton.click();

  // Wait for System Setup section to load
  await expect(page.locator('h5:has-text("System Setup")')).toBeVisible({ timeout: 15000 });
}


//---------- Step 3: System Setup ----------

export async function configureSystemSetup(page: Page, storagePolicyValue?: string) {
  await expect(page.locator('h5:has-text("System Setup")')).toBeVisible();

  const storagePolicySelect = page.locator('#vmcloneform-storage_policy_id');

  // Wait for the dropdown to be enabled
  await expect(storagePolicySelect).toBeEnabled();

  if (storagePolicyValue) {
    // Select by given value
    await storagePolicySelect.selectOption(storagePolicyValue);
  } else {
    // Dynamically select first non-empty option by value
    const options = await storagePolicySelect.locator('option').all();
    for (const option of options) {
      const value = await option.getAttribute('value');
      if (value && value.trim() !== '') {
        await storagePolicySelect.selectOption(value);
        break;
      }
    }
  }

  // Proceed to next step or save
  const nextButton = page.locator('button[type="submit"].btn-success#submitBtn');
  await expect(nextButton).toBeVisible();
  await nextButton.click();
}


