import { Page, expect } from '@playwright/test';

// --- Function Definitions First ---

export async function loginAsServiceProvider(page: Page, baseUrl: string, username: string, password: string) {
  await page.goto(baseUrl + '/login');
  await page.fill('#loginform-username', username);
  await page.fill('#loginform-password', password);
  await page.click('button[type="submit"]');
  await expect(page.locator('span:has-text("Virtual Data Centers")')).toBeVisible();
}

// export async function navigateToVDC(page: Page, vdcName: string) {
//   await page.click('span:has-text("Virtual Data Centers")');
//   await expect(page.getByRole('heading', { name: 'Virtual Data Center' })).toBeVisible();
//   await page.getByText(new RegExp(`^${vdcName}$`, 'i')).click();
//   await page.click('button:has-text("New Virtual Machine")');
//   await page.click('a:has-text("New Virtual Machine")');
// }
export async function navigateToVDC(page: Page, vdcName: string) {
  // Step 1: Open the Virtual Data Centers menu
  await page.click('li:has(span:has-text("Virtual Data Centers"))');

  // Step 2: Wait for heading that confirms navigation
  await expect(
    page.getByRole('heading', { name: 'Virtual Data Center' })
  ).toBeVisible({ timeout: 15000 });

 // Wait for at least one row in the table
await expect(page.locator('table tbody tr')).not.toHaveCount(0, { timeout: 15000 });


  // Step 4: Find and click the VDC link
  const vdcLink = page.locator(`a:has-text("${vdcName}")`).first();
  await expect(vdcLink).toBeVisible({ timeout: 20000 });
  await vdcLink.scrollIntoViewIfNeeded();
  await vdcLink.click();

  // Step 5: Wait for the New VM button to be ready
  const newVMButton = page.locator('button:has-text("New Virtual Machine")');
  await expect(newVMButton).toBeVisible({ timeout: 10000 });

  // Step 6: Click to start Create VM flow
  await newVMButton.click();

  // Step 7: Ensure the "New Virtual Machine" option in the dropdown is ready before clicking
  const newVMOption = page.locator('a:has-text("New Virtual Machine")');
  await expect(newVMOption).toBeVisible({ timeout: 10000 });
  await newVMOption.click();
}


export async function fillBasicInfo(page: Page, vmName: string, osType: string, osVersion: string) {
  await page.fill('#gen-info-input', vmName);
  const osTypes = ['linux', 'windows', 'unix', 'other'];
  const osPriorityList = [osType, ...osTypes.filter(x => x !== osType)];
  for (const os of osPriorityList) {
    const label = page.locator(`label[for="os_family${os}"]`);
    const radio = page.locator(`input#os_family${os}`);
    if ((await label.isVisible().catch(() => false)) && (await radio.isEnabled().catch(() => false))) {
      await label.click();
      break;
    }
  }
  const osVersionDropdown = page.locator('#virtualmachine-ostype');
  await expect(osVersionDropdown).toBeVisible();
  try {
    await osVersionDropdown.selectOption(osVersion);
  } catch {
    console.warn(`⚠️ OS version '${osVersion}' not found. Skipping...`);
  }
  await page.click('button:has-text("Next")');
}

export async function configureSystemSettings(
  page: Page,
  biosType: string,
  addEfiDisk?: boolean,
  preEnrollKeys?: boolean,
  qemuGuestAgent?: boolean,
  addTpm?: boolean,
  tpmVersion?: string
) {
  const bioSelect = page.locator('#virtualmachine-bios');
  await expect(bioSelect).toBeVisible();
  await bioSelect.selectOption(biosType === 'seabios' ? 'seabios' : 'ovmf');
  await page.waitForTimeout(300);

  const toggleCheckbox = async (id: string, shouldEnable: boolean | undefined) => {
    if (shouldEnable === undefined) return;
    const checkbox = page.locator(`#${id}`);
    if (await checkbox.isVisible()) {
      const isChecked = await checkbox.isChecked();
      if (shouldEnable && !isChecked) await checkbox.check();
      if (!shouldEnable && isChecked) await checkbox.uncheck();
    }
  };

  await toggleCheckbox('virtualmachine-efi_disk', addEfiDisk);
  await toggleCheckbox('virtualmachine-pre_enroll_keys', preEnrollKeys);
  await toggleCheckbox('virtualmachine-agent', qemuGuestAgent);
  await toggleCheckbox('virtualmachine-tpm', addTpm);

  if (addTpm && tpmVersion) {
    const tpmVersionDropdown = page.locator('#virtualmachine-tpm_version');
    await expect(tpmVersionDropdown).toBeVisible();
    await tpmVersionDropdown.selectOption(tpmVersion);
  }

  const nextButton = page.locator('button[data-nexttab="steparrow-hardware-settings-tab"]');
  await expect(nextButton).toBeVisible();
  await nextButton.click();
}

