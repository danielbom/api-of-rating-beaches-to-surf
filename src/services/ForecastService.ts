/* eslint-disable max-classes-per-file */
import StormGlassClient, { ForecastPoint } from '@src/clients/StormGlassClient';
import Logger from '@src/Logger';
import { Beach } from '@src/models/BeachRepository';
import InternalError from '@src/util/errors/InternalError';
import RatingService from './RatingService';
import RatingServiceFactory from './RatingServiceFactory';

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint { }

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

interface IRatingServiceFactory {
  create(beach: Beach): RatingService;
}

export default class ForecastService {
  constructor(
    protected stormGlass = new StormGlassClient(),
    protected ratingServiceFactory: IRatingServiceFactory = new RatingServiceFactory(),
  ) { }

  public async processForecastForBeaches(
    beaches: Beach[],
  ): Promise<TimeForecast[]> {
    try {
      Logger.info(`Preparing the forecast for ${beaches.length} beaches`);
      const allPoints = await Promise.all(
        beaches.map(async (beach) => {
          const points = await this.stormGlass.fetchPoints(
            beach.lat,
            beach.lng,
          );
          return this.enrichPointsData(points, beach);
        }),
      );
      const pointsWithCorrectSources: BeachForecast[] = allPoints.flat();
      return this.groupForecastByTime(pointsWithCorrectSources);
    } catch (err: any) {
      Logger.error(err);
      throw new ForecastProcessingInternalError(err.message);
    }
  }

  private enrichPointsData(
    points: ForecastPoint[],
    beach: Beach,
  ): BeachForecast[] {
    const ratingService = this.ratingServiceFactory.create(beach);

    return points.map((point) => ({
      lat: beach.lat,
      lng: beach.lng,
      name: beach.name,
      position: beach.position,
      rating: ratingService.getRateForPoint(point),
      time: point.time,
      swellDirection: point.swellDirection,
      swellHeight: point.swellHeight,
      swellPeriod: point.swellPeriod,
      waveDirection: point.waveDirection,
      waveHeight: point.waveHeight,
      windDirection: point.windDirection,
      windSpeed: point.windSpeed,
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
