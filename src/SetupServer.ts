import './util/module-alias';
import { Server } from '@overnightjs/core';
import express, { Application } from 'express';
import http from "http";
import Database from './Database';
import ForecastController from './controllers/ForecastController';
import BeachesController from './controllers/BeachesController';
import UsersController from './controllers/UserController';
import Logger from './Logger';

export default class SetupServer extends Server {
  private server?: http.Server;

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
    this.addControllers([
      new ForecastController(),
      new BeachesController(),
      new UsersController(),
    ]);
  }

  private async setupDatabase(): Promise<void> {
    await this.database.connect();
  }

  start() {
    this.server = this.app.listen(this.port, () => {
      Logger.info(`Server listening on: http://localhost:${this.port}`);
    });
  }

  public async close() {
    await this.database.close();
    if (this.server) {
      await new Promise((resolve, reject) => {
        this.server?.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });
    }
  }
}
