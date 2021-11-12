import {connect, Connection} from 'amqplib';
import appConfig from '@/config/appConfig';

async function rabbitMQConnection(): Promise<Connection> {
  return await connect({
    hostname: appConfig.infra.rabbitMQ.hostname,
    protocol: appConfig.infra.rabbitMQ.protocol,
    port: appConfig.infra.rabbitMQ.port,
  });
}

export default rabbitMQConnection;
