import { readFileSync } from 'fs';

/**
 * Reads the contents of all environment variables that end in _FILE, pressumed
 * to be file locations, and returns an object where each key has as its value
 * the content of the corresponding file.
 *
 * When the same environment variable is present using the regular and _FILE
 * forms, it will cause a validation error. You must provide one or the other.
 */
export const readDockerSecrets = () => {
  const config = {};

  for (const key in process.env) {
    if (key.endsWith('_FILE')) {
      const filePath = process.env[key];
      const secretContent = readFileSync(filePath, { encoding: 'utf-8' });
      const withoutSuffix = key.replace('_FILE', '');

      // readFileSync adds a new line character
      config[withoutSuffix] = secretContent.replace('\n', '');
    }
  }

  return config;
};
