/* eslint-disable max-classes-per-file */
import StormGlassClient, { ForecastPoint } from "@src/clients/StormGlassClient";
import { Beach } from "@src/models/BeachRepository";
import InternalError from "@src/util/errors/InternalError";

export interface BeachForecast extends Omit<Beach, "user">, ForecastPoint {}

type ISODate = string;
export interface TimeForecast {
  time: ISODate;
  forecast: BeachForecast[];
}

export class ForecastProcessingInternalError extends InternalError {
  constructor(message: string) {
    super(`Unexpected error during the forecast processing: ${message}`);
  }
}

export default class ForecastService {
  constructor(protected stormGlass = new StormGlassClient()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<TimeForecast[]> {
    try {
      const allPoints = await Promise.all(
        beaches.map(async (beach) => {
          const point = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
          return this.enrichPointsData(point, beach);
        })
      );
      const pointsWithCorrectSources: BeachForecast[] = allPoints.flat();
      return this.groupForecastByTime(pointsWithCorrectSources);
    } catch (unkErr) {
      const err: any = unkErr;
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private enrichPointsData(
    points: ForecastPoint[],
    beach: Beach
  ): BeachForecast[] {
    return points.map((e) => ({
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: 1,
      time: e.time,
      swellDirection: e.swellDirection,
      swellHeight: e.swellHeight,
      swellPeriod: e.swellPeriod,
      waveDirection: e.waveDirection,
      waveHeight: e.waveHeight,
      windDirection: e.windDirection,
      windSpeed: e.windSpeed,
    }));
  }

  private groupForecastByTime(forecasts: BeachForecast[]): TimeForecast[] {
    /* eslint-disable */
    const forecastByTime = forecasts.reduce((dict, x) => {
      if (dict[x.time]) {
        dict[x.time].push(x);
      } else {
        dict[x.time] = [x];
      }
      return dict;
    }, {} as Record<string, BeachForecast[]>);
    /* eslint-enable */

    return Object.entries(forecastByTime).map(([time, forecast]) => ({
      time,
      forecast,
    }));
  }
}
