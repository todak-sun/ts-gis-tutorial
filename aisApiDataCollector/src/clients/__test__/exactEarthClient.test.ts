import {exactEarthInstance} from '@/config/axiosConfig';
import ExactEarthClient from '@/clients/exactEarthClient';
import appConfig from '@/config/appConfig';
import {FeatureCollection} from '@/clients/model/responseTypes';

describe('exactEarthClient 테스트', () => {
  let exactEarthClient: ExactEarthClient;

  beforeAll(() => {
    exactEarthClient = new ExactEarthClient(exactEarthInstance, '' + appConfig.clients.exactEarth.token);
  });

  test('fetchAisInfos 테스트', async () => {
    const res: FeatureCollection = await exactEarthClient.fetchAisInfos();
    expect(res.features.length).toBeDefined();
  });
});
