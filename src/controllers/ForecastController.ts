import {
  ClassMiddleware, Controller, Get, Middleware,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import Logger from '@src/Logger';
import authMiddleware from '@src/middlewares/authMiddleware';
import BeachRepository, { Beach } from '@src/models/BeachRepository';
import ForecastService from '@src/services/ForecastService';
import ApiError from '@src/util/errors/ApiError';
import BaseController from './BaseController';

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  keyGenerator(request: Request): string {
    return request.ip;
  },
  handler(_request: Request, response: Response): void {
    response.status(429).send(ApiError.format({
      code: 429,
      message: 'Too many requests',
    }));
  },
});

@Controller('forecast')
@ClassMiddleware(authMiddleware)
export default class ForecastController extends BaseController {
  private ratingOrderMap: Record<string, 'asc' | 'desc'> = {
    1: 'asc',
    '-1': 'desc',
    asc: 'asc',
    desc: 'desc',
  };

  private forecastService = new ForecastService();

  @Get('')
  @Middleware(rateLimiter)
  public async getForecastForLoggedUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const ratingOrder = this.ratingOrderMap[request.query.order?.toString() ?? 'desc'];
      const userId = request?.context?.id;
      const beaches = await BeachRepository.find({ user: userId });
      const forecastData = await this.forecastService.processForecastForBeaches(
        beaches as unknown as Beach[],
        ratingOrder,
      );
      response.status(200).send(forecastData);
    } catch (err: any) {
      Logger.error(err);
      this.sendErrorResponse(response, { code: 500, message: 'Something went wrong' });
    }
  }
}
