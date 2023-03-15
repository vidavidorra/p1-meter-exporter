import process from 'node:process';
import {InfluxDB} from '@influxdata/influxdb-client';
import {config} from './config.js';
import P1Meter from './p1-meter/api.js';
import {Measurement, Meter, PowerStatus, System} from './exporter/index.js';

const influxDb = new InfluxDB({
  url: config.influxDb.url,
  token: config.influxDb.token,
});
const writeApi = influxDb.getWriteApi(
  config.influxDb.organisation,
  config.influxDb.bucket,
  's',
);

const p1Meter = new P1Meter(config.meterApiUrl);

const exporters = [Measurement, Meter, PowerStatus, System].map(
  (Exporter) => new Exporter(p1Meter, writeApi),
);
for (const exporter of exporters) {
  exporter.start();
}

process.on('SIGINT', async () => {
  await Promise.allSettled(exporters.map(async (exporter) => exporter.stop()));
  await writeApi.close();
});
