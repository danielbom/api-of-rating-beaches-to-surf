import { Controller, Post } from "@overnightjs/core";
import { Request, Response } from "express";
import BeachRepository from "@src/models/BeachRepository";
import BaseController from "./BaseController";

@Controller("beaches")
export default class BeachesController extends BaseController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new BeachRepository(request.body);
      const result = await beach.save();
      response.status(201).send(result);
    } catch (err: any) {
      this.sendCreatedUpdateErrorResponse(response, err);
    }
  }
}