export async function configureHardware(page: Page, options: {
  sockets: number;
  cores: number;
  memory: number;
  cpuVendor: 'GenuineIntel' | 'AuthenticAMD' | 'default';
  cpuType: string;
}) {
  await page.fill('#virtualmachine-sockets', options.sockets.toString());
  await page.fill('#virtualmachine-cores', options.cores.toString());
//   const vendorId = `#cpu_vendor${options.cpuVendor}`;
//   const vendorRadio = page.locator(vendorId);
//   await vendorRadio.scrollIntoViewIfNeeded();
//   await expect(vendorRadio).toBeVisible();
//   await vendorRadio.check();
  const label = page.locator(`label[for="cpu_vendor${options.cpuVendor}"]`);
await label.scrollIntoViewIfNeeded();
await expect(label).toBeVisible();
await label.click();
  await page.selectOption('#cpu-dropdown', options.cpuType);
  await page.fill('#virtualmachine-memory', options.memory.toString());
  await expect(page.locator('#virtualmachine-memory')).toHaveValue(options.memory.toString());
  const nextButton = page.locator('button[data-nexttab="steparrow-storage-configuration-tab"]');
  await nextButton.scrollIntoViewIfNeeded();
  await expect(nextButton).toBeVisible();
  await nextButton.click();
}

export async function configureStorage(page: Page, diskSize: number): Promise<boolean> {
 // const addStorageBtn = page.locator('span.btn-primary', { hasText: 'Add Storage Device' });
  //await addStorageBtn.click();

  const storageRow = page.locator('tr.hardware-storage').last();
  await storageRow.waitFor();

  const diskInput = storageRow.locator('input.disk-size');

  // 🔄 Updated: Wait for disk input to be visible and enabled
  await expect(diskInput).toBeVisible({ timeout: 5000 });
  await expect(diskInput).toBeEnabled();

  await diskInput.fill(diskSize.toString());

  const storagePolicyDropdown = storageRow.locator('select.storage-policy');
  const hasStorageOptions = await storagePolicyDropdown.locator('option').count();

  if (await storagePolicyDropdown.isVisible() && hasStorageOptions > 1) {
    await storagePolicyDropdown.selectOption({ index: 1 }); // Skip "Select Policy"

    //click next 
  const nextButton = page.locator('button[data-nexttab="steparrow-network-configuration-tab"]');
  await nextButton.scrollIntoViewIfNeeded();
  await expect(nextButton).toBeVisible();
  await nextButton.click();
    return true;
    
  } else {
    console.warn('⚠️ Storage policy dropdown not available or empty.');
    await page.click('button:has-text("Cancel")');
    return false;
  }


}


// export async function configureNetwork(
//   page: Page,
//   networkLabel: string,
//   nicModel: string = 'e1000e',
//   firewallEnabled: boolean = true,
//   connectEnabled: boolean = true,
//   preferredVlanId?: number
// ): Promise<boolean> {
//   // Ensure there's at least one network row
//   const networkRows = page.locator('tr.hardware-network');
//   const rowCount = await networkRows.count();

//   if (rowCount === 0) {
//     const addButton = page.locator('span.btn.btn-primary.material-shadow-none', { hasText: 'Add Network Device' });
// await addButton.waitFor({ state: 'visible', timeout: 5000 });
// await addButton.click();
// await expect(page.locator('tr.hardware-network')).toHaveCount(1, { timeout: 3000 });

//   }

//   // Use the first network row (index 0)
//   const row = networkRows.first();

//   // Select network from dropdown by label
//   const networkDropdown = row.locator('select.network-input');
//   await expect(networkDropdown).toBeVisible({ timeout: 2000 });

//   try {
//     await networkDropdown.selectOption({ label: networkLabel });
//   } catch {
//     console.warn(`⚠️ Network "${networkLabel}" not found in dropdown.`);
//   }

