import {AxiosInstance, AxiosResponse} from 'axios';
import {SpireResponseModel} from '@/clients/model/responseTypes';

class SpireClient {
  private axios: AxiosInstance;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
  }

  public async fetchAisInfos(limit: number, next: string | undefined = undefined): Promise<SpireResponseModel> {
    const requestParams: any = {ship_type: 'cargo', limit: limit};
    if (next) requestParams['next'] = next;
    let response: AxiosResponse<SpireResponseModel, any>;
    try {
      response = await this.axios.get('', {params: requestParams});
    } catch (e) {
      console.error(e);
      throw e;
    }
    return response.data;
  }
}

export default SpireClient;
