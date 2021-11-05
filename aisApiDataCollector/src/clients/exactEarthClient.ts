import {AxiosInstance, AxiosResponse} from 'axios';

export type FeatureCollection = {
  type: string;
  features: Feature[];
};

export type Feature = {
  type: string;
  geometry: Geometry;
  properties: Properties;
};

export type Geometry = {
  type: string;
  coordinates: number[];
};

export type Properties = {
  mmsi: string;
  imo: string;
  length: number;
  width: number;
  destination: string;
  eta: string;
  draught: number;
  heading: number;
  sog: number;
  cog: number;
  rot: number;
  ship_name: string;
  ship_type: string;
  call_sign: string;
  lng: number;
  lat: number;
  status: number;
  time: string;
  source: string;
  time_static: string;
  position: any;
};

class ExactEarthClient {
  private axios: AxiosInstance;
  private token: string;

  constructor(axios: AxiosInstance, token: string) {
    this.axios = axios;
    this.token = token;
  }

  private async fetchEnrolledMMSIList(): Promise<String[]> {
    const response: AxiosResponse<String[], any> = await this.axios.post('/voi', {token: this.token});
    return response.data;
  }

  public async fetchAisInfos(): Promise<FeatureCollection> {
    const mmsiList: String[] = await this.fetchEnrolledMMSIList();
    const response: AxiosResponse<FeatureCollection, any> = await this.axios.post('/lvi', {token: this.token, mmsi: mmsiList});
    return response.data;
  }
}

export default ExactEarthClient;