//   // Wait and check if VLAN input is visible and enabled
//   const vlanInput = page.locator('input.vlan-input').first(); // Assuming only one input per row
//   if (await vlanInput.isVisible({ timeout: 2000 }) && await vlanInput.isEnabled()) {
//     const vlanRange = await vlanInput.getAttribute('data-vlan-ids');
//     if (vlanRange) {
//       const validVlans = parseVlanIds(vlanRange);
//       const vlanToUse =
//         preferredVlanId && validVlans.includes(preferredVlanId)
//           ? preferredVlanId
//           : validVlans[0];

//       if (vlanToUse !== undefined) {
//         await vlanInput.fill(String(vlanToUse));
//       } else {
//         console.warn(`⚠️ No valid VLAN ID found in range: "${vlanRange}"`);
//       }
//     } else {
//       console.warn('⚠️ VLAN input has no data-vlan-ids attribute.');
//     }
//   } else {
//     console.info('ℹ️ VLAN input not visible or not enabled, skipping.');
//   }

//   // Select NIC model
//   const nicModelDropdown = row.locator('select.nic-model-input');
//   if (await nicModelDropdown.isVisible()) {
//     await nicModelDropdown.selectOption(nicModel);
//   }

//   // Toggle firewall
//   const firewallCheckbox = row.locator('input[type="checkbox"][name*="[firewall]"]');
//   if (await firewallCheckbox.isVisible()) {
//     const isChecked = await firewallCheckbox.isChecked();
//     if (firewallEnabled !== isChecked) {
//       await firewallCheckbox.click();
//     }
//   }

//   // Toggle connected checkbox
//   const connectedCheckbox = row.locator('input[type="checkbox"][name*="[connect]"]');
//   if (await connectedCheckbox.isVisible()) {
//     const isChecked = await connectedCheckbox.isChecked();
//     if (connectEnabled !== isChecked) {
//       await connectedCheckbox.click();
//     }
//   }
//   // Click Next to proceed

//    const nextButton = page.locator('button[data-nexttab="steparrow-discdrive-tab"]');
//   //await nextButton.scrollIntoViewIfNeeded();
//   await expect(nextButton).toBeVisible();
//   await nextButton.click();
    
//   return true;
// }

// // Helper to parse VLAN ranges like "5,10-12" into [5,10,11,12]
// function parseVlanIds(rangeStr: string): number[] {
//   const result: number[] = [];

//   for (const part of rangeStr.split(',')) {
//     if (part.includes('-')) {
//       const [start, end] = part.split('-').map(Number);
//       for (let i = start; i <= end; i++) result.push(i);
//     } else {
//       result.push(Number(part));
//     }
//   }

//   return result.filter(n => !isNaN(n));
// }
export async function configureNetwork(
  page: Page,
  networkLabel: string,
  nicModel: string = 'e1000e',
  firewallEnabled: boolean = true,
  connectEnabled: boolean = true,
  preferredVlanId?: number
): Promise<boolean> {
  const networkRows = page.locator('tr.hardware-network');

  // Helper to detect & handle "No available networks" modal
  async function checkAndHandleNoNetworkModal(): Promise<boolean> {
    const modal = page.locator('#swal2-html-container');
    try {
      await modal.waitFor({ state: 'visible', timeout: 2000 });
      const modalText = await modal.innerText();
      if (modalText.includes('No available External or Internal networks found')) {
        console.warn('⚠️ No network available modal detected.');
        await page.locator('button.swal2-confirm').click();
        const nextButton = page.locator('button[data-nexttab="steparrow-discdrive-tab"]');
        await nextButton.scrollIntoViewIfNeeded();
        await expect(nextButton).toBeVisible();
        await nextButton.click();
        return true; // modal handled, proceed no further network config
      }
    } catch {
      // modal not visible within timeout
    }
    return false; // no modal detected
  }

  // First check modal upfront, maybe modal is already showing
  if (await checkAndHandleNoNetworkModal()) {
    return true;
  }

  if ((await networkRows.count()) === 0) {
    const addButton = page.locator('span.btn.btn-primary.material-shadow-none:has-text("Add Network Device")');
    await addButton.waitFor({ state: 'visible', timeout: 5000 });
    await addButton.click();

    // Check modal again after clicking Add button
    if (await checkAndHandleNoNetworkModal()) {
      return true;
    }

    // Wait for network row after Add button if no modal
    await expect(networkRows).toHaveCount(1, { timeout: 10000 });
  }

  const row = networkRows.first();

  // Select network
  const networkDropdown = row.locator('select.network-input');
  await expect(networkDropdown).toBeVisible({ timeout: 2000 });
  try {
    await networkDropdown.selectOption({ label: networkLabel });
  } catch {
    console.warn(`⚠️ Network "${networkLabel}" not found in dropdown.`);
  }

  // VLAN input
  const vlanInput = page.locator('input.vlan-input').first();
  if (await vlanInput.isVisible() && await vlanInput.isEnabled()) {
    const vlanRange = await vlanInput.getAttribute('data-vlan-ids');
    if (vlanRange) {
      const validVlans = parseVlanIds(vlanRange);
      const vlanToUse = preferredVlanId && validVlans.includes(preferredVlanId)
        ? preferredVlanId
        : validVlans[0];
      if (vlanToUse !== undefined) {
        await vlanInput.fill(String(vlanToUse));
      } else {
        console.warn(`⚠️ No valid VLAN ID found in "${vlanRange}"`);
      }
    } else {
      console.warn('⚠️ VLAN input missing data-vlan-ids.');
    }
  }

  // NIC model
  const nicModelDropdown = row.locator('select.nic-model-input');
  if (await nicModelDropdown.isVisible()) {
    await nicModelDropdown.selectOption(nicModel);
  }

  // Firewall toggle
  const firewallCheckbox = row.locator('input[type="checkbox"][name*="[firewall]"]');
  if (await firewallCheckbox.isVisible()) {
    if (firewallEnabled !== await firewallCheckbox.isChecked()) {
      await firewallCheckbox.click();
    }
  }

  // Connected toggle
  const connectedCheckbox = row.locator('input[type="checkbox"][name*="[connect]"]');
  if (await connectedCheckbox.isVisible()) {
    if (connectEnabled !== await connectedCheckbox.isChecked()) {
      await connectedCheckbox.click();
    }
  }

  // Click Next button
  const nextButton = page.locator('button[data-nexttab="steparrow-discdrive-tab"]');
  await nextButton.scrollIntoViewIfNeeded();
  await expect(nextButton).toBeVisible();
  await nextButton.click();

  return true;
}

