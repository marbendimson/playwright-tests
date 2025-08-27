# Playwright Login Tests

This project contains Playwright tests for login validation with support for multiple environments.

## Environment Configuration

The project supports3environments:
- **Dev** (`@dev`) - `http://localhost:30`
- **Staging** (`@staging`) - `https://staging.example.com`
- **Prod** (`@prod`) - `https://example.com`

## Running Tests

### Run all tests (defaults to dev environment)
```bash
npx playwright test
```

### Run tests for specific environment using markers
```bash
# Run only dev tests
npx playwright test --grep @dev

# Run only staging tests
npx playwright test --grep @staging

# Run only prod tests
npx playwright test --grep @prod
```

### Set environment via environment variable
```bash
# Set environment variable
set TEST_ENV=staging  # Windows
export TEST_ENV=staging  # Linux/Mac

# Run tests
npx playwright test
```

### Run tests in headed mode
```bash
npx playwright test --headed
```

## Project Structure

```
├── tests/
│   └── login.spec.ts          # Login test cases
├── selectors.ts               # Page selectors
├── global.env.ts             # Environment configuration
├── playwright.config.ts      # Playwright configuration
└── package.json              # Dependencies
```

## Customizing Environments

Edit `global.env.ts` to update:
- Base URLs for each environment
- Valid/invalid credentials for each environment
- Add new environments as needed

## Test Cases
1nvalid Credentials Test** - Verifies error message appears for wrong credentials
2. **Valid Credentials Test** - Verifies successful login with correct credentials

Both tests run across all three browsers (Chromium, Firefox, WebKit) and can be targeted to specific environments using markers. 