import { AxiosStatic } from "axios";

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

export interface ForecastPoint {
  time: string;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  waveDirection: number;
  waveHeight: number;
  windDirection: number;
  windSpeed: number;
}

export default class StormGlass {
  readonly stormGlassAPIParams =
    "swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed";
  readonly stormGlassAPIFields = this.stormGlassAPIParams.split(",");
  readonly stormGlassAPISource = "noaa";

  constructor(protected requester: AxiosStatic) {}

  async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> {
    const url = `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`;
    const response = await this.requester.get<StormGlassForecastResponse>(url, {
      headers: {
        Authorization: "fake-token",
      },
    });
    return this.normalizeResponse(response.data);
  }

  private isValidPoint(point?: StormGlassPoint): boolean {
    return !!(
      point &&
      point.time &&
      this.stormGlassAPIFields.every(
        (f) =>
          typeof (point as any)[f][this.stormGlassAPISource] !== "undefined"
      )
    );
  }

  private normalizeResponse(
    response: StormGlassForecastResponse
  ): ForecastPoint[] {
    return response.hours
      .filter((x) => this.isValidPoint(x))
      .map((x) => {
        return {
          time: x.time!,
          swellDirection: x.swellDirection![this.stormGlassAPISource]!,
          swellHeight: x.swellHeight![this.stormGlassAPISource]!,
          swellPeriod: x.swellPeriod![this.stormGlassAPISource]!,
          waveDirection: x.waveDirection![this.stormGlassAPISource]!,
          waveHeight: x.waveHeight![this.stormGlassAPISource]!,
          windDirection: x.windDirection![this.stormGlassAPISource]!,
          windSpeed: x.windSpeed![this.stormGlassAPISource]!,
        };
      });
  }
}
