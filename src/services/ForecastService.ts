import StormGlassClient, { ForecastPoint } from "@src/clients/StormGlassClient";
import InternalError from "@src/util/errors/InternalError";

export enum BeachPosition {
  S = "S",
  E = "E",
  W = "W",
  N = "N",
}

export interface Beach {
  name: string;
  position: BeachPosition;
  lat: number;
  lng: number;
  user: string;
}

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
      const pointsWithCorrectSources: BeachForecast[] = [];
      for (const beach of beaches) {
        const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
        const enrichedPointsData = this.enrichPointsData(points, beach);
        pointsWithCorrectSources.push(...enrichedPointsData);
      }
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
    const forecastByTime = forecasts.reduce((dict, x) => {
      if (dict[x.time]) {
        dict[x.time].push(x);
      } else {
        dict[x.time] = [x];
      }
      return dict;
    }, {} as Record<string, BeachForecast[]>);

    return Object.entries(forecastByTime).map(([time, forecast]) => ({
      time,
      forecast,
    }));
  }
}
