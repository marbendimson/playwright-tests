import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';


test.describe('Verify Vlan Start field ', () => {
  test('Should successfully display by default the 11100 in the field', async ({ page }) => {
    const user = getUserByRole('Service Provider');

    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
     await page.click(loginSelectors.submit);
     await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 45000 });

  const settingsLink = page.locator('a.nav-link.menu-link[href="#Settings"]');
  await expect(settingsLink).toBeVisible();
  await expect(settingsLink).toBeEnabled();
  await settingsLink.click();
  await expect(page.locator('#Settings')).toBeVisible();

  const globalConfig = page.locator('span[data-key="t-Global Configurations"]');
  await expect(globalConfig).toBeVisible();
  await globalConfig.click();

  const InfrastructureTab = page.locator('a.nav-link', { hasText: 'Infrastructure Settings' });
await expect(InfrastructureTab).toBeVisible();
await expect(InfrastructureTab).toBeEnabled();
await InfrastructureTab.click();

const vlanNameLabel = page.locator('label',{hasText:'VLAN Starting Range'});
  await expect(vlanNameLabel).toBeVisible();
const vlanDescription = page.locator('p.text-muted', { hasText: ' Starting range for VLAN/VXLAN allocation' });
  await expect(vlanDescription).toBeVisible();


  const VlanInput = page.locator('input[name="Setting[vlan_start]"]');
  await expect(VlanInput).toBeVisible();
  await expect(VlanInput).toBeEnabled();
 await VlanInput.click();
  await VlanInput.fill('19000');


 await page.getByRole('button', { name: 'Save' }).click();

   // ✅ Verify success alert is visible
  const successAlert = page.locator('.alert-success', { hasText: 'Settings Saved!' });
  await expect(successAlert).toBeVisible()

  const vlancell=page.locator('td.text-white',{hasText:'19000'});
  await expect(vlancell).toBeVisible();

  await page.reload();

 await expect(vlancell).toBeVisible({timeout:5000});


  });


});