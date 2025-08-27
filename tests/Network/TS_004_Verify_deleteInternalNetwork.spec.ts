import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import { verifyInternalNetworkPage } from '../../network_internal';
import{DeleteInternalNetworkModal} from '../../createInternal'

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

    const deleteModal = new DeleteInternalNetworkModal(page);
  await deleteModal.deleteNetwork('Updated My Network', true);

  });
});
