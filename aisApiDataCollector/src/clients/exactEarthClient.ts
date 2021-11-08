import {AxiosInstance, AxiosResponse} from 'axios';
import {FeatureCollection} from '@/clients/model/responseTypes';

class ExactEarthClient {
  private axios: AxiosInstance;
  private token: string;

  constructor(axios: AxiosInstance, token: string) {
    this.axios = axios;
    this.token = token;
  }

  public async fetchAisInfos(): Promise<FeatureCollection> {
    const mmsiList: String[] = await this.fetchEnrolledMMSIList();
    const response: AxiosResponse<FeatureCollection, any> = await this.axios.post('/lvi', {token: this.token, mmsi: mmsiList});
    return response.data;
  }

  private async fetchEnrolledMMSIList(): Promise<String[]> {
    const response: AxiosResponse<String[], any> = await this.axios.post('/voi', {token: this.token});
    return response.data;
  }
}

export default ExactEarthClient;
