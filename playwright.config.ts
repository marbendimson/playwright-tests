// // import { defineConfig, devices } from '@playwright/test';

// // export default defineConfig({
// //   testDir: './tests',
// //   fullyParallel: true,
// //   forbidOnly: !!process.env.CI,
// //   retries: process.env.CI ? 2 : 0,
// //   workers: process.env.CI ? 1 : undefined,
// //   reporter: [
// //     ['html'],
// //     ['json', { outputFile: 'test-results/results.json' }]
// //   ],
// //   use: {
// //     baseURL: process.env.BASE_URL || 'https://mpstaging.multiportal.io',
// //     ignoreHTTPSErrors: true, // ✅ Allow self-signed/invalid certs
// //     trace: 'on-first-retry',
// //     screenshot: 'only-on-failure',
// //     video: 'retain-on-failure',
// //     headless: false,
// //     viewport: { width: 1920, height: 1080 },
// //   },
// //   projects: [
// //     {
// //       name: 'chromium',
// //       use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } },
// //     },
// //     { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
// //     { name: 'webkit', use: { ...devices['Desktop Safari'] } },
// //   ],

// // });

// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',
//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : undefined,
//   reporter: [
//     ['html'],
//     ['json', { outputFile: 'test-results/results.json' }]
//   ],
//   use: {
//     baseURL: process.env.BASE_URL || 'https://mpstaging.multiportal.io',
//     ignoreHTTPSErrors: true,
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     headless: true,
//     viewport: null,
//     launchOptions: {
//       args: [ '--no-sandbox',
//       '--disable-setuid-sandbox',
//       '--disable-gpu',
//       '--disable-dev-shm-usage',
//       '--disable-software-rasterizer',
//       '--start-maximized'],
//     },
//   },
//   projects: [
//     {
//       name: 'chromium',
//       use: {
//         ...devices['Desktop Chrome'],
//         viewport: null,                // allow full window size
//         deviceScaleFactor: undefined,  // remove to avoid the error
//         launchOptions: {
//           args: ['--start-maximized'],
//         },
//       },
//     },
//     {
//       name: 'firefox',
//       use: {
//         ...devices['Desktop Firefox'],
//         viewport: null,
//         deviceScaleFactor: undefined,
//         launchOptions: {
//           args: ['--start-maximized'],
//         },
//       },
//     },
//     {
//       name: 'webkit',
//       use: {
//         ...devices['Desktop Safari'],
//         viewport: null,
//         deviceScaleFactor: undefined,
//         launchOptions: {
//           args: ['--start-maximized'],
//         },
//       },
//     },
//   ],
// });


// import { defineConfig, devices } from '@playwright/test';

// export default defineConfig({
//   testDir: './tests',
//   fullyParallel: true,
//   forbidOnly: !!process.env.CI,
//   retries: process.env.CI ? 2 : 0,
//   workers: process.env.CI ? 1 : undefined,
//   reporter: [
//     ['html'],
//     ['json', { outputFile: 'test-results/results.json' }]
//   ],
//   use: {
//     baseURL: process.env.BASE_URL || 'https://mpstaging.multiportal.io',
//     ignoreHTTPSErrors: true,
//     trace: 'on-first-retry',
//     screenshot: 'only-on-failure',
//     video: 'retain-on-failure',
//     headless: true,       // ✅ headless for CI
//     viewport: { width: 1920, height: 1080 },
//     launchOptions: {
//       args: [
//         '--no-sandbox',
//         '--disable-setuid-sandbox',
//         '--disable-dev-shm-usage',
//         '--disable-gpu',
//       ],
//     },
//   },
//   projects: [
//     {
//       name: 'chromium',
//       use: { ...devices['Desktop Chrome'], headless: true }
//     },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'], headless: true }
//     },
//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'], headless: true }
//     },
//   ],
// });


import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }]
  ],

  // Default for all projects
  use: {
    baseURL: process.env.BASE_URL || 'https://mpstaging.multiportal.io',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: true,
        viewport: null, // let Chromium resize window itself
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--start-maximized', // ✅ safe here only
          ],
        },
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
        headless: true,
        viewport: { width: 1920, height: 1080 },
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        headless: true,
        viewport: { width: 1920, height: 1080 }, // mimic fullscreen
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
          ],
        },
      },
    },
  ],
});

