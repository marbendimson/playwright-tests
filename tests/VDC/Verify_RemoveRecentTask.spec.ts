import { test, expect } from '@playwright/test';
import { env, getUserByRole } from '../../global.env';
import { loginSelectors } from '../../selectors';
import{ensureRecentTasksVisible,viewAndCloseCompletedTask,verifyAndRemoveCompletedTask} from '../../recentTask';

test.describe('Login Success Tests', () => {
  test('should login successfully with Service Provider @dev @staging @preprod', async ({ page }) => {
  

    const user = getUserByRole('Service Provider');
    await page.goto(env.baseURL + '/login');
    await page.fill(loginSelectors.username, user.username);
    await page.fill(loginSelectors.password, user.password);
    await page.click(loginSelectors.submit);
    // await page.waitForTimeout(2000); // 2-second delay
    // await expect(page.locator(loginSelectors.success)).toBeVisible();
await page.waitForLoadState('networkidle');
    await expect(page.locator(loginSelectors.success)).toBeVisible({ timeout: 15000 });

   
   await ensureRecentTasksVisible(page);
    // close recent view  task modal 
   await viewAndCloseCompletedTask(page, 'Virtual Machine Creation');
    
   await verifyAndRemoveCompletedTask(page,'Virtual Machine Creation',true);

  });
 });