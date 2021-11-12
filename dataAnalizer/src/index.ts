import appConfig from '@/config/appConfig';
import rabbitMQConnection from '@/config/rabbitMQConfig';
import Vessel from '@/vessel/vessel';
import VesselReport, { AisMessage } from '@/vessel/vesselReport';
import VesselRepository from '@/vessel/vesselRepository';
import { Channel, Connection as RabbitMQConnection, ConsumeMessage } from 'amqplib';
import { Connection as DBConnection, createConnection } from 'typeorm';

(async () => {

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
    if (existVessel) {
      if (!existVessel.equalsWith(vesselReport)) {
        //TODO: 선박 정보가 변경되었으므로, 알림 포인트
        existVessel.updateWith(vesselReport);
        await vesselRepository.save(existVessel);
      }
    } else {
      const vessel = Vessel.createWith(vesselReport);
      const newVessel = await vesselRepository.save(vessel);
    }
    await ch.ack(message);
  });
})();
