import amqp, {Connection, Options} from 'amqplib';

const connectionNames = ['AIS_DATA'] as const;
export type ConnectionName = typeof connectionNames[number];

const exchangeName = ['ais_data'] as const;
export type EXCHANGE = typeof exchangeName[number];

const queueName = ['timescaledb'] as const;
export type QUEUE = typeof queueName[number];

const routingKeys = ['row'] as const;
export type ROUTING_KEY = typeof routingKeys[number];

export type queueBindGroups = {
  queue: QUEUE;
  exchange: EXCHANGE;
  key: ROUTING_KEY;
  type: string;
};

type ConnectionInfo = {
  name: ConnectionName;
  options: Options.Connect;
};

type QueueInfo = {
  name: QUEUE;
  options: Options.AssertQueue | undefined;
};

type ExchangeInfo = {
  name: EXCHANGE;
  options: Options.AssertExchange | undefined;
};

const rabbitMqConnections: ConnectionInfo[] = [
  {
    name: 'AIS_DATA',
    options: {
      hostname: process.env.INFRA_RABBIT_MQ_AIS_DATA_HOST,
      protocol: process.env.INFRA_RABBIT_MQ_AIS_DATA_PROTOCOL,
      port: parseInt(process.env.INFRA_RABBIT_MQ_AIS_DATA_PORT || '5672'),
    },
  },
];

export async function getConnection(key: ConnectionName): Promise<Connection> {
  const connection: Options.Connect = rabbitMqConnections.filter((con) => con.name === key)[0]?.options;
  return amqp.connect(connection);
}
