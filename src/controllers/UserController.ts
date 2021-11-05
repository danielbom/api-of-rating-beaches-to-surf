import {
  Middleware, Controller, Get, Post,
} from '@overnightjs/core';
import { Response, Request } from 'express';
import UserRepository from '@src/models/UserRepository';
import AuthService from '@src/services/AuthService';
import authMiddleware from '@src/middlewares/authMiddleware';
import BaseController from './BaseController';

@Controller('users')
export default class UsersController extends BaseController {
  @Post('')
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new UserRepository(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (err: any) {
      this.sendCreatedUpdateErrorResponse(response, err);
    }
  }

  @Post('authenticate')
  public async authenticate(
    request: Request,
    response: Response,
  ): Promise<void> {
    const { email, password } = request.body;
    const user = await UserRepository.findOne({ email });
    if (!user) {
      this.sendErrorResponse(response, {
        code: 401,
        message: 'User not found!',
      });
    } else {
      const isPasswordValid = await AuthService.comparePasswords(
        user.password,
        password,
      );
      if (isPasswordValid) {
        const userData = user.toJSON();
        const token = AuthService.generateToken({ id: userData.id });
        response.send({ ...userData, token });
      } else {
        this.sendErrorResponse(response, {
          code: 401,
          message: 'Password does not match!',
        });
      }
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(request: Request, response: Response): Promise<void> {
    const userId = request?.context?.id;
    const user = await UserRepository.findById(userId);
    if (!user) {
      this.sendErrorResponse(response, {
        code: 404,
        message: 'User not found!',
      });
    } else {
      response.send(user);
    }
  }
}
