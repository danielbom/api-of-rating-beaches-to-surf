import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import UserRepository from '@src/models/UserRepository';
import AuthService from '@src/services/AuthService';
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
  public async authenticate(request: Request, response: Response): Promise<void> {
    const { email, password } = request.body;
    const user = await UserRepository.findOne({ email });
    if (!user) {
      response.status(401).send({
        code: 401,
        error: 'User not found!',
      });
    } else {
      const isPasswordValid = await AuthService.comparePasswords(user.password, password);
      if (isPasswordValid) {
        const userData = user.toJSON();
        const token = await AuthService.generateToken(userData);
        response.send({ ...userData, token });
      } else {
        response
          .status(401)
          .send({ code: 401, error: 'Password does not match!' });
      }
    }
  }
}
