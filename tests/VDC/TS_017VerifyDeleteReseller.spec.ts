import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
  

    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    //await expect(page.locator(loginSelectors.success)).toBeVisible();

     await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });
    const resellersNav = page.locator('span[data-key="t-Resellers"]');
  await expect(resellersNav).toBeVisible();
  await expect(resellersNav).toBeEnabled();

  // Click 'Resellers' menu link
  await resellersNav.click();

    // Wait for and click the SVG icon
  //const svgIcon = page.locator('svg');
  //await expect(svgIcon).toBeVisible();
  //await expect(svgIcon).toBeEnabled();
  //await svgIcon.click();

  const svgIcon = page.locator('a', { hasText: 'QA_testingCreate' }); // Adjust selector if needed
  await expect(svgIcon).toBeVisible();
  await expect(svgIcon).toBeEnabled();
  await svgIcon.click();

  // Wait for the "UpdateQAreselltest" header
  const header = page.locator('h4', { hasText: 'QA_testingCreate' });
  await expect(header).toHaveText(/QA_testingCreate/i);

  await page.reload()

  const detailsHeader = page.locator('h4', { hasText: 'Details' });
  await expect(detailsHeader).toBeVisible();

  await page.waitForLoadState('networkidle');
//await expect(page.locator('table')).toBeVisible();

await page.reload()

  // ✅ Verify and click Delete button
  const deleteButton = page.locator('a.btn-danger', { hasText: 'Delete' });
  await expect(deleteButton).toBeVisible();
  await expect(deleteButton).toBeEnabled();
  await deleteButton.click();
  
   const confirmModal = page.locator('.swal2-popup', { hasText: 'Are you sure you want to delete this item?' });
  await expect(confirmModal).toBeVisible();

   //cancel deleting of reseller
  const cancelButton = page.locator('button.swal2-cancel', { hasText: 'Cancel' });
await expect(cancelButton).toBeVisible();
await cancelButton.click();

await page.reload()

await deleteButton.click();
await expect(confirmModal).toBeVisible();

  const yesButton = page.locator('button.swal2-confirm', { hasText: 'Yes' });
  await expect(yesButton).toBeVisible();
  await expect(yesButton).toBeEnabled();
  await yesButton.click();

  // ✅ Verify success message
  const successAlert = page.locator('div.alert-success', {
  hasText: 'Reseller Successfully Deleted.'
});
await expect(successAlert).toBeVisible();


   });
  });