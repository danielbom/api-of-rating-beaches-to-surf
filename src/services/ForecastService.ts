import StormGlass, { ForecastPoint } from "@src/clients/StormGlass";

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

export interface BeachForecast extends Omit<Beach, "user">, ForecastPoint {
}

export default class ForecastService {
  constructor(protected stormGlass = new StormGlass()) { }

  public async processForecastForBeaches(beaches: Beach[]): Promise<BeachForecast[]> {
    const pointsWithCorrectSources: BeachForecast[] = [];
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = points.map((e) => ({
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
      pointsWithCorrectSources.push(...enrichedBeachData);
    }
    return pointsWithCorrectSources;
  }
}
