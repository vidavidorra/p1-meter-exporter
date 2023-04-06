import Rollbar from 'rollbar';
import {readPackageSync} from 'read-pkg';
import {config} from './config.js';

const rollbar = new Rollbar({
  accessToken: config.rollbarToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  codeVersion: readPackageSync().version,
});

export default rollbar;