// VLAN parser helper (unchanged)
function parseVlanIds(rangeStr: string): number[] {
  const result: number[] = [];
  for (const part of rangeStr.split(',').map(p => p.trim())) {
    if (/^\d+-\d+$/.test(part)) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= end; i++) result.push(i);
    } else if (/^\d+$/.test(part)) {
      result.push(Number(part));
    }
  }
  return result;
}



// export async function configureDiscDrive(page: Page, isoName?: string): Promise<void> {
//   const addCdButton = page.locator('span.btn-primary', { hasText: 'Add CD/DVD Drive' });
//   await addCdButton.click();

//   const newRow = page.locator('tr.hardware-discdrive');
//   await newRow.waitFor();

//  const isoDropdown = page.locator('select[name*="[iso_image]"]');

// // Wait for dropdown to be usable
// await expect(isoDropdown).toBeVisible({ timeout: 10000 });
// await expect(isoDropdown).toBeEnabled({ timeout: 10000 });

// // Get all options inside the dropdown
// const options = await isoDropdown.locator('option').all();

// // Find the first valid ISO (not empty, not "Select ISO...")
// let validIsoValue: string | null = null;
// for (const option of options) {
//   const value = await option.getAttribute('value');
//   const label = await option.textContent();
//   if (value && value.trim() !== '' && label?.trim() !== 'Select ISO...') {
//     validIsoValue = value;
//     break;
//   }
// }

// if (validIsoValue) {
//   await isoDropdown.selectOption(validIsoValue);  // select by VALUE, not label
//   console.log(`✅ ISO selected: ${validIsoValue}`);
// } else {
//   console.warn('⚠️ No valid ISO image found. Removing drive to avoid validation error.');
//   const removeButton = page.locator('tr.hardware-discdrive button:has-text("Remove")');
//   await removeButton.click();
// }


//   const nextButton = page.locator('button[data-nexttab="steparrow-boot-order-tab"]');
//   await nextButton.scrollIntoViewIfNeeded();
//   await nextButton.click();
// }

