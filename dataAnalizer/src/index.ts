import appConfig from '@/config/appConfig';
import rabbitMQConnection from '@/config/rabbitMQConfig';
import Vessel from '@/vessel/vessel';
import VesselReport, { AisMessage } from '@/vessel/vesselReport';
import VesselRepository from '@/vessel/vesselRepository';
import { Channel, Connection as RabbitMQConnection, ConsumeMessage } from 'amqplib';
import { connect as mongodbConnect } from 'mongoose';
import { Connection as DBConnection, createConnection } from 'typeorm';
import logger from './config/logger';
import { IVesselMeta, MMSIMetaHistoryModel } from './vessel/vesselMetaHistoryDoc';

(async () => {

  await mongodbConnect(`mongodb://${appConfig.infra.mongodb.hostname}:${appConfig.infra.mongodb.port}/admin`, {
    user: appConfig.infra.mongodb.username,
    pass: appConfig.infra.mongodb.password
  });

  const rabbitConn: RabbitMQConnection = await rabbitMQConnection()
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

    const existVessel: Vessel | undefined = await vesselRepository.findByMMSI(vesselReport.getMMSI());
    
    const vesselMeta: IVesselMeta =  {
      callSign : vesselReport.getCallSign(),
      imo : vesselReport.getIMO(),
      shipName: vesselReport.getShipName(),
      shipType: vesselReport.getShipType(),
      changedAt : new Date(),
    }
  
    if (existVessel) {
      if (!existVessel.equalsWith(vesselReport)) {
        logger.debug(`[${vesselReport.getMMSI()}] 선박의 정보가 변경됨`)
        
        
        // RDB
        existVessel.updateWith(vesselReport);
        await vesselRepository.save(existVessel);
        logger.debug(`[${vesselReport.getMMSI()}] 저장된 정보 RDB 업데이트`)

        // MongoDB
        const mmsiMetaHistory = await MMSIMetaHistoryModel.findOne({mmsi: vesselReport.getMMSI()});
        if(!mmsiMetaHistory) {
          await MMSIMetaHistoryModel.create({mmsi : vesselReport.getMMSI(), histories : [vesselMeta], historiesLength: 1});
        } else {
          mmsiMetaHistory.histories.push(vesselMeta);
          mmsiMetaHistory.historiesLength = mmsiMetaHistory.histories.length
          mmsiMetaHistory.save();
        }
        logger.debug(`[${vesselReport.getMMSI()}] 변경 내역 MONGO DB에 추가`);
      }
    } else {
      logger.debug(`[${vesselReport.getMMSI()}] 신규 선박이 추가됨`)

      // RDB
      const vessel = Vessel.createWith(vesselReport);
      const newVessel = await vesselRepository.save(vessel);
      logger.debug(`[${vesselReport.getMMSI()}] 신규 선박 RDB 반영`)

      // MongoDB
      const mmsiMetaHistory = await MMSIMetaHistoryModel.findOne({mmsi: vesselReport.getMMSI()});
      if(!mmsiMetaHistory) {
        await MMSIMetaHistoryModel.create({mmsi : vesselReport.getMMSI(), histories : [vesselMeta], historiesLength: 1});
      }
      logger.debug(`[${vesselReport.getMMSI()}] 신규 선박 MONGO DB 반영`)
    }

  
    await ch.ack(message);
  });
})();
