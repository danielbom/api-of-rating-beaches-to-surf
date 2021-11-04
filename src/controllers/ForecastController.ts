import { ClassMiddleware, Controller, Get } from '@overnightjs/core';
import Logger from '@src/Logger';
import authMiddleware from '@src/middlewares/authMiddleware';
import BeachRepository, { Beach } from '@src/models/BeachRepository';
import ForecastService from '@src/services/ForecastService';
import { Request, Response } from 'express';
import BaseController from './BaseController';

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
  public async getForecastForLoggedUser(
    request: Request,
    response: Response,
  ): Promise<void> {
    try {
      const ratingOrder = this.ratingOrderMap[request.query.order?.toString() ?? 'desc'];
      const userId = request?.decoded?.id;
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