export async function configureDiscDrive(page: Page, isoName?: string): Promise<void> {
  const addCdButton = page.locator('span.btn-primary', { hasText: 'Add CD/DVD Drive' });
  await addCdButton.click();

  const newRow = page.locator('tr.hardware-discdrive');
  try {
    await newRow.waitFor({ state: 'visible', timeout: 5000 });
  } catch {
    console.warn('⚠️ CD/DVD drive row did not appear.');
    return;
  }

  const isoDropdown = newRow.locator('select[name*="[iso_image]"]');

  await expect(isoDropdown).toBeVisible({ timeout: 10000 });
  await expect(isoDropdown).toBeEnabled({ timeout: 10000 });

  const options = await isoDropdown.locator('option').all();

  let validIsoValue: string | null = null;

  if (isoName && isoName.trim() !== '') {
    // Find exact ISO matching isoName (case-insensitive, trimmed)
    for (const option of options) {
      const label = (await option.textContent())?.trim().toLowerCase() || '';
      const value = await option.getAttribute('value');
      if (value && label === isoName.trim().toLowerCase()) {
        validIsoValue = value;
        break;
      }
    }
  }

  // If no isoName provided or no match found, remove CD/DVD drive
  if (!validIsoValue) {
    console.warn(`⚠️ ISO "${isoName ?? 'not specified'}" not found or not provided. Removing CD/DVD drive.`);
    const removeButton = newRow.locator('button:has-text("Remove")');
    await removeButton.click();
    await expect(newRow).toHaveCount(0, { timeout: 5000 });
   
    const nextButton = page.locator('button[data-nexttab="steparrow-boot-order-tab"]');
  await nextButton.scrollIntoViewIfNeeded();
  await nextButton.click();

  return;
  }

  // Select the found ISO
  await isoDropdown.selectOption(validIsoValue);
  console.log(`✅ ISO selected: ${validIsoValue}`);

  const nextButton = page.locator('button[data-nexttab="steparrow-boot-order-tab"]');
  await nextButton.scrollIntoViewIfNeeded();
  await nextButton.click();
}



export async function configureBootOrder(page: Page, desiredOrder: string[],  toggleConfig?: Record<string, boolean>) {
  const bootItems = await page.locator('ul#sortableList > li').all();

  if (bootItems.length === 0) {
    console.warn('⚠️ No boot devices found to configure.');
    // Optional: decide if you want to throw or just return
    return;
  }

  // Toggle boot devices according to toggleConfig or enable by default
  for (const item of bootItems) {
    const deviceId = await item.getAttribute('data-device-id'); // e.g. scsi0, net0, ide0
    const toggle = item.locator('input.boot-toggle');

    let shouldEnable = true;
    if (deviceId && toggleConfig && deviceId in toggleConfig) {
      shouldEnable = toggleConfig[deviceId];
    }
    // default: enable if not specified

    const isChecked = await toggle.isChecked();
    if (shouldEnable !== isChecked) {
      await toggle.click(); // toggle if current state doesn't match desired state
    }
  }

  // Reordering boot devices dynamically based on presence
  if (bootItems.length < 2) {
    console.info('ℹ️ Only one boot device present, skipping reorder.');
  } else {
    const sortableList = page.locator('ul#sortableList');
    await sortableList.waitFor({ state: 'visible', timeout: 10000 });

    // Get list of device IDs actually present in the UI
    const presentDevices = await sortableList.locator('li').evaluateAll(nodes =>
      nodes.map(node => node.getAttribute('data-device-id')).filter(Boolean)
    );

    // Your desired order (example)
    const desiredOrder = ['ide0', 'scsi0', 'net0'];

    // Filter desiredOrder to only devices present
    const filteredOrder = desiredOrder.filter(deviceId => presentDevices.includes(deviceId));

    for (let i = 0; i < filteredOrder.length; i++) {
      const source = sortableList.locator(`li[data-device-id="${filteredOrder[i]}"]`);
      const target = sortableList.locator('li').nth(i);

      await source.waitFor({ state: 'visible', timeout: 5000 });
      await target.waitFor({ state: 'visible', timeout: 5000 });

      await source.dragTo(target);
    }
  }

  // Click the Create VM button
  const createVMButton = page.locator('button#submitBtn');
  await createVMButton.scrollIntoViewIfNeeded();
  await createVMButton.click();
}


// export async function finalizeAndCreate(page: Page) {
//   await expect(page.locator('button:has-text("Create")')).toBeVisible();
//   await page.click('button:has-text("Create")');
//   await expect(page.locator('div.toast-message')).toHaveText(/successfully created/i);
// }

// --- After All Functions Are Declared, Then Create the Object ---

const vmPage = {
  loginAsServiceProvider,
  navigateToVDC,
  fillBasicInfo,
  configureSystemSettings,
  configureHardware,
  configureStorage,
  configureNetwork,
  configureDiscDrive,
  configureBootOrder
  //finalizeAndCreate
};

export default vmPage;
