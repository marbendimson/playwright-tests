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

//     // 👇 Conditional headless & viewport
//     headless: !!process.env.CI, 
//     viewport: process.env.CI 
//       ? { width: 1920, height: 1080 } // fixed viewport in CI
//       : null,                         // real window size locally

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
//       use: { ...devices['Desktop Chrome'] }
//     },
//     {
//       name: 'firefox',
//       use: { ...devices['Desktop Firefox'] }
//     },
//     {
//       name: 'webkit',
//       use: { ...devices['Desktop Safari'] }
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
    ['dot'], // simple console output
    ['junit', { outputFile: 'results/results.xml' }], // ✅ Jenkins JUnit
    ['json', { outputFile: 'results/results.json' }], // JSON artifacts
    ['html', { outputFolder: 'playwright-report', open: 'never' }], // HTML report
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://mpstaging.multiportal.io',
    ignoreHTTPSErrors: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // 👇 Conditional headless & viewport
    headless: !!process.env.CI,
    viewport: process.env.CI
      ? { width: 1920, height: 1080 } // fixed viewport in CI
      : null,                         // real window size locally

    launchOptions: {
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

