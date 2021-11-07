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
    const response: AxiosResponse<SpireResponseModel, any> = await this.axios.get('', {params: requestParams});
    return response.data;
  }
}

export default SpireClient;
