import { Controller, Post } from "@overnightjs/core";
import UserRepository from "@src/models/UserRepository";
import { Response, Request } from "express";

@Controller("users")
export default class UsersController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const user = new UserRepository(request.body);
      const newUser = await user.save();
      response.status(201).send(newUser);
    } catch (err: any) {
      response.status(500).send({ message: "Something went wrong" });
    }
  }
}
