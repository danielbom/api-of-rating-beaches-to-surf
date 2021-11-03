import { Controller, Get, Post } from "@overnightjs/core";
import BeachRepository from "@src/models/BeachRepository";
import { Request, Response } from "express";
import mongoose from "mongoose";

@Controller("beaches")
export default class BeachesController {
  @Post("")
  public async create(request: Request, response: Response): Promise<void> {
    try {
      const beach = new BeachRepository(request.body);
      const result = await beach.save();
      response.status(201).send(result);
    } catch (err: any) {
      if (err instanceof mongoose.Error.ValidationError) {
        response.status(422).send({ error: err.message });
      } else {
        response.status(500).send({ error: "Internal Server error" });
      }
    }
  }
}
