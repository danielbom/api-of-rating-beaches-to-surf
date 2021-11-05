import './util/module-alias';
import { Server } from '@overnightjs/core';
import cors from 'cors';
import config from 'config';
import express, { Application } from 'express';
import expressPino from 'express-pino-logger';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import * as OpenApiValidator from 'express-openapi-validator';
import apiSchema from './api-schema.json';
import Database from './Database';
import ForecastController from './controllers/ForecastController';
import BeachesController from './controllers/BeachesController';
import UsersController from './controllers/UserController';
import Logger from './Logger';
import apiErrorValidator from './middlewares/apiErrorValidator';

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
    this.setupDocumentation();
    this.setupControllers();
    this.setupErrorHandler();
    await this.setupDatabase();
  }

  private setupExpress(): void {
    this.app.use(express.json());
    this.app.use(expressPino({
      logger: Logger,
    }));
    this.app.use(cors({
      origin: config.get('App.cors.origin'),
    }));
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

  private setupDocumentation(): void {
    this.app.use('/docs', swaggerUi.serve, swaggerUi.setup(apiSchema));
    this.app.use(OpenApiValidator.middleware({
      apiSpec: apiSchema as any,
      validateRequests: true,
      validateResponses: true,
    }));
  }

  private setupErrorHandler(): void {
    this.app.use(apiErrorValidator);
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
