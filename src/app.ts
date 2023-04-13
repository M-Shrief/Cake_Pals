import cors from 'cors';
import express, { Application, Request } from 'express';
import { PORT, DB_URL, DB_NAME } from './config';
import { IRoute } from './interfaces/route.interface';
import errorMiddleware from './middlewares/error.middleware';
import morganMiddleware from './middlewares/morgan.middleware';
import { logger } from './utils/logger';
import mongoose from 'mongoose';

export default class App {
  public app: Application;
  public port: string | number;

  constructor(routes: IRoute[]) {
    this.app = express();
    this.port = PORT || 3000;
    this.initializeMiddlewares();
    this.connectToDB(DB_URL as string, DB_NAME as string);
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen(): void {
    this.app.listen(this.port, () => {
      logger.info(
        `⚡️[server]: Server is running @ http://localhost:${this.port}`
      );
    });
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors<Request>());
    this.app.use(morganMiddleware);
  }

  private initializeRoutes(routes: IRoute[]): void {
    routes.forEach((route) => {
      this.app.use('/api/v1', route.router);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private connectToDB(url: string, name: string) {
    mongoose
      .connect(url, {
        dbName: name,
        // other option are no longer required for v6+
      })
      .then(() =>
        logger.info(`⚡️[Database]: connected to database ${DB_NAME}`)
      )
      .catch((err) => console.log(err));
  }
}
