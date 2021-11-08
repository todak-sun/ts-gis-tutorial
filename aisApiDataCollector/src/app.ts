import ExactEarthClient from '@/clients/exactEarthClient';
import {FeatureCollection, SpireResponseModel} from '@/clients/model/responseTypes';
import SpireClient from '@/clients/spireClient';
import appConfig from '@/config/appConfig';
import {exactEarthInstance, spireInstance} from '@/config/axiosConfig';
import logger from '@/config/logger';
import {getConnection} from '@/config/rabbitMQ';
import {ExactEarthApiCaller, SpireApiCaller} from '@/service/apiCaller';
import ApiCollector from '@/service/apiCollector';
import {ExactEarthDataProducer, SpireDataProducer} from '@/service/apiDataProcessor';

logger.info('Application Start');
logger.info(`NODE_ENV : ${process.env.NODE_ENV}`);

class ArgumentParser {
  private param: Map<string, string>;
  private constructor(args: string[]) {
    this.param = new Map<string, string>();
    args.forEach((arg) => {
      if (arg.startsWith('--')) {
        const [key, value] = arg.replace(/--/gi, '').split('=');
        this.param.set(key, value);
      }
    });

    Array.from(this.param.entries()).forEach(([key, value]) => {
      logger.debug(`key: ${key}, value: ${value}`);
    });
  }

  public static from(args: string[]) {
    return new ArgumentParser(args);
  }

  public isEmpty(): boolean {
    return !!this.param.size;
  }

  public getParam(key: string) {
    return this.param.get(key);
  }
}

(async () => {
  const parser = ArgumentParser.from(process.argv.slice(2));
  let apiCollector: ApiCollector<any>;
  const connection = await getConnection('AIS_DATA');
  logger.info(`실행작업 : ${parser.getParam('job')}`);
  switch (parser.getParam('job')) {
    case 'spire':
      apiCollector = new ApiCollector<SpireResponseModel>(new SpireApiCaller(new SpireClient(spireInstance)), new SpireDataProducer(connection));
      break;
    case 'exactearth':
      apiCollector = new ApiCollector<FeatureCollection>(
        new ExactEarthApiCaller(new ExactEarthClient(exactEarthInstance, '' + appConfig.clients.exactEarth.token)),
        new ExactEarthDataProducer(connection)
      );
      break;
    default:
      throw new Error('정의되지 않은 작업');
  }
  await apiCollector.start();
})();
