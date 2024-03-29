import {
  ClassMiddleware, Controller, Get, Post,
} from '@overnightjs/core';
import { Request, Response } from 'express';
import BeachRepository from '@src/models/BeachRepository';
import authMiddleware from '@src/middlewares/authMiddleware';
import BaseController from './BaseController';

@Controller('beaches')
@ClassMiddleware(authMiddleware)
export default class BeachesController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const userId = request?.context?.id;
      const beach = new BeachRepository({ ...request.body, user: userId });
      const result = await beach.save();
      response.status(201).send(result);
    } catch (err: any) {
      this.sendCreatedUpdateErrorResponse(response, err);
    }
  }

  @Get('')
  public async list(request: Request, response: Response): Promise<void> {
    try {
      const userId = request?.context?.id;
      const beaches = await BeachRepository.find({ user: userId });
      response.status(200).send(beaches);
    } catch (err: any) {
      this.sendCreatedUpdateErrorResponse(response, err);
    }
  }
}
