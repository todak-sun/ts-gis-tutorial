import axios, {AxiosError, AxiosRequestConfig} from 'axios';
import appConfig from '@/config/appConfig';
import {AxiosInstance, AxiosResponse} from 'axios';
import logger from '@/config/logger';

class Counter {
  private count: number = 0;

  public increaseAndGet(): number {
    return ++this.count;
  }

  public reset(): void {
    this.count = 0;
  }
}

function createInstance(config: AxiosRequestConfig<any>) {
  const retryCounter: Counter = new Counter();
  const defaultTimeout = 3000;
  const retryer = (config: AxiosRequestConfig<any>, count: number, timeout: number) => {
    if (count > 10) {
      throw new Error('MAX RETRY COUNT');
    }
    return new Promise((res) => {
      setTimeout(() => {
        logger.debug(`retry count(${count}) - ${JSON.stringify(config)}`);
        res(instance.request(config));
      }, timeout);
    });
  };

  const onFulfilled = (res: AxiosResponse) => {
    retryCounter.reset();
    return res;
  };

  const onReject = (error: AxiosError) => {
    if (error.config) {
      const count = retryCounter.increaseAndGet();
      return retryer(error.config, count, defaultTimeout * count);
    }
    return Promise.reject(error);
  };

  const instance = axios.create(config);
  instance.interceptors.response.use(onFulfilled, onReject);
  return instance;
}

export const exactEarthInstance: AxiosInstance = createInstance({
  baseURL: appConfig.clients.exactEarth.baseURL,
  timeout: 1000 * 60 * 30,
});

export const spireInstance: AxiosInstance = createInstance({
  baseURL: appConfig.clients.spire.baseURL,
  responseType: 'json',
  timeout: 1000 * 60 * 30,
  headers: {
    Authorization: `Bearer ${appConfig.clients.spire.token}`,
  },
});
