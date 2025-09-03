import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { DeleteModal,CataloguePage,VmTemplatePage } from '../../Import';

test.describe('Verify Virtual Machine Template page', () => {
  test('should be able to successfully display Template page from Catalogue dropdown  @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
   await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });


    const catalogue = new CataloguePage(page);
const templatePage = new VmTemplatePage(page);
const deleteModal = new DeleteModal(page);

await catalogue.goToTemplatesPage();

// Wait for table to render
await page.locator('table tbody tr td a').first().waitFor({ state: 'visible', timeout: 10000 });

// Get all template links
const allTemplates = await page.locator('table tbody tr td a').allInnerTexts();

// Find the first template that includes your stable part of the name
const templateName = allTemplates.find(t => t.includes('AutoVM-001'));
if (!templateName) {
  console.log('All templates found:', allTemplates);
  throw new Error('No template matching "AutoVM-001" found.');
}

// Proceed with delete
const matchingTemplateLink = page.locator('table tbody tr td a', { hasText: templateName }).first();
await matchingTemplateLink.scrollIntoViewIfNeeded();
await templatePage.viewTemplate(templateName);
await templatePage.openDeleteModal(templateName);
await deleteModal.expectVisible(templateName);
await deleteModal.confirmDelete(templateName, false);

// Verify deletion
const deletedRow = page.locator('table tbody tr td a', { hasText: templateName });
await expect(deletedRow).toHaveCount(0, { timeout: 10000 });

  const successAlert = page.locator('div.alert.alert-success', { hasText: 'Virtual Machine template deleted successfully' });
await expect(successAlert).toBeVisible();


    });
 });