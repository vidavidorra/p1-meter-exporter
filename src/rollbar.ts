import Rollbar from 'rollbar';
import {config} from './config.js';

const rollbar = new Rollbar({
  accessToken: config.rollbarToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

export default rollbar;
