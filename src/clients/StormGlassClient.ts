/* eslint-disable max-classes-per-file */
import InternalError from '@src/util/errors/InternalError';
import config, { IConfig } from 'config';
import HttpClient from '@src/util/HttpClient';

const stormGlassResourceConfig: IConfig = config.get(
  'App.resources.StormGlass',
);

export interface StormGlassPointSource {
  [key: string]: number | undefined;
}

export interface StormGlassPoint {
  time?: string;
  swellDirection?: StormGlassPointSource;
  swellHeight?: StormGlassPointSource;
  swellPeriod?: StormGlassPointSource;
  waveDirection?: StormGlassPointSource;
  waveHeight?: StormGlassPointSource;
  windDirection?: StormGlassPointSource;
  windSpeed?: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

type ISODate = string;
export interface ForecastPoint {
  time: ISODate;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error when trying to communicate to StormGlass';
    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Unexpected error returned by the StormGlass service';
    super(`${internalMessage}: ${message}`);
  }
}

export default class StormGlassClient {
  readonly stormGlassAPIParams =
  'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';

  readonly stormGlassAPIFields = this.stormGlassAPIParams.split(',');

  readonly stormGlassAPISource = 'noaa';

  constructor(protected httpClient = new HttpClient()) {}

  async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    try {
      const STORM_GLASS_API_URL = stormGlassResourceConfig.get('apiUrl');
      const url = `${STORM_GLASS_API_URL}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`;
      const response = await this.httpClient.get<StormGlassForecastResponse>(
        url,
        {
          headers: {
            Authorization: 'fake-token',
          },
        },
      );
      return this.normalizeResponse(response.data);
    } catch (unkErr) {
      const err: any = unkErr;
      if (HttpClient.isRequestError(err)) {
        const error = JSON.stringify(err.response.data);
        const code = err.response.status;
        throw new StormGlassResponseError(`Error: ${error} Code: ${code}`);
      } else {
        throw new ClientRequestError(err?.message);
      }
    }
  }

  private isValidPoint(point?: StormGlassPoint): boolean {
    return !!(
      point
      && point.time
      && this.stormGlassAPIFields.every(
        (f) => (point as any)[f]?.[this.stormGlassAPISource] ?? false,
      )
    );
  }

  private normalizeResponse(
    response: StormGlassForecastResponse,
  ): ForecastPoint[] {
    return response.hours
      .filter((x) => this.isValidPoint(x))
      .map((x: any) => ({
        time: x.time,
        swellDirection: x.swellDirection[this.stormGlassAPISource],
        swellHeight: x.swellHeight[this.stormGlassAPISource],
        swellPeriod: x.swellPeriod[this.stormGlassAPISource],
        waveDirection: x.waveDirection[this.stormGlassAPISource],
        waveHeight: x.waveHeight[this.stormGlassAPISource],
        windDirection: x.windDirection[this.stormGlassAPISource],
        windSpeed: x.windSpeed[this.stormGlassAPISource],
      }));
  }
}
