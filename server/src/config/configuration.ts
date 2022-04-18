import { readFileSync } from 'fs';

const DOCKER_SECRET_SUFFIX = '_FILE';

export const readEnv = () => {
  return {
    MONGODB_NAME: process.env.MONGODB_NAME,
    MONGODB_USER: process.env.MONGODB_USER,
    MONGODB_PASSWORD: process.env.MONGODB_PASSWORD,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE,
  };
};

/**
 * Reads the contents of all environment variables that end in _FILE, pressumed
 * to be file locations, and returns an object where each key has as its value
 * the content of the corresponding file.
 *
 * When present, the *_FILE environment will take precedence over its inline
 * environment variable counterpart. i.e., MONGODB_NAME_FILE takes precedence
 * over MONGODB_NAME
 */
export const readDockerSecrets = () => {
  const config = {};

  for (const key in process.env) {
    if (key.endsWith(DOCKER_SECRET_SUFFIX)) {
      const filePath = process.env[key];
      const secretContent = readFileSync(filePath, { encoding: 'utf-8' });
      const withoutSuffix = key.replace(DOCKER_SECRET_SUFFIX, '');
      config[withoutSuffix] = secretContent;
    }
  }

  return config;
};
