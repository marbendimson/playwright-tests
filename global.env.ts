import { devEnv } from './env.dev';
import { stagingEnv } from './env.staging';
import { preprodEnv } from './env.preprod';

const environments = {
  dev: devEnv,
  staging: stagingEnv,
  preprod: preprodEnv,
};

// Default environment (can be overridden by environment variable)
const defaultEnv = process.env.TEST_ENV || 'dev';

// Export the active environment
export const env = environments[defaultEnv as keyof typeof environments];

// Environment markers for Playwright
export const envMarkers = {
  dev: '@dev',
  staging: '@staging',
  prod: '@prod',
};

// Helper function to get environment by marker
export function getEnvByMarker(marker: string) {
  switch (marker) {
    case '@dev':
      return environments.dev;
    case '@staging':
      return environments.staging;
    case '@preprod':
      return environments.preprod;
    default:
      return environments.staging;
  }
}

// Helper function to get user by role
export function getUserByRole(role: string) {
  const user = Object.values(env.users).find(user => user.role === role);
  return user || env.users.serviceProvider; // fallback to service provider
}

// Helper function to get user by username
export function getUserByUsername(username: string) {
  const user = Object.values(env.users).find(user => user.username === username);
  return user || env.users.serviceProvider; // fallback to service provider
} 

