import {dirname} from 'node:path';
import {stdout} from 'node:process';
import {fileURLToPath} from 'node:url';
import bunyan from 'bunyan';
import {
  type Logger as SimpleLogger,
  PrettyStream,
} from '@vidavidorra/bunyan-pretty-stream';
import {config} from './config.js';

class Logger extends bunyan {
  constructor() {
    const prettyStream = new PrettyStream({
      show: {source: true},
      basePath: dirname(fileURLToPath(import.meta.url)),
    });
    prettyStream.pipe(stdout);

    super({
      name: 'P1 meter exporter',
      src: true,
      serializers: bunyan.stdSerializers,
      streams: [
        {
          level: config.logLevel,
          stream: prettyStream,
          type: 'raw',
        },
      ],
    });
  }
}

const instance = new Logger();
const logger: SimpleLogger = instance;

export default logger;
export {instance, logger};
