import axios from 'axios';
import appConfig from '@/config/appConfig';
import {AxiosInstance} from 'axios';

export const exactEarthInstance: AxiosInstance = axios.create({
  baseURL: appConfig.clients.exactEarth.baseURL,
});

export const spireInstance: AxiosInstance = axios.create({
  baseURL: appConfig.clients.spire.baseURL,
  headers: {
    Authorization: `bearer ${appConfig.clients.spire.token}`,
  },
});
