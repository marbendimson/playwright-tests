import { expect, Page } from '@playwright/test';

// export async function verifyInternalNetworkPage(page: Page) {
//   // Verify the main header
//   await expect(page.locator('h4.card-title.mb-0.flex-grow-1', { hasText: 'Internal Networks' })).toBeVisible();

//   // Verify the "Create Internal Network" button
//   await expect(page.locator('a.btn-primary.modal-btn', { hasText: 'Create Internal Network' })).toBeVisible();

//   // Verify the search input box by placeholder or id
//   await expect(page.locator('input#datacentervnetsearch-query')).toBeVisible();

//   // Optionally verify the search button
//   await expect(page.locator('button.createTask', { hasText: 'Search' })).toBeVisible();
// }



export async function verifyInternalNetworkPage(page: Page, searchTerm?: string) {
  // Verify main page elements
  await expect(page.locator('h4.card-title.mb-0.flex-grow-1', { hasText: 'Internal Networks' })).toBeVisible();
  await expect(page.locator('a.btn-primary.modal-btn', { hasText: 'Create Internal Network' })).toBeVisible();
  await expect(page.locator('input#datacentervnetsearch-query')).toBeVisible();
  await expect(page.locator('button.createTask', { hasText: 'Search' })).toBeVisible();

  if (searchTerm) {
    await page.fill('#datacentervnetsearch-query', searchTerm);
    await page.click('button.createTask');

    const resultRows = page.locator('table tr', { hasText: searchTerm });
    const noResults = page.locator('div.empty', { hasText: 'No results found.' });

    // Wait for either first matching row or no-results message
    await Promise.race([
      resultRows.first().waitFor({ state: 'visible', timeout: 5000 }),
      noResults.waitFor({ state: 'visible', timeout: 5000 }),
    ]);

    if (await resultRows.count() > 0) {
      // Assert that at least one row is visible
      await expect(resultRows.first()).toBeVisible();
    } else {
      await expect(noResults).toBeVisible();
    }
  }
}


