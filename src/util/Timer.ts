import moment from 'moment';

export default class Timer {
  public static getUnixTimeForAFutureDay(days: number): number {
    return moment().add(days, 'days').unix();
  }
}
