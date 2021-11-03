import { Controller, Post } from "@overnightjs/core";
import { Response, Request } from "express";
import UserRepository from "@src/models/UserRepository";
import BaseController from "./BaseController";

@Controller("users")
export default class UsersController extends BaseController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new UserRepository(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (err: any) {
      this.sendCreatedUpdateErrorResponse(response, err);
    }
  }
}
