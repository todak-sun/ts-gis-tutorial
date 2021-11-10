import {spireInstance} from '@/config/axiosConfig';
import SpireClient from '@/clients/spireClient';

import {SpireResponseModel} from '@core/responseTypes';

describe('Spire 데이터를 가지고오는 Client 테스트', () => {
  let spireClient: SpireClient;

  beforeAll(() => {
    spireClient = new SpireClient(spireInstance);
  });

  test('ais 정보를 정상으로 가지고온다.', async () => {
    const res: SpireResponseModel = await spireClient.fetchAisInfos(1);
    expect(res.paging.next).toBeDefined();
  });
});
