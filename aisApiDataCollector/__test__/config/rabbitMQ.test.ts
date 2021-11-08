import {getConnection} from '@/config/rabbitMQ';

describe('rabbitMQ 설정 테스트', () => {
  test('getConnection', async () => {
    const connection = await getConnection('AIS_DATA');

    expect(connection).toBeDefined();

    connection.close();
  });
});
