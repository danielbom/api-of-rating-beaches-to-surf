import { ForecastPoint } from '@src/clients/StormGlassClient';
import { Beach, GeoPosition } from '@src/models/BeachRepository';

type Range = {
  min: number;
  max: number;
};

export default class RatingService {
  private readonly waveHeights = {
    ankleToKnee: <Range>{ min: 0.3, max: 1.0 },
    waistHigh: <Range>{ min: 1.0, max: 2.0 },
    headHigh: <Range>{ min: 2.0, max: 2.5 },
  };

  private readonly reversePosition = {
    [GeoPosition.E]: GeoPosition.W,
    [GeoPosition.W]: GeoPosition.E,
    [GeoPosition.S]: GeoPosition.N,
    [GeoPosition.N]: GeoPosition.S,
  };

  constructor(private beach: Beach) { }

  public getRateForPoint(point: ForecastPoint): number {
    const swellDirection = this.getPositionFromLocation(point.swellDirection);
    const windDirection = this.getPositionFromLocation(point.windDirection);
    const windAndWaveRating = this.getRatingBasedOnWindAndWavePositions(
      swellDirection,
      windDirection,
    );
    const swellHeightRating = this.getRatingForSwellSize(point.swellHeight);
    const swellPeriodRating = this.getRatingForSwellPeriod(point.swellPeriod);
    const finalRating = (windAndWaveRating + swellHeightRating + swellPeriodRating) / 3;
    return Math.round(finalRating);
  }

  public getPositionFromLocation(coordinate: number): GeoPosition {
    // https://www.bapequipmentstore.com/images/products/large_1721_protra.jpg
    // eslint-disable-next-line
    coordinate %= 360;
    // [0..50]
    if (coordinate <= 50) { return GeoPosition.N; }
    // (50..120]
    if (coordinate <= 120) { return GeoPosition.E; }
    // (120..220]
    if (coordinate <= 220) { return GeoPosition.S; }
    // (220..310]
    if (coordinate <= 310) { return GeoPosition.W; }
    // (310..360]
    return GeoPosition.N;
  }

  public getRatingForSwellSize(height: number): number {
    if (this.isBetweenRange(this.waveHeights.ankleToKnee, height)) return 2;
    if (this.isBetweenRange(this.waveHeights.waistHigh, height)) return 3;
    if (this.waveHeights.headHigh.min <= height) return 5;
    return 1;
  }

  private isBetweenRange({ min, max }: Range, value: number) {
    return min < value && value <= max;
  }

  public getRatingForSwellPeriod(period: number): number {
    // [..7)
    if (period < 7) { return 1; }
    // [7..10)
    if (period < 10) { return 2; }
    // [7..14)
    if (period < 14) { return 4; }
    // [14..)
    return 5;
  }

  public getRatingBasedOnWindAndWavePositions(
    wavePosition: GeoPosition,
    windPosition: GeoPosition,
  ): number {
    if (wavePosition === windPosition) return 1;
    if (this.isWindOffShore(wavePosition, windPosition)) return 5;
    return 3;
  }

  private isWindOffShore(wavePosition: GeoPosition, windPosition: GeoPosition): boolean {
    const isWaveOpposedOfWind = this.reversePosition[wavePosition] === windPosition;
    const isBeachPositionEqualsToWave = this.beach.position === wavePosition;
    return isWaveOpposedOfWind && isBeachPositionEqualsToWave;
  }
}
