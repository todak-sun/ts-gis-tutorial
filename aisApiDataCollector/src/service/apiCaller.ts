import ExactEarthClient from '@/clients/exactEarthClient';
import SpireClient from '@/clients/spireClient';
import logger from '@/config/logger';
import { IApiDataProcessor } from '@/service/apiDataProcessor';
import { FeatureCollection, SpireResponseModel } from '@core/responseTypes';

export interface IApiCaller<RES> {
  call(processor: IApiDataProcessor<RES>, next: string | undefined): void;
}

export class SpireApiCaller implements IApiCaller<SpireResponseModel> {
  private client: SpireClient;
  constructor(client: SpireClient) {
    this.client = client;
  }

  async call(processor: IApiDataProcessor<SpireResponseModel>, next: string): Promise<void> {
    logger.debug('call...');

    const res: SpireResponseModel = await this.client.fetchAisInfos(1000, next);
    await processor.process(res);

    const nextParam = res?.paging?.next;
    logger.debug(`next param : ${nextParam}`);

    if (nextParam) {
      await this.call(processor, nextParam);
    } else {
      await processor.close();
    }
  }
}

export class ExactEarthApiCaller implements IApiCaller<FeatureCollection> {
  private client: ExactEarthClient;

  constructor(client: ExactEarthClient) {
    this.client = client;
  }

  async call(processor: IApiDataProcessor<FeatureCollection>): Promise<void> {
    logger.debug('call');

    const res: FeatureCollection = await this.client.fetchAisInfos();

    await processor.process(res);
    await processor.close();
  }
}
