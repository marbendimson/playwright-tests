import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { CataloguePage,VmTemplateImportPage } from '../../Import';

test.describe('Verify Virtual Machine Template page', () => {
  test('should be able to successfully display Template page from Catalogue dropdown  @dev @staging @preprod', async ({ page }) => {
    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    await expect(page.locator(loginSelectors.success)).toBeVisible();

    const templateName = 'AutoVM-001';
  const dataCenter = 'MainDC';

     const cataloguePage = new CataloguePage(page);
    const vmTemplateImportPage = new VmTemplateImportPage(page);

   await cataloguePage.goToTemplatesPage();

    await vmTemplateImportPage.openImport();
    await vmTemplateImportPage.selectDataCenter(dataCenter);
    await vmTemplateImportPage.chooseVmTemplate(templateName);
    await vmTemplateImportPage.assign({isPublic:true});
    await vmTemplateImportPage.importTemplate();

  
const templateRow = page.locator('table tbody tr', {
      has: page.locator('a', { hasText: new RegExp(templateName, 'i') }),
    });
await expect(templateRow).toBeVisible();

await expect(templateRow.locator('td').nth(2)).toHaveText('Yes');

await expect(templateRow.locator('td').nth(4)).toHaveText('-');

    
    });
 });