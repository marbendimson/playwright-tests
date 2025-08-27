import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Verify Virtual Machine Template page', () => {
  test('should be able to successfully display Template page from Catalogue dropdown  @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
   await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

    const CatalogueNav = page.locator('span:has-text("Catalogue")');
  await expect(CatalogueNav).toBeVisible();
  await expect(CatalogueNav).toBeEnabled();

  // Click 'Tenant' menu link
  await CatalogueNav.click();

  const templateNav = page.getByRole('link', { name: 'Templates' });
  await expect(templateNav).toBeVisible();
  await templateNav.click();

    await expect(page.getByRole('heading', { level: 4, name: 'Virtual Machine Templates' })).toBeVisible();

    const importVmTemplateButton = page.getByRole('link', { name: 'Import VM Template from Proxmox' });
    await expect(importVmTemplateButton).toBeVisible();
    await importVmTemplateButton.click();

   await expect(page.getByRole('heading', { level: 4, name: 'VM Template Import ' })).toBeVisible();

   await page.waitForSelector('#isosync-form-pjax');

  // Select2 dropdown field for Data Center
const dataCenterDropdown = page.locator('[aria-labelledby="select2-virtualmachinecataloguesyncform-data_center_id-container"]');

// OPTIONAL: Define a variable if you want to conditionally control whether to fill or leave blank
const shouldSelectDataCenter = true; // <- Set to true if you want to select 'MainDC'

if (shouldSelectDataCenter) {
  // Click the dropdown to activate the options
  await dataCenterDropdown.click();
  // Wait for and select 'MainDC' option
  const mainDCOption = page.locator('.select2-results__option', { hasText: /^DC$/ });
  await expect(mainDCOption).toBeVisible();
  await mainDCOption.click();
  // Confirm selection registered (optional but good practice)
  await expect(
    page.locator('#select2-virtualmachinecataloguesyncform-data_center_id-container')
  ).toHaveText('DC');
} else {
  // Skipping selection to test validation
  console.log('Skipping data center selection to test validation error...');
}
// Click "Next Step"
await page.click('#data-center-submit');
await expect(page.locator('h5.mb-1', { hasText: 'VM Templates' })).toBeVisible();

const search = page.locator('input.search-input');
await expect(search).toBeVisible();
await expect(search).toBeEnabled();
//await search.fill('testVM');
// Select the first VM template button
const vmOption = page.getByRole('button', { name: /^\[\d+\]/ }).first();
await expect(vmOption).toBeVisible({ timeout: 10000 });
await vmOption.click();


await page.locator('#vm-selection-submit').click();

await expect(page.locator('h5.mb-1', { hasText: 'Virtual Data Center' })).toBeVisible();
await expect(page.locator('#virtualmachinecataloguesyncform-is_public')).toBeVisible();
//Is public 
await page.locator('#virtualmachinecataloguesyncform-is_public').uncheck();
await expect(page.locator('#select2-virtualmachinecataloguesyncform-company_id-container')).toBeVisible();
// Click the visible Select2 dropdown
await page.locator('#select2-virtualmachinecataloguesyncform-company_id-container').click();
// Wait for the dropdown options to appear and click the one you want
await page.locator('.select2-results__option', { hasText: 'TenantCreate' }).click();
await expect(page.locator('#select2-virtualmachinecataloguesyncform-virtual_data_center_id-container')).toBeVisible();
await page.locator('#select2-virtualmachinecataloguesyncform-virtual_data_center_id-container').click

await page.locator('#select2-virtualmachinecataloguesyncform-virtual_data_center_id-container').click();
const vdcOption = page.locator('li.select2-results__option', { hasText: 'VDC Autotest' });
await expect(vdcOption).toBeVisible();  // Add this line to ensure it's visible before clicking
await vdcOption.click();
//import template
await page.getByRole('button', { name: 'Import VM Templates' }).click();

await expect(page.locator('div.alert-success')).toHaveText(/VM Template imported successfully/);

// If no selection was made, validate that the warning message appears
if (!shouldSelectDataCenter) {
  await expect(
    page.locator('p.help-block', { hasText: 'Data Center is required' })
  ).toBeVisible();
} else {
  // Otherwise, make sure no validation error appears
  await expect(
    page.locator('p.help-block', { hasText: 'Data Center is required' })
  ).toHaveCount(0);
}



    });
 });