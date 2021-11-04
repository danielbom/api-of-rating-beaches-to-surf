import { Beach } from '@src/models/BeachRepository';
import RatingService from './RatingService';

export default class RatingServiceFactory {
  public create(beach: Beach): RatingService {
    return new RatingService(beach);
  }
}
