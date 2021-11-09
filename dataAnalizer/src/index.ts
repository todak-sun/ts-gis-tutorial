import appConfig from '@/config/appConfig';
import logger from '@/config/logger';
import VesselReport, {AisMessage} from '@/domain/VesselReport';
import Vessel from '@/entity/Vessel';
import VesselRepository from '@/repository/VesselRepository';
import amqp, {Channel, Connection as RabbitMQConnection, ConsumeMessage} from 'amqplib';
import {Connection as DBConnection, createConnection} from 'typeorm';

(async () => {
  const rabbitConn: RabbitMQConnection = await amqp.connect({
    hostname: appConfig.infra.rabbitMQ.hostname,
    protocol: appConfig.infra.rabbitMQ.protocol,
    port: appConfig.infra.rabbitMQ.port,
  });

  const pgConn: DBConnection = await createConnection({
    type: 'postgres',
    host: appConfig.infra.postgresql.hostname,
    port: appConfig.infra.postgresql.port,
    username: appConfig.infra.postgresql.username,
    password: appConfig.infra.postgresql.password,
    database: appConfig.infra.postgresql.database,
    entities: [Vessel],
  });

  const vesselRepository = pgConn.getCustomRepository(VesselRepository);

  const ch: Channel = await rabbitConn.createChannel();
  await ch.assertQueue('ais_data.timescaledb', {durable: true});
  await ch.prefetch(1, true);
  await ch.consume('ais_data.timescaledb', async (message: ConsumeMessage | null) => {
    if (!message) return;
    //TODO: 레디스에 배 정보 캐싱하기.
    //TODO: 위치 정보 쌓기
    const aisMessage: AisMessage<any> = JSON.parse(message.content.toString('utf-8'));
    const vesselReport: VesselReport = new VesselReport(aisMessage);

    const existVessel = await vesselRepository.findByMMSI(vesselReport.getMMSI());
    if (existVessel) {
      existVessel.callSign = vesselReport.getCallSign();
      existVessel.imo = vesselReport.getIMO();
      existVessel.shipName = vesselReport.getShipName();
      existVessel.shipType = vesselReport.getShipType();
      existVessel.isActive = vesselReport.isActive();
      existVessel.updatedDateTime = new Date();
      const updatedVessel = await vesselRepository.save(existVessel);
      logger.debug(`updated vessle : ${updatedVessel.id}`);
    } else {
      const vessel = new Vessel();
      vessel.mmsi = vesselReport.getMMSI();
      vessel.callSign = vesselReport.getCallSign();
      vessel.imo = vesselReport.getIMO();
      vessel.shipName = vesselReport.getShipName();
      vessel.shipType = vesselReport.getShipType();
      vessel.isActive = vesselReport.isActive();
      vessel.createdDateTime = new Date();
      vessel.updatedDateTime = new Date();
      const newVessel = await vesselRepository.save(vessel);
    }

    // logger.debug(`vesselReport : ${vesselReport.toString()}`);
    await ch.ack(message);
  });
})();
