import { Controller, Get, Post } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller("beaches")
export default class BeachesController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    response.status(201).send({ ...request.body, id: 'fake-id' });
  }
}
