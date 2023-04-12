# P1 Meter exporter

[HomeWizard P1 Meter](https://www.homewizard.com/p1-meter/) exporter.

> **Note** When errors occur, the data that caused the error is submitted to [Rollbar](https://rollbar.com/) to reproduce and fix the error.

## Usage

### docker-compose

```yml
version: '3.0'
services:
  p1-meter-exporter:
    image: ghcr.io/vidavidorra/p1-meter-exporter:latest
    container_name: p1-meter-exporter
    environment:
      - METER_API_URL=http://192.168.1.10/api
      - INFLUXDB_URL=http://192.168.1.2:8086
      - 'INFLUXDB_TOKEN=RUHDbp7UGt7I6Q+abdG7QVtrcdOPtHJlGDugMNxFUSY='
      - INFLUXDB_ORGANISATION=my-org
      - INFLUXDB_BUCKET=p1-meter
      - LOG_LEVEL=trace # optional
    restart: unless-stopped
```

### Parameters

The Docker container image is configured using environment envirables passed at runtime.

| parameter               | description                                                                                    |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `METER_API_URL`         | URL to the HomeWizard P1 meter API                                                             |
| `INFLUXDB_URL`          | URL to Influx DB                                                                               |
| `INFLUXDB_TOKEN`        | Influx DB token with write permissions to the bucket                                           |
| `INFLUXDB_ORGANISATION` | Influx DB organisation name or ID                                                              |
| `INFLUXDB_BUCKET`       | name or ID of the Influx DB bucket to write the data to                                        |
| `LOG_LEVEL`             | _optional_ specify log level, can be one of `trace`, `debug`, `info`, `warn`, `error`, `fatal` |

### Unraid

On [Unraid](https://unraid.net/) the Docker container image can be used using the pre-defined template. Open a terminal or SSH to the server and execute the following command to download the template in the user template section. This template can then be used when adding a container.

```shell
curl https://raw.githubusercontent.com/vidavidorra/p1-meter-exporter/main/static/unraid.xml -o /boot/config/plugins/dockerMan/templates-user/p1-meter-exporter.xml
```

## Security policy

Please refer to the [Security Policy on GitHub](https://github.com/vidavidorra/p1-meter-exporter/security/) for the security policy.

## License

This project is licensed under the [GPLv3 license](https://www.gnu.org/licenses/gpl.html).

Copyright © 2023 Jeroen de Bruijn

<details><summary>License details.</summary>
<p>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.

The full text of the license is available in the [LICENSE](LICENSE.md) file in this repository and [online](https://www.gnu.org/licenses/gpl.html).

</details>
