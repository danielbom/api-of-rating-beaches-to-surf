import "./util/module-alias";
import { Server } from "@overnightjs/core";
import express, { Application } from "express";
import ForecastController from "./controllers/ForecastController";
import Database from "./Database";

export default class SetupServer extends Server {
  constructor(private port = 3000, private database = new Database()) {
    super();
  }

  public getApp(): Application {
    return this.app;
  }

  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(express.json());
  }

  private setupControllers(): void {
    const forecastController = new ForecastController();
    this.addControllers([forecastController]);
  }

  private async setupDatabase(): Promise<void> {
    await this.database.connect();
  }

  public async close() {
    await this.database.close();
  }
}
