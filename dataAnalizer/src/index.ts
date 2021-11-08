import amqp, {Channel, Connection, ConsumeMessage} from 'amqplib';
import logger from './config/logger';
import VesselReport from './domain/VesselReport';
import {Feature, SpireData} from './model/responseTypes';

export type SpireMessage = {_vendor: 'S'} & SpireData;
export type ExactEarthMessage = {_vendor: 'E'} & Feature;

type Vessel = {
  mmsi: string;
  callSign: string;
  imo: string;
  shipType: string;
  shipName: string;
};

type Report = {
  position: number[];
  updatedAt: Date;
};

type VesselReport = {
  vessel: Vessel;
  report: Report;
};

(async () => {
  const conn: Connection = await amqp.connect({
    hostname: process.env.INFRA_RABBIT_MQ_AIS_DATA_HOST,
    protocol: process.env.INFRA_RABBIT_MQ_AIS_DATA_PROTOCOL,
    port: parseInt(process.env.INFRA_RABBIT_MQ_AIS_DATA_PORT + ''),
  });

  const ch: Channel = await conn.createChannel();
  await ch.assertQueue('ais_data.timescaledb', {durable: true});
  await ch.prefetch(1, true);
  await ch.consume('ais_data.timescaledb', async (message: ConsumeMessage | null) => {
    if (!message) return;

    const content = JSON.parse(message.content.toString('utf-8'));
    if (content['_vendor'] === 'S') {
      const data: SpireMessage = content;
      const vesselReport: VesselReport = {
        vessel: {
          mmsi: data.mmsi,
          callSign: data.call_sign,
          imo: data.imo,
          shipType: data.ship_type,
          shipName: data.name,
        },
        report: {
          position: data.last_known_position.geometry.coordinates,
          updatedAt: new Date(data.last_known_position.timestamp),
        },
      };

      logger.debug(`S : ${JSON.stringify(vesselReport)}`);
    } else if (content['_vendor'] === 'E') {
      const data: ExactEarthMessage = content;
      VesselReport.from(data);
      logger.debug(`E : ${JSON.stringify(vesselReport)}, ${data.properties.time}`);
    }

    await ch.ack(message);
  });
})();


