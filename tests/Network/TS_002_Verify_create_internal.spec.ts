import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';
import{CreateInternalNetwork} from '../../createInternal'

test.describe('Internal Networks Page', () => {
  test('should login and display Internal Networks page', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

     await page.waitForLoadState('networkidle');
    const networkingSpan = page.locator('span[data-key="t-networking"]');
    await expect(networkingSpan).toBeVisible();
    await networkingSpan.click();

    const internalNetworksSpan = page.locator('span[data-key="t-Internal Networks"]');
    await expect(internalNetworksSpan).toBeVisible();
    await internalNetworksSpan.click();


    // Call your reusable verification function
    await verifyInternalNetworkPage(page);

    // Open the modal
  await page.locator('a.btn.btn-primary.modal-btn', { hasText: 'Create Internal Network' }).click();

  const formPage = new CreateInternalNetwork(page);
  await formPage.expectModalVisible();

  // Submit empty form to trigger validation errors
  await formPage.submitForm();

  // Check validation messages for empty required fields
  await expect(page.locator('text=Name cannot be blank.')).toBeVisible();
  await expect(page.locator('text=Tenant cannot be blank.')).toBeVisible();
  await expect(page.locator('text=Data Center cannot be blank.')).toBeVisible();
  await expect(page.locator('text=Virtual Data Centers cannot be blank.')).toBeVisible();

  // Now fill the form with valid data
  await formPage.fillForm({
    name: 'My Network',
    tenant: 'TenantCreate',
    dataCenter: 'DC',
    virtualDataCenters: ['VDC Autotest'], // example selections
    subnet: 'test',
    gateway: 'sample auto',
  });

  // Submit the form again
  await formPage.submitForm();
   await verifyInternalNetworkPage(page);
  await expect(page.getByRole('cell', { name: 'My Network', exact: true })).toBeVisible();
  await page.reload();
  await verifyInternalNetworkPage(page);
  await expect(page.getByRole('cell', { name: 'My Network', exact: true })).toBeVisible();


  });
});
