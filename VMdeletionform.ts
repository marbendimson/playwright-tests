import { expect, Page } from '@playwright/test';

export async function deleteVMByNameIfExists(
  page: Page,
  vmName: string,
  confirmDelete = true,
  alsoDeleteProxmoxData = false
) {
  // Wait for the VM table header to ensure the VM list is loaded
  await page.waitForSelector('thead tr th:has-text("Name")', { state: 'visible', timeout: 15000 });

  // Find the first VM row matching the vmName
  const vmRow = page.locator('table tbody tr').filter({
    has: page.locator(`td:has-text("${vmName}")`)
  }).first();

  // Check if VM exists
  if (await vmRow.count() === 0) {
    console.log(`VM "${vmName}" is already deleted or does not exist.`);
    return;
  }

  // Click the delete button to open the confirmation modal
  await vmRow.locator('a.delete-btn').click();

  // Locate the modal by matching the modal title with the VM name
  const modal = page.locator(`div.modal-content:has(h5.modal-title:has-text("Delete: ${vmName}"))`);
  await modal.waitFor({ state: 'visible', timeout: 10000 });

  if (confirmDelete) {
    // Type VM name into the confirmation input
    await modal.locator('#vmdeleteform-name').fill(vmName);

    // Check "Also delete data from Proxmox" if requested
    if (alsoDeleteProxmoxData) {
      const checkbox = modal.locator('#vmdeleteform-include_proxmox');
      if (!(await checkbox.isChecked())) {
        await checkbox.check();
      }
    }

    // Click the Delete button
    await modal.locator('button.btn-danger').click();

    // Wait for modal to close
    await modal.waitFor({ state: 'detached', timeout: 10000 });

    // Verify the VM row is removed from the list
    await expect(vmRow).toHaveCount(0, { timeout: 15000 });

    console.log(`VM "${vmName}" deleted successfully.`);
  } else {
    // Cancel deletion by clicking Cancel button
    await modal.locator('button.btn-secondary').click();

    // Wait for modal to close
    await modal.waitFor({ state: 'detached', timeout: 10000 });

    console.log(`Deletion cancelled for VM "${vmName}".`);
  }
}
