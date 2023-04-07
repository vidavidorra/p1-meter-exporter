import {env} from 'node:process';
import Rollbar from 'rollbar';
import {readPackageSync} from 'read-pkg';
import {config} from './config.js';

const rollbar = new Rollbar({
  accessToken: config.rollbarToken,
  addErrorContext: true,
  captureUncaught: true,
  captureUnhandledRejections: true,
  codeVersion: readPackageSync().version,
  environment: env.NODE_ENV ?? 'development',
});

export default rollbar;
