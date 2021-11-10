import {IApiCaller} from '@/service/apiCaller';
import {IApiDataProcessor} from '@/service/apiDataProcessor';

export default class ApiCollector<T> {
  private caller: IApiCaller<T>;
  private processor: IApiDataProcessor<T>;

  constructor(caller: IApiCaller<T>, processor: IApiDataProcessor<T>) {
    this.caller = caller;
    this.processor = processor;
  }

  public async start() {
    await this.caller.call(this.processor, undefined);
  }
}
