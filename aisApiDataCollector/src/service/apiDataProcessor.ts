import logger from '@/config/logger';
import {EXCHANGE, QUEUE, ROUTING_KEY} from '@/config/rabbitMQ';
import {Channel, Connection} from 'amqplib';
import {FeatureCollection, SpireResponseModel} from '../clients/model/responseTypes';

export interface IApiDataProcessor<T> {
  process(data: T): void;
  close(): void;
}

export class SpireDataProducer implements IApiDataProcessor<SpireResponseModel> {
  private connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  async process(data: SpireResponseModel): Promise<void> {
    logger.debug('process...');
    const ch: Channel = await this.connection.createChannel();
    const exchange: EXCHANGE = 'ais_data';
    const queues: QUEUE[] = ['timescaledb'];
    const routingKey: ROUTING_KEY = 'row';

    await ch.assertExchange(exchange, 'topic', {durable: false});

    await Promise.all(
      queues
        .map((queue) => [exchange, queue].join('.'))
        .map(async (queue) => {
          await ch.assertQueue(queue, {durable: true});
          await ch.bindQueue(queue, exchange, routingKey);
        })
    );

    data.data.forEach((d) => {
      const target = {vendor: 'S', ...d};
      const json: string = JSON.stringify(target);
      const success = ch.publish(exchange, routingKey, Buffer.from(json), {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
      });
    });

    await ch.close();
  }

  async close(): Promise<void> {
    logger.debug('done!');
    return this.connection.close();
  }
}

export class ExactEarthDataProducer implements IApiDataProcessor<FeatureCollection> {
  private connection: Connection;

  public constructor(connection: Connection) {
    this.connection = connection;
  }

  async process(data: FeatureCollection): Promise<void> {
    logger.debug('process...');
    const ch: Channel = await this.connection.createChannel();
    const exchange: EXCHANGE = 'ais_data';
    const queues: QUEUE[] = ['timescaledb'];
    const routingKey: ROUTING_KEY = 'row';

    await ch.assertExchange(exchange, 'topic', {durable: false});

    await Promise.all(
      queues
        .map((queue) => [exchange, queue].join('.'))
        .map(async (queue) => {
          await ch.assertQueue(queue, {durable: true});
          await ch.bindQueue(queue, exchange, routingKey);
        })
    );

    data.features.forEach((feature) => {
      const target = {vendor: 'E', ...feature};
      const json: string = JSON.stringify(target);
      const success = ch.publish(exchange, routingKey, Buffer.from(json), {
        contentType: 'application/json',
        contentEncoding: 'utf-8',
      });
    });

    await ch.close();
  }
  async close(): Promise<void> {
    logger.debug('done!');
    return await this.connection.close();
  }
}
