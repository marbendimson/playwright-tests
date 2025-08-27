import { test, expect } from '@playwright/test';
import { env } from '../../global.env';
import { loginSelectors } from '../../selectors';

test.describe('Login Error Tests', () => {
  test('should show error for invalid credentials @dev @staging @preprod', async ({ page }) => {
    
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, env.invalidUser.username);
    await page.fill(loginSelectors.password, env.invalidUser.password);
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    await expect(page.locator(loginSelectors.error1)).toBeVisible();
  });

  test('should show error for empty username @dev @staging @preprod', async ({ page }) => {
    
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.password, 'somepassword');
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    await expect(page.locator(loginSelectors.erroremptyusername)).toBeVisible();
  });

  test('should show error for empty password @dev @staging @preprod', async ({ page }) => {
  
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, 'someuser');
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    await expect(page.locator(loginSelectors.erroremptypass)).toBeVisible();
  });

  test.skip('should show error for empty form @dev @staging @preprod', async ({ page }) => {
   
    await page.goto(env.baseURL + '/login');
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    //await expect(page.locator(loginSelectors.error)).toBeVisible();
  });

  test.skip('should show error for wrong username format @dev @staging @preprod', async ({ page }) => {
    
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, 'invalid@email');
    await page.fill(loginSelectors.password, 'somepassword');
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    //await expect(page.locator(loginSelectors.error)).toBeVisible();
  });

  test.skip('should show error for short password @dev @staging @preprod', async ({ page }) => {
   
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, 'service.provider');
    await page.fill(loginSelectors.password, '123');
    await page.click(loginSelectors.submit);
    await page.waitForTimeout(2000); // 2-second delay
    //await expect(page.locator(loginSelectors.error)).toBeVisible();
  });
});