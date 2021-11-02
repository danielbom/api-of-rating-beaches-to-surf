import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpConfig extends AxiosRequestConfig {}

export interface HttpResponse<T = any> extends AxiosResponse<T> {}

export default class HttpClient {
  constructor(private requester = axios) {}

  public get<T>(
    url: string,
    config: HttpConfig = {}
  ): Promise<HttpResponse<T>> {
    return this.requester.get<T, HttpResponse<T>>(url, config);
  }

  public static isRequestError(error?: AxiosError): boolean {
    return !!error?.response?.status;
  }
}
