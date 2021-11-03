import { Controller, Get } from "@overnightjs/core";
import BeachRepository, { Beach } from "@src/models/BeachRepository";
import ForecastService from "@src/services/ForecastService";
import { Request, Response } from "express";

@Controller("forecast")
export default class ForecastController {
  private forecastService = new ForecastService();

  @Get("")
  public async getForecastForLoggedUser(
    _request: Request,
    response: Response
  ): Promise<void> {
    try {
      const beaches = await BeachRepository.find({});
      const forecastData = await this.forecastService.processForecastForBeaches(
        beaches as unknown as Beach[]
      );
      response.status(200).send(forecastData);
    } catch (err: any) {
      response.status(500).send({ message: "Something went wrong" });
    }
  }
}
