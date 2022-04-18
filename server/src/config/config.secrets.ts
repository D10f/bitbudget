import { readFileSync } from 'fs';

export default () =>
  Object.keys(process.env)
    .filter((envVariable) => envVariable.endsWith('_FILE'))
    .reduce((config, envVariable) => {
      config[envVariable] = readFileSync(process.env[envVariable]);
      return config;
    }, {});
