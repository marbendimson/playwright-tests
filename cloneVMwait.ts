import { expect, Page } from '@playwright/test';

export async function waitForClonedVm(page: Page, vmName: string, timeout = 60000) {
  const clonedVmLink = page.locator('h2 a', { hasText: vmName });

  // Use Playwright’s built-in auto-retry
  await expect(clonedVmLink).toBeVisible({ timeout });
}



